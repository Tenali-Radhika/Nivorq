import React, { useState } from 'react';
import { X, Key, Cpu, Server, CheckCircle2, Shield } from 'lucide-react';
import { api } from '../api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onConfigSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentModel, onConfigSaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(currentModel || 'gemini-2.5-flash');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateConfig(apiKey ? apiKey : undefined, model);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onConfigSaved();
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-panel-glow bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">System & Model Configuration</h3>
              <p className="text-xs text-slate-400">Google Cloud Vertex AI & Gemini Architecture</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Notice banner */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-start gap-3">
            <Shield className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div className="text-xs text-cyan-200 leading-relaxed">
              <strong>Enterprise Zero-Trust Mode:</strong> If no API key is specified, Nivorq operates in self-contained high-fidelity grounded mode using the pre-indexed vector corpus and deterministic ADK multi-agent synthesis.
            </div>
          </div>

          {/* Gemini API Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gemini API Key (Optional)</span>
            </label>
            <input
              type="password"
              placeholder="AIzaSy... (leave blank to use default enterprise simulation)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
            />
            <p className="text-[11px] text-slate-500 mt-1">Accepts standard Gemini API key or Vertex AI service token.</p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Foundation Model</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 transition"
            >
              <option value="gemini-2.5-flash">Gemini 3.8 / 2.5 Flash (Sub-second Agent Routing & Tool Calls)</option>
              <option value="gemini-1.5-pro">Gemini 3.1 / 1.5 Pro (Deep Strategic Research & Reasoning)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen Multimodal Execution)</option>
            </select>
          </div>

          {/* Google Cloud Environment Details */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-slate-500" /> GCP Region</span>
              <span className="font-mono text-slate-200">asia-southeast1 (Singapore)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-slate-500" /> Target Runtime</span>
              <span className="font-mono text-slate-200">Google Cloud Run (Serverless)</span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
