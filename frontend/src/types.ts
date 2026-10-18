export interface Citation {
  chunk_id: string;
  doc_id: string;
  doc_title: string;
  category: string;
  page_number: number;
  confidence: number;
  score: number;
  content: string;
  excerpt: string;
}

export interface ThoughtStep {
  step: number;
  agent: string;
  action: string;
  details: string;
  duration_ms: number;
  status: string;
}

export interface ActionItem {
  id: string;
  title: string;
  assignee: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  due_date: string;
  department: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model_used?: string;
  citations?: Citation[];
  thought_trace?: ThoughtStep[];
  suggested_actions?: ActionItem[];
  grounding_score?: number;
  latency_ms?: number;
}

export interface EnterpriseDocument {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  summary: string;
  content: string;
}

export interface MeetingAnalysisResult {
  meeting_title: string;
  executive_summary: string;
  consensus_score: number;
  alignment_label: string;
  tension_points: string[];
  decisions_made: { id: string; decision: string; status: string; impact: string }[];
  decisions_deferred: { id: string; decision: string; reason: string; owner: string }[];
  action_items: ActionItem[];
  executive_briefing: string;
  latency_ms: number;
  timestamp: string;
}

export interface SystemHealth {
  status: string;
  version: string;
  environment: string;
  gemini_api_configured: boolean;
  active_model: string;
  indexed_documents: number;
  indexed_chunks: number;
  cloud_run_telemetry: {
    platform: string;
    region: string;
    project_id: string;
    bigquery_sync: string;
  };
}

export interface AnalyticsData {
  total_queries: number;
  total_hours_saved: number;
  avg_latency_ms: number;
  grounding_fidelity: number;
  cost_savings_usd: number;
  active_nodes: number;
  bigquery_sync_status: string;
  recent_logs: {
    id: string;
    timestamp: string;
    user: string;
    query: string;
    category: string;
    model: string;
    latency_ms: number;
    confidence: string;
    status: string;
  }[];
}
