import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Users,
  Database,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Plus,
  ShieldAlert,
  HardDrive,
  Building2,
  Sun,
  Moon,
} from 'lucide-react';
import { useDb, useStore } from '../store';
import { colorForName, initials } from '../lib/constants';

export const SettingsView: React.FC = () => {
  const db = useDb();
  const { updateSettings, replaceDb, resetDb, theme, toggleTheme } = useStore();

  const [companyName, setCompanyName] = useState(db.settings?.company || 'Aeethod');
  const [newMember, setNewMember] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ company: companyName.trim() });
    alert('Company name updated!');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.trim()) return;
    const current = db.settings?.team || [];
    if (current.includes(newMember.trim())) {
      alert('Team member already exists.');
      return;
    }
    updateSettings({ team: [...current, newMember.trim()] });
    setNewMember('');
  };

  const handleRemoveMember = (name: string) => {
    const current = db.settings?.team || [];
    if (current.length <= 1) {
      alert('At least one team member must remain.');
      return;
    }
    if (window.confirm(`Remove "${name}" from team?`)) {
      updateSettings({ team: current.filter((m) => m !== name) });
    }
  };

  const handleExportDb = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `aeethod-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleImportDb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (!parsed.tasks || !parsed.topics) {
          throw new Error('Invalid Aeethod database structure.');
        }
        await replaceDb(parsed);
        setImportStatus('Database successfully restored!');
        setTimeout(() => setImportStatus(null), 3000);
      } catch (err) {
        alert('Failed to import database: ' + (err instanceof Error ? err.message : String(err)));
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset Aeethod OS to the initial seed dataset? Any newly created custom data will be overwritten with the seed state.'
      )
    ) {
      setIsResetting(true);
      try {
        await resetDb();
        alert('Database successfully reset to seed data!');
      } catch (e) {
        alert('Reset failed: ' + String(e));
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-slide-in">
      {/* Header */}
      <div className="card p-6 border-ink-800 bg-ink-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider font-mono">
              System Administration
            </span>
            <span className="text-xs text-slate-400">• Local Storage & Configuration</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Settings & Data Management
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Manage your team roster, company profile, database exports, backups, and disk
            persistence.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-ink-950 px-3.5 py-1.5 rounded-lg border border-ink-800 font-mono text-xs text-slate-400">
          <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
          <span>db.json (Active)</span>
        </div>
      </div>

      {/* Appearance / Theme */}
      <div className="card p-6 border border-[#2e2e2e] bg-[#202020] space-y-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Appearance & Theme</span>
          </h3>
          <p className="text-xs text-[#9b9b9b]">
            Choose your preferred workspace aesthetic. Supports Notion Dark and crisp Notion White mode.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg pt-1">
          {/* Dark Mode Card */}
          <div
            onClick={() => toggleTheme('dark')}
            className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3.5 ${
              theme === 'dark'
                ? 'border-indigo-500 bg-[#262626] ring-2 ring-indigo-500/20'
                : 'border-[#2e2e2e] bg-[#1a1a1a] hover:border-[#3e3e3e]'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#2e2e2e] flex items-center justify-center text-indigo-400 shadow-sm">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Notion Dark</span>
                {theme === 'dark' && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-indigo-500/20 text-indigo-300">
                    Active
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#9b9b9b]">Dark canvas (#191919)</div>
            </div>
          </div>

          {/* Light Mode Card */}
          <div
            onClick={() => toggleTheme('light')}
            className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3.5 ${
              theme === 'light'
                ? 'border-amber-500 bg-[#ffffff] ring-2 ring-amber-500/20'
                : 'border-[#2e2e2e] bg-[#fbfbfa] hover:border-[#3e3e3e]'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#e3e2de] flex items-center justify-center text-amber-500 shadow-sm">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#37352f] flex items-center gap-2">
                <span>Notion White</span>
                {theme === 'light' && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-amber-500/20 text-amber-700">
                    Active
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#787774]">Clean white canvas (#ffffff)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Profile */}
      <div className="card p-6 border border-ink-800 bg-ink-900 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span>Company Profile</span>
        </h3>

        <form onSubmit={handleUpdateCompany} className="flex items-end gap-3 max-w-md">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Company Name
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="input-field text-xs"
            />
          </div>
          <button type="submit" className="btn-primary text-xs py-2 px-4 shrink-0">
            Save Name
          </button>
        </form>
      </div>

      {/* Team Roster */}
      <div className="card p-6 border border-ink-800 bg-ink-900 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Team Members & Assignees</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {db.settings?.team?.length || 0} active members
          </span>
        </div>

        <div className="divide-y divide-ink-800/80 max-w-xl">
          {(db.settings?.team || []).map((member) => (
            <div key={member} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: colorForName(member) }}
                >
                  {initials(member)}
                </div>
                <span className="text-xs font-semibold text-white">{member}</span>
              </div>

              <button
                onClick={() => handleRemoveMember(member)}
                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-ink-800 transition"
                title="Remove Member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddMember} className="flex items-end gap-3 max-w-md pt-2">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Add New Member
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Chen"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              className="input-field text-xs"
            />
          </div>
          <button type="submit" className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </form>
      </div>

      {/* Database & Persistence */}
      <div className="card p-6 border border-ink-800 bg-ink-900 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Local Database & Backup Ops</span>
        </h3>

        {/* Database Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-ink-950 border border-ink-800 font-mono text-xs">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Business Topics</div>
            <div className="text-white font-bold text-base mt-0.5">{db.topics.length}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Tasks & Stories</div>
            <div className="text-white font-bold text-base mt-0.5">{db.tasks.length}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Custom Fields</div>
            <div className="text-emerald-400 font-bold text-base mt-0.5">{db.fields.length} (Unlimited)</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Docs & PRDs</div>
            <div className="text-white font-bold text-base mt-0.5">{db.docs.length}</div>
          </div>
        </div>

        {/* Actions: Export / Import */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportDb}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-ink-800 hover:bg-ink-700 text-slate-200 hover:text-white border border-ink-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Database (JSON)</span>
          </button>

          <label className="px-4 py-2 rounded-lg text-xs font-semibold bg-ink-800 hover:bg-ink-700 text-slate-200 hover:text-white border border-ink-700 transition flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Import / Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportDb}
              className="hidden"
            />
          </label>

          {exportSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Backup downloaded!
            </span>
          )}

          {importStatus && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {importStatus}
            </span>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border border-rose-900/40 bg-gradient-to-br from-ink-900 via-rose-950/10 to-ink-900 space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <ShieldAlert className="w-4 h-4" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Danger Zone</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-rose-950/50">
          <div>
            <div className="text-xs font-bold text-white">Reset Database to Default Seed</div>
            <p className="text-[11px] text-slate-400 max-w-lg mt-0.5">
              Replaces the current state in <code className="text-slate-300">data/db.json</code> with
              the original 22 business topics, customer profiles, competitor data, and engineering
              sprints.
            </p>
          </div>

          <button
            onClick={handleReset}
            disabled={isResetting}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 transition flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset to Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
