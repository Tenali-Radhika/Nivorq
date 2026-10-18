import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, AlertTriangle, Clock, Copy, Check, Users, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { MeetingAnalysisResult, ActionItem } from '../types';
import { api } from '../api';

interface MeetingStudioViewProps {
  onAddActionToBoard: (action: ActionItem) => void;
}

export const MeetingStudioView: React.FC<MeetingStudioViewProps> = ({ onAddActionToBoard }) => {
  const [title, setTitle] = useState('Executive Leadership & Board Q3 Strategy Meeting');
  const [transcript, setTranscript] = useState(`[00:00:15] Sarah Lin (CEO): Let's call the meeting to order. Internal audit indicates our staff spends 28% of their week just digging through documents. We need an autonomous AI solution now.
[00:03:40] Dr. Elena Vance (AI Architect): The Nivorq agent prototype on Google Cloud Run achieves sub-800ms P95 vector retrieval and eliminates manual document hunting.
[00:08:20] David Zhao (CFO): What is the budgetary reallocation required?
[00:09:10] Sarah Lin (CEO): Reallocate $2.4M from legacy search systems into the Nivorq Autonomous Agent program. Board, do we have consensus?
[00:11:00] Board Members: Approved unanimously.
[00:14:15] Priya Patel (VP Customer Success): We also need to roll this out as a pilot to our top 20 enterprise accounts by November 10.
[00:18:30] Marcus Sterling (Chief of Staff): Also confirming our selection for the AI Builder Cup 2026 Grand Finale in Singapore on December 4. Two members traveling.
[00:22:00] Rachel Green (CISO): Before Singapore, we must complete our SOC-2 Type II audit on BigQuery telemetry retention.
[00:25:30] David Zhao (CFO): I will deliver revised Q4 financial models showing our $340,000/year Cloud Run savings by October 22.`);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingAnalysisResult | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const presets = [
    {
      label: "Q3 Board Strategy Meeting",
      title: "Executive Leadership & Board Q3 Strategy Meeting",
      text: `[00:00:15] Sarah Lin (CEO): Let's call the meeting to order. Internal audit indicates our staff spends 28% of their week just digging through documents. We need an autonomous AI solution now.
[00:03:40] Dr. Elena Vance (AI Architect): The Nivorq agent prototype on Google Cloud Run achieves sub-800ms P95 vector retrieval and eliminates manual document hunting.
[00:08:20] David Zhao (CFO): What is the budgetary reallocation required?
[00:09:10] Sarah Lin (CEO): Reallocate $2.4M from legacy search systems into the Nivorq Autonomous Agent program. Board, do we have consensus?
[00:11:00] Board Members: Approved unanimously.
[00:14:15] Priya Patel (VP Customer Success): We also need to roll this out as a pilot to our top 20 enterprise accounts by November 10.
[00:18:30] Marcus Sterling (Chief of Staff): Also confirming our selection for the AI Builder Cup 2026 Grand Finale in Singapore on December 4. Two members traveling.
[00:22:00] Rachel Green (CISO): Before Singapore, we must complete our SOC-2 Type II audit on BigQuery telemetry retention.
[00:25:30] David Zhao (CFO): I will deliver revised Q4 financial models showing our $340,000/year Cloud Run savings by October 22.`
    },
    {
      label: "Project Titan Engineering Sync",
      title: "Project Titan Architecture & SLA Review",
      text: `[00:01:10] Elena Vance: Reviewing our sub-second P95 target on Cloud Run. We've set min instances to 2 and concurrency to 80.
[00:05:40] DevOps Lead: Auto-scaling triggers at 70% CPU. Circuit breaker handles Gemini API rate limit spikes automatically with exponential backoff.
[00:09:00] Security Engineer: All embeddings utilize text-embedding-004 with customer-managed keys via KMS.
[00:14:00] Elena Vance: Approved. Target container deployment date is October 25.`
    }
  ];

  const handleRunAnalysis = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const res = await api.analyzeMeeting(transcript, title);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.executive_briefing);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header Banner */}
      <div className="glass-panel-glow" style={{
        padding: '24px 30px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        background: 'linear-gradient(135deg, rgba(14,20,34,0.95) 0%, rgba(88,28,135,0.3) 100%)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="brand-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
              Meeting Intelligence Studio
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Autonomous Workflow Synthesis</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>Transcript to Decision Automation</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, maxWidth: 640 }}>
            Automatically synthesize executive summaries, decisions, consensus scores, and actionable tasks directly from unstructured transcripts.
          </p>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTitle(p.title);
                setTranscript(p.text);
              }}
              className="btn-secondary"
              style={{ fontSize: 11.5, padding: '6px 12px' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Left Editor & Right Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: 24 }}>
        
        {/* Left: Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
                Meeting Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: '#0d1322',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: 12.5,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
                Unstructured Transcript / Meeting Notes
              </label>
              <textarea
                rows={13}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste verbatim transcript or audio transcription here..."
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 10,
                  background: '#0d1322',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={loading || !transcript.trim()}
              className="btn-primary"
              style={{ padding: '12px 20px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              {loading ? (
                <>
                  <Sparkles style={{ width: 16, height: 16, animation: 'spin 1.5s linear infinite' }} />
                  <span>Synthesizing Intelligence...</span>
                </>
              ) : (
                <>
                  <Play style={{ width: 14, height: 14, fill: '#ffffff' }} />
                  <span>Run Meeting Intelligence Agent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Summary & Consensus Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
                <div className="glass-panel-glow" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users style={{ width: 14, height: 14, color: '#00f2fe' }} /> Consensus Score
                  </span>
                  <div style={{ margin: '10px 0' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>
                      {result.consensus_score}%
                    </span>
                    <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#10b981', marginTop: 2 }}>
                      {result.alignment_label}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Unanimous Board Resolution</span>
                </div>

                <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#c084fc', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Sparkles style={{ width: 14, height: 14 }} /> Executive TL;DR
                  </span>
                  <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6 }}>
                    {result.executive_summary}
                  </p>
                  <span style={{ fontSize: 10, color: '#64748b', marginTop: 8 }}>Processed in {result.latency_ms}ms</span>
                </div>
              </div>

              {/* Decisions Made vs Deferred */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="glass-panel" style={{ padding: 20 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#10b981', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <CheckCircle2 style={{ width: 15, height: 15 }} /> Decisions Made & Approved
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.decisions_made.map((d) => (
                      <div key={d.id} style={{
                        padding: 12,
                        borderRadius: 10,
                        background: 'rgba(16, 185, 129, 0.06)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        fontSize: 12,
                        color: '#f8fafc'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', fontSize: 9 }}>
                            {d.status}
                          </span>
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>Impact: {d.impact}</span>
                        </div>
                        <p>{d.decision}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: 20 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <AlertTriangle style={{ width: 15, height: 15 }} /> Deferred Decisions & Friction
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.decisions_deferred.map((d) => (
                      <div key={d.id} style={{
                        padding: 12,
                        borderRadius: 10,
                        background: 'rgba(245, 158, 11, 0.06)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        fontSize: 12,
                        color: '#f8fafc'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span className="brand-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)', fontSize: 9 }}>
                            DEFERRED
                          </span>
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>{d.owner}</span>
                        </div>
                        <p style={{ fontWeight: 600 }}>{d.decision}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{d.reason}</p>
                      </div>
                    ))}
                    {result.tension_points.map((t, idx) => (
                      <div key={idx} style={{
                        padding: 10,
                        borderRadius: 8,
                        background: 'rgba(14, 20, 32, 0.5)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: 11,
                        color: '#94a3b8',
                        fontStyle: 'italic'
                      }}>
                        • {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#00f2fe', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock style={{ width: 15, height: 15 }} /> Synthesized Action Items ({result.action_items.length} tasks ready for Kanban)
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {result.action_items.map((act) => (
                    <div key={act.id} className="extracted-action-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span className="brand-badge" style={{
                          background: act.priority === 'CRITICAL' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: act.priority === 'CRITICAL' ? '#f43f5e' : '#f59e0b',
                          borderColor: act.priority === 'CRITICAL' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'
                        }}>
                          {act.priority}
                        </span>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{act.due_date}</span>
                      </div>
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: '#ffffff' }}>{act.title}</p>
                      <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{act.assignee}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{act.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click Executive Follow-up Broadcast */}
              <div className="glass-panel-glow" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#c084fc', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail style={{ width: 15, height: 15 }} /> 1-Click Executive Follow-Up Broadcast
                  </span>
                  <button onClick={copyEmail} className="btn-secondary" style={{ padding: '6px 14px' }}>
                    {copiedEmail ? <Check style={{ width: 14, height: 14, color: '#10b981' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email Digest'}</span>
                  </button>
                </div>
                <div style={{
                  padding: 16,
                  borderRadius: 12,
                  background: 'rgba(8, 12, 20, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: '#cbd5e1',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {result.executive_briefing}
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel" style={{
              height: '100%',
              minHeight: 450,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 30
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: 'rgba(168, 85, 247, 0.12)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                border: '1px solid rgba(168, 85, 247, 0.3)'
              }}>
                <Sparkles style={{ width: 26, height: 26 }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff' }}>No Meeting Intelligence Generated Yet</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 420, marginTop: 6, lineHeight: 1.6 }}>
                Select one of the presets on the left or paste your own meeting transcript, then click <strong>"Run Meeting Intelligence Agent"</strong> to extract consensus, decisions, and tasks.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
