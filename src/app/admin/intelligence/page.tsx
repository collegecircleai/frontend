"use client";

import { 
  Bell, 
  Clock, 
  Activity, 
  Users, 
  UserPlus,
  Cloud,
  Cpu,
  ShieldCheck,
  HardDrive,
  Network,
  Database,
  MoreVertical
} from "lucide-react";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function AdminIntelligencePage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalCourses: 0,
    aiGenerationsToday: 0,
    apiCreditsUsed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "48px 56px", maxWidth: "1200px" }}>
      
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#FFFFFF", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
            Admin Intelligence
          </h1>
          <p style={{ fontSize: "13px", color: "#8B849E" }}>
            Real-time platform overview
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
            cursor: "pointer"
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
          <div style={{ 
            width: "36px", height: "36px", borderRadius: "50%", 
            background: "linear-gradient(135deg, #4D3FFF, #00C896)",
            marginLeft: "8px"
          }} />
        </div>
      </div>

      {/* Real-time Pulse Section */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00D28E", boxShadow: "0 0 10px #00D28E" }} />
          <h2 style={{ fontSize: "11px", fontWeight: 700, color: "#00D28E", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Real-Time Pulse
          </h2>
        </div>

        {/* 3 Main Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "20px" }}>
          {/* Total Users */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "11px", color: "#8B849E", fontWeight: 600, marginBottom: "16px" }}>Total Users</div>
            <div style={{ fontSize: "36px", fontWeight: 700, color: "#00D28E", fontFamily: "var(--font-display)" }}>{loading ? "-" : stats.totalUsers}</div>
            <Users size={80} color="rgba(0, 210, 142, 0.05)" style={{ position: "absolute", right: "-10px", bottom: "-10px" }} />
          </div>
          {/* AI Generations */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "11px", color: "#8B849E", fontWeight: 600, marginBottom: "16px" }}>AI Generations Today</div>
            <div style={{ fontSize: "36px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-display)" }}>{loading ? "-" : stats.aiGenerationsToday}</div>
            <Activity size={80} color="rgba(255, 255, 255, 0.03)" style={{ position: "absolute", right: "-10px", bottom: "-10px" }} />
          </div>
          {/* New Signups */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "11px", color: "#8B849E", fontWeight: 600, marginBottom: "16px" }}>New Signups Today</div>
            <div style={{ fontSize: "36px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-display)" }}>{loading ? "-" : stats.newUsersToday}</div>
            <UserPlus size={80} color="rgba(255, 255, 255, 0.03)" style={{ position: "absolute", right: "-10px", bottom: "-10px" }} />
          </div>
        </div>

        {/* 5 Mini Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "9px", color: "#8B849E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Total Courses</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF" }}>{loading ? "-" : stats.totalCourses}</div>
          </div>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "9px", color: "#8B849E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>API Credits Used</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FF6B6B" }}>{loading ? "-" : stats.apiCreditsUsed}</div>
          </div>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "9px", color: "#8B849E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Retention</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF" }}>0%</div>
          </div>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "9px", color: "#8B849E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Latency</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF" }}>42ms</div>
          </div>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "9px", color: "#8B849E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Support Tckts</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF" }}>0</div>
          </div>
        </div>

        {/* Big Chart: Signup Trend */}
        <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>Signup Trend</div>
              <div style={{ fontSize: "11px", color: "#8B849E" }}>24-hour distribution cycle</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#E2DCEF" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#B2A3FF" }} />
              Primary Ingest
            </div>
          </div>
          
          {/* Real data chart wrapper (using mock line if no real timeseries data yet) */}
          <div style={{ height: "180px", width: "100%", position: "relative", opacity: loading || stats.newUsersToday === 0 ? 0.3 : 1 }}>
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              {/* Grid lines */}
              <line x1="0" y1="180" x2="1000" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              {/* Smooth curve line */}
              <path 
                d="M 0,160 C 100,160 150,140 200,90 C 250,40 300,150 350,160 C 400,170 450,20 500,20 C 550,20 580,180 620,180 C 660,180 680,20 720,20 C 760,20 780,180 820,180 C 860,180 880,20 920,20 C 960,20 980,180 1000,180" 
                fill="none" 
                stroke="#B2A3FF" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "10px", color: "#8B849E" }}>
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* Middle Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          
          {/* Feature Usage */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "24px" }}>Feature Usage</div>
            
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
                <span style={{ color: "#E2DCEF" }}>AI Analysis</span>
                <span style={{ color: "#FFFFFF", fontWeight: 600 }}>82%</span>
              </div>
              <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                <div style={{ width: "82%", height: "100%", backgroundColor: "#B2A3FF", borderRadius: "2px" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
                <span style={{ color: "#E2DCEF" }}>Data Export</span>
                <span style={{ color: "#FFFFFF", fontWeight: 600 }}>44%</span>
              </div>
              <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                <div style={{ width: "44%", height: "100%", backgroundColor: "#00D28E", borderRadius: "2px" }} />
              </div>
            </div>
          </div>

          {/* Weekly Comparison */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "16px" }}>Weekly Comparison</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-display)", marginBottom: "4px" }}>1.2k</div>
                <div style={{ fontSize: "11px", color: "#00D28E", fontWeight: 500 }}>↗ +12.4% vs LW</div>
              </div>
              {/* Mock Bar Chart */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "40px" }}>
                <div style={{ width: "6px", height: "15px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
                <div style={{ width: "6px", height: "25px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
                <div style={{ width: "6px", height: "18px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
                <div style={{ width: "6px", height: "30px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
                <div style={{ width: "6px", height: "40px", backgroundColor: "#B2A3FF", borderRadius: "2px" }} />
              </div>
            </div>
          </div>

          {/* Monthly Progress */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Circular Progress Mock */}
            <div style={{ position: "relative", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ position: "absolute" }}>
                <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle cx="30" cy="30" r="26" fill="none" stroke="#B2A3FF" strokeWidth="6" strokeDasharray="163" strokeDashoffset="45" strokeLinecap="round" transform="rotate(-90 30 30)" />
              </svg>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>72%</span>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>Monthly Progress</div>
              <div style={{ fontSize: "11px", color: "#8B849E", marginBottom: "4px" }}>Instructional Quota</div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#B2A3FF", letterSpacing: "0.05em" }}>ON TARGET</div>
            </div>
          </div>
        </div>

        {/* Platform KPIs */}
        <div style={{ fontSize: "10px", fontWeight: 600, color: "#8B849E", letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>
          Platform KPIs
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <Cloud size={16} color="#00D28E" style={{ marginBottom: "12px" }} />
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginBottom: "2px" }}>99.98%</div>
            <div style={{ fontSize: "10px", color: "#8B849E" }}>Uptime SLA</div>
          </div>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <Activity size={16} color="#B2A3FF" style={{ marginBottom: "12px" }} />
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginBottom: "2px" }}>0.2s</div>
            <div style={{ fontSize: "10px", color: "#8B849E" }}>Sync Latency</div>
          </div>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <ShieldCheck size={16} color="#FFB020" style={{ marginBottom: "12px" }} />
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginBottom: "2px" }}>Clean</div>
            <div style={{ fontSize: "10px", color: "#8B849E" }}>Threat Level</div>
          </div>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <HardDrive size={16} color="#E2DCEF" style={{ marginBottom: "12px" }} />
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginBottom: "2px" }}>4.2 TB</div>
            <div style={{ fontSize: "10px", color: "#8B849E" }}>Storage Usage</div>
          </div>
          <div style={{ backgroundColor: "#1A1825", borderRadius: "8px", padding: "16px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <Network size={16} color="#E2DCEF" style={{ marginBottom: "12px" }} />
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginBottom: "2px" }}>12 Nodes</div>
            <div style={{ fontSize: "10px", color: "#8B849E" }}>Active Clusters</div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
          
          {/* Feature Adoption Detailed */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>Feature Adoption Detailed</div>
              <MoreVertical size={16} color="#8B849E" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
                  <span style={{ color: "#E2DCEF" }}>Natural Language Query</span>
                  <span style={{ color: "#FFFFFF", fontWeight: 600 }}>89%</span>
                </div>
                <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                  <div style={{ width: "89%", height: "100%", backgroundColor: "#B2A3FF", borderRadius: "2px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
                  <span style={{ color: "#E2DCEF" }}>Automated Reporting</span>
                  <span style={{ color: "#FFFFFF", fontWeight: 600 }}>74%</span>
                </div>
                <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                  <div style={{ width: "74%", height: "100%", backgroundColor: "#00D28E", borderRadius: "2px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
                  <span style={{ color: "#E2DCEF" }}>Student Risk Profiling</span>
                  <span style={{ color: "#FFFFFF", fontWeight: 600 }}>52%</span>
                </div>
                <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                  <div style={{ width: "52%", height: "100%", backgroundColor: "#FFB020", borderRadius: "2px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "8px" }}>
                  <span style={{ color: "#E2DCEF" }}>API Integration</span>
                  <span style={{ color: "#FFFFFF", fontWeight: 600 }}>31%</span>
                </div>
                <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                  <div style={{ width: "31%", height: "100%", backgroundColor: "#E2DCEF", borderRadius: "2px" }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* API Credits */}
            <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>API Credits</div>
                <Database size={16} color="#FFB020" />
              </div>
              <div style={{ fontSize: "11px", color: "#8B849E", marginBottom: "16px" }}>Monthly consumption balance</div>
              
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
                <span style={{ fontSize: "32px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-display)" }}>842,500</span>
                <span style={{ fontSize: "12px", color: "#8B849E" }}>/ 1M</span>
              </div>
              
              <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: "4px", backgroundColor: "rgba(255, 176, 32, 0.1)", color: "#FFB020", fontSize: "10px", fontWeight: 600 }}>
                Refills in 12 days
              </div>
            </div>

            {/* System Health */}
            <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>System Health</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00D28E", boxShadow: "0 0 5px #00D28E" }} />
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#00D28E", letterSpacing: "0.05em" }}>OPTIMAL</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#8B849E" }}>CPU Load</span>
                  <span style={{ color: "#FFFFFF", fontWeight: 500 }}>14%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#8B849E" }}>Memory Usage</span>
                  <span style={{ color: "#FFFFFF", fontWeight: 500 }}>3.8GB</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#8B849E" }}>Active Instances</span>
                  <span style={{ color: "#FFFFFF", fontWeight: 500 }}>12 / 13</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

