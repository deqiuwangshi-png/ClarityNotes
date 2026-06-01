import type { Stat } from "@/types/landing";
import { STATS } from "@/constants/landing";

interface StatsSectionProps {
  stats?: Stat[];
}

export function StatsSection({ stats = STATS }: StatsSectionProps) {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-label-caps text-on-surface-variant">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
