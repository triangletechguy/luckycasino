import axios from "axios";
import {
  ACTIVE_PLAYERS_API_URL,
  BET_PLACE_API_URL,
  GAME_DETAILS_API_URL,
  GAME_ID,
  HISTORY_API_URL,
  JACKPOT_API_URL,
  MUSIC_SETTING_API_URL,
  PLAYER_API_URL,
  PRIZE_DISTRIBUTIONS_API_URL,
  RANKING_API_URL,
  RECHARGE_URL_API_URL,
  REMAINING_API_URL,
  WIN_TODAY_API_URL,
} from "../config/gameconfig";
import { getRequiredUserId } from "../utils/user";

type ApiStatus = boolean | number | string | undefined;

function isTruthyStatus(status: ApiStatus): boolean {
  if (status === undefined || status === null) return false;
  if (typeof status === "boolean") return status;
  if (typeof status === "number") return status === 1;

  const normalized = status.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "success";
}

function assertStatus(status: ApiStatus, message: string): void {
  if (!isTruthyStatus(status)) {
    throw new Error(message);
  }
}

type GameOption = {
  id: number;
  name: string;
  logo: string;
};

type BetAmount = {
  id: number;
  amount: string;
  icon: string;
};

type HowToPlay = {
  rules?: string;
};

export type GameDetailsData = {
  id?: number;
  name?: string;
  how_to_play?: HowToPlay;
  options?: GameOption[];
  bet_amounts?: BetAmount[];
};

type GameDetails = {
  status?: boolean | number | string;
  data?: GameDetailsData;
  message?: string;
};

export const fetchGameDetail = async (): Promise<GameDetailsData> => {
  const response = await axios.get<GameDetails>(GAME_DETAILS_API_URL);
  assertStatus(response.data.status, response.data.message || "Game details API failed.");

  return response.data.data ?? {};
};

type RemainingTodayData = {
  server_time: string;
  end_time: string;
  remaining_seconds: number;
};

export type RemainingToday = {
  status: boolean;
  data: RemainingTodayData;
  message: string;
};

export const fetchRemainingToday = async (): Promise<RemainingToday> => {
  const response = await axios.get<RemainingToday>(REMAINING_API_URL);
  assertStatus(response.data.status, response.data.message || "Remaining today API failed.");

  return response.data;
};

export type RankingItem = {
  user_id: number;
  total_win: string;
  total_bet: string;
  user?: {
    id: number;
    username: string;
    avater: string;
  };
};

type MyRanking = {
  position: number;
  user_id: number;
  username: string;
  avater: string;
  total_win: string;
  total_bet: string;
};

export type RankingResponse = {
  status?: boolean | number | string;
  gift?: string;
  today?: RankingItem[];
  today_my_ranking?: MyRanking | null;
  yesterday?: RankingItem[];
  yesterday_my_ranking?: MyRanking | null;
};

export const fetchRanking = async (): Promise<RankingResponse> => {
  const userId = getRequiredUserId();
  const response = await axios.get<RankingResponse>(`${RANKING_API_URL}/${userId}`);
  assertStatus(response.data.status, "Ranking API failed.");

  return response.data;
};

type Jackpot = {
  status: boolean | number | string;
  amount: string;
};

export const fetchJackpot = async (): Promise<Jackpot> => {
  const response = await axios.get<Jackpot>(JACKPOT_API_URL);
  assertStatus(response.data.status, "Jackpot API failed.");

  return response.data;
};

export type RechargeUrlResponse = {
  status?: boolean | number | string;
  message?: string;
  url?: string;
};

export const fetchRechargeUrl = async (): Promise<RechargeUrlResponse> => {
  const response = await axios.get<RechargeUrlResponse>(RECHARGE_URL_API_URL);
  assertStatus(response.data.status, response.data.message || "Recharge URL API failed.");

  return response.data;
};

type RankPrize = {
  rank_no: string;
  price: number;
  policy: string | null;
};

export type PrizeDistributionProps = {
  status: boolean | number | string;
  ranks: RankPrize[];
  policy: RankPrize[];
  message: string;
};

export const fetchPrizeDistribution =
  async (): Promise<PrizeDistributionProps> => {
    const response = await axios.get<PrizeDistributionProps>(
      PRIZE_DISTRIBUTIONS_API_URL,
    );
    assertStatus(
      response.data.status,
      response.data.message || "Prize distribution API failed.",
    );

    return response.data;
  };

export type PlayerDetailsData = {
  id?: number;
  username?: string;
  avater?: string;
  balance?: string;
};

type PlayerDetails = {
  status?: boolean | number | string;
  data?: PlayerDetailsData;
  message?: string;
};

export const fetchPlayerInfo = async (): Promise<PlayerDetailsData> => {
  const userId = getRequiredUserId();
  const response = await axios.get<PlayerDetails>(`${PLAYER_API_URL}/${userId}`);
  assertStatus(response.data.status, response.data.message || "Player API failed.");

  return response.data.data ?? {};
};

