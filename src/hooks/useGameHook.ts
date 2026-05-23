import { useCallback, useEffect, useState } from "react";
import { echo } from "./echo";
import {
  fetchWinToday,
  fetchGameDetail,
  fetchRemainingToday,
  fetchRanking,
  fetchJackpot,
  fetchRechargeUrl,
  fetchPrizeDistribution,
  fetchPlayerInfo,
  fetchMusicSetting,
  saveMusicSetting,
  betPlace,
  fetchHistory,
  type History,
  type WinToday,
  type GameDetailsData,
  type RankingResponse,
  type RechargeUrlResponse,
  type PrizeDistributionProps,
  type PlayerDetailsData,
  type ActivePlayers,
  type ACtivePlayersData,
  type BetPlaceResponse,
} from "../api/api";
import {
  ACTIVE_CHANNEL,
  ACTIVE_EVENT,
  REALTIME_CHANNEL,
  REALTIME_EVENT,
  getAssetUrl,
} from "../config/gameconfig";
export function resolveAssetUrl(path: string): string {
  return getAssetUrl(path);
}
export type GameStore = {
  gameDetails: GameDetailsData | null;
  ranking:RankingResponse|null ;
  jackpot:string;
  url?:RechargeUrlResponse | null;
  prizeDistribution:PrizeDistributionProps|null;
  playerInfo: PlayerDetailsData | null;
  isLoading: boolean;
  isMusicEnabled: boolean;
  isMusicSettingLoading: boolean;
musicOverridden: boolean;
remaining:number;
winToday:WinToday|null;
ActivePlayers:ActivePlayers|null;
History:History|null;
};
const listeners = new Set<(state: GameStore) => void>();
let store: GameStore = {
  gameDetails: null,
  ranking: null,
  jackpot: "",
  url:null,
  prizeDistribution:null,
  playerInfo: null,
  isLoading: true,
  isMusicSettingLoading: true,
  isMusicEnabled: true,
musicOverridden: false,
remaining:0,
winToday:null,
ActivePlayers:null,
History:null,
};
let hasInitialized = false;
let hasActive = false;
let initialLoadPromise: Promise<void> | null = null;
let gameRefreshPromise: Promise<void> | null = null;
let gameRefreshQueued = false;
const LOCAL_BALANCE_GUARD_TTL_MS = 15_000;
let localBalanceGuard: number | null = null;
let localBalanceGuardSetAt = 0;

type ActivePlayersEvent = {
  data?: ACtivePlayersData[];
  players?: ACtivePlayersData[];
  total_amount?: number;
  total_user?: number;
};

function emit() {
  listeners.forEach((listener) => listener(store));
}
function updateStore(
  partial: Partial<GameStore> | ((current: GameStore) => Partial<GameStore>),
) {
  const nextPartial = typeof partial === "function" ? partial(store) : partial;
  store = {
    ...store,
    ...nextPartial,
  };
  emit();
}

function parseMoney(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.-]/g, "");
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return "0";

  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/\.?0+$/, "");
}

