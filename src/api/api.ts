import axios from "axios";
import { BET_PLACE_API_URL, GAME_ID } from "../config/gameconfig";
import { getRequiredUserId } from "../utils/user";

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

export type RemainingTodayData = {
  server_time: string;
  end_time: string;
  remaining_seconds: number;
};

export type RemainingToday = {
  status: boolean | number | string;
  data: RemainingTodayData;
  message: string;
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

export type RechargeUrlResponse = {
  status?: boolean | number | string;
  message?: string;
  url?: string;
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

export type PlayerDetailsData = {
  id?: number;
  username?: string;
  avater?: string;
  balance?: string;
};

type SlotElement = {
  id: number;
  option_id: number;
};

export type BetPlaceResponse = {
  success?: boolean;
  status?: "win" | "lost" | string | boolean | number;
  win_amount: string;
  result: {
    set_A: SlotElement[];
    set_B: SlotElement[];
    set_C: SlotElement[];
  };
  win_type?: string | null;
};

export type betPlace = BetPlaceResponse;

export type WinToday = {
  status: boolean | number | string;
  user_id: number;
  win: number;
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

/**
 * Allowed user-action API.
 * Spin uses POST /bet-place with { user_id, amount }.
 */
export const betPlace = async (amount: number): Promise<betPlace> => {
  const userId = getRequiredUserId();

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid bet amount.");
  }

  const response = await axios.post<BetPlaceResponse>(BET_PLACE_API_URL, {
    user_id: userId,
    amount,
  });

  validateBetPlaceResponse(response.data);

  return response.data;
};

/**
 * Realtime mode: these functions do not make HTTP requests.
 * The backend should send current data through websocket payloads.
 */
export const fetchGameDetail = async (): Promise<GameDetailsData> => ({
  id: GAME_ID,
  name: "Super 777",
  options: [],
  bet_amounts: [],
});

export const fetchRemainingToday = async (): Promise<RemainingToday> => ({
  status: true,
  data: {
    server_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    remaining_seconds: 0,
  },
  message: "Realtime mode: remaining time should come from websocket.",
});

export const fetchRanking = async (): Promise<RankingResponse> => ({
  status: true,
  gift: "",
  today: [],
  today_my_ranking: null,
  yesterday: [],
  yesterday_my_ranking: null,
});

export const fetchJackpot = async (): Promise<{ status: boolean; amount: string }> => ({
  status: true,
  amount: "0",
});

export const fetchRechargeUrl = async (): Promise<RechargeUrlResponse> => ({
  status: true,
  url: "",
});

export const fetchPrizeDistribution = async (): Promise<PrizeDistributionProps> => ({
  status: true,
  ranks: [],
  policy: [],
  message: "Realtime mode: prize distribution should come from websocket.",
});

export const fetchPlayerInfo = async (): Promise<PlayerDetailsData> => ({
  id: getRequiredUserId(),
});

export const fetchMusicSetting = async (): Promise<boolean> => true;

export const saveMusicSetting = async (
  _isMusicOn: boolean,
): Promise<{ status: boolean; message: string }> => ({
  status: true,
  message: "Local music setting updated.",
});

export const fetchWinToday = async (): Promise<WinToday> => ({
  status: true,
  user_id: getRequiredUserId(),
  win: 0,
});

export const fetchActivePlayers = async (): Promise<ActivePlayers> => ({
  status: true,
  total_amount: 0,
  total_user: 0,
  data: [],
});

export const fetchHistory = async (): Promise<History> => ({
  status: true,
  data: [],
});