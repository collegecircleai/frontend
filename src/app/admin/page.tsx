"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Clock, 
  RefreshCcw, 
  Search, 
  Filter, 
  SortDesc, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  X
} from "lucide-react";
import api from "@/lib/api";

type Activity = {
  title: string;
  meta: string;
  color: string;
};

type UserType = {
  id: string;
  name: string;
  email: string;
  college: string;
  joined: string;
  courses: number;
  avgSession: string;
  lastLogin: string;
  status: string;
  semester?: string;
  major?: string;
  gpa?: string;
  queries?: number;
  streak?: string;
  activities?: Activity[];
};

// Mock data to perfectly match the screenshot UI until real data replaces it
const MOCK_USERS: UserType[] = [
  { id: "1", name: "Priya Sharma", email: "priya.s@university.edu", college: "Stanford University", joined: "2023-08-15", courses: 12, avgSession: "42m 15s", lastLogin: "2h ago", status: "ACTIVE" },
  { id: "2", name: "Rohan Mehta", email: "rohan.m@iit.edu", college: "IIT Delhi", joined: "2023-09-02", courses: 8, avgSession: "1h 12m", lastLogin: "Just now", status: "ACTIVE" },
  { id: "3", name: "Anjali Nair", email: "anjali.n@mit.edu", college: "MIT", joined: "2023-01-12", courses: 4, avgSession: "18m 04s", lastLogin: "14 days ago", status: "INACTIVE" },
  { 
    id: "4", name: "Karan Singh", email: "ks.admin@iitb.ac.in", college: "IIT Bombay", joined: "2023-11-20", 
    courses: 11, avgSession: "42 m", lastLogin: "1h ago", status: "ACTIVE",
    semester: "8th Semester", major: "Computer Science", gpa: "9.82 / 10.0", queries: 342, streak: "04 d",
    activities: [
      { title: "Logged in via SSO", meta: "14:22:12 - IP 192.168.1.1", color: "#B2A3FF" },
      { title: "Completed Quiz: AI Ethics", meta: "12:05:44 - Score: 98%", color: "#00D28E" },
      { title: "Document Upload: Thesis_v2.pdf", meta: "Yesterday - 18:40:02", color: "#8B849E" },
      { title: "Shared Course: Deep Learning", meta: "Yesterday - 15:20:10", color: "#8B849E" },
      { title: "Resource Access Denied", meta: "Admin permission needed", color: "#FF6B6B" }
    ]
  },
  { id: "5", name: "Divya Iyer", email: "divya.i@harvard.edu", college: "Harvard University", joined: "2024-05-10", courses: 1, avgSession: "12m 45s", lastLogin: "12h ago", status: "NEW" },
  { id: "6", name: "Arjun Patel", email: "arjun.p@blocked.com", college: "University of Waterloo", joined: "2022-12-05", courses: 32, avgSession: "0s", lastLogin: "90 days ago", status: "BLOCKED" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/auth/users");
        if (response.data?.data?.items) {
          const backendUsers = response.data.data.items.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            college: u.college_id || "N/A",
            joined: new Date(u.created_at).toISOString().split("T")[0],
            courses: 0, // Fallback until backend supports
            avgSession: "--", 
            lastLogin: "--", 
            status: u.is_active ? "ACTIVE" : "INACTIVE",
            semester: u.semester || "--",
            major: u.course || "--",
            gpa: "--",
            queries: 0,
            streak: "0 d",
            activities: []
          }));
          setUsers(backendUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle clicking outside sidebar to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getStatusPill = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, backgroundColor: "rgba(0, 210, 142, 0.1)", color: "#00D28E", letterSpacing: "0.05em" }}>ACTIVE</span>;
      case "INACTIVE":
        return <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, backgroundColor: "rgba(139, 132, 158, 0.1)", color: "#8B849E", letterSpacing: "0.05em" }}>INACTIVE</span>;
      case "NEW":
        return <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, backgroundColor: "rgba(123, 112, 255, 0.15)", color: "#B2A3FF", letterSpacing: "0.05em" }}>NEW</span>;
      case "BLOCKED":
        return <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, backgroundColor: "rgba(255, 77, 77, 0.1)", color: "#FF6B6B", letterSpacing: "0.05em" }}>BLOCKED</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100%", display: "flex", overflow: "hidden" }}>
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        padding: "48px 56px", 
        maxWidth: "1200px",
        transition: "margin-right 0.3s ease",
        marginRight: selectedUser ? "400px" : "0" // Push content when sidebar opens
      }}>
        
        {/* Header section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#FFFFFF", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
              All Users
            </h1>
            <p style={{ fontSize: "13px", color: "#8B849E" }}>
              User database and management
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button style={{ background: "none", border: "none", color: "#E2DCEF", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Bell size={18} />
            </button>
            <button style={{ background: "none", border: "none", color: "#E2DCEF", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Clock size={18} />
            </button>
            <button style={{ 
              background: "rgba(255,255,255,0.05)", 
              border: "1px solid rgba(255,255,255,0.1)", 
              color: "#E2DCEF", 
              padding: "8px 16px", 
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              Refresh
            </button>
            <button style={{ 
              background: "#D4C9FF", 
              border: "none", 
              color: "#0B0A10", 
              padding: "8px 24px", 
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer"
            }}>
              Export
            </button>
          </div>
        </div>

        {/* Toolbar (Search & Filters) */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            background: "#13111C", 
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "0 16px",
            width: "400px",
            height: "40px"
          }}>
            <Search size={16} color="#8B849E" />
            <input 
              type="text" 
              placeholder="Search user ID, email, or name..." 
              style={{ 
                background: "transparent", 
                border: "none", 
                color: "#FFFFFF", 
                outline: "none", 
                marginLeft: "12px",
                width: "100%",
                fontSize: "13px"
              }} 
            />
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ 
              background: "#13111C", 
              border: "1px solid rgba(255,255,255,0.08)", 
              color: "#E2DCEF", 
              padding: "0 16px", 
              height: "40px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <Filter size={14} /> Filters
            </button>
            <button style={{ 
              background: "#13111C", 
              border: "1px solid rgba(255,255,255,0.08)", 
              color: "#E2DCEF", 
              padding: "0 16px", 
              height: "40px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <SortDesc size={14} /> Sort by: Joined
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div style={{ 
          background: "#1A1825", 
          borderRadius: "12px", 
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", textAlign: "left" }}>
                <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", textTransform: "uppercase" }}>User</th>
                <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", textTransform: "uppercase" }}>College</th>
                <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", textTransform: "uppercase" }}>Joined</th>
                <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>Courses</th>
                <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", textTransform: "uppercase" }}>Avg Session</th>
                <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", textTransform: "uppercase" }}>Last Login</th>
                <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr 
                  key={u.id} 
                  onClick={() => setSelectedUser(u)}
                  style={{ 
                    borderBottom: i === users.length - 1 ? "none" : "1px solid rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    backgroundColor: selectedUser?.id === u.id ? "rgba(255,255,255,0.02)" : "transparent",
                    transition: "background-color 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUser?.id !== u.id) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser?.id !== u.id) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "36px", 
                      height: "36px", 
                      borderRadius: "50%", 
                      background: "linear-gradient(135deg, #4D3FFF, #00C896)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "14px",
                      overflow: "hidden"
                    }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>{u.name}</div>
                      <div style={{ fontSize: "12px", color: "#8B849E", marginTop: "2px" }}>{u.email}</div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "13px", color: "#E2DCEF" }}>{u.college}</td>
                  <td style={{ padding: "16px 24px", fontSize: "13px", color: "#E2DCEF" }}>
                    <div style={{ width: "80px" }}>{u.joined}</div>
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "13px", color: "#E2DCEF", textAlign: "center" }}>{u.courses}</td>
                  <td style={{ padding: "16px 24px", fontSize: "13px", color: "#E2DCEF" }}>{u.avgSession}</td>
                  <td style={{ padding: "16px 24px", fontSize: "13px", color: "#8B849E" }}>{u.lastLogin}</td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    {getStatusPill(u.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
          <div style={{ fontSize: "13px", color: "#8B849E" }}>
            Showing 1 to 6 of 1,248 results
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ width: "32px", height: "32px", borderRadius: "6px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#8B849E", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ChevronLeft size={16} />
            </button>
            <button style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(123, 112, 255, 0.2)", border: "1px solid rgba(123, 112, 255, 0.3)", color: "#B2A3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              1
            </button>
            <button style={{ width: "32px", height: "32px", borderRadius: "6px", background: "transparent", border: "none", color: "#8B849E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", cursor: "pointer" }}>
              2
            </button>
            <button style={{ width: "32px", height: "32px", borderRadius: "6px", background: "transparent", border: "none", color: "#8B849E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", cursor: "pointer" }}>
              3
            </button>
            <button style={{ width: "32px", height: "32px", borderRadius: "6px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#E2DCEF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out User Profile Sidebar */}
      <div style={{
        position: "fixed",
        top: 0,
        right: selectedUser ? 0 : "-420px",
        width: "400px",
        height: "100vh",
        backgroundColor: "#13111C",
        borderLeft: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
        transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 50,
        overflowY: "auto"
      }}>
        {selectedUser && (
          <div style={{ padding: "32px" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexShrink: 0 }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>User Profile</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                style={{ background: "none", border: "none", color: "#8B849E", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "40px" }}>
              <div style={{ 
                width: "56px", 
                height: "56px", 
                borderRadius: "50%", 
                background: "linear-gradient(135deg, #4D3FFF, #00C896)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 600,
                fontSize: "20px"
              }}>
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF", marginBottom: "2px" }}>{selectedUser.name}</h3>
                <p style={{ fontSize: "12px", color: "#8B849E", marginBottom: "8px" }}>{selectedUser.email}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: "rgba(0, 210, 142, 0.1)", color: "#00D28E", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em" }}>
                    PREMIUM MEMBER
                  </span>
                  <span style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#E2DCEF", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em" }}>
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Section: Academic Foundation */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", marginBottom: "12px" }}>
                ACADEMIC FOUNDATION
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ backgroundColor: "#1A1825", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Institution</div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#E2DCEF" }}>{selectedUser.college || "N/A"}</div>
                </div>
                <div style={{ backgroundColor: "#1A1825", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Semester</div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#E2DCEF" }}>{selectedUser.semester || "N/A"}</div>
                </div>
                <div style={{ backgroundColor: "#1A1825", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Major</div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#E2DCEF" }}>{selectedUser.major || "N/A"}</div>
                </div>
                <div style={{ backgroundColor: "#1A1825", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>GPA</div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#E2DCEF" }}>{selectedUser.gpa || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Section: Engagement Metrics */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", marginBottom: "12px" }}>
                ENGAGEMENT METRICS
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ backgroundColor: "#22202E", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>{selectedUser.courses}</div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", textTransform: "uppercase" }}>Courses</div>
                </div>
                <div style={{ backgroundColor: "#22202E", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 600, color: "#00D28E", marginBottom: "4px" }}>
                    {selectedUser.avgSession?.split(' ')[0]}<span style={{ fontSize: "14px", color: "#8B849E", marginLeft: "2px" }}>{selectedUser.avgSession?.split(' ')[1] || 'm'}</span>
                  </div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", textTransform: "uppercase" }}>Avg Session</div>
                </div>
                <div style={{ backgroundColor: "#22202E", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>{selectedUser.queries || 0}</div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", textTransform: "uppercase" }}>Queries</div>
                </div>
                <div style={{ backgroundColor: "#22202E", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>
                    {selectedUser.streak?.split(' ')[0] || "00"}<span style={{ fontSize: "14px", color: "#8B849E", marginLeft: "2px" }}>d</span>
                  </div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", textTransform: "uppercase" }}>Streak</div>
                </div>
              </div>
            </div>

            {/* Section: Institutional Ledger */}
            <div style={{ marginBottom: "0" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", marginBottom: "16px" }}>
                INSTITUTIONAL LEDGER
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", paddingLeft: "8px" }}>
                {/* Connecting line */}
                <div style={{ position: "absolute", left: "10px", top: "10px", bottom: "10px", width: "1px", backgroundColor: "rgba(255,255,255,0.05)" }} />
                
                {selectedUser.activities?.map((activity, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "16px", position: "relative" }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: activity.color, marginTop: "6px", flexShrink: 0, zIndex: 2 }} />
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 500, color: "#E2DCEF", marginBottom: "2px" }}>{activity.title}</div>
                      <div style={{ fontSize: "10px", color: "#8B849E" }}>{activity.meta}</div>
                    </div>
                  </div>
                ))}
                
                {(!selectedUser.activities || selectedUser.activities.length === 0) && (
                  <div style={{ fontSize: "12px", color: "#8B849E", paddingLeft: "16px" }}>No recent activity.</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexShrink: 0 }}>
              <button style={{ 
                flex: 1, 
                backgroundColor: "#D4C9FF", 
                color: "#0B0A10", 
                border: "none", 
                padding: "12px", 
                borderRadius: "8px", 
                fontSize: "13px", 
                fontWeight: 600, 
                cursor: "pointer",
                flexShrink: 0,
                minHeight: "44px"
              }}>
                Message User
              </button>
              <button style={{ 
                flex: 1, 
                backgroundColor: "transparent", 
                color: "#FF6B6B", 
                border: "1px solid rgba(255, 107, 107, 0.3)", 
                padding: "12px", 
                borderRadius: "8px", 
                fontSize: "13px", 
                fontWeight: 600, 
                cursor: "pointer",
                flexShrink: 0,
                minHeight: "44px"
              }}>
                Block User
              </button>
            </div>
            
          </div>
        )}
      </div>

    </div>
  );
}
