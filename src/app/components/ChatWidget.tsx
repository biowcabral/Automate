'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME: Message = {
  role: 'assistant',
  content: "Hey! 👋 I'm Aria, coding2u's automation specialist. Tell me — what repetitive tasks are eating up your team's time right now?",
};

export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [handoff, setHandoff]   = useState(false);
  const [badge, setBadge]       = useState(true);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) setBadge(false); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || handoff) return;

    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      if (data.handoff) setHandoff(true);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, something went wrong. Please try again or reach out via WhatsApp!" },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, handoff, messages]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Chat panel */}
        {open && (
          <div
            className="flex flex-col animate-fade-in"
            style={{
              width: 'min(380px, calc(100vw - 2rem))',
              height: 'min(540px, calc(100vh - 6rem))',
              background: 'linear-gradient(160deg, #0B1628 0%, #0E1C30 100%)',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: '1.25rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,115,22,0.08)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(249,115,22,0.12)',
              background: 'rgba(249,115,22,0.06)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F97316, #c2410c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                ⚡
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Aria</p>
                <p style={{ color: 'rgba(249,115,22,0.8)', fontSize: '0.7rem', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  coding2u Automation Specialist
                </p>
              </div>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                padding: '2px 8px', borderRadius: 999,
                background: 'rgba(249,115,22,0.15)', color: '#F97316',
                border: '1px solid rgba(249,115,22,0.3)',
              }}>coding2u</span>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 20, lineHeight: 1, padding: 0, marginLeft: 4 }}
                aria-label="Close chat"
              >×</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%', padding: '0.6rem 0.9rem',
                    borderRadius: m.role === 'user' ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                    background: m.role === 'user'
                      ? 'linear-gradient(135deg, #F97316, #ea6a0a)'
                      : 'rgba(255,255,255,0.07)',
                    color: '#fff', fontSize: '0.825rem', lineHeight: 1.5,
                    border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Typing dots */}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '0.6rem 1rem', borderRadius: '1rem 1rem 1rem 0.2rem',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', gap: 4, alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(d => (
                      <span key={d} style={{
                        width: 6, height: 6, borderRadius: '50%', background: '#F97316',
                        display: 'inline-block', animation: 'bounce 1.2s infinite',
                        animationDelay: `${d * 0.2}s`,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Handoff */}
              {handoff && (
                <div style={{
                  margin: '0.5rem 0', padding: '1rem', borderRadius: '1rem',
                  background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)',
                  textAlign: 'center',
                }}>
                  <p style={{ color: '#86efac', fontSize: '0.8rem', margin: 0, fontWeight: 600 }}>
                    ✓ Our automation team has been notified and will reach out shortly!
                  </p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {!handoff && (
              <div style={{
                padding: '0.75rem 1rem', borderTop: '1px solid rgba(249,115,22,0.1)',
                display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(0,0,0,0.2)',
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type your message…"
                  disabled={loading}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    borderRadius: 999, padding: '0.55rem 1rem',
                    color: '#fff', fontSize: '0.825rem', outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(249,115,22,0.2)')}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: 'none',
                    background: input.trim() ? '#F97316' : 'rgba(249,115,22,0.2)',
                    color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'background 0.2s',
                  }}
                  aria-label="Send"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            )}

            <p style={{ color: '#334155', fontSize: '0.6rem', textAlign: 'center', padding: '0.4rem 0', margin: 0 }}>
              Powered by coding2u AI
            </p>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Open chat"
          style={{
            width: 56, height: 56, borderRadius: '50%', border: 'none',
            background: open
              ? 'linear-gradient(135deg, #1E3A5F, #0B1628)'
              : 'linear-gradient(135deg, #F97316, #c2410c)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: open ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 32px rgba(249,115,22,0.5)',
            transition: 'all 0.3s ease',
            position: 'relative',
          }}
        >
          {badge && !open && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 18, height: 18, borderRadius: '50%',
              background: '#22c55e', color: '#fff',
              fontSize: '0.65rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #0B1628',
            }}>1</span>
          )}
          {open ? (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4C2.897 2 2 2.897 2 4v18l4-4h14c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 12H5.586L4 15.586V4h16v10z"/>
            </svg>
          )}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease forwards; }
      `}</style>
    </>
  );
}
