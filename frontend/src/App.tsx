import React, { useState, useEffect } from 'react';
import { MessageSquare, FolderGit2, Video, CheckSquare, BarChart3 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SettingsModal } from './components/SettingsModal';
import { CitationDrawer } from './components/CitationDrawer';
import { CopilotView } from './views/CopilotView';
import { DocumentHubView } from './views/DocumentHubView';
import { MeetingStudioView } from './views/MeetingStudioView';
import { ActionBoardView } from './views/ActionBoardView';
import { AnalyticsView } from './views/AnalyticsView';

import { SystemHealth, EnterpriseDocument, ActionItem, ChatMessage, Citation } from './types';
import { api } from './api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'copilot' | 'documents' | 'meeting' | 'actions' | 'analytics'>('copilot');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [documents, setDocuments] = useState<EnterpriseDocument[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [resetting, setResetting] = useState(false);
  
  // Modals & Drawers
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      const [healthData, docsData, actionsData] = await Promise.all([
        api.getHealth(),
        api.getDocuments(),
        api.getActions(),
      ]);
      setHealth(healthData);
      setDocuments(docsData.documents);
      setActions(actionsData.actions);

      // Preload initial welcome assistant message with rich reasoning trace
      if (messages.length === 0) {
        setMessages([
          {
            id: 'msg-welcome',
            role: 'assistant',
            content: `### Welcome to Nivorq Enterprise Autonomous Copilot 👋\n\nI am your unified agentic workspace assistant for the **AI Builder Cup 2026**. I continuously ingest corporate knowledge assets, transcribe and extract decisions from executive meetings, eliminate manual document searching, and orchestrate autonomous cross-departmental workflows on **Google Cloud Run**.\n\n**Where would you like to begin?**\n- Inquire about the **Project Titan Architecture** or Cloud Run autoscaling SLAs.\n- Analyze the **Q3 Board Decisions & Singapore Grand Finale** roadmap.\n- Verify our **SOC-2 Type II CMEK Encryption** and data residency policies.\n- Or switch to the **Meeting Intelligence Studio** to parse raw meeting transcripts into actionable decisions!`,
            timestamp: new Date().toISOString(),
            model_used: healthData.active_model,
            grounding_score: 99.4,
            latency_ms: 320,
            thought_trace: [
              {
                step: 1,
                agent: "Supervisor Orchestrator",
                action: "Workspace Context Initialization",
                details: "Verified 5 enterprise corpora partitions and loaded active session profile.",
                duration_ms: 45,
                status: "completed"
              },
              {
                step: 2,
                agent: "Verification Critic Agent",
                action: "Zero-Trust Security Verification",
                details: "SOC-2 Type II audit logging initialized. CMEK encryption verified.",
                duration_ms: 38,
                status: "completed"
              }
            ],
            citations: [
              {
                chunk_id: "doc-titan-arch-01-p1-c0",
                doc_id: "doc-titan-arch-01",
                doc_title: "Project Titan: Agentic Microservices Architecture Specification",
                category: "Engineering & Architecture",
                page_number: 1,
                confidence: 0.99,
                score: 0.942,
                content: "Sub-800ms end-to-end P95 retrieval latency across 500,000+ vector indexed enterprise chunks. Native multi-agent collaboration leveraging Google's Agent Development Kit (ADK) and Vertex AI Agent Engine.",
                excerpt: "Sub-800ms end-to-end P95 retrieval latency across 500,000+ vector indexed enterprise chunks."
              },
              {
                chunk_id: "doc-board-minutes-02-p1-c0",
                doc_id: "doc-board-minutes-02",
                doc_title: "Executive Leadership & Board Q3 Strategy Meeting Minutes",
                category: "Executive Strategy",
                page_number: 1,
                confidence: 0.98,
                score: 0.915,
                content: "Reallocate $2.4M from legacy enterprise search maintenance into the Nivorq Autonomous Agent Program on Google Cloud Run.",
                excerpt: "Reallocate $2.4M from legacy enterprise search maintenance into the Nivorq Autonomous Agent Program on Google Cloud Run."
              }
            ],
            suggested_actions: [
              {
                id: "act-init-01",
                title: "Complete Cloud Run production containerization & achieve <1s latency",
                assignee: "Dr. Elena Vance (Chief AI Architect)",
                priority: "CRITICAL",
                due_date: "2026-10-25",
                department: "Engineering",
                status: "IN_PROGRESS"
              },
              {
                id: "act-init-04",
                title: "Coordinate Singapore AI Builder Cup Grand Finale logistics and demo deck",
                assignee: "Marcus Sterling (Chief of Staff)",
                priority: "HIGH",
                due_date: "2026-11-15",
                department: "Operations",
                status: "TODO"
              }
            ]
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSendMessage = async (query: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoadingChat(true);

    try {
      const response = await api.sendChat(query, health?.active_model);
      const assistantMsg: ChatMessage = {
        id: `msg-res-${Date.now()}`,
        role: 'assistant',
        content: response.response_text,
        timestamp: response.timestamp,
        model_used: response.model_used,
        citations: response.citations,
        thought_trace: response.thought_trace,
        suggested_actions: response.suggested_actions,
        grounding_score: response.grounding_score,
        latency_ms: response.latency_ms,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `### ⚠️ Connection Notice\n\nUnable to reach the backend service. Please verify that the server is active.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleResetSamples = async () => {
    setResetting(true);
    try {
      await api.resetDocuments();
      await loadInitialData();
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const handleAddActionToBoard = async (action: ActionItem) => {
    try {
      await api.createAction({
        title: action.title,
        assignee: action.assignee,
        priority: action.priority,
        due_date: action.due_date,
        department: action.department,
        status: 'TODO',
      });
      const actionsData = await api.getActions();
      setActions(actionsData.actions);
      setActiveTab('actions');
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'copilot', label: 'Agent Copilot & Knowledge RAG', icon: MessageSquare },
    { id: 'documents', label: 'Enterprise Document Hub', icon: FolderGit2, badge: documents.length },
    { id: 'meeting', label: 'Meeting Intelligence Studio', icon: Video },
    { id: 'actions', label: 'Autonomous Action Board', icon: CheckSquare, badge: actions.length },
    { id: 'analytics', label: 'BigQuery Telemetry & ROI', icon: BarChart3 },
  ];

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        health={health}
        onOpenSettings={() => setSettingsOpen(true)}
        onResetSamples={handleResetSamples}
        resetting={resetting}
      />

      {/* Tab Navigation */}
      <nav className="tab-navbar">
        <div className="tab-nav-wrapper">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon style={{ width: 15, height: 15 }} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="tab-badge">{tab.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main View Area */}
      <main style={{ flex: 1, paddingBottom: 40 }}>
        {activeTab === 'copilot' && (
          <CopilotView
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loadingChat}
            onSelectCitation={(citation) => setActiveCitation(citation)}
            onAddActionToBoard={handleAddActionToBoard}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentHubView
            documents={documents}
            onDocumentUploaded={loadInitialData}
            selectedDocId={selectedDocId}
          />
        )}

        {activeTab === 'meeting' && (
          <MeetingStudioView
            onAddActionToBoard={handleAddActionToBoard}
          />
        )}

        {activeTab === 'actions' && (
          <ActionBoardView
            actions={actions}
            onActionUpdated={async () => {
              const res = await api.getActions();
              setActions(res.actions);
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView />
        )}
      </main>

      {/* Modals & Drawers */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentModel={health?.active_model || 'gemini-2.5-flash'}
        onConfigSaved={loadInitialData}
      />

      <CitationDrawer
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
        onViewDocument={(docId) => {
          setSelectedDocId(docId);
          setActiveTab('documents');
        }}
      />
    </div>
  );
};
