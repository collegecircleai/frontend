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
import api from "@/lib/api";
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
            CC{" "}&gt;AI
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
}: {
  href: string;
  label: string;
  icon: any;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? "0" : "12px",
        padding: collapsed ? "12px" : "12px 16px",
        borderRadius: "14px",
        textDecoration: "none",
        color: active ? "white" : "var(--mist)",
        background: active ? "var(--violet, #4D3FFF)" : "transparent",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        justifyContent: collapsed ? "center" : "flex-start",
        position: "relative",
        overflow: "hidden",
        boxShadow: active ? "0 8px 20px rgba(77, 63, 255, 0.25)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "var(--ink)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--mist)";
        }
      }}
    >
      <Icon
        size={20}
        strokeWidth={active ? 2.5 : 2}
        style={{ flexShrink: 0 }}
      />
      {!collapsed && (
        <span
          style={{
            fontSize: "14px",
            fontWeight: active ? 600 : 500,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
      {active && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "20%",
            bottom: "20%",
            width: "3px",
            background: "white",
            borderRadius: "0 4px 4px 0",
          }}
        />
      )}
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
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCredits = async () => {
      try {
        const res = await api.get("/payments/credits");
        const nextCredits = res.data?.data?.credits ?? res.data?.credits;
        if (mounted && typeof nextCredits === "number") {
          setCredits(nextCredits);
        }
      } catch {
        if (mounted) {
          setCredits(null);
        }
      }
    };

    if (user) {
      void loadCredits();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);



  const handleLogout = () => setIsLogoutModalOpen(true);
  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const sidebarWidth = isMobile ? 280 : collapsed ? 68 : 240;

  return (
    <aside
      style={{
        width: sidebarWidth,
        height: "100vh",
        background: "var(--pearl)",
        borderRight: "1px solid var(--border-light)",
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? "24px 16px" : "32px 14px",
        transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
        overflowY: "auto",
      }}
    >
      {/* Logo & Mobile Close */}
      <div
        style={{
          padding: isMobile ? "0 8px 28px" : collapsed ? "4px 0 28px" : "4px 8px 28px",
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
              cursor: "pointer"
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname === item.href}
            collapsed={collapsed}
          />
        ))}
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
              <div
                style={{
                  marginTop: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 8px",
                  borderRadius: 999,
                  background: "rgba(0, 200, 150, 0.12)",
                  color: "var(--jade)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Credits
                <span style={{ color: "var(--ink)", letterSpacing: 0 }}>
                  {credits ?? "--"}
                </span>
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
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}
      aria-hidden="true"
    />
  );
}


/* ── Settings Layout ── */
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--pearl)",
        color: "var(--ink)",
        position: "relative",
      }}
    >
      {!isMobile && <Sidebar collapsed={collapsed} />}
      {/* Mobile: bottom navigation */}
      {isMobile && <BottomNav />}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          position: "relative",
        }}
      >
        {/* Universal Header (Fixed) */}
        <header
          style={{
            height: "64px",
            background: "rgba(var(--pearl-rgb), 0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 50,
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => (isMobile ? setMobileOpen(true) : setCollapsed(!collapsed))}
            style={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              border: "1px solid var(--border-light)",
              display: isMobile ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
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
            <div style={{ zIndex: 10, paddingLeft: "4px", display: "flex", alignItems: "center", position: "absolute", left: "16px" }}>
              <div style={{ transform: "scale(0.8)", transformOrigin: "left center" }}><CCAILogo collapsed={true} /></div>
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
              <span>CC</span><span style={{ marginLeft: "3px" }}>&gt;AI</span>
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
              Settings
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <ThemeSwitcher />
        </header>

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            position: "relative",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
