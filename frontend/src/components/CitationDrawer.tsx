import React from 'react';
import { X, FileText, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';
import { Citation } from '../types';

interface CitationDrawerProps {
  citation: Citation | null;
  onClose: () => void;
  onViewDocument: (docId: string) => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({ citation, onClose, onViewDocument }) => {
  if (!citation) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      maxWidth: 480,
      backgroundColor: '#0a0f1c',
      borderLeft: '1px solid rgba(0, 242, 254, 0.25)',
      boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(20px)'
    }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(14, 20, 32, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(0, 242, 254, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00f2fe',
            border: '1px solid rgba(0, 242, 254, 0.3)'
          }}>
            <FileText style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="brand-badge" style={{ fontSize: 10 }}>{citation.category}</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Page {citation.page_number}</span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginTop: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {citation.doc_title}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
        >
          <X style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Verification Status */}
        <div style={{
          padding: 16,
          borderRadius: 12,
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 style={{ width: 22, height: 22, color: '#10b981' }} />
            <div>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: '#ffffff' }}>Factual Grounding Match</p>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>Verified by Critic Agent</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              {Math.round(citation.confidence * 100)}%
            </span>
            <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>Sim: {citation.score}</span>
          </div>
        </div>

        {/* Exact Grounding Excerpt */}
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Bookmark style={{ width: 14, height: 14, color: '#00f2fe' }} /> Exact Grounding Excerpt
          </span>
          <div style={{
            padding: 16,
            borderRadius: 12,
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.28)',
            color: '#e0f2fe',
            fontSize: 12.5,
            lineHeight: 1.6,
            fontFamily: 'var(--font-mono)'
          }}>
            "{citation.excerpt || citation.content.slice(0, 200)}"
          </div>
        </div>

        {/* Complete Chunk Context */}
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', display: 'block', marginBottom: 8 }}>
            Complete Retrieved Chunk Context
          </span>
          <div style={{
            padding: 16,
            borderRadius: 12,
            background: 'rgba(14, 20, 32, 0.8)',
            border: '1px solid var(--border-subtle)',
            color: '#cbd5e1',
            fontSize: 12.5,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap'
          }}>
            {citation.content}
          </div>
        </div>

        {/* Chunk Metadata */}
        <div style={{
          padding: 14,
          borderRadius: 12,
          background: 'rgba(10, 15, 26, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: '#94a3b8',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          <div><strong style={{ color: '#ffffff' }}>Chunk ID:</strong> {citation.chunk_id}</div>
          <div><strong style={{ color: '#ffffff' }}>Document ID:</strong> {citation.doc_id}</div>
          <div><strong style={{ color: '#ffffff' }}>Vector Dimension:</strong> 768 (text-embedding-004)</div>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(14, 20, 32, 0.6)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={() => {
            onViewDocument(citation.doc_id);
            onClose();
          }}
          className="btn-secondary"
        >
          <ExternalLink style={{ width: 14, height: 14 }} />
          <span>View In Document Hub</span>
        </button>
      </div>

    </div>
  );
};
