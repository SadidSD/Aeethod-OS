export type FieldType = 'text' | 'number' | 'currency' | 'percent' | 'select' | 'date' | 'url' | 'checkbox';

export interface SelectOption {
  id: string;
  label: string;
  color: string;
}

export interface Field {
  id: string;
  topicId: string;
  name: string;
  type: FieldType;
  order: number;
  options?: SelectOption[];
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'urgent' | 'high' | 'normal' | 'low';
export type DevType = 'feature' | 'bug' | 'chore' | 'spike' | 'debt';

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  topicId: string;
  title: string;
  description: string;
  status: string;
  priority: Priority;
  assignee: string;
  dueDate: string | null;
  tags: string[];
  parentId: string | null;
  fields: Record<string, unknown>;
  comments: Comment[];
  order: number;
  type?: DevType;
  points?: number | null;
  sprintId?: string | null;
  epicId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  num: number;
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doc {
  id: string;
  topicId: string;
  title: string;
  content: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MetricRow {
  id: string;
  month: string; // YYYY-MM
  kind: 'actual' | 'plan';
  mrr: number | null;
  customers: number | null;
  newCustomers: number | null;
  churnedCustomers: number | null;
  salesMarketingSpend: number | null;
  cogs: number | null;
  opex: number | null;
  cash: number | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Epic {
  id: string;
  name: string;
  color: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  team: string[];
  company?: string;
}

export interface Collections {
  topics: Topic;
  tasks: Task;
  docs: Doc;
  fields: Field;
  metrics: MetricRow;
  sprints: Sprint;
  epics: Epic;
}

export type Col = keyof Collections;

export type DB = { [K in Col]: Collections[K][] } & { settings: Settings; version?: number };
