import React, { useState } from 'react';
import { Send, Sparkles, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Bookmark, ArrowRight, Clock, Plus, Bot, User } from 'lucide-react';
import { ChatMessage, Citation, ActionItem } from '../types';
import { api } from '../api';

interface CopilotViewProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  loading: boolean;
  onSelectCitation: (citation: Citation) => void;
  onAddActionToBoard: (action: ActionItem) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  messages,
  onSendMessage,
  loading,
  onSelectCitation,
  onAddActionToBoard,
}) => {
  const [input, setInput] = useState('');
  const [expandedTraceIndex, setExpandedTraceIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleSuggestedPrompt = (prompt: string) => {
    if (loading) return;
    onSendMessage(prompt);
  };

  const promptSuggestions = [
    { label: "Q3 Board Strategy & Decisions", prompt: "Summarize the key decisions, budget approvals, and Singapore Grand Finale timeline from the Q3 Board Meeting." },
    { label: "Project Titan Cloud Run Architecture", prompt: "What are the sub-second retrieval SLAs and Cloud Run autoscaling limits in the Project Titan architecture specification?" },
    { label: "SOC-2 & Data Residency Rules", prompt: "Detail the enterprise data residency, customer CMEK encryption, and zero-training guarantees under our SOC-2 and PDPA standards." },
    { label: "Customer Retention & NRR Q3", prompt: "What were our Net Revenue Retention (NRR) benchmarks and top enterprise customer feedback in the Q3 Customer Success report?" }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-6xl mx-auto px-4 py-2">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
          >
            {/* User message */}
            {msg.role === 'user' ? (
              <div className="flex items-start gap-3 max-w-2xl">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20 text-sm leading-relaxed">
                  {msg.content}
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ) : (
              /* Assistant message */
              <div className="flex items-start gap-3 max-w-3xl w-full">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
                  <Bot className="w-4 h-4 text-white" />
                </div>

                <div className="flex-1 space-y-4">
                  {/* Multi-Agent Reasoning Trace Panel */}
                  {msg.thought_trace && msg.thought_trace.length > 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden text-xs">
                      <button
                        onClick={() => setExpandedTraceIndex(expandedTraceIndex === idx ? null : idx)}
                        className="w-full px-4 py-2.5 flex items-center justify-between text-slate-300 hover:text-white hover:bg-slate-800/50 transition font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-semibold">ADK Multi-Agent Execution Graph</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] border border-cyan-500/20">
                            {msg.thought_trace.length} Agents
                          </span>
                          {msg.latency_ms && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {msg.latency_ms}ms
                            </span>
                          )}
                        </div>
                        {expandedTraceIndex === idx ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {expandedTraceIndex === idx && (
                        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
                          {msg.thought_trace.map((step) => (
                            <div key={step.step} className="flex items-start gap-2.5 text-[11px] font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-cyan-300">{step.agent}</span>
                                  <span className="text-slate-500 text-[10px]">{step.duration_ms}ms</span>
                                </div>
                                <p className="text-slate-300 mt-0.5">{step.details}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Response Card */}
                  <div className="p-5 rounded-2xl glass-panel-glow border border-slate-800/90 text-sm copilot-markdown">
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-200">
                      {msg.content}
                    </div>

                    {/* Grounding & Citations Bar */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-800/80">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Grounded Citations ({msg.grounding_score}% Confidence)
                          </span>
                          <span className="text-[11px] text-slate-500">Click to inspect exact source</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((c) => (
                            <button
                              key={c.chunk_id}
                              onClick={() => onSelectCitation(c)}
                              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/50 text-xs text-slate-300 hover:text-white transition shadow-sm"
                            >
                              <Bookmark className="w-3 h-3 text-cyan-400" />
                              <span className="max-w-[200px] truncate">{c.doc_title}</span>
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 font-mono text-[10px]">
                                {Math.round(c.confidence * 100)}%
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Actions Extracted */}
                    {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-800/80">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-400" /> Action Items Extracted by Workflow Agent
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.suggested_actions.map((act) => (
                            <div
                              key={act.id}
                              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-2"
                            >
                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-slate-200 line-clamp-1">{act.title}</span>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                  <span>{act.assignee}</span>
                                  <span>•</span>
                                  <span className="text-amber-400 font-semibold">{act.priority}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => onAddActionToBoard(act)}
                                title="Add to Kanban Board"
                                className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition shrink-0"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Agents executing: Vector Search → Gemini Synthesis → Verification Critic...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0 uppercase tracking-wider">Quick Prompts:</span>
        {promptSuggestions.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSuggestedPrompt(item.prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/40 text-slate-300 hover:text-white transition whitespace-nowrap text-xs shadow-sm flex items-center gap-1.5"
          >
            <span>{item.label}</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-2xl glass-panel-glow border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden focus-within:border-cyan-400 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask anything across enterprise documents, meetings, architectures, or SOC-2 compliance..."
            className="w-full py-4 pl-5 pr-14 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2.5 p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};
