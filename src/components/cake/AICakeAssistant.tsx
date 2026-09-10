import React, { useState, useRef, useEffect } from 'react';
import { useDesignerStore } from '../../stores/designerStore';
import { AISuggestion } from '../../types/ai.types';
import { Sparkles, Send, Bot, User, Check, X, Wand2, Lightbulb } from 'lucide-react';
import { Button } from '../ui/Button';

export const AICakeAssistant: React.FC = () => {
  const {
    chatMessages,
    isAiTyping,
    sendMessage,
    applySuggestion,
    currentDesign,
  } = useDesignerStore();

  const [input, setInput] = useState('');
  const [dismissedSuggestionIds, setDismissedSuggestionIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAiTyping) return;
    sendMessage(input.trim());
    setInput('');
  };

  const quickPrompts = [
    'Romantic anniversary cake idea',
    'Kids colorful superhero theme',
    'Luxury gold floral pairing',
    'Suggest matching flavor for Red Velvet',
  ];

  return (
    <div className="flex flex-col h-full max-h-[640px] rounded-3xl bg-white/95 border border-cream-300 shadow-soft-lg overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-900 via-burgundy-900 to-chocolate-950 text-white border-b border-rose-950/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 text-chocolate-950 shadow-md">
            <Sparkles className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base leading-tight">Dream Cake AI</h4>
            <p className="text-[11px] text-rose-200">Your Creative Pastry Stylist</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded-full text-gold-300 border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Stylist
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-cream-300">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
          >
            <div className="flex items-start gap-2 max-w-[90%]">
              {msg.sender === 'ai' && (
                <div className="h-7 w-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-800 shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-rose-700 text-white rounded-br-xs'
                    : 'bg-cream-100/80 text-chocolate-900 border border-cream-200 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* Suggestions embedded in AI message */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-cream-300">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                      <Wand2 className="h-3 w-3 text-gold-500" /> AI Recommendations
                    </span>
                    {msg.suggestions
                      .filter((sug) => !dismissedSuggestionIds.includes(sug.id))
                      .map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="rounded-xl bg-white border border-rose-200 p-2.5 shadow-xs space-y-2"
                        >
                          <div>
                            <span className="font-semibold text-chocolate-900 text-xs block">
                              {suggestion.title}
                            </span>
                            <p className="text-[11px] text-chocolate-600 mt-0.5">
                              {suggestion.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              type="button"
                              variant="gold"
                              size="sm"
                              className="text-[11px] h-7 px-2.5"
                              onClick={() => applySuggestion(suggestion)}
                              leftIcon={<Sparkles className="h-3 w-3" />}
                            >
                              Apply Suggestions
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-[11px] h-7 px-2 text-chocolate-500 hover:text-chocolate-800"
                              onClick={() => setDismissedSuggestionIds((prev) => [...prev, suggestion.id])}
                            >
                              Keep My Design
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[9px] text-chocolate-400 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isAiTyping && (
          <div className="flex items-center gap-2 text-xs text-chocolate-500 animate-pulse">
            <div className="h-7 w-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-800">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-xl bg-cream-100 p-2.5 border border-cream-200 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-chocolate-600 ml-1">Pastry Stylist is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-cream-50 border-t border-cream-200 overflow-x-auto scrollbar-none flex gap-1.5">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => sendMessage(prompt)}
            className="whitespace-nowrap text-[11px] font-medium bg-white hover:bg-rose-50 hover:text-rose-800 text-chocolate-700 px-2.5 py-1 rounded-lg border border-cream-300 transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
          >
            <Lightbulb className="h-3 w-3 text-gold-500" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-cream-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for recommendations, color ideas, flavor pairings..."
          className="flex-1 rounded-xl border border-cream-300 bg-cream-50/70 px-3 py-2 text-xs text-chocolate-900 placeholder:text-chocolate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-200"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!input.trim() || isAiTyping}
          className="h-8 w-8 p-0 rounded-xl shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
