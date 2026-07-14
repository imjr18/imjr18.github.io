import type { Metric } from "@/lib/types";
import { MetricStat } from "./MetricStat";

export function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((m) => (
        <MetricStat key={m.label} metric={m} />
      ))}
    </div>
  );
}
