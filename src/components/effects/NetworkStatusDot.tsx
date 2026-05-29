"use client";

import { useEffect, useState } from "react";

type NetworkStatus = "fast" | "slow" | "offline";

export default function NetworkStatusDot() {
  const [status, setStatus] = useState<NetworkStatus>("fast");

  useEffect(() => {
    // Helper to determine status based on connection info
    const updateStatus = () => {
      if (!navigator.onLine) {
        setStatus("offline");
        return;
      }

      // Check for navigator.connection (Network Information API)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        // If effectiveType is 2g or slow-2g, or downlink is very low, mark as slow
        if (
          connection.effectiveType === "2g" || 
          connection.effectiveType === "slow-2g" || 
          connection.effectiveType === "3g"
        ) {
          setStatus("slow");
        } else {
          setStatus("fast");
        }
      } else {
        // Fallback for Safari / iPhones: Just show fast if online
        setStatus("fast");
      }
    };

    // Initial check
    updateStatus();

    // Listeners for online/offline
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // Listener for connection speed changes (if supported)
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener("change", updateStatus);
    }

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      if (connection) {
        connection.removeEventListener("change", updateStatus);
      }
    };
  }, []);

  // Determine color based on status
  let bgColor = "var(--jade)"; // Default Fast (Green)
  let shadowColor = "var(--jade)";

  if (status === "slow") {
    bgColor = "#FFB020"; // Yellow/Orange
    shadowColor = "#FFB020";
  } else if (status === "offline") {
    bgColor = "#FF6B7A"; // Red
    shadowColor = "#FF6B7A";
  }

  return (
    <div
      title={status === "fast" ? "Excellent Connection" : status === "slow" ? "Slow Connection" : "Offline"}
      style={{
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        background: bgColor,
        boxShadow: `0 0 8px ${shadowColor}`,
        transition: "all 0.5s ease",
      }}
    />
  );
}
