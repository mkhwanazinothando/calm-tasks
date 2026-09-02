import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export const categoryStyles: Record<string, string> = {
  Work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  Personal: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
  Shopping: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  Health: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100",
  Study: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100",
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        categoryStyles[category] ??
          "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground",
        className
      )}
    >
      {category}
    </span>
  );
}
