import React, { useState, useRef } from 'react';
import { Upload, FileText, Search, Plus, CheckCircle, Calendar, User, Eye, X, Shield, RefreshCw } from 'lucide-react';
import { EnterpriseDocument } from '../types';
import { api } from '../api';

interface DocumentHubViewProps {
  documents: EnterpriseDocument[];
  onDocumentUploaded: () => void;
  selectedDocId?: string | null;
}

export const DocumentHubView: React.FC<DocumentHubViewProps> = ({
  documents,
  onDocumentUploaded,
  selectedDocId
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectDoc, setInspectDoc] = useState<EnterpriseDocument | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Engineering & Architecture');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-inspect if selectedDocId is provided
  React.useEffect(() => {
    if (selectedDocId) {
      const match = documents.find(d => d.id === selectedDocId);
      if (match) setInspectDoc(match);
    }
  }, [selectedDocId, documents]);

  const categories = [
    'ALL',
    'Engineering & Architecture',
    'Executive Strategy',
    'Compliance & Security',
    'Customer Success & Operations',
    'Operations & SRE'
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCat = activeCategory === 'ALL' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      await api.uploadDocument(file, uploadCategory);
      onDocumentUploaded();
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please ensure file is a valid PDF or text document.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
      {/* Top Banner & Upload bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel-glow border border-slate-800 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Vertex AI Vector Store
            </span>
            <span className="text-xs text-slate-400">Zero-Trust Enterprise Index</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">Multi-Source Knowledge Ingestion</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Ingest PDFs, Word docs, and meeting notes into real-time semantic vector partitions with cryptographic citation guarantees.
          </p>
        </div>

        {/* Upload Trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
          >
            <option value="Engineering & Architecture">Engineering & Architecture</option>
            <option value="Executive Strategy">Executive Strategy</option>
            <option value="Compliance & Security">Compliance & Security</option>
            <option value="Customer Success & Operations">Customer Success</option>
          </select>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md,.json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Chunking & Indexing...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Document (PDF/MD)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indexed corpus..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="group p-5 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {doc.category}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {doc.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-2">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {doc.summary}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate max-w-[180px]">
                <User className="w-3 h-3 text-slate-400" /> {doc.author}
              </span>

              <button
                onClick={() => setInspectDoc(doc)}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Inspector Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl max-h-[85vh] glass-panel-glow bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
              <div className="space-y-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {inspectDoc.category}
                </span>
                <h3 className="text-lg font-bold text-white font-['Outfit']">{inspectDoc.title}</h3>
                <p className="text-xs text-slate-400">By {inspectDoc.author} • Ingested on {inspectDoc.date}</p>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40">
              {inspectDoc.content}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
              <span>Security: SOC-2 CMEK Encrypted</span>
              <button
                onClick={() => setInspectDoc(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
