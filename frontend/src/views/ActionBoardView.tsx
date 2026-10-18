import React, { useState } from 'react';
import { Calendar, Download, Plus, ArrowRight, ArrowLeft, Trash2, CheckCircle2, Clock, AlertCircle, Sparkles, X, FileJson } from 'lucide-react';
import { ActionItem } from '../types';
import { api } from '../api';

interface ActionBoardViewProps {
  actions: ActionItem[];
  onActionUpdated: () => void;
}

export const ActionBoardView: React.FC<ActionBoardViewProps> = ({ actions, onActionUpdated }) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [jiraPayload, setJiraPayload] = useState<any>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newPriority, setNewPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newDueDate, setNewDueDate] = useState('2026-10-30');
  const [newDept, setNewDept] = useState('Engineering');

  const columns = [
    { id: 'TODO', label: 'To Do', color: '#94a3b8' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: '#00f2fe' },
    { id: 'REVIEW', label: 'Under Review', color: '#a855f7' },
    { id: 'DONE', label: 'Completed', color: '#10b981' },
  ];

  const handleMoveAction = async (action: ActionItem, newStatus: ActionItem['status']) => {
    try {
      await api.updateAction(action.id, { ...action, status: newStatus });
      onActionUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    try {
      await api.deleteAction(actionId);
      onActionUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.createAction({
        title: newTitle.trim(),
        assignee: newAssignee.trim() || 'Unassigned',
        priority: newPriority,
        due_date: newDueDate,
        department: newDept,
        status: 'TODO'
      });
      setShowNewModal(false);
      setNewTitle('');
      setNewAssignee('');
      onActionUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportIcs = async () => {
    try {
      const blob = await api.exportIcs();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nivorq-enterprise-actions.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportJira = async () => {
    try {
      const data = await api.exportJira();
      setJiraPayload(data);
      setShowJiraModal(true);
    } catch (err) {
      console.error(err);
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
        background: 'linear-gradient(135deg, rgba(14,20,34,0.95) 0%, rgba(49,46,129,0.3) 100%)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="brand-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
              Autonomous Action Board
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Enterprise Workflow Automation</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>Multi-Department Task Kanban</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, maxWidth: 640 }}>
            Tasks extracted autonomously by the Workflow Agent from meeting minutes, executive directives, and architecture specifications.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleExportIcs} className="btn-secondary">
            <Calendar style={{ width: 14, height: 14, color: '#00f2fe' }} />
            <span>Export Calendar (.ICS)</span>
          </button>

          <button onClick={handleExportJira} className="btn-secondary">
            <FileJson style={{ width: 14, height: 14, color: '#c084fc' }} />
            <span>Export Jira JSON</span>
          </button>

          <button onClick={() => setShowNewModal(true)} className="btn-primary">
            <Plus style={{ width: 14, height: 14 }} />
            <span>New Action</span>
          </button>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="kanban-grid">
        {columns.map((col) => {
          const colActions = actions.filter((a) => a.status === col.id);
          return (
            <div key={col.id} className="kanban-column">
              
              {/* Column Header */}
              <div className="kanban-column-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: col.color }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{col.label}</h3>
                </div>
                <span className="tab-badge" style={{ padding: '2px 8px' }}>{colActions.length}</span>
              </div>

              {/* Cards list */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {colActions.map((act) => (
                  <div key={act.id} className="kanban-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="brand-badge" style={{
                        fontSize: 9,
                        background: act.priority === 'CRITICAL' ? 'rgba(244, 63, 94, 0.15)' : act.priority === 'HIGH' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 242, 254, 0.15)',
                        color: act.priority === 'CRITICAL' ? '#f43f5e' : act.priority === 'HIGH' ? '#f59e0b' : '#00f2fe',
                        borderColor: act.priority === 'CRITICAL' ? 'rgba(244, 63, 94, 0.3)' : act.priority === 'HIGH' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(0, 242, 254, 0.3)'
                      }}>
                        {act.priority}
                      </span>
                      <span style={{ fontSize: 10.5, color: '#94a3b8', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock style={{ width: 11, height: 11 }} /> {act.due_date}
                      </span>
                    </div>

                    <p style={{ fontSize: 12.5, fontWeight: 700, color: '#ffffff', lineHeight: 1.4 }}>
                      {act.title}
                    </p>

                    <div style={{
                      paddingTop: 8,
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      color: '#94a3b8'
                    }}>
                      <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: '#e2e8f0' }}>
                        {act.assignee}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#64748b' }}>
                        {act.department}
                      </span>
                    </div>

                    {/* Move / Delete Controls */}
                    <div style={{
                      paddingTop: 8,
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <button
                        onClick={() => handleDeleteAction(act.id)}
                        style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
                        title="Delete task"
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>

                      <div style={{ display: 'flex', gap: 6 }}>
                        {col.id !== 'TODO' && (
                          <button
                            onClick={() => {
                              const prevIdx = columns.findIndex(c => c.id === col.id) - 1;
                              if (prevIdx >= 0) handleMoveAction(act, columns[prevIdx].id as any);
                            }}
                            className="btn-secondary"
                            style={{ padding: '4px 8px' }}
                            title="Move left"
                          >
                            <ArrowLeft style={{ width: 12, height: 12 }} />
                          </button>
                        )}
                        {col.id !== 'DONE' && (
                          <button
                            onClick={() => {
                              const nextIdx = columns.findIndex(c => c.id === col.id) + 1;
                              if (nextIdx < columns.length) handleMoveAction(act, columns[nextIdx].id as any);
                            }}
                            className="btn-secondary"
                            style={{ padding: '4px 8px', color: '#00f2fe' }}
                            title="Move right"
                          >
                            <ArrowRight style={{ width: 12, height: 12 }} />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}

                {colActions.length === 0 && (
                  <div style={{
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 12,
                    color: '#64748b',
                    fontSize: 12
                  }}>
                    No tasks
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showNewModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 460 }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>Create New Action Item</h3>
              <button onClick={() => setShowNewModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Verify KMS encryption key rotation"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0d1322', border: '1px solid var(--border-subtle)', color: '#ffffff', fontSize: 12.5, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
                  Assignee
                </label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  placeholder="e.g. Dr. Elena Vance"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0d1322', border: '1px solid var(--border-subtle)', color: '#ffffff', fontSize: 12.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: '#0d1322', border: '1px solid var(--border-subtle)', color: '#ffffff', fontSize: 12, outline: 'none' }}
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 10, background: '#0d1322', border: '1px solid var(--border-subtle)', color: '#ffffff', fontSize: 12, outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="e.g. Engineering"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0d1322', border: '1px solid var(--border-subtle)', color: '#ffffff', fontSize: 12.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowNewModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jira Modal */}
      {showJiraModal && jiraPayload && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 640 }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>Atlassian Jira REST API Payload</h3>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>Bulk issue creation schema for Jira Cloud / Data Center</p>
              </div>
              <button onClick={() => setShowJiraModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <div style={{ padding: 20, maxHeight: 360, overflowY: 'auto', background: '#070b14', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#00f2fe' }}>
              <pre>{JSON.stringify(jiraPayload, null, 2)}</pre>
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(jiraPayload, null, 2));
                  alert('Copied Jira payload to clipboard!');
                }}
                className="btn-primary"
              >
                Copy JSON Payload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
