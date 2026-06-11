import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
  tone?: "green" | "blue" | "amber" | "red";
}

const toneClasses = {
  green: "bg-[#dff2e6] text-[#174832]",
  blue: "bg-[#e3f2fd] text-[#2563a8]",
  amber: "bg-[#fff4cf] text-[#8a5a00]",
  red: "bg-[#fde7e7] text-[#b42318]",
};

export function MetricCard({
  title,
  value,
  description,
  icon,
  tone = "green",
}: MetricCardProps) {
  return (
    <article className="idam-kpi p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#607368]">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#12231b]">
            {value}
          </p>
        </div>
        {icon && (
          <div className={`rounded-xl p-2.5 ${toneClasses[tone]}`}>{icon}</div>
        )}
      </div>
      {description && (
        <p className="mt-3 text-sm leading-5 text-[#607368]">{description}</p>
      )}
    </article>
  );
}
