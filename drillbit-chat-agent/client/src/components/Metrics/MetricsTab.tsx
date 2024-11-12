import React, { useEffect, useState } from "react";
import { MetricCard } from "../ui/metric-card";
import { Beer, Coffee, Activity, DollarSign } from "lucide-react";
import { Metrics } from "../../types/Metrics";
import { getMetrics as getMetricsAPI } from "../../api/API";

const MetricsTab: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics>();

  useEffect(() => {
    getMetricsAPI(
      (metrics: Metrics) => {
        console.log(metrics)
        setMetrics(metrics)
      },
      (error: string) => console.error(error)
    );
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Drinks"
        value={metrics?.totalDrinks || '0'}
        className="bg-gradient-to-r from-pink-400 to-pink-600 shadow-lg"
        icon={<Beer className="h-8 w-8" />}
      />
      <MetricCard
        title="Sobering Drinks"
        value={metrics?.totalSoberingDrinks || '0'}
        className="bg-gradient-to-r from-green-400 to-green-600 shadow-lg"
        icon={<Coffee className="h-8 w-8" />}
      />
      <MetricCard
        title="Max Drunk Reached"
        value={metrics?.maxDrunkReached || '0'}
        className="bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg"
        icon={<Activity className="h-8 w-8" />}
      />
      <MetricCard
        title="Total Spent"
        value={`$${metrics?.totalRevenue}`}
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg"
        icon={<DollarSign className="h-8 w-8" />}
      />
    </div>
  );
};

export { MetricsTab };
