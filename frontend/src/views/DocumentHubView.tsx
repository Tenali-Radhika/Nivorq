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
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Top Banner */}
      <div className="glass-panel-glow" style={{
        padding: '24px 30px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        background: 'linear-gradient(135deg, rgba(14,20,34,0.95) 0%, rgba(8,47,73,0.3) 100%)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="brand-badge">Vertex AI Vector Store</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Zero-Trust Enterprise Index</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>Multi-Source Knowledge Ingestion</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, maxWidth: 640 }}>
            Ingest PDFs, Word docs, and technical whitepapers into real-time semantic vector partitions with cryptographic citation guarantees.
          </p>
        </div>

        {/* Upload Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background: '#0d1322',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: 12,
              outline: 'none'
            }}
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
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary"
          >
            {uploading ? (
              <>
                <RefreshCw style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
                <span>Chunking & Indexing...</span>
              </>
            ) : (
              <>
                <Upload style={{ width: 14, height: 14 }} />
                <span>Upload Document (PDF/MD)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Categories & Search */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="tab-btn"
              style={{
                background: activeCategory === cat ? 'linear-gradient(135deg, #00f2fe 0%, #0284c7 100%)' : 'rgba(16, 24, 40, 0.8)',
                color: activeCategory === cat ? '#06080e' : '#94a3b8',
                fontWeight: activeCategory === cat ? 800 : 500,
                border: activeCategory === cat ? 'none' : '1px solid var(--border-subtle)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search style={{ width: 15, height: 15, color: '#64748b', position: 'absolute', left: 12, top: 11 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indexed corpus..."
            style={{
              width: '100%',
              padding: '8px 14px 8px 36px',
              borderRadius: 10,
              background: '#0d1322',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: 12,
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="doc-grid">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="doc-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="brand-badge" style={{ fontSize: 10 }}>{doc.category}</span>
                <span style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar style={{ width: 12, height: 12 }} /> {doc.date}
                </span>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', lineHeight: 1.4 }}>
                {doc.title}
              </h3>

              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>
                {doc.summary}
              </p>
            </div>

            <div style={{
              marginTop: 18,
              paddingTop: 12,
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <User style={{ width: 13, height: 13, color: '#94a3b8' }} /> {doc.author}
              </span>

              <button
                onClick={() => setInspectDoc(doc)}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: 11.5 }}
              >
                <Eye style={{ width: 13, height: 13 }} />
                <span>Inspect</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Modal */}
      {inspectDoc && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 740, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span className="brand-badge" style={{ fontSize: 10 }}>{inspectDoc.category}</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>{inspectDoc.title}</h3>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>By {inspectDoc.author} • Ingested on {inspectDoc.date}</p>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: 24,
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.7,
              color: '#cbd5e1',
              whiteSpace: 'pre-wrap',
              background: '#070b14'
            }}>
              {inspectDoc.content}
            </div>

            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: '#64748b'
            }}>
              <span>Security: SOC-2 CMEK Encrypted</span>
              <button onClick={() => setInspectDoc(null)} className="btn-secondary" style={{ padding: '6px 14px' }}>
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
