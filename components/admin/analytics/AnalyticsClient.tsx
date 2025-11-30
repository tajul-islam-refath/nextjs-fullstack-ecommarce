"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsData } from "@/lib/actions/dashboard.actions";
import { SalesChart } from "./SalesChart";
import { TopProducts } from "./TopProducts";
import { Loader2 } from "lucide-react";

interface AnalyticsData {
  salesData: {
    date: string;
    sales: number;
    orders: number;
  }[];
  topProducts: {
    id: string;
    name: string;
    quantity: number;
  }[];
  period: {
    start: Date;
    end: Date;
  };
}

interface AnalyticsClientProps {
  initialData: AnalyticsData;
}

export default function AnalyticsClient({ initialData }: AnalyticsClientProps) {
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [period, setPeriod] = useState<string>("7d");
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    startTransition(async () => {
      const result = await getAnalyticsData(value as any);
      if (result.success && result.data) {
        setData(result.data);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Time Period:</span>
          <Select
            value={period}
            onValueChange={handlePeriodChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isPending && (
        <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Sales Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart data={data.salesData} />
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <TopProducts products={data.topProducts} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Revenue (Period)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳
              {data.salesData
                .reduce((acc, curr) => acc + curr.sales, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Orders (Period)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.salesData.reduce((acc, curr) => acc + curr.orders, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳
              {Math.round(
                data.salesData.reduce((acc, curr) => acc + curr.sales, 0) /
                  (data.salesData.reduce((acc, curr) => acc + curr.orders, 0) ||
                    1)
              ).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
