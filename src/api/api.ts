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
  if (typeof status === "boolean") return status;
  if (typeof status === "number") return status === 1;

  if (typeof status === "string") {
    const normalized = status.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "success";
  }

  return false;
}

export type GameOption = {
  id: number;
  name: string;
  logo: string;
};

export type BetAmount = {
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
  status?: ApiStatus;
  data?: GameDetailsData;
  message?: string;
};

export const fetchGameDetail = async (): Promise<GameDetailsData> => {
  const response = await axios.get<GameDetails>(GAME_DETAILS_API_URL);

  if (!isTruthyStatus(response.data.status)) {
    console.warn(response.data.message || "Game details API returned false status.");
  }

  return response.data.data ?? {
    id: GAME_ID,
    name: "Super 777",
  };
};

type RemainingTodayData = {
  server_time: string;
  end_time: string;
  remaining_seconds: number;
};

export type RemainingToday = {
  status: ApiStatus;
  data: RemainingTodayData;
  message: string;
};

export const fetchRemainingToday = async (): Promise<RemainingToday> => {
  const response = await axios.get<RemainingToday>(REMAINING_API_URL);
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
  status?: ApiStatus;
  gift?: string;
  today?: RankingItem[];
  today_my_ranking?: MyRanking | null;
  yesterday?: RankingItem[];
  yesterday_my_ranking?: MyRanking | null;
};

export const fetchRanking = async (): Promise<RankingResponse> => {
  const response = await axios.get<RankingResponse>(
    `${RANKING_API_URL}/${getRequiredUserId()}`,
  );

  return response.data;
};

type Jackpot = {
  status: ApiStatus;
  amount: string;
};

export const fetchJackpot = async (): Promise<Jackpot> => {
  const response = await axios.get<Jackpot>(JACKPOT_API_URL);
  return response.data;
};

export type RechargeUrlResponse = {
  status?: ApiStatus;
  message?: string;
  url?: string;
};

export const fetchRechargeUrl = async (): Promise<RechargeUrlResponse> => {
  const response = await axios.get<RechargeUrlResponse>(RECHARGE_URL_API_URL);
  return response.data;
};

type RankPrize = {
  rank_no: string;
  price: number;
  policy: string | null;
};

export type PrizeDistributionProps = {
  status: ApiStatus;
  ranks: RankPrize[];
  policy: RankPrize[];
  message: string;
};

export const fetchPrizeDistribution =
  async (): Promise<PrizeDistributionProps> => {
    const response = await axios.get<PrizeDistributionProps>(
      PRIZE_DISTRIBUTIONS_API_URL,
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
  status?: ApiStatus;
  data?: PlayerDetailsData;
  message?: string;
};

export const fetchPlayerInfo = async (): Promise<PlayerDetailsData> => {
  const response = await axios.get<PlayerDetails>(
    `${PLAYER_API_URL}/${getRequiredUserId()}`,
  );

  return response.data.data ?? {};
};

type SlotElement = {
  id: number;
  option_id: number;
};

export type BetPlaceResponse = {
  success?: boolean;
  status?: "win" | "lost" | string | boolean | number;
  win_amount: string;
  balance?: string | number;
  current_balance?: string | number;
  post_balance?: string | number;
  new_balance?: string | number;
  wallet_balance?: string | number;
  data?: {
    balance?: string | number;
    current_balance?: string | number;
    post_balance?: string | number;
    new_balance?: string | number;
    wallet_balance?: string | number;
  };
  result: {
    set_A: SlotElement[];
    set_B: SlotElement[];
    set_C: SlotElement[];
  };
  win_type?: string | null;
};

export type betPlace = BetPlaceResponse;

function isSuccessfulBetResponse(data: BetPlaceResponse): boolean {
  const normalizedStatus = String(data.status ?? "").trim().toLowerCase();

  return (
    data.success === true ||
    data.status === true ||
    data.status === 1 ||
    normalizedStatus === "true" ||
    normalizedStatus === "1" ||
    normalizedStatus === "win" ||
    normalizedStatus === "lost"
  );
}

function validateBetPlaceResponse(data: BetPlaceResponse): void {
  if (!isSuccessfulBetResponse(data)) {
    throw new Error("Bet place API failed.");
  }

  if (!data.result?.set_A || !data.result?.set_B || !data.result?.set_C) {
    throw new Error("Bet place API response is missing result sets.");
  }
}

export const betPlace = async (amount: number): Promise<betPlace> => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Invalid bet amount: ${String(amount)}`);
  }

  const response = await axios.post<BetPlaceResponse>(BET_PLACE_API_URL, {
    user_id: getRequiredUserId(),
    amount,
  });

  validateBetPlaceResponse(response.data);

  return response.data;
};

type MusicSettingResponse = {
  status?: ApiStatus;
  data?: number;
  message?: string;
};

export const fetchMusicSetting = async (): Promise<boolean> => {
  const response = await axios.get<MusicSettingResponse>(
    `${MUSIC_SETTING_API_URL}/${GAME_ID}/${getRequiredUserId()}`,
  );

  return response.data.data === 1;
};

export const saveMusicSetting = async (
  isMusicOn: boolean,
): Promise<{ status?: ApiStatus; message?: string }> => {
  const response = await axios.post(MUSIC_SETTING_API_URL, {
    game_id: GAME_ID,
    user_id: getRequiredUserId(),
    status: isMusicOn ? 1 : 0,
  });

  return response.data;
};

export type WinToday = {
  status: ApiStatus;
  user_id: number;
  win: number;
};

export const fetchWinToday = async (): Promise<WinToday> => {
  const response = await axios.get<WinToday>(
    `${WIN_TODAY_API_URL}/${getRequiredUserId()}`,
  );

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
  status: ApiStatus;
  data: HistoryData[];
};

export const fetchHistory = async (): Promise<History> => {
  const response = await axios.get<History>(
    `${HISTORY_API_URL}/${getRequiredUserId()}`,
  );

  return response.data;
};
