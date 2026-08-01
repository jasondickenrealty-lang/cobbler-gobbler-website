'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type ChatMsg = {
  role: 'user' | 'assistant';
  text: string;
  ts: number;
};

function newConversationId() {
  // Stable per-browser tab/profile; keep it simple.
  return `web_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function ChatWidget() {
  const storageKey = 'cobblestone_support_chat_v1';
  const convoKey = 'cobblestone_support_chat_convo_v1';

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [conversationId, setConversationId] = useState<string>('');

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setMessages(JSON.parse(saved));
      const convo = localStorage.getItem(convoKey);
      if (convo) setConversationId(convo);
      else {
        const id = newConversationId();
        setConversationId(id);
        localStorage.setItem(convoKey, id);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-50)));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [open, messages.length]);

  const canSend = useMemo(() => input.trim().length > 0 && !busy, [input, busy]);

  async function send() {
    if (!canSend) return;
    const text = input.trim();
    setInput('');
    setError(null);

    const userMsg: ChatMsg = { role: 'user', text, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);

    setBusy(true);
    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const replyText = (data?.reply || '').toString().trim();
      if (!replyText) throw new Error('Empty reply');

      const botMsg: ChatMsg = { role: 'assistant', text: replyText, ts: Date.now() };
      setMessages((m) => [...m, botMsg]);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setMessages([]);
    const id = newConversationId();
    setConversationId(id);
    try {
      localStorage.setItem(convoKey, id);
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }

  return (
    // On mobile the fixed action bar owns the bottom ~62px, so `.chat-launcher-offset`
    // (globals.css) lifts the widget clear of it and drops back to the normal
    // offset at lg, where that bar is gone.
    <div className="chat-launcher-offset fixed right-4 z-[9999] font-sans sm:right-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="min-h-[44px] rounded-full bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 shadow-lg"
          aria-label="Open chat"
        >
          Chat
        </button>
      ) : (
        // Fluid width so it never exceeds a 320-360px screen, and dvh-based
        // height so the iOS keyboard can't push the composer out of reach.
        <div className="w-[calc(100vw-2rem)] max-w-[340px] sm:max-w-[380px] h-[min(520px,calc(100dvh-8rem))] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
            <div>
              <div className="font-semibold">Moona</div>
              <div className="text-xs opacity-80">I can help with flavors, orders, and store info—or take complaints and suggestions.</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={clear} className="min-h-[36px] text-xs px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">Clear</button>
              <button onClick={() => setOpen(false)} className="min-h-[36px] text-xs px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">Close</button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-sm text-gray-700 space-y-2">
                <div>Hi there! I’m <span className="font-semibold">Moona</span> 🐄</div>
                <div className="text-gray-600">
                  I can only help with CobbleStone Creamery questions (hours, location, flavors, orders, events) and cow stuff.
                </div>
              </div>
            ) : null}

            <div className="space-y-2 mt-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start items-end gap-2'}
                >
                  {m.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                      {/* Moona avatar */}
                      <img src="/moona.webp" alt="Moona" className="w-full h-full object-cover" />
                    </div>
                  ) : null}

                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[80%] bg-pink-600 text-white rounded-2xl px-3 py-2 text-sm'
                        : 'max-w-[80%] bg-white text-gray-900 border border-gray-200 rounded-2xl px-3 py-2 text-sm'
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 bg-white">
            {error ? <div className="text-xs text-red-600 mb-2">{error}</div> : null}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send();
                }}
                placeholder={busy ? 'Sending…' : 'Type a message'}
                enterKeyHint="send"
                autoCapitalize="sentences"
                /* text-base (16px) on mobile: anything smaller makes iOS
                   Safari auto-zoom the page on focus and never zoom back. */
                className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={send}
                disabled={!canSend}
                className={
                  canSend
                    ? 'shrink-0 min-h-[44px] rounded-xl bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 text-sm'
                    : 'shrink-0 min-h-[44px] rounded-xl bg-gray-300 text-gray-600 px-4 py-2 text-sm cursor-not-allowed'
                }
              >
                Send
              </button>
            </div>
            <div className="text-[11px] text-gray-500 mt-2">
              By chatting, you agree we may store this conversation for support quality.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
