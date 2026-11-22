"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlyPoint } from "@/types/dashboard";
import { formatCurrency, formatNumber } from "@/lib/format";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--card-foreground)",
  fontSize: 12,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
};

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function MonthlyBarChart({
  data,
  color = "#6e13f9",
  currency = false,
  height = 270,
}: {
  data: MonthlyPoint[];
  color?: string;
  currency?: boolean;
  height?: number;
}) {
  const chartData = data.map((point) => ({
    ...point,
    label: point.label,
  }));

  return (
    <div style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          barCategoryGap="32%"
        >
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="var(--border)"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            width={54}
            tickFormatter={(value: number) =>
              currency
                ? compactCurrency.format(value)
                : formatNumber(value)
            }
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            contentStyle={tooltipStyle}
            formatter={(value) => [
              currency
                ? formatCurrency(Number(value))
                : formatNumber(Number(value)),
              currency ? "Earnings" : "Bookings",
            ]}
          />
          <Bar
            dataKey="value"
            fill={color}
            radius={[7, 7, 2, 2]}
            maxBarSize={46}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RoleDonut({
  customers,
  owners,
  admins,
}: {
  customers: number;
  owners: number;
  admins: number;
}) {
  const data = [
    { name: "Customers", value: customers, fill: "#38bdf8" },
    { name: "Owners", value: owners, fill: "#22c55e" },
    { name: "Admins", value: admins, fill: "#6e13f9" },
  ];

  const total = customers + owners + admins;

  return (
    <div className="flex min-w-0 flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-[150px] w-[150px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={
                total > 0
                  ? data
                  : [{ name: "No users", value: 1, fill: "var(--muted)" }]
              }
              dataKey="value"
              innerRadius={48}
              outerRadius={68}
              paddingAngle={3}
              strokeWidth={0}
            >
              {(total > 0
                ? data
                : [
                    {
                      name: "No users",
                      value: 1,
                      fill: "var(--muted)",
                    },
                  ]
              ).map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            {total > 0 && (
              <Tooltip contentStyle={tooltipStyle} />
            )}
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground">
            {formatNumber(total)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Users
          </span>
        </div>
      </div>

      <div className="w-full min-w-0 space-y-2.5">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: item.fill }}
              />
              {item.name}
            </span>
            <span className="font-semibold text-foreground">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
