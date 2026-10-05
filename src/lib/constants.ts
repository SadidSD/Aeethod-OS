import {
  BarChart3, Boxes, Brain, Calculator, Code2, Cog, Crosshair, Database, Gauge, Handshake, HeartHandshake,
  KanbanSquare, Megaphone, Network, Palette, Rocket, Scale, Store, Target, TrendingUp, Truck, Users, Wallet, Folder,
  type LucideIcon,
} from 'lucide-react';
import type { DevType, Priority, Task } from '../types';

export interface StatusDef {
  id: string;
  label: string;
  color: string;
}

export const BUSINESS_STATUSES: StatusDef[] = [
  { id: 'todo', label: 'To Do', color: '#64748b' },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { id: 'review', label: 'Review', color: '#a855f7' },
  { id: 'blocked', label: 'Blocked', color: '#ef4444' },
  { id: 'done', label: 'Done', color: '#22c55e' },
];

export const DEV_STATUSES: StatusDef[] = [
  { id: 'backlog', label: 'Backlog', color: '#64748b' },
  { id: 'ready', label: 'Ready', color: '#0ea5e9' },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { id: 'in_review', label: 'In Review', color: '#a855f7' },
  { id: 'qa', label: 'QA / Staging', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#22c55e' },
];

export const statusesFor = (topicId: string) => (topicId === 'dev' ? DEV_STATUSES : BUSINESS_STATUSES);
export const statusDef = (topicId: string, id: string): StatusDef =>
  statusesFor(topicId).find((s) => s.id === id) ?? { id, label: id, color: '#64748b' };
export const isDone = (t: Pick<Task, 'status'>) => t.status === 'done';
export const defaultStatus = (topicId: string) => (topicId === 'dev' ? 'backlog' : 'todo');

export const PRIORITIES: { id: Priority; label: string; color: string; rank: number }[] = [
  { id: 'urgent', label: 'Urgent', color: '#ef4444', rank: 0 },
  { id: 'high', label: 'High', color: '#f97316', rank: 1 },
  { id: 'normal', label: 'Normal', color: '#3b82f6', rank: 2 },
  { id: 'low', label: 'Low', color: '#94a3b8', rank: 3 },
];
export const priorityDef = (id: Priority) => PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[2];

export const DEV_TYPES: { id: DevType; label: string; color: string }[] = [
  { id: 'feature', label: 'Feature', color: '#3b82f6' },
  { id: 'bug', label: 'Bug', color: '#ef4444' },
  { id: 'chore', label: 'Chore', color: '#94a3b8' },
  { id: 'spike', label: 'Spike', color: '#a855f7' },
  { id: 'debt', label: 'Tech Debt', color: '#f59e0b' },
];
export const devTypeDef = (id?: DevType) => DEV_TYPES.find((d) => d.id === id);

export const POINTS = [1, 2, 3, 5, 8, 13];

export const OPTION_COLORS = [
  '#64748b', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

const ICONS: Record<string, LucideIcon> = {
  Target, Megaphone, Handshake, Palette, Crosshair, Wallet, Calculator, TrendingUp, Truck, Store, Database,
  BarChart3, Cog, HeartHandshake, Scale, Users, KanbanSquare, Network, Rocket, Brain, Boxes, Gauge, Code2,
};
export const iconFor = (name: string): LucideIcon => ICONS[name] ?? Folder;
export const ICON_NAMES = Object.keys(ICONS);

/** Category display order in the sidebar. */
export const CATEGORY_ORDER = [
  'Strategy', 'Growth', 'Money', 'Money / Analytics', 'Foundation', 'Operations', 'Systems',
  'Differentiation', 'Product', 'Retention', 'People', 'Execution', 'Self',
];

export const TOPIC_EMOJIS: Record<string, string> = {
  strategy: '🎯',
  marketing: '📣',
  sales: '🤝',
  branding: '🎨',
  'b2b-positioning': '🏹',
  finance: '💰',
  accounting: '🧮',
  economics: '📈',
  scm: '🚚',
  retail: '🏪',
  mis: '🗄️',
  bi: '📊',
  operations: '⚙️',
  'customer-success': '❤️',
  legal: '⚖️',
  hrm: '👥',
  pm: '📋',
  integration: '🔗',
  fundraising: '🚀',
  founder: '🧠',
  product: '📦',
  'saas-metrics': '📐',
  dev: '🛠️',
};

export const emojiForTopic = (topicId: string): string => {
  return TOPIC_EMOJIS[topicId] || '📄';
};

export const NOTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  gray: { bg: '#2a2a2a', text: '#9b9b9b', border: '#383838' },
  brown: { bg: '#382e2b', text: '#cfa496', border: '#4e3f3a' },
  orange: { bg: '#3d2c1e', text: '#e58a2d', border: '#553b26' },
  yellow: { bg: '#3b351d', text: '#d6a540', border: '#524924' },
  green: { bg: '#22382b', text: '#5eb384', border: '#2d4d3a' },
  blue: { bg: '#1e3342', text: '#4ea0d0', border: '#29485e' },
  purple: { bg: '#312744', text: '#ab82cf', border: '#453660' },
  pink: { bg: '#3a2234', text: '#d6659f', border: '#522d48' },
  red: { bg: '#3f2222', text: '#e06560', border: '#5a2e2e' },
};

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';

export function colorForName(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return OPTION_COLORS[(h % (OPTION_COLORS.length - 1)) + 1];
}