type SlotElement = {
  id: number;
  option_id: number;
};

export type BetPlaceResponse = {
  /** API documentation uses success boolean. */
  success?: boolean;
  /** API documentation uses status: "win" or "lost". */
  status?: "win" | "lost" | string | boolean | number;
  win_amount: string;
  result: {
    set_A: SlotElement[];
    set_B: SlotElement[];
    set_C: SlotElement[];
  };
  /** Backend may send BIG WIN / MEGA WIN / SUPER WIN / null. */
  win_type: string | null;
};

export type betPlace = BetPlaceResponse;

function validateBetPlaceResponse(data: BetPlaceResponse): void {
  const normalizedStatus = String(data.status ?? "").trim().toLowerCase();
  const isSuccessfulRequest =
    data.success === true ||
    data.status === true ||
    data.status === 1 ||
    normalizedStatus === "true" ||
    normalizedStatus === "1" ||
    normalizedStatus === "win" ||
    normalizedStatus === "lost";

  if (!isSuccessfulRequest) {
    throw new Error("Bet place API failed.");
  }

  if (!data.result?.set_A || !data.result?.set_B || !data.result?.set_C) {
    throw new Error("Bet place API response is missing result sets.");
  }

  if (
    data.result.set_A.length < 3 ||
    data.result.set_B.length < 3 ||
    data.result.set_C.length < 3
  ) {
    throw new Error("Bet place API response must contain a 3x3 slot result.");
  }
}

export const betPlace = async (amount: number): Promise<betPlace> => {
  const userId = getRequiredUserId();

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid bet amount.");
  }

  /**
   * Matches the PDF documentation exactly:
   * POST /bet-place
   * {
   *   "user_id": 2,
   *   "amount": 1000
   * }
   */
  const response = await axios.post<BetPlaceResponse>(BET_PLACE_API_URL, {
    user_id: userId,
    amount,
  });

  validateBetPlaceResponse(response.data);

  return {
    ...response.data,
    win_type: response.data.win_type ?? null,
  };
};

type MusicSettingResponse = {
  status?: boolean | number | string;
  data?: number;
  message?: string;
};

export const fetchMusicSetting = async (): Promise<boolean> => {
  const userId = getRequiredUserId();
  const response = await axios.get<MusicSettingResponse>(
    `${MUSIC_SETTING_API_URL}/${GAME_ID}/${userId}`,
  );
  assertStatus(response.data.status, response.data.message || "Music setting API failed.");

  return response.data.data === 1;
};

type SaveMusicSettingResponse = {
  status?: boolean | number | string;
  message?: string;
};

export const saveMusicSetting = async (
  isMusicOn: boolean,
): Promise<SaveMusicSettingResponse> => {
  const userId = getRequiredUserId();
  const response = await axios.post<SaveMusicSettingResponse>(
    MUSIC_SETTING_API_URL,
    {
      game_id: GAME_ID,
      user_id: userId,
      status: isMusicOn ? 1 : 0,
    },
  );
  assertStatus(response.data.status, response.data.message || "Save music setting API failed.");

  return response.data;
};

export type WinToday = {
  status: boolean | number | string;
  user_id: number;
  win: number;
};

export const fetchWinToday = async (): Promise<WinToday> => {
  const userId = getRequiredUserId();
  const response = await axios.get<WinToday>(`${WIN_TODAY_API_URL}/${userId}`);
  assertStatus(response.data.status, "Win today API failed.");

  return response.data;
};

export type ACtivePlayersData = {
  id: number;
  user_id: number;
  win_amount: number;
  win_type: string | null;
  user: {
    id: number;
    username: string;
    avater: string;
  };
};

export type ActivePlayers = {
  status: boolean;
  total_amount: number;
  total_user: number;
  data: ACtivePlayersData[];
};

export const fetchActivePlayers = async (): Promise<ActivePlayers> => {
  const response = await axios.get<ActivePlayers>(ACTIVE_PLAYERS_API_URL);

  if (!response.data.status) {
    throw new Error("Active players API failed.");
  }

  return response.data;
};

type HistoryElement = {
  id: number;
  option_id: number;
};

type HistoryResult = {
  set_A: HistoryElement[];
  set_B: HistoryElement[];
  set_C: HistoryElement[];
};

type HistoryData = {
  id: number;
  user_id: number;
  bet_amount: string;
  round_result: HistoryResult;
  win_amount: string;
  post_balance: string;
  current_balance: string;
  status: string;
  created_at: string;
};

export type History = {
  status: boolean | number | string;
  data: HistoryData[];
};

export const fetchHistory = async (): Promise<History> => {
  const userId = getRequiredUserId();
  const response = await axios.get<History>(`${HISTORY_API_URL}/${userId}`);
  assertStatus(response.data.status, "History API failed.");

  return response.data;
};