function getBalanceFromBetResponse(response: BetPlaceResponse): number | null {
  const candidates = [
    response.current_balance,
    response.balance,
    response.post_balance,
    response.new_balance,
    response.wallet_balance,
    response.data?.current_balance,
    response.data?.balance,
    response.data?.post_balance,
    response.data?.new_balance,
    response.data?.wallet_balance,
  ];

  for (const candidate of candidates) {
    const parsed = parseMoney(candidate);

    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function setLocalBalanceGuard(balance: number) {
  localBalanceGuard = balance;
  localBalanceGuardSetAt = Date.now();
}

function clearLocalBalanceGuard() {
  localBalanceGuard = null;
  localBalanceGuardSetAt = 0;
}

function getActiveLocalBalanceGuard(): number | null {
  if (localBalanceGuard === null) {
    return null;
  }

  if (Date.now() - localBalanceGuardSetAt > LOCAL_BALANCE_GUARD_TTL_MS) {
    clearLocalBalanceGuard();
    return null;
  }

  return localBalanceGuard;
}

function getKnownPlayerBalance(): number | null {
  const guarded = getActiveLocalBalanceGuard();

  if (guarded !== null) {
    return guarded;
  }

  return parseMoney(store.playerInfo?.balance);
}

function mergePlayerInfoWithGuard(
  incoming: PlayerDetailsData | null | undefined,
  current: PlayerDetailsData | null,
): PlayerDetailsData | null {
  const hasIncoming = incoming !== null && incoming !== undefined;
  const hasCurrent = current !== null && current !== undefined;

  if (!hasIncoming && !hasCurrent) {
    return null;
  }

  const baseInfo: PlayerDetailsData = {
    ...(current ?? {}),
    ...(incoming ?? {}),
  };

  const guardedBalance = getActiveLocalBalanceGuard();

  if (guardedBalance === null) {
    return baseInfo;
  }

  const incomingBalance = parseMoney(incoming?.balance);

  if (incomingBalance !== null && Math.abs(incomingBalance - guardedBalance) < 0.0001) {
    clearLocalBalanceGuard();
    return baseInfo;
  }

  return {
    ...baseInfo,
    balance: formatMoney(guardedBalance),
  };
}

function updatePlayerBalance(balance: number) {
  setLocalBalanceGuard(balance);
  updateStore((current) => ({
    playerInfo: {
      ...(current.playerInfo ?? {}),
      balance: formatMoney(balance),
    },
  }));
}

async function runRefreshGameData() {
  updateStore({ isLoading: true, isMusicSettingLoading: true });
  const [gameDetail, ranking, jackpot, player, url, prizeDistribution, isMusicEnabled, winToday, history] =
    await Promise.allSettled([
      fetchGameDetail(),
      fetchRanking(),
      fetchJackpot(),
      fetchPlayerInfo(),
      fetchRechargeUrl(),
      fetchPrizeDistribution(),
      fetchMusicSetting(),
      fetchWinToday(),
      fetchHistory(),
    ]);

  const failedRequests: string[] = [];
  let hasFetchedPlayerInfo = false;
  let fetchedPlayerInfo: PlayerDetailsData | null = null;

  const nextState: Partial<GameStore> = {
    isMusicSettingLoading: false,
    isLoading: false,
  };

  if (gameDetail.status === "fulfilled") nextState.gameDetails = gameDetail.value;
  else failedRequests.push("game details");

  if (ranking.status === "fulfilled") nextState.ranking = ranking.value;
  else failedRequests.push("ranking");

  if (jackpot.status === "fulfilled") nextState.jackpot = jackpot.value.amount;
  else failedRequests.push("jackpot");

  if (player.status === "fulfilled") {
    hasFetchedPlayerInfo = true;
    fetchedPlayerInfo = player.value;
  } else failedRequests.push("player");

  if (url.status === "fulfilled") nextState.url = url.value;
  else failedRequests.push("recharge url");

  if (prizeDistribution.status === "fulfilled") nextState.prizeDistribution = prizeDistribution.value;
  else failedRequests.push("prize distribution");

  if (isMusicEnabled.status === "fulfilled") nextState.isMusicEnabled = isMusicEnabled.value;
  else failedRequests.push("music setting");

  if (winToday.status === "fulfilled") nextState.winToday = winToday.value;
  else failedRequests.push("win today");

  if (history.status === "fulfilled") nextState.History = history.value;
  else failedRequests.push("history");

  if (failedRequests.length > 0) {
    console.warn(
      "Some game bootstrap requests failed. Continuing with partial data:",
      failedRequests.join(", "),
    );
  }

  updateStore((current) => ({
    ...nextState,
    ...(hasFetchedPlayerInfo
      ? {
          playerInfo: mergePlayerInfoWithGuard(
            fetchedPlayerInfo,
            current.playerInfo,
          ),
        }
      : {}),
  }));
}

function refreshGameDataWithQueue(): Promise<void> {
  if (gameRefreshPromise) {
    gameRefreshQueued = true;
    return gameRefreshPromise;
  }

  gameRefreshPromise = (async () => {
    do {
      gameRefreshQueued = false;
      await runRefreshGameData();
    } while (gameRefreshQueued);
  })().finally(() => {
    gameRefreshPromise = null;
  });

  return gameRefreshPromise;
}

function updateActiveDataFromSocket(event: ActivePlayersEvent) {
  const players = event.players ?? event.data ?? [];
  updateStore({
    ActivePlayers: {
      status: true,
      total_amount:
        event.total_amount ??
        players.reduce((total, player) => total + Number(player.win_amount ?? 0), 0),
      total_user: event.total_user ?? players.length,
      data: players,
    },
  });
}
function initializeStore() {
  if (hasInitialized) return;
  hasInitialized = true;
  const channel = echo.channel(REALTIME_CHANNEL);
  const eventName = `.${REALTIME_EVENT}`;
  channel.listen(eventName, () => {
    void refreshGameDataWithQueue().catch((error) => {
      console.error("Failed to refresh game data from realtime event", error);
    });
  });
}

function updateActiveUsers() {
  if (hasActive) return;
  hasActive = true;
  const channel = echo.channel(ACTIVE_CHANNEL);
  const eventName = `.${ACTIVE_EVENT}`;
  channel.listen(eventName, (event: ActivePlayersEvent) => {
    if (event.players || event.data) {
      updateActiveDataFromSocket(event);
      return;
    }
    console.warn(
      "Active players socket event received without players/data payload. Skipping API refresh.",
    );
  });
}
export async function bootstrapGameStore(): Promise<GameStore> {
  initializeStore();
  if (!initialLoadPromise) {
    initialLoadPromise = refreshGameDataWithQueue().finally(() => {
      initialLoadPromise = null;
    });
  }
  await initialLoadPromise;
  return store;
}
export async function bootstrapActivePlayers() {
  updateActiveUsers();
}

export async function refreshActivePlayers() {
  updateActiveUsers();
  return store.ActivePlayers;
}

export function useGame() {
  const [snapshot, setSnapshot] = useState({ ...store });
  useEffect(() => {
    void bootstrapGameStore().catch((error) => {
      console.error("Failed to bootstrap game store", error);
    });
    void bootstrapActivePlayers().catch((error) => {
      console.error("Failed to bootstrap Active store", error);
    });

    const listener = (nextState: GameStore) => {
      setSnapshot({ ...nextState });
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
const handlePrizeDistribution= useCallback(async () => {
    const data = await fetchPrizeDistribution();
    updateStore({ prizeDistribution: data });
    return data;
  }, []);

const handleWinToday= useCallback(async () => {
    const data = await fetchWinToday();
    updateStore({ winToday: data });
    return data;
  }, []);

  const handleRechargeRedirect = useCallback(async () => {
  try {
    const data = await fetchRechargeUrl();

    if (data.url && data.url.startsWith("http")) {
      updateStore({url:data});
      window.location.href = data.url;
    }
  } catch (error) {
    console.error(error);
  }
}, []);

  const handlePlaceBet = useCallback(async (amount: number) => {
  const previousBalance = getKnownPlayerBalance();
  const response: betPlace = await betPlace(amount);
  const responseBalance = getBalanceFromBetResponse(response);
  const winAmount = parseMoney(response.win_amount) ?? 0;
  const nextBalance =
    responseBalance ??
    (previousBalance !== null ? Math.max(0, previousBalance - amount + winAmount) : null);

  if (nextBalance !== null) {
    updatePlayerBalance(nextBalance);
  }

  // Keep the local store aligned with the backend. The optimistic update above
  // makes the UI change immediately, and this request corrects it if the server
  // applies any extra wallet rule.
  void fetchPlayerInfo()
    .then((data) => {
      updateStore((current) => ({
        playerInfo: mergePlayerInfoWithGuard(data, current.playerInfo),
      }));
    })
    .catch((error) => {
      console.warn("Failed to refresh player balance after bet", error);
    });

  return response;
}, []);

const handleSetMusicEnabled = useCallback(async (nextValue: boolean) => {
    await saveMusicSetting( nextValue);
    updateStore({ isMusicEnabled: nextValue });
  }, []);
 
const handleRemainingToday= useCallback(async () => {
    const data = await fetchRemainingToday();
    return data;
  }, []);
const handleRanking= useCallback(async () => {
    const data = await fetchRanking();
    updateStore({ranking:data  });
    return data;
  }, []);
const handleJackPot= useCallback(async () => {
    const data = await fetchJackpot();
    updateStore({jackpot:data.amount  });
    return data.amount;
  }, []);
const handlePlayerInfo= useCallback(async () => {
    const data = await fetchPlayerInfo();
    updateStore((current) => ({
      playerInfo: mergePlayerInfoWithGuard(data, current.playerInfo),
    }));
    return data;
  }, []);
const clearCurrentRoundBets = useCallback(() => {
  
  }, []);
const handleHistory= useCallback(async () => {
    const data = await fetchHistory();
    updateStore({History:data})
    return data;
  }, []);
  return {
    betAmounts: snapshot.gameDetails?.bet_amounts ?? [],
    options: snapshot.gameDetails?.options ?? [],
    gameDetails: snapshot.gameDetails,
    playerInfo: snapshot.playerInfo,
    isLoading: snapshot.isLoading,
    isMusicEnabled: snapshot.isMusicEnabled,
    isMusicSettingLoading: snapshot.isMusicSettingLoading,
    ranking: snapshot.ranking,
    jackpot: snapshot.jackpot,
    rechargeUrl: snapshot.url?.url || null,
    prizeDistribution:snapshot.prizeDistribution,
    ActivePlayers:snapshot.ActivePlayers,
    history:snapshot.History,
    placeBet: handlePlaceBet,
    setMusicEnabled: handleSetMusicEnabled,
    clearCurrentRoundBets,
    handleRechargeRedirect,
    handlePrizeDistribution,
    handleRemainingToday,
    handleWinToday,
    handleRanking,
    handleJackPot,
    handlePlayerInfo,
    handleHistory,
  };
}
