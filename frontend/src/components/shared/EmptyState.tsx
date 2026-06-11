import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="idam-empty-state">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#174832] shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-bold text-[#12231b]">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#607368]">
          {description}
        </p>
      )}
    </div>
  );
}
