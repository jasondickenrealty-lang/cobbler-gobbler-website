export const ORDER_ONLINE_URL =
  process.env.NEXT_PUBLIC_ORDER_ONLINE_URL || 'https://order.cobblestonecreamery.com/auth';

const normalizedOrderOnlineUrl = ORDER_ONLINE_URL.replace(/\/+$/, '');

export const FREE_GAME_PLAY_URL = normalizedOrderOnlineUrl.endsWith('/auth')
  ? normalizedOrderOnlineUrl.replace(/\/auth$/, '')
  : normalizedOrderOnlineUrl;
