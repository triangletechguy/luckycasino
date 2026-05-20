const USER_ID_STORAGE_KEY = "user_id";
const USER_TOKEN_STORAGE_KEY = "user_token";
const USERNAME_STORAGE_KEY = "username";
const USER_AVATAR_STORAGE_KEY = "user_avatar";
const USER_BALANCE_STORAGE_KEY = "user_balance";

export type StoredLaunchUser = {
  userId: number;
  token: string;
  username?: string;
  avater?: string;
  avatar?: string;
  balance?: number;
};

export function saveLaunchUser(user: StoredLaunchUser): void {
  localStorage.setItem(USER_ID_STORAGE_KEY, String(user.userId));
  localStorage.setItem(USER_TOKEN_STORAGE_KEY, user.token);

  if (user.username) {
    localStorage.setItem(USERNAME_STORAGE_KEY, user.username);
  } else {
    localStorage.removeItem(USERNAME_STORAGE_KEY);
  }

  const avatar = user.avater || user.avatar;

  if (avatar) {
    localStorage.setItem(USER_AVATAR_STORAGE_KEY, avatar);
  } else {
    localStorage.removeItem(USER_AVATAR_STORAGE_KEY);
  }

  if (typeof user.balance === "number" && Number.isFinite(user.balance)) {
    localStorage.setItem(USER_BALANCE_STORAGE_KEY, String(user.balance));
  } else {
    localStorage.removeItem(USER_BALANCE_STORAGE_KEY);
  }
}

export function clearLaunchUser(): void {
  localStorage.removeItem(USER_ID_STORAGE_KEY);
  localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
  localStorage.removeItem(USERNAME_STORAGE_KEY);
  localStorage.removeItem(USER_AVATAR_STORAGE_KEY);
  localStorage.removeItem(USER_BALANCE_STORAGE_KEY);
}

export function getStoredLaunchUser(): StoredLaunchUser | null {
  const userId = Number(localStorage.getItem(USER_ID_STORAGE_KEY));
  const token = localStorage.getItem(USER_TOKEN_STORAGE_KEY) || "";

  if (!Number.isInteger(userId) || userId <= 0 || !token) {
    return null;
  }

  const username = localStorage.getItem(USERNAME_STORAGE_KEY) || undefined;
  const avatar = localStorage.getItem(USER_AVATAR_STORAGE_KEY) || undefined;
  const balanceRaw = localStorage.getItem(USER_BALANCE_STORAGE_KEY);
  const balance = balanceRaw !== null ? Number(balanceRaw) : undefined;

  return {
    userId,
    token,
    username,
    avatar,
    balance: Number.isFinite(balance) ? balance : undefined,
  };
}

export function getUserId(): number {
  const userId = Number(localStorage.getItem(USER_ID_STORAGE_KEY));

  if (!Number.isInteger(userId) || userId <= 0) {
    return 0;
  }

  return userId;
}

export function getRequiredUserId(): number {
  const userId = getUserId();

  if (!userId) {
    throw new Error(
      "Missing user_id. Open the game with ?userid=USER_ID&token=TOKEN.",
    );
  }

  return userId;
}

export function getUserToken(): string {
  return localStorage.getItem(USER_TOKEN_STORAGE_KEY) || "";
}

export function getRequiredUserToken(): string {
  const token = getUserToken();

  if (!token) {
    throw new Error(
      "Missing user token. Open the game with ?userid=USER_ID&token=TOKEN.",
    );
  }

  return token;
}