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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col animate-slideLeft">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {citation.category}
              </span>
              <span className="text-xs text-slate-400">Page {citation.page_number}</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">{citation.doc_title}</h3>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Verification Status Metric */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white">Factual Grounding Match</p>
              <p className="text-[11px] text-slate-400">Verified by Critic Agent</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-emerald-400 font-mono">
              {Math.round(citation.confidence * 100)}%
            </span>
            <span className="block text-[10px] text-slate-500">Vector Sim: {citation.score}</span>
          </div>
        </div>

        {/* Primary Grounded Excerpt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" /> Exact Grounding Excerpt
            </span>
          </div>
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-100 text-xs leading-relaxed font-mono">
            "{citation.excerpt || citation.content.slice(0, 200)}"
          </div>
        </div>

        {/* Full Chunk Context */}
        <div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Complete Retrieved Chunk Context
          </span>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
            {citation.content}
          </div>
        </div>

        {/* Chunk Metadata */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 font-mono">
          <div><strong className="text-slate-300">Chunk ID:</strong> {citation.chunk_id}</div>
          <div><strong className="text-slate-300">Document ID:</strong> {citation.doc_id}</div>
          <div><strong className="text-slate-300">Vector Dimension:</strong> 768 (text-embedding-004)</div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex justify-end">
        <button
          onClick={() => {
            onViewDocument(citation.doc_id);
            onClose();
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View In Document Hub</span>
        </button>
      </div>

    </div>
  );
};
