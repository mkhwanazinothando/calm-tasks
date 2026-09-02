import { CheckCircle2, Circle, Clock } from "lucide-react";
import { type Task, type TaskStatus, STATUS_LABELS } from "@/types/task";
import { cn } from "@/lib/utils";

interface ProgressStatsProps {
  tasks: Task[];
}

type StatusCounts = {
  completed: number;
  inProgress: number;
  notStarted: number;
};

const statusConfig: Record<
  TaskStatus,
  { icon: typeof CheckCircle2; label: string; key: keyof StatusCounts; color: string }
> = {
  completed: { icon: CheckCircle2, label: STATUS_LABELS.completed, key: "completed", color: "text-status-completed" },
  "in-progress": { icon: Clock, label: STATUS_LABELS["in-progress"], key: "inProgress", color: "text-status-in-progress" },
  "not-started": { icon: Circle, label: STATUS_LABELS["not-started"], key: "notStarted", color: "text-status-not-started" },
};

export function ProgressStats({ tasks }: ProgressStatsProps) {
  const counts: StatusCounts = {
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    notStarted: tasks.filter((t) => t.status === "not-started").length,
  };

  const total = tasks.length;
  const completed = counts.completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 task-card-shadow">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-primary transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-foreground">
                {percentage}%
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {completed} of {total} completed
            </h2>
            <p className="text-sm text-muted-foreground">
              {total === 0
                ? "Add your first task to get started."
                : percentage === 100
                  ? "All caught up — great work!"
                  : "Keep going, you're making progress."}
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 gap-3 sm:w-auto">
          {( ["not-started", "in-progress", "completed"] as TaskStatus[] ).map((status) => {
            const { icon: Icon, label, key } = statusConfig[status];
            return (
              <div
                key={status}
                className="flex flex-col items-center rounded-xl bg-muted p-3 text-center"
              >
                <Icon
                  className={cn(
                    "mb-1.5 h-5 w-5",
                    status === "completed"
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                <span className="text-xl font-semibold text-foreground">
                  {counts[key]}
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
