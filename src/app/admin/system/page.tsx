"use client";

import { 
  Bell, 
  Clock, 
  Search,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

export default function AdminSystemPage() {
  return (
    <div style={{ padding: "48px 56px", maxWidth: "1200px" }}>
      
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
            System Health
          </h1>
          <div style={{ display: "flex", gap: "24px", fontSize: "13px", fontWeight: 600 }}>
            <Link href="#" style={{ color: "#FFFFFF", textDecoration: "none" }}>Dashboard</Link>
            <Link href="#" style={{ color: "#8B849E", textDecoration: "none" }}>Analytics</Link>
            <Link href="#" style={{ color: "#8B849E", textDecoration: "none" }}>Logs</Link>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ 
            display: "flex", alignItems: "center", gap: "6px", 
            padding: "6px 12px", borderRadius: "100px", 
            backgroundColor: "rgba(0, 210, 142, 0.1)", 
            border: "1px solid rgba(0, 210, 142, 0.2)"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00D28E", boxShadow: "0 0 5px #00D28E" }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#00D28E", letterSpacing: "0.05em" }}>LIVE SYSTEM</span>
          </div>
          
          <button style={{ background: "none", border: "none", color: "#E2DCEF", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Bell size={18} />
          </button>
          <button style={{ background: "none", border: "none", color: "#E2DCEF", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Clock size={18} />
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

      {/* Top Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "24px" }}>
        
        <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
          <div style={{ fontSize: "10px", color: "#8B849E", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>Uptime</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-display)", marginBottom: "12px" }}>
            99.99 <span style={{ fontSize: "14px", color: "#8B849E" }}>%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#00D28E", fontWeight: 500 }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00D28E" }} />
            32d 14h 22m
          </div>
        </div>

        <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
          <div style={{ fontSize: "10px", color: "#8B849E", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>Error Rate</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-display)", marginBottom: "12px" }}>
            0.04 <span style={{ fontSize: "14px", color: "#8B849E" }}>%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#B2A3FF", fontWeight: 500 }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#B2A3FF" }} />
            Nominal range
          </div>
        </div>

        <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
          <div style={{ fontSize: "10px", color: "#8B849E", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>Avg Latency</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-display)", marginBottom: "12px" }}>
            142 <span style={{ fontSize: "14px", color: "#8B849E" }}>ms</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#FFB020", fontWeight: 500 }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FFB020" }} />
            + 54ms
          </div>
        </div>

        <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
          <div style={{ fontSize: "10px", color: "#8B849E", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>Active Sessions</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-display)", marginBottom: "12px" }}>
            12,842
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#8B849E", fontWeight: 500 }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#8B849E" }} />
            84% capacity
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px" }}>
        
        {/* Services Status List */}
        <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "32px", border: "1px solid rgba(255,255,255,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.05em", textTransform: "uppercase" }}>Services Status List</h2>
            <div style={{ fontSize: "11px", color: "#8B849E", letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#8B849E" }} />
              6 Active Services
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Service 1 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00D28E", boxShadow: "0 0 8px rgba(0,210,142,0.4)" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>Core Database</div>
                  <div style={{ fontSize: "11px", color: "#8B849E" }}>PostgreSQL - Primary Cluster</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "48px", textAlign: "right" }}>
                <div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Latency</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#00D28E" }}>7ms</div>
                </div>
                <div style={{ width: "60px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Uptime</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>99.999%</div>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00D28E", boxShadow: "0 0 8px rgba(0,210,142,0.4)" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>Gemini LLM Pipeline</div>
                  <div style={{ fontSize: "11px", color: "#8B849E" }}>Vertex AI - Multi-region</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "48px", textAlign: "right" }}>
                <div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Latency</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#00D28E" }}>540ms</div>
                </div>
                <div style={{ width: "60px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Uptime</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>99.91%</div>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00D28E", boxShadow: "0 0 8px rgba(0,210,142,0.4)" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>Auth & Verification Email</div>
                  <div style={{ fontSize: "11px", color: "#8B849E" }}>SendGrid - SMTP Relay</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "48px", textAlign: "right" }}>
                <div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Latency</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#00D28E" }}>115ms</div>
                </div>
                <div style={{ width: "60px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Uptime</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>100%</div>
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00D28E", boxShadow: "0 0 8px rgba(0,210,142,0.4)" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>Identity Management (Auth)</div>
                  <div style={{ fontSize: "11px", color: "#8B849E" }}>OAuth 5.0 - JWT Cluster</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "48px", textAlign: "right" }}>
                <div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Latency</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#00D28E" }}>13ms</div>
                </div>
                <div style={{ width: "60px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Uptime</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>99.999%</div>
                </div>
              </div>
            </div>

            {/* Service 5 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FFB020", boxShadow: "0 0 8px rgba(255,176,32,0.4)" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>Distributed File Storage</div>
                  <div style={{ fontSize: "11px", color: "#8B849E" }}>S3 Compatible - Cold Storage</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "48px", textAlign: "right" }}>
                <div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Latency</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFB020" }}>341ms</div>
                </div>
                <div style={{ width: "60px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Uptime</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>99.09%</div>
                </div>
              </div>
            </div>

            {/* Service 6 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00D28E", boxShadow: "0 0 8px rgba(0,210,142,0.4)" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>Global Content Delivery (CDN)</div>
                  <div style={{ fontSize: "11px", color: "#8B849E" }}>Edge Locations - Static Assets</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "48px", textAlign: "right" }}>
                <div>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Latency</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#00D28E" }}>4ms</div>
                </div>
                <div style={{ width: "60px" }}>
                  <div style={{ fontSize: "9px", color: "#8B849E", letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>Uptime</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>100%</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* API Credits Usage */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              <span style={{ color: "#8B849E" }}>API Credits Usage</span>
              <span style={{ color: "#B2A3FF" }}>38%</span>
            </div>
            
            <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "3px", marginBottom: "12px" }}>
              <div style={{ width: "38%", height: "100%", backgroundColor: "#B2A3FF", borderRadius: "3px" }} />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#8B849E", marginBottom: "24px", fontFamily: "var(--font-mono)" }}>
              <span>0 CR</span>
              <span>1,000,000 CR</span>
            </div>
            
            <div style={{ fontSize: "12px", color: "#E2DCEF", lineHeight: 1.5 }}>
              Current usage is within allocated limits.<br />
              Next credit reset in <span style={{ color: "#FFFFFF", fontWeight: 600 }}>12d 04h</span>.
            </div>
          </div>

          {/* Storage Capacity */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              <span style={{ color: "#8B849E" }}>Storage Capacity</span>
              <span style={{ color: "#FFB020" }}>71%</span>
            </div>
            
            <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "3px", marginBottom: "16px" }}>
              <div style={{ width: "71%", height: "100%", backgroundColor: "#FFB020", borderRadius: "3px" }} />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", fontFamily: "var(--font-mono)" }}>1.42 TB</span>
              <span style={{ fontSize: "12px", color: "#8B849E", fontFamily: "var(--font-mono)" }}>/ 2.00 TB</span>
            </div>
            
            <div style={{ 
              backgroundColor: "rgba(255, 176, 32, 0.05)", 
              border: "1px solid rgba(255, 176, 32, 0.1)", 
              borderRadius: "8px", 
              padding: "16px",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start"
            }}>
              <AlertTriangle size={16} color="#FFB020" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "12px", color: "#FFB020", lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600 }}>Storage reaching threshold.</span><br />
                Consider archiving logs.
              </div>
            </div>
          </div>

          {/* Real-Time Load */}
          <div style={{ backgroundColor: "#1A1825", borderRadius: "12px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)", flex: 1 }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#8B849E", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "24px" }}>
              Real-Time Load
            </div>
            
            {/* Mock Bar Chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "60px", marginBottom: "20px" }}>
              {[30, 45, 25, 60, 40, 70, 50, 35, 55, 45, 30, 80, 60].map((h, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  height: `${h}%`, 
                  backgroundColor: "rgba(255,255,255,0.1)", 
                  borderRadius: "2px" 
                }} />
              ))}
            </div>
            
            <div style={{ fontSize: "11px", color: "#8B849E", fontFamily: "var(--font-mono)", textAlign: "center" }}>
              Sampling: Every 5s &nbsp;—&nbsp; Load: <span style={{ color: "#E2DCEF" }}>0.82</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
