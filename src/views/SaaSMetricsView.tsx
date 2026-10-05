import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ShieldCheck,
  Zap,
  Plus,
  Edit2,
  Trash2,
  Sliders,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useDb, useStore } from '../store';
import { fmtMoney } from '../lib/metrics';
import { MetricRow } from '../types';

export const SaaSMetricsView: React.FC = () => {
  const db = useDb();
  const { create, update, remove } = useStore();

  // Simulation Sliders State
  const [simNewPerMonth, setSimNewPerMonth] = useState(8);
  const [simArpu, setSimArpu] = useState(195);
  const [simChurnPercent, setSimChurnPercent] = useState(0.5);

  // Add / Edit Row Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MetricRow | null>(null);
  const [monthStr, setMonthStr] = useState('');
  const [kind, setKind] = useState<'plan' | 'actual'>('actual');
  const [mrr, setMrr] = useState<number>(0);
  const [customers, setCustomers] = useState<number>(0);
  const [newCust, setNewCust] = useState<number>(0);
  const [churnedCust, setChurnedCust] = useState<number>(0);
  const [smSpend, setSmSpend] = useState<number>(0);
  const [cogs, setCogs] = useState<number>(0);
  const [opex, setOpex] = useState<number>(4000);
  const [notes, setNotes] = useState('');

  // 12-Month Simulation Calculation
  const simulationData = React.useMemo(() => {
    const data = [];
    let currentCustomers = 0;
    for (let m = 1; m <= 12; m++) {
      const churned = Math.round(currentCustomers * (simChurnPercent / 100));
      currentCustomers = currentCustomers + simNewPerMonth - churned;
      const monthlyMrr = currentCustomers * simArpu;
      const monthlyArr = monthlyMrr * 12;
      const grossMargin = monthlyMrr * 0.88;
      data.push({
        month: `M${m}`,
        customers: currentCustomers,
        mrr: monthlyMrr,
        arr: monthlyArr,
        grossMargin,
      });
    }
    return data;
  }, [simNewPerMonth, simArpu, simChurnPercent]);

  const simMonth12 = simulationData[11] || { customers: 0, mrr: 0, arr: 0, grossMargin: 0 };

  const openAddModal = () => {
    setEditingRow(null);
    const nextMonth = new Date().toISOString().slice(0, 7);
    setMonthStr(nextMonth);
    setKind('actual');
    setMrr(1950);
    setCustomers(10);
    setNewCust(3);
    setChurnedCust(0);
    setSmSpend(1800);
    setCogs(234);
    setOpex(4000);
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (row: MetricRow) => {
    setEditingRow(row);
    setMonthStr(row.month);
    setKind(row.kind);
    setMrr(row.mrr || 0);
    setCustomers(row.customers || 0);
    setNewCust(row.newCustomers || 0);
    setChurnedCust(row.churnedCustomers || 0);
    setSmSpend(row.salesMarketingSpend || 0);
    setCogs(row.cogs || 0);
    setOpex(row.opex || 0);
    setNotes(row.notes || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthStr) return;

    if (editingRow) {
      update('metrics', editingRow.id, {
        month: monthStr,
        kind,
        mrr: Number(mrr),
        customers: Number(customers),
        newCustomers: Number(newCust),
        churnedCustomers: Number(churnedCust),
        salesMarketingSpend: Number(smSpend),
        cogs: Number(cogs),
        opex: Number(opex),
        notes: notes.trim(),
      });
    } else {
      create('metrics', {
        month: monthStr,
        kind,
        mrr: Number(mrr),
        customers: Number(customers),
        newCustomers: Number(newCust),
        churnedCustomers: Number(churnedCust),
        salesMarketingSpend: Number(smSpend),
        cogs: Number(cogs),
        opex: Number(opex),
        notes: notes.trim(),
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, mName: string) => {
    if (window.confirm(`Delete metric row for ${mName}?`)) {
      remove('metrics', id);
    }
  };

  // Sort metrics chronologically
  const sortedMetrics = [...db.metrics].sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-in">
      {/* Header */}
      <div className="card p-6 border-emerald-500/30 bg-gradient-to-r from-ink-900 via-emerald-950/20 to-ink-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider font-mono">
              B2B SaaS Economics
            </span>
            <span className="text-xs text-slate-400">• Unit Economics & Financial Operating Plan</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            SaaS Metrics, Unit Economics & Runway Modeler
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Monitor real and projected recurring revenue, payback velocity, gross margins, and
            customer acquisition economics tailored for the TCG merchant vertical.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2 text-xs py-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Record Month Actual / Plan</span>
        </button>
      </div>

      {/* Core Unit Economics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 border border-ink-800 bg-ink-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Blended ARPU</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">$194.60<span className="text-xs font-normal text-slate-400">/mo</span></div>
          <div className="text-[11px] text-slate-400">~$2,335 Annual Contract Value</div>
        </div>

        <div className="card p-4 border border-ink-800 bg-ink-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Gross Margin</span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono">88%</div>
          <div className="text-[11px] text-slate-400">Pure software, low hosting footprint</div>
        </div>

        <div className="card p-4 border border-ink-800 bg-ink-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>CAC & Payback</span>
            <Target className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">3.5 mo</div>
          <div className="text-[11px] text-slate-400">CAC ~$600 via direct founder outbound</div>
        </div>

        <div className="card p-4 border border-ink-800 bg-ink-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>LTV : CAC Ratio</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">&gt; 65:1</div>
          <div className="text-[11px] text-slate-400">LTV &gt;$41,000 at &lt;5% annual churn</div>
        </div>
      </div>

      {/* Interactive Growth Simulator */}
      <div className="card p-6 border-indigo-500/30 bg-ink-900/90 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-ink-800 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Interactive 12-Month ARR Ramp Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Adjust onboarding velocity and ARPU to simulate Year 1 ARR targets.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-ink-950 px-4 py-2 rounded-xl border border-ink-800">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Month 12 MRR</div>
              <div className="text-lg font-black text-emerald-400 font-mono">{fmtMoney(simMonth12.mrr)}</div>
            </div>
            <div className="h-6 w-px bg-ink-800" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Month 12 Run-Rate (ARR)</div>
              <div className="text-lg font-black text-indigo-300 font-mono">{fmtMoney(simMonth12.arr)}</div>
            </div>
            <div className="h-6 w-px bg-ink-800" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Active Stores</div>
              <div className="text-lg font-black text-white font-mono">{simMonth12.customers}</div>
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">New Stores / Month:</span>
              <span className="font-mono font-bold text-indigo-400">{simNewPerMonth} stores</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={simNewPerMonth}
              onChange={(e) => setSimNewPerMonth(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2 stores</span>
              <span>15 stores</span>
              <span>30 stores</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Blended Monthly ARPU:</span>
              <span className="font-mono font-bold text-emerald-400">${simArpu} / mo</span>
            </div>
            <input
              type="range"
              min="79"
              max="499"
              step="10"
              value={simArpu}
              onChange={(e) => setSimArpu(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$79 (Show)</span>
              <span>$195 (Blended)</span>
              <span>$499 (Enterprise)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Monthly Churn Rate:</span>
              <span className="font-mono font-bold text-rose-400">{simChurnPercent}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.5"
              step="0.1"
              value={simChurnPercent}
              onChange={(e) => setSimChurnPercent(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.1% (Best)</span>
              <span>0.5% (Target)</span>
              <span>2.5% (High)</span>
            </div>
          </div>
        </div>

        {/* Simulator Chart */}
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simulationData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorGm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="month" stroke="#737373" fontSize={11} />
              <YAxis
                stroke="#737373"
                fontSize={11}
                tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  borderColor: '#404040',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: number) => [fmtMoney(val), '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="mrr"
                name="Monthly Recurring Revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMrr)"
              />
              <Area
                type="monotone"
                dataKey="grossMargin"
                name="88% Gross Profit"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGm)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan vs Actuals Table */}
      <div className="card p-6 border border-ink-800 bg-ink-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Financial Ledger & Operating Plan</span>
            </h3>
            <p className="text-xs text-slate-400">
              Monthly breakdown of active stores, MRR, S&M burn, and OPEX.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {sortedMetrics.length} months tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-ink-950/50">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Stores</th>
                <th className="py-2.5 px-3">New</th>
                <th className="py-2.5 px-3">Churn</th>
                <th className="py-2.5 px-3">MRR</th>
                <th className="py-2.5 px-3">ARR Run-Rate</th>
                <th className="py-2.5 px-3">S&M Spend</th>
                <th className="py-2.5 px-3">OPEX</th>
                <th className="py-2.5 px-3">Notes</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800/60 font-mono">
              {sortedMetrics.map((row) => (
                <tr key={row.id} className="hover:bg-ink-800/40 transition">
                  <td className="py-2.5 px-3 font-bold text-white">{row.month}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold border ${
                        row.kind === 'actual'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      }`}
                    >
                      {row.kind}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">{row.customers ?? '—'}</td>
                  <td className="py-2.5 px-3 text-emerald-400">+{row.newCustomers ?? 0}</td>
                  <td className="py-2.5 px-3 text-rose-400">-{row.churnedCustomers ?? 0}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-300">
                    {row.mrr !== null ? fmtMoney(row.mrr) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {row.mrr !== null ? fmtMoney(row.mrr * 12) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {row.salesMarketingSpend !== null ? fmtMoney(row.salesMarketingSpend) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {row.opex !== null ? fmtMoney(row.opex) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans text-[11px] truncate max-w-xs">
                    {row.notes || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(row)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-ink-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id, row.month)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-ink-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metric Row Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6 space-y-4 shadow-2xl border-emerald-500/30">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{editingRow ? 'Edit Metric Row' : 'Record Metric Row'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Month (YYYY-MM)
                  </label>
                  <input
                    type="month"
                    required
                    value={monthStr}
                    onChange={(e) => setMonthStr(e.target.value)}
                    className="input-field text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Type
                  </label>
                  <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value as 'plan' | 'actual')}
                    className="input-field text-xs"
                  >
                    <option value="actual">Actual (Historical)</option>
                    <option value="plan">Plan (Projection)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    MRR ($)
                  </label>
                  <input
                    type="number"
                    value={mrr}
                    onChange={(e) => setMrr(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Total Stores
                  </label>
                  <input
                    type="number"
                    value={customers}
                    onChange={(e) => setCustomers(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    New Stores Added
                  </label>
                  <input
                    type="number"
                    value={newCust}
                    onChange={(e) => setNewCust(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Stores Churned
                  </label>
                  <input
                    type="number"
                    value={churnedCust}
                    onChange={(e) => setChurnedCust(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    S&M Spend ($)
                  </label>
                  <input
                    type="number"
                    value={smSpend}
                    onChange={(e) => setSmSpend(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    COGS ($)
                  </label>
                  <input
                    type="number"
                    value={cogs}
                    onChange={(e) => setCogs(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    OPEX ($)
                  </label>
                  <input
                    type="number"
                    value={opex}
                    onChange={(e) => setOpex(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Launched BinderPOS migration campaign..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-ink-800 transition"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-1.5 px-4">
                  {editingRow ? 'Save Changes' : 'Record Row'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
