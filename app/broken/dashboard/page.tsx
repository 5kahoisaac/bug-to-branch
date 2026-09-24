"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

const STATS = [
  { label: "Reports this week", current: 42, previous: 30 },
  { label: "Open issues", current: 17, previous: undefined },
  { label: "Merged PRs", current: 9, previous: 12 },
];

const ROWS = [
  { id: 101, title: "Checkout button does nothing", reporter: "alice@example.com", status: "open", updated: "2026-09-20" },
  { id: 102, title: "Subtotal shows weird number", reporter: "bob@example.com", status: "triaged", updated: "2026-09-21" },
  { id: 103, title: "Dark mode toggle missing", reporter: "carol@example.com", status: "closed", updated: "2026-09-22" },
];

function percentChange(current: number, previous?: number) {
  return Math.round(((current - (previous as number)) / (previous as number)) * 100);
}

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <Button variant="outline" onClick={() => setIsRefreshing(true)} disabled={isRefreshing}>
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      <div className="mt-8 flex items-center gap-4 rounded-xl border bg-card/50 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/team-avatar.png" alt="Team avatar" className="size-12 rounded-full" />
        <div>
          <p className="font-medium">Sandbox team</p>
          <p className="text-sm text-zinc-800">Last synced 3 minutes ago · 4 members online</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card/50 p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.current}</p>
            <p className="mt-1 text-sm text-emerald-400">+{percentChange(stat.current, stat.previous)}%</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 -mt-6 ml-8 rounded-xl border bg-card p-5">
        <p className="font-medium">Heads up</p>
        <p className="mt-1 text-sm text-muted-foreground">Weekly digest goes out on Friday.</p>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Recent reports</h2>
      <table className="mt-4 w-[1400px] text-left text-sm">
        <thead className="text-muted-foreground">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Title</th>
            <th className="p-3">Reporter</th>
            <th className="p-3">Status</th>
            <th className="p-3">Last updated</th>
          </tr>
        </thead>
        <tbody className="divide-y border-t">
          {ROWS.map((row) => (
            <tr key={row.id}>
              <td className="p-3 font-mono">#{row.id}</td>
              <td className="p-3">{row.title}</td>
              <td className="p-3">{row.reporter}</td>
              <td className="p-3">{row.status}</td>
              <td className="p-3">{row.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
