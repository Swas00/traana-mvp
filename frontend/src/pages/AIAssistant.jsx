import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  Mic, 
  ShieldAlert, 
  Radio, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function AIAssistant({ setCurrentTab }) {
  const { activeAlert, t } = useEmergency();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello. I am **TRAANA AI**, your emergency disaster response advisor.\n\nI am actively monitoring the current **${activeAlert ? activeAlert.type : 'Emergency'}** alert for your sector. How can I assist you with immediate evacuation, shelter discovery, or safety protocols?`,
      disclaimer: "⚠️ TRAANA MVP: Answers are informational. Prioritize official loudspeaker sirens and directives from civil defense personnel."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "What should I do during this flood?",
    "Where is the nearest safe shelter?",
    "What should I pack in my 72h go-bag?",
    "Is tap water safe to drink right now?",
    "What to do if there is a downed power cable?",
    "Show me emergency helpline phone numbers"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText = null) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend || !textToSend.trim()) return;

    const userMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          activeAlertId: activeAlert?.id
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: json.data.answer,
            disclaimer: json.data.disclaimer,
            provider: json.provider
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: "I am having trouble reaching the emergency data feed. Please dial **112** immediately for urgent assistance.",
            disclaimer: "⚠️ Call emergency services directly."
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "Communication timeout. Seek high ground immediately and call **112** or **1070**.",
          disclaimer: "⚠️ Emergency priority."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Strip markdown formatting for speech
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t.aiTitle}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1">
              <Sparkles size={12} /> Gemini Contextual AI
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t.aiSubtitle}
          </p>
        </div>

        {activeAlert && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200">
            <Radio size={14} className="text-red-400 animate-pulse" />
            <span>Aware of Active: <strong>{activeAlert.type} ({activeAlert.severity})</strong></span>
          </div>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          {t.quickQuestions}:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 h-[480px] flex flex-col shadow-2xl overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-sm leading-relaxed ${
                  isBot
                    ? 'bg-slate-950 border border-slate-800 text-slate-200 shadow-md'
                    : 'bg-blue-600 text-white font-medium shadow-md'
                }`}>
                  <div className="whitespace-pre-line text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  {isBot && msg.disclaimer && (
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400 font-normal">
                      {msg.disclaimer}
                    </div>
                  )}

                  {isBot && (
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Provider: {msg.provider || 'TRAANA Core'}</span>
                      <button
                        onClick={() => speakText(msg.text)}
                        title="Read aloud"
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                      >
                        <Volume2 size={12} />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot size={18} />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span>TRAANA AI is assessing active alert context and synthesizing life-safety advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.askPlaceholder}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold transition shadow-lg"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
