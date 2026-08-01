export const ORDER_ONLINE_URL =
  process.env.NEXT_PUBLIC_ORDER_ONLINE_URL || 'https://order.cobblestonecreamery.com/menu';
export const WHOLESALE_URL =
  process.env.NEXT_PUBLIC_WHOLESALE_URL || 'https://wholesale.cobblestonecreamery.com';

const normalizedOrderOnlineUrl = ORDER_ONLINE_URL.replace(/\/+$/, '');
const onlineOrderingBaseUrl = normalizedOrderOnlineUrl.replace(/\/(?:auth|menu)(?:\?.*)?$/, '');

export const FREE_GAME_PLAY_URL = `${onlineOrderingBaseUrl}/portal/games`;
