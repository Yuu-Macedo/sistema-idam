import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  eyebrow = "Sistema IDAM",
  icon: Icon,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <section className="idam-card overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-[#edf1ed] bg-[#f8fbf8] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-3">
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dff2e6] text-[#174832]">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#607368]">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-xl font-bold leading-tight text-[#12231b] sm:text-2xl">
              {title}
            </h2>
            {description && (
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[#607368]">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      {children && <div className="px-5 py-4">{children}</div>}
    </section>
  );
}
