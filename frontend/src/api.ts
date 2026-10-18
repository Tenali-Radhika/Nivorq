import { SystemHealth, EnterpriseDocument, ActionItem, MeetingAnalysisResult, AnalyticsData } from './types';

const API_BASE = '/api';

export const api = {
  async getHealth(): Promise<SystemHealth> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  },

  async getDocuments(): Promise<{ count: number; documents: EnterpriseDocument[] }> {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async resetDocuments(): Promise<any> {
    const res = await fetch(`${API_BASE}/documents/reset-samples`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset documents');
    return res.json();
  },

  async uploadDocument(file: File, category: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  async sendChat(query: string, modelName?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, model_name: modelName }),
    });
    if (!res.ok) throw new Error('Failed to process chat query');
    return res.json();
  },

  async analyzeMeeting(transcript: string, title?: string): Promise<MeetingAnalysisResult> {
    const res = await fetch(`${API_BASE}/meeting/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, title }),
    });
    if (!res.ok) throw new Error('Failed to analyze meeting');
    return res.json();
  },

  async getActions(): Promise<{ actions: ActionItem[] }> {
    const res = await fetch(`${API_BASE}/actions`);
    if (!res.ok) throw new Error('Failed to fetch actions');
    return res.json();
  },

  async createAction(action: Omit<ActionItem, 'id'>): Promise<any> {
    const res = await fetch(`${API_BASE}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
    });
    if (!res.ok) throw new Error('Failed to create action');
    return res.json();
  },

  async updateAction(actionId: string, action: Partial<ActionItem>): Promise<any> {
    const res = await fetch(`${API_BASE}/actions/${actionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
    });
    if (!res.ok) throw new Error('Failed to update action');
    return res.json();
  },

  async deleteAction(actionId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/actions/${actionId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete action');
    return res.json();
  },

  async exportIcs(): Promise<Blob> {
    const res = await fetch(`${API_BASE}/actions/export/ics`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to export calendar');
    return res.blob();
  },

  async exportJira(): Promise<any> {
    const res = await fetch(`${API_BASE}/actions/export/jira`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to export Jira payload');
    return res.json();
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async updateConfig(apiKey?: string, model?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gemini_api_key: apiKey, gemini_model: model }),
    });
    if (!res.ok) throw new Error('Failed to update config');
    return res.json();
  }
};
