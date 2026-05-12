import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center px-2 gap-1.5">
      <Icon className="h-6 w-6 text-primary" strokeWidth={2.25} />
      <p className="text-2xl font-bold text-white leading-none">{value}</p>
      <p className="text-[10px] font-medium tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
