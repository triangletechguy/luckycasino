import axios from "axios";
import { INTRO_API_URL } from "../config/gameconfig";

export type IntroResponse = {
  status?: boolean | number | string;
  user_id?: number | string;
  message?: string;
  [key: string]: unknown;
};

export const checkIntroIntegration = async (
  userId: number,
  token: string,
): Promise<IntroResponse> => {
  const response = await axios.post<IntroResponse>(INTRO_API_URL, {
    userid: userId,
    token,
  });

  return response.data;
};