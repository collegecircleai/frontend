"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Users,
  Grid,
  Clock,
  Settings,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ADMIN_NAV = [
  { href: "/admin/intelligence", label: "Intelligence", icon: Activity },
  { href: "/admin", label: "Users", icon: Users },
  { href: "/admin/system", label: "System", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Basic client-side protection (can be enhanced with middleware)
  if (user && user.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#0B0A10",
      color: "#E2DCEF",
      fontFamily: "var(--font-body)"
    }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px",
        backgroundColor: "#13111C",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        display: "flex",
        flexDirection: "column",
        padding: "32px 0",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 24px", marginBottom: "48px" }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            fontWeight: 700,
            color: "#D4C9FF",
            letterSpacing: "0.02em"
          }}>
            CC<span style={{ fontSize: "16px", marginLeft: "4px" }}>&gt;AI</span>
          </div>
          <div style={{
            fontSize: "11px",
            color: "#8B849E",
            marginTop: "4px",
            letterSpacing: "0.05em"
          }}>
            Admin Intelligence
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", padding: "0 12px" }}>
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#FFFFFF" : "#8B849E",
                  backgroundColor: isActive ? "rgba(255, 255, 255, 0.05)" : "transparent",
                  transition: "all 0.2s ease"
                }}
              >
                <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div style={{ padding: "0 24px", marginTop: "auto" }}>
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.05)", marginBottom: "24px" }} />
          <button 
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "none",
              border: "none",
              color: "#8B849E",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              padding: 0,
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#FFFFFF"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#8B849E"}
          >
            <User size={16} />
            Admin Profile
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
