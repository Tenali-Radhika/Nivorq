import React, { useState } from 'react';
import { Send, Sparkles, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Bookmark, ArrowRight, Clock, Plus, Bot, User } from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { ChatMessage, Citation, ActionItem } from '../types';

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
    <div className="copilot-container">
      
      {/* Messages Scroll Area */}
      <div className="chat-scroll-area">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`chat-message-row ${msg.role === 'user' ? 'user-row' : 'assistant-row'}`}
          >
            {msg.role === 'user' ? (
              <div className="user-bubble">
                {msg.content}
              </div>
            ) : (
              <div className="assistant-wrapper">
                <div className="bot-avatar">
                  <Bot style={{ width: 20, height: 20 }} />
                </div>

                <div className="assistant-body">
                  {/* Multi-Agent Reasoning Trace */}
                  {msg.thought_trace && msg.thought_trace.length > 0 && (
                    <div className="reasoning-trace-card">
                      <button
                        onClick={() => setExpandedTraceIndex(expandedTraceIndex === idx ? null : idx)}
                        className="reasoning-trace-header"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Sparkles style={{ width: 14, height: 14, color: '#00f2fe' }} />
                          <span style={{ fontWeight: 700, color: '#ffffff' }}>ADK Multi-Agent Execution Graph</span>
                          <span className="brand-badge" style={{ fontSize: 10, padding: '1px 6px' }}>
                            {msg.thought_trace.length} Agents
                          </span>
                          {msg.latency_ms && (
                            <span style={{ color: '#94a3b8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock style={{ width: 12, height: 12 }} /> {msg.latency_ms}ms
                            </span>
                          )}
                        </div>
                        {expandedTraceIndex === idx ? (
                          <ChevronUp style={{ width: 16, height: 16 }} />
                        ) : (
                          <ChevronDown style={{ width: 16, height: 16 }} />
                        )}
                      </button>

                      {expandedTraceIndex === idx && (
                        <div className="reasoning-steps-list">
                          {msg.thought_trace.map((step) => (
                            <div key={step.step} className="step-item">
                              <CheckCircle2 style={{ width: 14, height: 14, color: '#10b981', marginTop: 2, flexShrink: 0 }} />
                              <div className="step-content">
                                <div className="step-header">
                                  <span className="step-agent-name">{step.agent}</span>
                                  <span className="step-duration">{step.duration_ms}ms</span>
                                </div>
                                <p className="step-details">{step.details}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assistant Response Box with Clean Markdown Rendering */}
                  <div className="assistant-response-box">
                    <Markdown>{msg.content}</Markdown>

                    {/* Grounded Citations Bar */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="citations-wrapper">
                        <div className="citations-header">
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981' }}>
                            <ShieldCheck style={{ width: 15, height: 15 }} />
                            Grounded Citations ({msg.grounding_score}% Confidence)
                          </span>
                          <span style={{ color: '#64748b', fontSize: 11, textTransform: 'none' }}>
                            Click to inspect exact source
                          </span>
                        </div>
                        <div className="citation-chips-flex">
                          {msg.citations.map((c) => (
                            <button
                              key={c.chunk_id}
                              onClick={() => onSelectCitation(c)}
                              className="citation-chip-btn"
                            >
                              <Bookmark style={{ width: 13, height: 13, color: '#00f2fe' }} />
                              <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {c.doc_title}
                              </span>
                              <span className="citation-chip-badge">
                                {Math.round(c.confidence * 100)}%
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extracted Actions Section */}
                    {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                      <div className="actions-extracted-box">
                        <div className="citations-header">
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a855f7' }}>
                            <Sparkles style={{ width: 15, height: 15 }} />
                            Action Items Extracted by Workflow Agent
                          </span>
                        </div>
                        <div className="actions-cards-grid">
                          {msg.suggested_actions.map((act) => (
                            <div key={act.id} className="extracted-action-card">
                              <div>
                                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#f8fafc', marginBottom: 2 }}>
                                  {act.title}
                                </div>
                                <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', gap: 6 }}>
                                  <span>{act.assignee}</span>
                                  <span>•</span>
                                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>{act.priority}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => onAddActionToBoard(act)}
                                title="Add to Kanban Board"
                                className="btn-secondary"
                                style={{ padding: '6px 10px', borderRadius: 8 }}
                              >
                                <Plus style={{ width: 14, height: 14, color: '#00f2fe' }} />
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
          <div className="assistant-wrapper">
            <div className="bot-avatar">
              <Bot style={{ width: 20, height: 20 }} />
            </div>
            <div className="assistant-response-box" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#94a3b8' }}>
              <Sparkles style={{ width: 16, height: 16, color: '#00f2fe', animation: 'spin 1.5s linear infinite' }} />
              <span>Agents executing: Vector Search → Gemini Synthesis → Verification Critic...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Bar */}
      <div className="quick-prompts-bar">
        <span className="quick-prompt-label">Quick Prompts:</span>
        {promptSuggestions.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSuggestedPrompt(item.prompt)}
            disabled={loading}
            className="prompt-pill-btn"
          >
            <span>{item.label}</span>
            <ArrowRight style={{ width: 12, height: 12, color: '#00f2fe' }} />
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSubmit} className="chat-input-form" style={{ marginTop: 10 }}>
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask anything across enterprise documents, meetings, architectures, or SOC-2 compliance..."
            className="chat-input-field"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="chat-send-btn"
          >
            <Send style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </form>

    </div>
  );
};
