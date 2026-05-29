"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import api, { getFriendlyErrorMessage } from "@/lib/api";
import {
  Users,
  BookOpen,
  Zap,
  Database,
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Cpu,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Design System Tokens
const COLORS = {
  bg: "#0D0D1A",
  card: "#14122A",
  accent: "#4D3FFF",
  text: "#FFFFFF",
  textMuted: "#94A3B8",
  jade: "#10B981",
  yellow: "#F59E0B",
  red: "#EF4444",
};

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [aiActivity, setAiActivity] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // RBAC Protection
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      redirect("/dashboard");
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      setErrorMessage(null);
      const [statsRes, usersRes, activityRes, healthRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get(`/admin/users?page=${page}&search=${search}`),
        api.get("/admin/ai-activity"),
        api.get("/admin/health"),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) {
        setUsers(usersRes.data.data.users);
        setTotalUsers(usersRes.data.data.total);
      }
      if (activityRes.data.success) setAiActivity(activityRes.data.data);
      if (healthRes.data.success) setHealth(healthRes.data.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setErrorMessage(
        getFriendlyErrorMessage(err, "Unable to load admin data right now."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user, page, search]);

  const handleBlockUser = async (id: string) => {
    try {
      const res = await api.post(`/admin/users/${id}/block`);
      if (res.data.success) {
        setUsers(
          users.map((u) =>
            u.user_id === id ? { ...u, is_active: res.data.data.is_active } : u,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to toggle block status", err);
      setErrorMessage(
        getFriendlyErrorMessage(err, "Unable to update user status."),
      );
    }
  };

  if (authLoading || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center text-white font-['DM_Sans']">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <ShieldAlert className="w-12 h-12 text-[#4D3FFF]" />
          <p className="text-lg font-medium">Authorizing Admin Access...</p>
        </div>
      </div>
    );
  }

  const creditUsagePercent = stats
    ? (stats.apiCreditsUsed / stats.apiCreditsLimit) * 100
    : 0;
  const creditBarColor =
    creditUsagePercent > 80
      ? COLORS.red
      : creditUsagePercent > 50
        ? COLORS.yellow
        : COLORS.jade;

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white font-['DM_Sans'] p-6 md:p-10">
      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {errorMessage}
        </div>
      )}
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-['Playfair_Display'] font-bold mb-2">
            Command Center
          </h1>
          <p className="text-slate-400">
            Welcome back, Admin. System operations are currently nominal.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#14122A] border border-white/10 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:border-[#4D3FFF] transition-colors"
            />
          </div>
          <button className="bg-[#4D3FFF] hover:bg-[#4D3FFF]/80 px-6 py-2 rounded-full transition-all font-medium">
            System Export
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-5 h-5" />}
          trend="+12% from last month"
        />
        <StatCard
          title="New Users Today"
          value={stats?.newUsersToday || 0}
          icon={<Zap className="w-5 h-5" />}
          trend="Real-time growth"
        />
        <StatCard
          title="Courses Uploaded"
          value={stats?.totalCourses || 0}
          icon={<BookOpen className="w-5 h-5" />}
          trend="8 pending review"
        />
        <StatCard
          title="AI Generations"
          value={stats?.aiGenerationsToday || 0}
          icon={<Activity className="w-5 h-5" />}
          trend="Last 24 hours"
        />
        <div className="bg-[#14122A] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              API Credit Usage
            </h3>
            <div
              className={`p-2 rounded-lg bg-white/5 ${creditUsagePercent > 80 ? "animate-pulse" : ""}`}
            >
              <Cpu className={`w-5 h-5`} style={{ color: creditBarColor }} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-4">
            {creditUsagePercent.toFixed(1)}%
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${creditUsagePercent}%` }}
              className="h-full rounded-full"
              style={{ backgroundColor: creditBarColor }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            {stats?.apiCreditsUsed} / {stats?.apiCreditsLimit} tokens used
          </p>
          {creditUsagePercent > 80 && (
            <div className="absolute top-0 right-0 p-1">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users Table */}
        <div className="lg:col-span-2 bg-[#14122A] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold">User Management</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                Page {page} of {Math.ceil(totalUsers / 20) || 1}
              </span>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1 hover:bg-white/5 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="p-1 hover:bg-white/5 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">College</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr
                    key={u.user_id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{u.name}</span>
                        <span className="text-xs text-slate-500">
                          {u.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {u.college || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge active={u.is_active} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleBlockUser(u.user_id)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                          u.is_active
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                            : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                        }`}
                      >
                        {u.is_active ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Activity & Health */}
        <div className="flex flex-col gap-8">
          {/* Recent AI Generations */}
          <div className="bg-[#14122A] rounded-2xl border border-white/5 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#4D3FFF]" />
              AI Activity Log
            </h2>
            <div className="space-y-4">
              {aiActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <div
                    className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${log.status === "success" ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{log.topic}</p>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                      <span>
                        {log.user} • {log.type}
                      </span>
                      <span>
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-[#14122A] rounded-2xl border border-white/5 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#4D3FFF]" />
              System Integrity
            </h2>
            <div className="space-y-4">
              <HealthRow
                label="Database Cluster"
                status={health?.database || "Checking..."}
                active={health?.database === "Connected"}
              />
              <HealthRow
                label="Gemini API Engine"
                status={health?.gemini || "Checking..."}
                active={health?.gemini === "Active"}
              />
              <HealthRow
                label="SMTP Node"
                status={health?.email || "Checking..."}
                active={health?.email === "Active"}
              />
            </div>
            <div className="mt-8 p-4 rounded-xl bg-[#4D3FFF]/5 border border-[#4D3FFF]/20">
              <div className="flex items-center gap-3 text-xs text-[#4D3FFF]">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="font-mono uppercase tracking-tighter">
                  System Pulse Monitoring Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <div className="bg-[#14122A] p-6 rounded-2xl border border-white/5 transition-transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </h3>
        <div className="p-2 rounded-lg bg-white/5 text-[#4D3FFF]">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <p className="text-xs text-slate-500">{trend}</p>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
        active
          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          : "bg-red-500/10 text-red-500 border border-red-500/20"
      }`}
    >
      <span
        className={`w-1 h-1 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`}
      />
      {active ? "Active" : "Blocked"}
    </div>
  );
}

function HealthRow({
  label,
  status,
  active,
}: {
  label: string;
  status: string;
  active: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium">{status}</span>
        {active ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
      </div>
    </div>
  );
}
