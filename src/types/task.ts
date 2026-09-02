export type TaskStatus = "not-started" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  status: TaskStatus;
  createdAt: number;
}

export const DEFAULT_CATEGORIES = [
  "Work",
  "Personal",
  "Shopping",
  "Health",
  "Study",
  "Other",
] as const;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
};
