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
    { id: 'TODO', label: 'To Do', color: 'border-slate-700 bg-slate-900/40 text-slate-300' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400' },
    { id: 'REVIEW', label: 'Under Review', color: 'border-purple-500/40 bg-purple-950/20 text-purple-400' },
    { id: 'DONE', label: 'Completed', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400' },
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
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel-glow border border-slate-800 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Autonomous Action Board
            </span>
            <span className="text-xs text-slate-400">Enterprise Workflow Automation</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">Multi-Department Task Kanban</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Tasks extracted autonomously by the Workflow Agent from meeting minutes, executive directives, and architecture specifications.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportIcs}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Export Calendar (.ICS)</span>
          </button>

          <button
            onClick={handleExportJira}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
          >
            <FileJson className="w-4 h-4 text-purple-400" />
            <span>Export Jira JSON</span>
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Action</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colActions = actions.filter((a) => a.status === col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl glass-panel border border-slate-800/90 bg-slate-950/60 p-4 min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    col.id === 'DONE' ? 'bg-emerald-400' :
                    col.id === 'REVIEW' ? 'bg-purple-400' :
                    col.id === 'IN_PROGRESS' ? 'bg-cyan-400' : 'bg-slate-500'
                  }`} />
                  <h3 className="text-sm font-bold text-white font-['Outfit']">{col.label}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono font-bold text-slate-300">
                  {colActions.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colActions.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl glass-panel-glow bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group"
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        act.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        act.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {act.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {act.due_date}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-xs font-bold text-white leading-snug">
                      {act.title}
                    </p>

                    {/* Assignee & Dept */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[140px] font-medium text-slate-300">{act.assignee}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{act.department}</span>
                    </div>

                    {/* Move Actions / Delete Controls */}
                    <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteAction(act.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1">
                        {col.id !== 'TODO' && (
                          <button
                            onClick={() => {
                              const prevIdx = columns.findIndex(c => c.id === col.id) - 1;
                              if (prevIdx >= 0) handleMoveAction(act, columns[prevIdx].id as any);
                            }}
                            title="Move left"
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {col.id !== 'DONE' && (
                          <button
                            onClick={() => {
                              const nextIdx = columns.findIndex(c => c.id === col.id) + 1;
                              if (nextIdx < columns.length) handleMoveAction(act, columns[nextIdx].id as any);
                            }}
                            title="Move right"
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}

                {colActions.length === 0 && (
                  <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-600 text-xs">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md glass-panel-glow bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
              <h3 className="text-base font-bold text-white font-['Outfit']">Create New Action Item</h3>
              <button onClick={() => setShowNewModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Verify KMS encryption key rotation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignee</label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  placeholder="e.g. Dr. Elena Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="e.g. Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jira Payload Modal */}
      {showJiraModal && jiraPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl glass-panel-glow bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">Jira Bulk Issue Payload</h3>
                <p className="text-xs text-slate-400">Atlassian REST API Compliant Structure</p>
              </div>
              <button onClick={() => setShowJiraModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto font-mono text-xs text-cyan-200 bg-slate-950/60">
              <pre>{JSON.stringify(jiraPayload, null, 2)}</pre>
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(jiraPayload, null, 2));
                  alert('Copied Jira payload to clipboard!');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition"
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
