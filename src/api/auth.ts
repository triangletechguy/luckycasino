/**
 * Company confirmed user integration is not needed for this game.
 * Keep this file only for backwards compatibility with old imports.
 */

export type IntroResponse = {
  status: boolean;
  user_id?: number;
};

export const checkIntroIntegration = async (
  userId: number,
  _token: number | string,
): Promise<IntroResponse> => ({
  status: Number.isInteger(userId) && userId > 0,
  user_id: userId,
});