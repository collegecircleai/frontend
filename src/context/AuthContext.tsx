"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  college_id?: string;
  year?: number;
  course?: string;
  isOnboarded?: boolean;
  premiumUptoDate?: string | null;
  isPremium?: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const storedRefreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;
        const storedUser =
          typeof window !== "undefined" ? localStorage.getItem("user") : null;

        // Restore from localStorage
        if (storedToken) {
          setToken(storedToken);
        }
        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken);
        }
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            // Invalid JSON in storage
          }
        }

        const isJwtExpired = (tokenValue: string) => {
          const payload = parseJwt(tokenValue);
          if (!payload?.exp) {
            return false;
          }

          return payload.exp * 1000 <= Date.now();
        };

        if (storedRefreshToken && (!storedToken || isJwtExpired(storedToken))) {
          try {
            const refreshRes = await api.post("/auth/refresh", {
              refreshToken: storedRefreshToken,
            });

            if (
              refreshRes?.data?.success &&
              refreshRes.data?.data?.accessToken
            ) {
              const newToken = refreshRes.data.data.accessToken;
              const newRefreshToken = refreshRes.data.data.refreshToken;
              setToken(newToken);
              if (newRefreshToken) {
                setRefreshToken(newRefreshToken);
              }
              if (typeof window !== "undefined") {
                localStorage.setItem("token", newToken);
                if (newRefreshToken) {
                  localStorage.setItem("refreshToken", newRefreshToken);
                }
              }
              return;
            }
          } catch (error) {
            // Refresh failed, clear auth
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
            }
            setUser(null);
            setToken(null);
            setRefreshToken(null);
            return;
          }
        }

        // If we have both tokens and the access token is still valid, trust the stored session.
        if (storedToken && storedRefreshToken && storedUser) {
          return;
        }

        // If we only have refresh token, try to refresh
        if (storedRefreshToken && !storedToken) {
          try {
            const refreshRes = await api.post("/auth/refresh", {
              refreshToken: storedRefreshToken,
            });

            if (
              refreshRes?.data?.success &&
              refreshRes.data?.data?.accessToken
            ) {
              const newToken = refreshRes.data.data.accessToken;
              const newRefreshToken = refreshRes.data.data.refreshToken;
              setToken(newToken);
              if (newRefreshToken) {
                setRefreshToken(newRefreshToken);
              }
              if (typeof window !== "undefined") {
                localStorage.setItem("token", newToken);
                if (newRefreshToken) {
                  localStorage.setItem("refreshToken", newRefreshToken);
                }
              }
            }
          } catch (error) {
            // Refresh failed, clear auth
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
            }
            setUser(null);
            setToken(null);
            setRefreshToken(null);
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const handleAuthCleared = () => {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setIsLoading(false);
    };

    window.addEventListener("auth:cleared", handleAuthCleared);
    return () => window.removeEventListener("auth:cleared", handleAuthCleared);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data;
    if (data?.success && data?.data?.user) {
      const userData = data.data.user;
      const accessToken = data.data.accessToken;
      const refreshTokenValue = data.data.refreshToken;

      setUser(userData);
      setToken(accessToken);
      setRefreshToken(refreshTokenValue);

      if (typeof window !== "undefined") {
        localStorage.setItem("token", accessToken);
        if (refreshTokenValue) {
          localStorage.setItem("refreshToken", refreshTokenValue);
        }
        localStorage.setItem("user", JSON.stringify(userData));
      }
    }
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        refreshToken,
        setRefreshToken,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function getPostAuthRoute(user: User | null): string {
  if (!user) return "/login";
  if (user.role === "admin") return "/admin";
  if (!user.isOnboarded) return "/onboarding";
  return "/dashboard";
}
