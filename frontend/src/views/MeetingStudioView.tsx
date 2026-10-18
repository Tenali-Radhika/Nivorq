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
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 glass-panel-glow border border-slate-800 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-purple-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Meeting Intelligence Studio
            </span>
            <span className="text-xs text-slate-400">Autonomous Workflow Synthesis</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">Transcript to Decision Automation</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Automatically synthesize executive summaries, decisions, consensus scores, and actionable tasks directly from unstructured transcripts.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTitle(p.title);
                setTranscript(p.text);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Transcript Editor */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Meeting Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Unstructured Transcript / Meeting Notes
              </label>
              <textarea
                rows={12}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste verbatim transcript or audio transcription here..."
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={loading || !transcript.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Intelligence...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Meeting Intelligence Agent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Intelligence Results */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Summary & Consensus Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Consensus Meter */}
                <div className="p-5 rounded-2xl glass-panel-glow border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" /> Consensus Score
                  </span>
                  <div className="my-2">
                    <span className="text-3xl font-extrabold text-cyan-400 font-mono">
                      {result.consensus_score}%
                    </span>
                    <span className="block text-xs font-semibold text-emerald-400 mt-0.5">
                      {result.alignment_label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">Unanimous Board Resolution</span>
                </div>

                {/* Executive TL;DR */}
                <div className="sm:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Executive TL;DR
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {result.executive_summary}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-2">Processed in {result.latency_ms}ms</span>
                </div>
              </div>

              {/* Decisions Made vs Deferred */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Decisions Made */}
                <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Decisions Made & Approved
                  </span>
                  <div className="space-y-2">
                    {result.decisions_made.map((d) => (
                      <div key={d.id} className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-xs text-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                            {d.status}
                          </span>
                          <span className="text-[10px] text-slate-400">Impact: {d.impact}</span>
                        </div>
                        <p>{d.decision}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decisions Deferred & Tension */}
                <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Deferred Decisions & Tension
                  </span>
                  <div className="space-y-2">
                    {result.decisions_deferred.map((d) => (
                      <div key={d.id} className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs text-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold">
                            DEFERRED
                          </span>
                          <span className="text-[10px] text-slate-400">{d.owner}</span>
                        </div>
                        <p className="font-semibold">{d.decision}</p>
                        <p className="text-[11px] text-slate-400">{d.reason}</p>
                      </div>
                    ))}
                    {result.tension_points.map((t, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 italic">
                        • {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Items Generated */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Synthesized Action Items (Ready for Kanban)
                  </span>
                  <span className="text-xs text-slate-400">{result.action_items.length} tasks extracted</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.action_items.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          act.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          act.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}>
                          {act.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{act.due_date}</span>
                      </div>
                      <p className="text-xs font-semibold text-white leading-snug">{act.title}</p>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{act.assignee}</span>
                        <span className="text-slate-500 font-mono text-[10px]">{act.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click Executive Follow-up Email Draft */}
              <div className="p-5 rounded-2xl glass-panel-glow border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> 1-Click Executive Follow-Up Broadcast
                  </span>
                  <button
                    onClick={copyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email Digest'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result.executive_briefing}
                </div>
              </div>

            </div>
          ) : (
            /* Empty State */
            <div className="h-full min-h-[420px] flex flex-col items-center justify-center p-8 glass-panel border border-slate-800/80 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">No Meeting Intelligence Generated Yet</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Select one of the presets on the left or paste your own meeting transcript, then click <strong>"Run Meeting Intelligence Agent"</strong> to extract consensus, decisions, and tasks.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
