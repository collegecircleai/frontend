"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Shield, 
  LogOut, 
  Settings as SettingsIcon,
  CreditCard,
  Smartphone,
  Edit2,
  Check,
  X as CloseIcon,
  Camera,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import ConfirmModal from "@/components/effects/ConfirmModal";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Profile Edit States
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "Scholar");
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [role, setRole] = useState(user?.role || "student");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("cc_ai_user_name");
    const savedRole = localStorage.getItem("cc_ai_user_role");
    const savedPic = localStorage.getItem("cc_ai_user_pic");

    if (savedName) setName(savedName);
    else if (user?.name) setName(user.name);

    if (savedRole) setRole(savedRole);
    else if (user?.role) setRole(user.role);

    if (savedPic) setProfilePic(savedPic);
    if (savedPic) setProfilePic(savedPic);
  }, [user]);

  useEffect(() => {
    let mounted = true;
    const loadCredits = async () => {
      try {
        const res = await api.get("/payments/credits");
        const nextCredits = res.data?.data?.credits ?? res.data?.credits;
        if (mounted && typeof nextCredits === "number") {
          setCredits(nextCredits);
        }
      } catch (err) {
        if (mounted) setCredits(null);
      }
    };
    if (user) {
      void loadCredits();
    }
    return () => { mounted = false; };
  }, [user]);

  const handleLogout = () => setIsLogoutModalOpen(true);
  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const handleSaveRole = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("cc_ai_user_role", role);
      setIsEditingRole(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePic = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfilePic(null);
    localStorage.removeItem("cc_ai_user_pic");
  };

  const handleSaveName = () => {
    localStorage.setItem("cc_ai_user_name", name);
    setIsEditingName(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePic(result);
        localStorage.setItem("cc_ai_user_pic", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ 
      maxWidth: "1000px", 
      margin: "0 auto", 
      padding: "40px 24px",
      fontFamily: "var(--font-body)"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: 700, 
          color: "var(--ink)", 
          letterSpacing: "-0.03em",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <SettingsIcon size={32} color="#4D3FFF" />
          Settings
        </h1>
        <p style={{ color: "var(--mist)", marginTop: "8px" }}>
          Manage your account preferences, security, and billing.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        {/* Profile Card */}
        <div style={{ 
          background: "var(--pearl)", 
          border: "1px solid var(--border-light)", 
          borderRadius: "24px", 
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div 
              onClick={() => document.getElementById("profile-upload")?.click()}
              style={{ 
                width: 80, 
                height: 80, 
                borderRadius: "24px", 
                background: profilePic ? `url(${profilePic}) center/cover no-repeat` : "linear-gradient(135deg, #4D3FFF, #00C896)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(77, 63, 255, 0.3)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector(".camera-overlay") as HTMLElement;
                if (overlay) overlay.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector(".camera-overlay") as HTMLElement;
                if (overlay) overlay.style.opacity = "0";
              }}
            >
              {!profilePic && <User size={36} color="white" />}
              
              <div 
                className="camera-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  color: "white",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  backdropFilter: "blur(2px)"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <Camera size={24} />
                  {profilePic && (
                    <button 
                      onClick={handleRemovePic}
                      style={{ 
                        background: "rgba(255,107,122,0.2)", 
                        border: "1px solid rgba(255,107,122,0.4)", 
                        borderRadius: "8px", 
                        padding: "4px 8px",
                        color: "#FF6B7A",
                        fontSize: "10px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,107,122,0.4)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,107,122,0.2)"}
                    >
                      <Trash2 size={12} />
                      REMOVE
                    </button>
                  )}
                </div>
              </div>
              <input 
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {isEditingName ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    style={{ 
                      background: "rgba(255,255,255,0.05)", 
                      border: "1px solid #4D3FFF", 
                      borderRadius: "6px", 
                      color: "var(--ink)", 
                      fontSize: "18px", 
                      fontWeight: 700,
                      padding: "2px 8px",
                      width: "100%",
                      outline: "none"
                    }}
                  />
                  <button 
                    onClick={handleSaveName}
                    style={{ background: "transparent", border: "none", color: "var(--jade)", cursor: "pointer", display: "flex" }}
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)" }}>
                    {name}
                  </h2>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    style={{ 
                      background: "transparent", 
                      border: "none", 
                      color: "#4D3FFF", 
                      cursor: "pointer",
                      opacity: 0.6,
                      display: "flex",
                      padding: "4px"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
              <p style={{ color: "var(--mist)", fontSize: "12px", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                {role}
              </p>
              
              <div
                style={{
                  marginTop: 10,
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
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--mist)" }}>
              <Mail size={18} />
              <span style={{ fontSize: "14px" }}>{user?.email || "No email provided"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--mist)" }}>
              <Shield size={18} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Role:</span>
                {isEditingRole ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                    <input 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      autoFocus
                      style={{ 
                        background: "rgba(255,255,255,0.05)", 
                        border: "1px solid #4D3FFF", 
                        borderRadius: "6px", 
                        color: "var(--ink)", 
                        fontSize: "13px", 
                        padding: "2px 8px",
                        width: "100%",
                        outline: "none"
                      }}
                    />
                    <button 
                      onClick={handleSaveRole}
                      disabled={isSaving}
                      style={{ background: "transparent", border: "none", color: "var(--jade)", cursor: "pointer", display: "flex" }}
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => { setIsEditingRole(false); setRole(user?.role || "student"); }}
                      style={{ background: "transparent", border: "none", color: "#FF6B7A", cursor: "pointer", display: "flex" }}
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{role}</span>
                    <button 
                      onClick={() => setIsEditingRole(true)}
                      style={{ 
                        background: "transparent", 
                        border: "none", 
                        color: "#4D3FFF", 
                        cursor: "pointer",
                        opacity: 0.6,
                        display: "flex",
                        padding: "4px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
                    >
                      <Edit2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>


      </div>


      {/* Billing & Pricing */}
      <Link href="/pricing" style={{ textDecoration: "none" }}>
        <div style={{ 
          background: "var(--pearl)", 
          border: "1px solid var(--border-light)", 
          borderRadius: "24px", 
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginTop: "24px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 15px 30px rgba(77,63,255,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>Billing &amp; Pricing</h3>
            <p style={{ color: "var(--mist)", fontSize: "14px", marginTop: "4px" }}>Manage your subscription, credits, and payment methods.</p>
          </div>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "16px",
            background: "rgba(77,63,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--violet)",
            flexShrink: 0,
          }}>
            <CreditCard size={22} />
          </div>
        </div>
      </Link>

      {/* Danger Zone */}
      <div style={{ marginTop: "48px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#FF6B7A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
          Danger Zone
        </h2>

        {/* Sign Out */}
        <div style={{ 
          background: "rgba(255, 107, 122, 0.05)", 
          border: "1px solid rgba(255, 107, 122, 0.2)", 
          borderRadius: "24px", 
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>Sign Out</h3>
            <p style={{ color: "var(--mist)", fontSize: "14px", marginTop: "4px" }}>Logout from your account on this device.</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              background: "#FF6B7A", 
              color: "white", 
              border: "none", 
              borderRadius: "16px", 
              padding: "12px 24px", 
              fontWeight: 700, 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 10px 20px rgba(255, 107, 122, 0.2)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(255, 107, 122, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(255, 107, 122, 0.2)";
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}

