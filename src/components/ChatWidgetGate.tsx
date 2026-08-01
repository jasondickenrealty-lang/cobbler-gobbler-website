'use client';

import { usePathname } from 'next/navigation';
import { isDisplayRoute } from '@/lib/displayRoutes';
import ChatWidget from './ChatWidget';

/**
 * Decides whether Moona's chat launcher renders.
 *
 * Off on unattended screens (TV boards, in-store kiosks) — nobody is there to
 * dismiss a chat bubble covering the menu.
 *
 * Kill switch: set NEXT_PUBLIC_SUPPORT_CHAT_ENABLED=false in apphosting.yaml and
 * redeploy to take her down site-wide without a code change. NEXT_PUBLIC_* values
 * are inlined at build time, so a rebuild is required either way. Any other value
 * (including unset) leaves her on.
 */
const CHAT_DISABLED = process.env.NEXT_PUBLIC_SUPPORT_CHAT_ENABLED === 'false';

export default function ChatWidgetGate() {
  const pathname = usePathname();

  if (CHAT_DISABLED) {
    return null;
  }

  if (isDisplayRoute(pathname)) {
    return null;
  }

  return <ChatWidget />;
}
