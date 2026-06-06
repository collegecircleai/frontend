"use client";

import React, { useEffect, useState } from "react";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isCheckingCalendar, setIsCheckingCalendar] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkCalendarStatus = async () => {
      try {
        const res = await api.get("/auth/calendar/status");
        const connected =
          res?.data?.data?.connected ?? res?.data?.connected ?? false;

        if (mounted) {
          setIsCalendarConnected(Boolean(connected));
        }
      } catch (error) {
        console.error("Calendar status fetch failed", error);
        if (mounted) setIsCalendarConnected(false);
      } finally {
        if (mounted) setIsCheckingCalendar(false);
      }
    };

    checkCalendarStatus();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px 48px",
        background: "var(--bg)",
      }}
    >
      <div
        style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: 24 }}
      >
        <section
          style={{
            border: "1px solid var(--border-light)",
            borderRadius: 24,
            background: "var(--pearl)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            padding: 24,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--mist)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: 12,
            }}
          >
            Profile
          </p>
          <h1
            style={{
              margin: "8px 0 6px",
              fontSize: 30,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            {user?.name || "Scholar"}
          </h1>
          <p style={{ margin: 0, color: "var(--mist)", fontSize: 14 }}>
            {user?.email || "No email on file"}
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          <article
            style={{
              border: "1px solid var(--border-light)",
              borderRadius: 24,
              background: "var(--pearl)",
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "var(--mist)",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    fontSize: 11,
                  }}
                >
                  Calendar Connection
                </p>
                <h2
                  style={{
                    margin: "6px 0 0",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {isCheckingCalendar
                    ? "Checking..."
                    : isCalendarConnected
                      ? "Connected"
                      : "Not connected"}
                </h2>
              </div>
              {isCheckingCalendar ? (
                <Calendar size={22} color="var(--mist)" />
              ) : isCalendarConnected ? (
                <CheckCircle2 size={22} color="var(--jade)" />
              ) : (
                <XCircle size={22} color="var(--warning, #F59E0B)" />
              )}
            </div>
            <p
              style={{
                marginTop: 10,
                color: "var(--mist)",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {isCalendarConnected
                ? "Your Google Calendar connection is active."
                : "Connect Google Calendar to enable calendar-linked features."}
            </p>
          </article>

          <article
            style={{
              border: "1px solid var(--border-light)",
              borderRadius: 24,
              background: "var(--pearl)",
              padding: 20,
            }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--mist)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: 11,
              }}
            >
              Account
            </p>
            <ul
              style={{
                margin: "10px 0 0 0",
                paddingLeft: 18,
                color: "var(--ink)",
                display: "grid",
                gap: 8,
                fontSize: 14,
              }}
            >
              <li>Role: {user?.role || "student"}</li>
              <li>College ID: {user?.college_id || "—"}</li>
              <li>Course: {user?.course || "—"}</li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
