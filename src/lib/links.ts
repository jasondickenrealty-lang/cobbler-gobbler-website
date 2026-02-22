export const ORDER_ONLINE_URL =
  process.env.NEXT_PUBLIC_ORDER_ONLINE_URL || 'http://localhost:3001/auth';

const normalizedOrderOnlineUrl = ORDER_ONLINE_URL.replace(/\/+$/, '');

export const FREE_GAME_PLAY_URL = normalizedOrderOnlineUrl.endsWith('/auth')
  ? normalizedOrderOnlineUrl
  : `${normalizedOrderOnlineUrl}/auth`;
