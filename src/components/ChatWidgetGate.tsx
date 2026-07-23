'use client';

import { usePathname } from 'next/navigation';
import { isDisplayRoute } from '@/lib/displayRoutes';
import ChatWidget from './ChatWidget';

export default function ChatWidgetGate() {
  const pathname = usePathname();

  if (isDisplayRoute(pathname)) {
    return null;
  }

  return <ChatWidget />;
}