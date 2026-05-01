'use client';

import { useEffect, useRef, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId?: string;
}

export function ChatDrawer({ isOpen, onClose, recipeId }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Keep a stable ref to the last conversation snapshot for retry
  const lastSentMessages = useRef<Message[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  async function callChat(messagesToSend: Message[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToSend, recipeId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    lastSentMessages.current = next;
    await callChat(next);
  }

  async function retry() {
    if (lastSentMessages.current.length === 0) return;
    await callChat(lastSentMessages.current);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ask Pellito"
        className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-[#f5f0e8] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '72vh', maxHeight: '600px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#526a8d] text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚓</span>
            <span className="font-display font-semibold text-sm tracking-widest uppercase">
              Ask Pellito
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="text-white/80 hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && !loading && (
            <p className="text-center text-gray-500 text-sm mt-8">
              Ask me about ingredients, steps, allergens, or any recipe.
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] px-3 py-2 text-base leading-snug whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#526a8d] text-white'
                    : 'bg-white border border-[#74777f] text-[#001b3c]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#74777f] px-4 py-2 text-sm text-gray-500">
                <span className="animate-pulse">Pellito is thinking…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start">
              <div className="bg-white border border-red-300 px-3 py-2 text-sm text-red-600 flex items-center gap-2">
                <span>{error}</span>
                <button
                  onClick={retry}
                  className="underline font-medium hover:no-underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 border-t border-[#001b3c] bg-white px-3 py-3 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a recipe…"
            disabled={loading}
            className="flex-1 border border-[#74777f] px-3 py-2 text-base bg-white text-[#001b3c] placeholder-gray-400 focus:outline-none focus:border-[#526a8d] disabled:opacity-60"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-[#526a8d] text-white px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-[#3d5270] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
