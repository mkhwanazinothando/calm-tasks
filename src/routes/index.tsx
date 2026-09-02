import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ListTodo } from "lucide-react";
import { toast } from "sonner";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProgressStats } from "@/components/progress-stats";
import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";
import { categoryStyles } from "@/components/category-badge";
import { cn } from "@/lib/utils";
import { type Task, type TaskStatus, DEFAULT_CATEGORIES } from "@/types/task";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "TaskFlow — Calm Task Management" },
      {
        name: "description",
        content:
          "Organize your day with TaskFlow. Add tasks, set statuses, group by category, and track progress in a calming blue interface.",
      },
      { property: "og:title", content: "TaskFlow — Calm Task Management" },
      {
        property: "og:description",
        content:
          "Organize your day with TaskFlow. Add tasks, set statuses, group by category, and track progress in a calming blue interface.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const STORAGE_KEY = "taskflow-tasks";

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const initialTasks: Task[] = [
  {
    id: generateId(),
    title: "Review project requirements",
    description: "Go through the brief and highlight key deliverables.",
    category: "Work",
    status: "in-progress",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: generateId(),
    title: "Buy groceries for the week",
    description: "Vegetables, milk, eggs, and whole-grain bread.",
    category: "Shopping",
    status: "not-started",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: generateId(),
    title: "Morning yoga session",
    description: "20 minutes of stretching and breathing exercises.",
    category: "Health",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
];

function Index() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, initialTasks);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  const categories = useMemo(() => {
    const dynamic = new Set(tasks.map((t) => t.category));
    return DEFAULT_CATEGORIES.filter((c) => dynamic.has(c));
  }, [tasks]);

  const addTask = ({
    title,
    description,
    category,
    status,
  }: {
    title: string;
    description: string;
    category: string;
    status: TaskStatus;
  }) => {
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      category,
      status,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    toast.success("Task added");
  };

  const updateStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.info("Task deleted");
  };

  return (
    <main className="min-h-screen bg-background soft-gradient">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <ListTodo className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                TaskFlow
              </h1>
              <p className="text-sm text-muted-foreground">
                Stay calm, stay organized.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex flex-col gap-6">
          <ProgressStats tasks={tasks} />
          <TaskForm onAddTask={addTask} />

          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Categories:</span>
              {categories.map((category) => (
                <span
                  key={category}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 font-medium",
                    categoryStyles[category] ??
                      "bg-secondary text-secondary-foreground"
                  )}
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          <TaskList
            tasks={tasks}
            filter={filter}
            onFilterChange={setFilter}
            onStatusChange={updateStatus}
            onDelete={deleteTask}
          />
        </div>
      </div>
    </main>
  );
}
