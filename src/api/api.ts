import axios from "axios";
import {
  GAME_ID,
  GAME_DETAILS_API_URL,
  PLAYER_API_URL,
  BET_PLACE_API_URL,
  MUSIC_SETTING_API_URL,
  RANKING_API_URL,
  RECHARGE_URL_API_URL,
  PRIZE_DISTRIBUTIONS_API_URL,
  JACKPOT_API_URL,
  REMAINING_API_URL,
  WIN_TODAY_API_URL,
  ACTIVE_PLAYERS_API_URL,
  HISTORY_API_URL,
} from "../config/gameconfig";
import { getUserId } from "../utils/user";

///////////////////////////////////////////////////////////////
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
  status?: boolean;
  data?: GameDetailsData;
  message?: string;
};
export const fetchGameDetail = async (): Promise<GameDetailsData> => {
  const response = await axios.get<GameDetails>(GAME_DETAILS_API_URL);
  if (!response.data.status) {
    // throw new Error(response.data.message || "API returned false status");
    console.log("game-details error")
  }
  return response.data.data as GameDetailsData;
};
/////////////////////////////////////////////////////////////
// export type CreateRoundResponse = {
//   game_id: number;
//   round_no: number;
//   remaining_seconds: number;
//   stage: string;
// };
// export const createRound = async (): Promise<CreateRoundResponse> => {
//   const response = await axios.get<CreateRoundResponse>(CURRENT_ROUND_API_URL);
//   if (!response.data) {
//     // throw new Error(response.data || "Failed to load sound setting");
//     console.log("game-round error")
//   }
//   return response.data;
// }
///////////////////////////////////////////////////////////
// type Winners = {
//   id: number;
//   username: string;
//   avater: string;
//   win_amount: number;
// }
// export type ResultData = {
//   round_id: number;
//   round_no: number;
//   winning_option_id: number;
//   winners: Winners[];
// };
// export type MakeResultResponse = {
//   status: boolean;
//   message: string;
//   data?: ResultData;
// };
// export const makeGameResult = async (roundId: number): Promise<MakeResultResponse> => {
//     const response = await axios.post<MakeResultResponse>(ROUND_RESULT_API_URL, {
//       game_id: GAME_ID,
//       round_no: roundId,
//     });
//   if (!response.data.status) {
// console.log("round-result status error")
//     // throw new Error(response.data.message || "Failed to make game result");
//   }
//   if (!response.data.data) {
// console.log("round-result data error")
//     // throw new Error(response.data.message || "Failed to make game result");
//   }
//   return response.data;
// };
///////////////////////////////////////////////////////////////
// type GameResultItem = {
//   option_id: number;
//   option_name: string;
//   is_jackpot:number;
// };
// export type GameResults = {
//   status?: boolean;
//   data?: GameResultItem[];
//   message?: string;
// };
// export const fetchGameResults = async (): Promise<GameResults> => {
//   const response = await axios.get<GameResults>(GAME_RESULTS_API_URL);
//   if (!response.data.status) {
//     // throw new Error(response.data.message || "API returned false status");
//     console.log("results error")
//   }
//   return response.data;
// };
///////////////////////////////////////////////////////////////
type RemainingTodayData={
  server_time:string;
  end_time:string;
  remaining_seconds:number;
}
type RemainingToday={
  status: boolean;
  data:RemainingTodayData;
  message:string;
}
export const fetchRemainingToday =async()=>{
  const response = await axios.get<RemainingToday>(REMAINING_API_URL);
  if (!response.data.status) {
    // throw new Error(response.data.message || "API returned false status");
    console.log("remaining today error")
  }
  return response.data;
}
///////////////////////////////////////////////////////////////
export type RankingItem = {
  user_id: number;
  total_win: string;
  total_bet:string;
  user?: {
    id: number;
    username: string;
    avater: string;
  };
};
export type RankingResponse = {
  status?: boolean;
  today?: RankingItem[];
  yesterday?: RankingItem[];
};
export const fetchRanking= async (): Promise<RankingResponse> => {
  const response = await axios.get<RankingResponse>(RANKING_API_URL);
  if (!response.data.status) {
    // throw new Error(response.data.message || "Failed to load ranking today");
    console.log("ranking today error")
  }
  return response.data;
};

