export interface Todo {
  id: string;
  title: string;
  dueAt: string; // ISO datetime
  createdAt: string; // ISO datetime
  completedAt?: string; // ISO datetime
}
