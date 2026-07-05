"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();


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
