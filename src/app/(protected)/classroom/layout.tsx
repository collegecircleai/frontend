"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Upload,
  BarChart2,
  Zap,
  Shield,
  LogOut,
  Menu,
  X,
  User,
  Mic,
  CreditCard,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DarkAurora from "@/components/effects/DarkAurora";
import ElegantParticles from "@/components/effects/ElegantParticles";
import ComponentErrorBoundary from "@/components/effects/ErrorBoundary";
import ThemeSwitcher from "@/components/effects/ThemeSwitcher";
import ConfirmModal from "@/components/effects/ConfirmModal";
import NetworkStatusDot from "@/components/effects/NetworkStatusDot";
import BottomNav from "@/components/layout/BottomNav";
import SwipeWrapper from "@/components/layout/SwipeWrapper";

/* ── CC>AI Logo ── */
function CCAILogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <svg
        viewBox="0 0 80 80"
        width={36}
        height={36}
        fill="none"
        aria-hidden="true"
      >
        <circle cx="32" cy="40" r="28" fill="var(--violet, #4D3FFF)" />
        <circle cx="52" cy="32" r="20" fill="var(--deep, #0B0B12)" />
        <circle cx="52" cy="32" r="14" fill="var(--deep, #0B0B12)" />
        <circle
          cx="52"
          cy="32"
          r="9"
          fill="var(--jade, #00C896)"
          opacity="0.9"
        />
        <circle cx="32" cy="40" r="10" fill="var(--deep, #0B0B12)" />
        <circle cx="52" cy="32" r="4" fill="var(--deep, #0B0B12)" />
      </svg>
      {!collapsed && (
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "18px",
              color: "var(--logo-accent)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            CC &gt;AI
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "var(--mist)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: "3px",
            }}
          >
            Gurukul Digital
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Nav Items Config ── */
const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/course", label: "My Courses", icon: BookOpen },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/assignment-solver", label: "Assg Solver", icon: Zap },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/classroom", label: "Live Classroom", icon: Mic },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

/* -- Mobile Bottom Nav Items (no Upload/Pricing) -- */
const MOBILE_NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/course", label: "Courses", icon: BookOpen },
  { href: "/assignment-solver", label: "Solver", icon: Zap },
  { href: "/classroom", label: "Live", icon: Mic },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

/* ── Single Nav Link ── */
function NavLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={() => {
        if (onClick) onClick();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? "0" : "14px",
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "14px" : "13px 20px",
        borderRadius: "10px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: active ? 600 : 500,
        fontFamily: "var(--font-body)",
        color: active ? "#4D3FFF" : "var(--mist)",
        background: active ? "rgba(77,63,255,0.08)" : "transparent",
        borderLeft: active ? "3px solid #4D3FFF" : "3px solid transparent",
        transition: "all 0.2s ease",
        position: "relative",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLElement;
          el.style.color = "var(--ink)";
          el.style.background = "rgba(9,9,15,0.04)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLElement;
          el.style.color = "var(--mist)";
          el.style.background = "transparent";
        }
      }}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        size={18}
        strokeWidth={active ? 2.2 : 1.8}
        style={{ flexShrink: 0 }}
      />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

/* ── Sidebar Component ── */
function Sidebar({
  collapsed,
  onClose,
  isMobile = false,
}: {
  collapsed: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const sidebarWidth = isMobile ? 280 : collapsed ? 68 : 240;

  return (
    <aside
      id="dashboard-sidebar"
      style={{
        width: sidebarWidth,
        background: "var(--pearl)",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px",
        zIndex: 200,
        borderRight: "1px solid var(--border-light)",
        boxShadow: isMobile ? "0 0 40px rgba(0,0,0,0.3)" : "none",
        transition:
          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s ease",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* Logo & Mobile Close */}
      <div
        style={{
          padding: isMobile
            ? "0 8px 28px"
            : collapsed
              ? "4px 0 28px"
              : "4px 8px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CCAILogo collapsed={isMobile ? false : collapsed} />
        {isMobile && onClose && (
          <button
            onClick={onClose}
            style={{
              background: "rgba(77,63,255,0.08)",
              border: "none",
              borderRadius: "10px",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--logo-accent)",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          flex: 1,
        }}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href))
            }
            collapsed={collapsed}
          />
        ))}

        {/* Admin — only if role === 'admin' */}
        {user?.role === "admin" && (
          <NavLink
            href="/admin"
            label="Admin"
            icon={Shield}
            active={pathname?.startsWith("/admin")}
            collapsed={collapsed}
          />
        )}
      </nav>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.08)",
          margin: "16px 0",
        }}
      />

      {/* User Footer */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* User Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: collapsed ? "10px" : "10px 12px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.04)",
            justifyContent: collapsed ? "center" : "flex-start",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4D3FFF, #00C896)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={16} color="white" />
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--ink)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name || "Scholar"}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--mist)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {user?.role || "student"}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </aside>
  );
}

/* ── Mobile Overlay ── */
function MobileOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 190,
        backdropFilter: "blur(2px)",
      }}
      aria-hidden="true"
    />
  );
}

/* ── Classroom Layout ── */
export default function ClassroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarWidth = isMobile ? 0 : collapsed ? 68 : 240;

  return (
    <div
      className="content-wrapper"
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--pearl)",
        position: "relative",
      }}
    >
      {/* Background Effects for Dark Mode */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ComponentErrorBoundary>
          <DarkAurora />
          <ElegantParticles count={40} />
        </ComponentErrorBoundary>
      </div>

      {/* Desktop: always-visible sidebar */}
      {!isMobile && <Sidebar collapsed={collapsed} />}
      {/* Mobile: bottom navigation */}
      {isMobile && <BottomNav />}

      {/* Main content */}
      <div
        style={{
          marginLeft: sidebarWidth,
          flex: 1,
          minWidth: 0,
          transition: "margin-left 0.25s ease",
          background: "transparent",
        }}
      >
        {/* Top strip: fixed to be constant */}
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            left: sidebarWidth,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            padding: isMobile ? "10px 16px" : "14px 32px",
            background: "rgba(var(--header-bg), 0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border-light)",
            gap: "16px",
            transition: "left 0.25s ease",
            height: isMobile ? "56px" : "64px",
          }}
        >
          {/* Sidebar Toggle (Left) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: isMobile ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: "10px",
              border: "1px solid var(--border-light)",
              background: "rgba(77,63,255,0.05)",
              cursor: "pointer",
              color: "var(--logo-accent)",
              transition: "all 0.2s ease",
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            <Menu size={20} />
          </button>

          {/* Mobile Top Left Logo */}
          {isMobile && (
            <div
              style={{
                zIndex: 10,
                paddingLeft: "4px",
                display: "flex",
                alignItems: "center",
                position: "absolute",
                left: "16px",
              }}
            >
              <div
                style={{
                  transform: "scale(0.8)",
                  transformOrigin: "left center",
                }}
              >
                <CCAILogo collapsed={true} />
              </div>
            </div>
          )}

          {/* Centered Dynamic Page Identity (Pro Feel) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--logo-accent)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              <span>CC</span>
              <span style={{ marginLeft: "3px" }}>&gt;AI</span>
            </div>
            <NetworkStatusDot />
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--ink)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Live Classroom
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Right Side Tools */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              zIndex: 10,
            }}
          >
            <ThemeSwitcher />
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: isMobile ? "56px" : "64px" }} />

        {/* Page content */}
        <SwipeWrapper>
          <div style={{ padding: "0px" }}>{children}</div>
        </SwipeWrapper>
      </div>
    </div>
  );
}
