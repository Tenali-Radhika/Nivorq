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
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 520 }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(14,20,32,0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'rgba(0,242,254,0.12)',
              color: '#00f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0,242,254,0.3)'
            }}>
              <Key style={{ width: 17, height: 17 }} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>System & Model Configuration</h3>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>Google Cloud Vertex AI & Gemini Architecture</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Banner */}
          <div style={{
            padding: 14,
            borderRadius: 12,
            background: 'rgba(0,242,254,0.06)',
            border: '1px solid rgba(0,242,254,0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10
          }}>
            <Shield style={{ width: 16, height: 16, color: '#00f2fe', marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 11.5, color: '#e0f2fe', lineHeight: 1.5 }}>
              <strong>Enterprise Zero-Trust Mode:</strong> If no API key is specified, Nivorq operates in self-contained high-fidelity grounded mode using the pre-indexed vector corpus and deterministic ADK multi-agent synthesis.
            </div>
          </div>

          {/* Gemini Key */}
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
              Gemini API Key (Optional)
            </label>
            <input
              type="password"
              placeholder="AIzaSy... (leave blank to use default enterprise simulation)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
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
            <p style={{ fontSize: 10.5, color: '#64748b', marginTop: 4 }}>Accepts standard Gemini API key or Vertex AI service token.</p>
          </div>

          {/* Model Selection */}
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
              Foundation Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
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
            >
              <option value="gemini-2.5-flash">Gemini 3.8 / 2.5 Flash (Sub-second Agent Routing & Tool Calls)</option>
              <option value="gemini-1.5-pro">Gemini 3.1 / 1.5 Pro (Deep Strategic Research & Reasoning)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen Multimodal Execution)</option>
            </select>
          </div>

          {/* GCP Details */}
          <div style={{
            padding: 14,
            borderRadius: 12,
            background: 'rgba(10,15,26,0.6)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: 11.5
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Server style={{ width: 13, height: 13 }} /> GCP Region</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#ffffff' }}>asia-southeast1 (Singapore)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Cpu style={{ width: 13, height: 13 }} /> Target Runtime</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#ffffff' }}>Google Cloud Run (Serverless)</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {savedSuccess ? (
                <>
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#ffffff' }} />
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
