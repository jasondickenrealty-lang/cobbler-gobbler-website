export const ORDER_ONLINE_URL =
  process.env.NEXT_PUBLIC_ORDER_ONLINE_URL || 'https://order.cobblestonecreamery.com/auth';

const normalizedOrderOnlineUrl = ORDER_ONLINE_URL.replace(/\/+$/, '');
const onlineOrderingBaseUrl = normalizedOrderOnlineUrl.replace(/\/auth(?:\?.*)?$/, '');

export const FREE_GAME_PLAY_URL = `${onlineOrderingBaseUrl}/portal/games`;
