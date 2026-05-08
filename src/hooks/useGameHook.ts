import { useCallback, useEffect, useState } from "react";
import { echo,  } from "./echo";
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
  fetchActivePlayers,
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
} from "../api/api";
import {
  ACTIVE_CHANNEL,
  ACTIVE_EVENT,
  FALLBACK_REFRESH_MS,
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
let activePlayersPromise: Promise<ActivePlayers> | null = null;
let activePlayersRefreshTimer: ReturnType<typeof setInterval> | null = null;
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

async function runRefreshGameData() {
  updateStore({ isLoading: true, isMusicSettingLoading: true });
  try {
    const [gameDetail,ranking,jackpot,player,url,prizeDistribution,isMusicEnabled, winToday,history] = await Promise.all([
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
  updateStore({
    gameDetails: gameDetail,
    ranking: ranking,
    jackpot: jackpot.amount,
  playerInfo: player,
  url: url,
  isMusicSettingLoading: false,
  prizeDistribution:prizeDistribution,
  isMusicEnabled,
  isLoading: false,
  winToday:winToday,
  History:history,
});
  } catch (error) {
    updateStore({ isLoading: false, isMusicSettingLoading: false,});
    throw error;
  }
}
async function fetchActiveData(){
  if (!activePlayersPromise) {
    activePlayersPromise = fetchActivePlayers().finally(() => {
      activePlayersPromise = null;
    });
  }
  const activePlayers = await activePlayersPromise;
  updateStore({ActivePlayers:activePlayers})
  return activePlayers;
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
function startActivePlayersFallbackRefresh() {
  if (activePlayersRefreshTimer) return;
  activePlayersRefreshTimer = setInterval(() => {
    void fetchActiveData().catch((error) => {
      console.error("Failed to refresh active players", error);
    });
  }, FALLBACK_REFRESH_MS);
}
function initializeStore() {
  if (hasInitialized) return;
  hasInitialized = true;
  const channel = echo.channel(REALTIME_CHANNEL);
  const eventName = `.${REALTIME_EVENT}`;
  channel.listen(eventName, async () => {
    await runRefreshGameData();
  });
}

function updateActiveUsers(){
if (hasActive) return;
 hasActive = true;
 const channel = echo.channel(ACTIVE_CHANNEL);
 const eventName = `.${ACTIVE_EVENT}`;
  channel.listen(eventName, (event: ActivePlayersEvent) => {
    if (event.players || event.data) {
      updateActiveDataFromSocket(event);
      return;
    }
    void fetchActiveData().catch((error) => {
      console.error("Failed to refresh active players from socket", error);
    });
  });
  startActivePlayersFallbackRefresh();
}
export async function bootstrapGameStore(): Promise<GameStore> {
  initializeStore();
  if (!initialLoadPromise) {
    initialLoadPromise = runRefreshGameData().finally(() => {
      initialLoadPromise = null;
    });
  }
  await initialLoadPromise;
  return store;
}
export async function bootstrapActivePlayers() {
  updateActiveUsers();
  await fetchActiveData();
}
export async function refreshActivePlayers() {
  updateActiveUsers();
  return fetchActiveData();
}
export function useGame() {
  const [snapshot, setSnapshot] = useState({ ...store });
  useEffect(() => {
    void bootstrapGameStore().catch((error) => {
      console.error("Failed to bootstrap game store", error);
    });

    const listener = (nextState: GameStore) => {
      setSnapshot({ ...nextState });
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
useEffect(() => {
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

  const handlePlaceBet = useCallback(async ( amount: number,) => {
    // const currentBalance = Number.parseFloat(store.playerInfo?.balance ?? "0");
    // if (currentBalance < amount) {
    //   // throw new Error("Insufficient balance");
    // }
    const response: betPlace = await betPlace(amount, );
    void refreshActivePlayers().catch((error) => {
      console.error("Failed to refresh active players after bet", error);
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
    updateStore({playerInfo:data})
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