type Jackpot ={
  status:boolean;
  amount:string;
}
export const fetchJackpot = async (): Promise<Jackpot> => {
  const response = await axios.get<Jackpot>(JACKPOT_API_URL);
  if (!response.data.status) {
    // throw new Error(response.data.message || "Failed to load ranking today");
     console.log("ranking yesterday error")
  }
  return response.data;
};
//////////////////////////////////////////////////////////////////////////
export type RechargeUrlResponse={
  status?:boolean;
  message?:string;
  url?:string;
}
export const fetchRechargeUrl = async (): Promise<RechargeUrlResponse> => {
  const response = await axios.get<RechargeUrlResponse>(RECHARGE_URL_API_URL);
  if (!response.data.status) {
    // throw new Error(response.data.message || "API returned false status");
    console.log("recharge error")
  }
  return response.data;
};
//////////////////////////////////////////////////////////////////////////////////
type Ranks ={
  rank_no:string;
  price:number;
  policy:string|null;
}
type Policy ={
  rank_no:string;
  price:number;
  policy:string|null;
}
export type PrizeDistributionProps = {
  status: boolean;
  ranks:Ranks[];
  policy:Policy[];
  message:string;
}
export const fetchPrizeDistribution=async (): Promise<PrizeDistributionProps> => {
  const response = await axios.get<PrizeDistributionProps>(PRIZE_DISTRIBUTIONS_API_URL);
  if (!response.data.status) {
    // throw new Error(response.data.message || "API returned false status");
    console.log("prize error")
  }
  return response.data;
};
////////////////////////////////////////////////////////////////////////////
export type PlayerDetailsData = {
  id?: number;
  username?: string;
  avater?: string;
  balance?: string;
};
type PlayerDetails = {
  status?: boolean;
  data?: PlayerDetailsData;
  message?: string;
};
export const fetchPlayerInfo = async (): Promise<PlayerDetailsData> => {
  const response = await axios.get<PlayerDetails>(`${PLAYER_API_URL}/${getUserId()}`);
  if (!response.data.status) {
    // throw new Error(response.data.message || "API returned false status");
    console.log("player error")
  }
  return response.data.data as PlayerDetailsData;
};
/////////////////////////////////////////////////////////////////////////////
type Element={
id:number;
option_id:number;
}

export type betPlace = {
  status?: string;
  win_amount:string;
  result:{
    set_A:Element[],
    set_B:Element[],
    set_C:Element[],
};
  win_type:string;
};
export const betPlace = async ( amount: number,): Promise<betPlace> => {
  const response = await axios.post<betPlace>(BET_PLACE_API_URL, {
    amount: amount,
    user_id: getUserId(),
  });
  if (!response.data.status) {
    // throw new Error(response.data.message || "Failed to place bet");
  }
  return response.data;
};
//////////////////////////////////////////////////////////////////////////////
type MusicSettingResponse = {
  status?: boolean;
  data?: number;
  message?: string;
};
export const fetchMusicSetting = async (): Promise<boolean> => {
  const response = await axios.get<MusicSettingResponse>(`${MUSIC_SETTING_API_URL}/${GAME_ID}/${getUserId()}`);
  if (!response.data.status) {
    // throw new Error(response.data.message || "Failed to load music setting");
    console.log("music-setting get error")
  }
  return response.data.data === 1;
};
/////////////////////////////////////////////////////////////////////////////
type SaveMusicSettingResponse = {
  status?: boolean;
  message?: string;
};
export const saveMusicSetting = async (
  isMusicOn: boolean,
): Promise<SaveMusicSettingResponse> => {
  const response = await axios.post<SaveMusicSettingResponse>(MUSIC_SETTING_API_URL, {
    game_id: GAME_ID,
    user_id: getUserId(),
    status: isMusicOn ? 1 : 0,
  });
  if (!response.data.status) {
    // throw new Error(response.data.message || "Failed to save music setting");
    console.log("music-setting post error")
  }
  return response.data;
};
/////////////////////////////////////////////////////////////////////////////
export type WinToday={
  status:boolean;
  user_id:number;
  win:number;
}

export const fetchWinToday = async (): Promise<WinToday> => {
  const response = await axios.get<WinToday>(`${WIN_TODAY_API_URL}/${getUserId()}`);
  if (!response.data.status) {
    // throw new Error(response.data.message || "Failed to load music setting");
    console.log("winToday get error")
  }
  return response.data;
};

 export type ACtivePlayersData={
  id:number;
  user_id:number;
  win_amount:number;
  win_type:string;
  user:{
    id:number;
    username:string;
    avater:string;
  }
}
export type ActivePlayers={
  status:boolean;
  total_amount:number;
  total_user:number;
  data:ACtivePlayersData[]
}

export const fetchActivePlayers = async (): Promise<ActivePlayers> => {
  const response = await axios.get<ActivePlayers>(ACTIVE_PLAYERS_API_URL);
  if (!response.data.status) {
    // throw new Error(response.data.message || "Failed to load music setting");
    console.log("activePlayers get error")
  }
  return response.data;
};

type HistoryElement={
  id:number;
  option_id:number;
}
type HistoryResult={
  set_A:HistoryElement[];
  set_B:HistoryElement[];
  set_C:HistoryElement[];
}
type HistoryData={
  id:number;
  user_id:number;
  bet_amount:string;
  round_result:HistoryResult;
  win_amount:string;
  post_balance:string;
  current_balance:string;
  status:string;
  created_at:string;
}
export type History={
status:boolean;
data:HistoryData[];
}

export const fetchHistory = async (): Promise<History> => {
  const response = await axios.get<History>(`${HISTORY_API_URL}/${getUserId()}`);
  if (!response.data.status) {
    // throw new Error(response.data.message || "Failed to load music setting");
    console.log("winToday get error")
  }
  return response.data;
};


