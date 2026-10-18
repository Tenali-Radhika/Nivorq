import React from 'react';
import { Cpu, ShieldCheck, Cloud, Settings, RefreshCw, Zap } from 'lucide-react';
import { SystemHealth } from '../types';

interface NavbarProps {
  health: SystemHealth | null;
  onOpenSettings: () => void;
  onResetSamples: () => void;
  resetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ health, onOpenSettings, onResetSamples, resetting }) => {
  return (
    <header className="border-b border-[var(--border-subtle)] bg-[rgba(7,9,14,0.85)] backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Zap className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight font-['Outfit'] text-white">NIVORQ</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI Builder Cup '26
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Enterprise Autonomous Intelligence & Productivity Copilot</p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden lg:flex items-center gap-4 text-xs">
          {/* Cloud Run Telemetry */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            <Cloud className="w-3.5 h-3.5 text-blue-400" />
            <span>Cloud Run: <strong className="text-emerald-400 font-mono">Serverless Active</strong></span>
          </div>

          {/* Active Model */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Model: <strong className="text-cyan-300 font-mono">{health?.active_model || 'gemini-2.5-flash'}</strong></span>
          </div>

          {/* BigQuery Audit */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>BigQuery: <strong className="text-emerald-300 font-mono">Telemetry Streaming</strong></span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetSamples}
            disabled={resetting}
            title="Reload core sample corporate documents"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Reset Corpus</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition shadow-sm"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </header>
  );
};
