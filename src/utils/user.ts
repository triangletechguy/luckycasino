export function getUserId(): number {
  const rawUserId = localStorage.getItem("user_id");
  const userId = Number(rawUserId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return 0;
  }

  return userId;
}

export function getRequiredUserId(): number {
  const userId = getUserId();

  if (!userId) {
    throw new Error(
      "Missing authenticated user_id. Open the game with valid userid and token.",
    );
  }

  return userId;
}