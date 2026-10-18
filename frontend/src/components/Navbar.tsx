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
    <header className="app-navbar">
      <div className="nav-wrapper">
        
        {/* Brand */}
        <div className="nav-brand-group">
          <div className="brand-icon-box">
            <Zap style={{ width: 22, height: 22, color: '#ffffff' }} />
          </div>
          <div className="brand-title-box">
            <div className="brand-title-row">
              <span className="brand-name">NIVORQ</span>
              <span className="brand-badge">AI Builder Cup '26</span>
            </div>
            <p className="brand-subtitle">Enterprise Autonomous Intelligence & Productivity Copilot</p>
          </div>
        </div>

        {/* Center Status Indicators */}
        <div className="nav-telemetry-group" style={{ display: 'flex', gap: 12 }}>
          <div className="telemetry-pill">
            <Cloud style={{ width: 14, height: 14, color: '#38bdf8' }} />
            <span>Cloud Run: <strong style={{ color: '#10b981' }}>Serverless Active</strong></span>
          </div>

          <div className="telemetry-pill">
            <Cpu style={{ width: 14, height: 14, color: '#00f2fe' }} />
            <span>Model: <strong style={{ color: '#38bdf8' }}>{health?.active_model || 'gemini-2.5-flash'}</strong></span>
          </div>

          <div className="telemetry-pill">
            <ShieldCheck style={{ width: 14, height: 14, color: '#10b981' }} />
            <span>BigQuery: <strong style={{ color: '#10b981' }}>Telemetry Streaming</strong></span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="nav-actions-group">
          <button
            onClick={onResetSamples}
            disabled={resetting}
            title="Reload core sample corporate documents"
            className="btn-secondary"
          >
            <RefreshCw style={{ width: 14, height: 14, animation: resetting ? 'spin 1s linear infinite' : 'none' }} />
            <span>Reset Corpus</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="btn-primary"
          >
            <Settings style={{ width: 14, height: 14 }} />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </header>
  );
};
