import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthState {
  token: string | null;
  userName: string | null;
  userPhone: number | null;
  isVerified: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, name?: string) => void;
  setPhone: (phone: number) => void;
  setVerified: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => ({
    token: localStorage.getItem("auth_token"),
    userName: localStorage.getItem("auth_name"),
    userPhone: localStorage.getItem("auth_phone") ? Number(localStorage.getItem("auth_phone")) : null,
    isVerified: localStorage.getItem("auth_verified") === "true",
  }));

  const login = (token: string, name?: string) => {
    localStorage.setItem("auth_token", token);
    if (name) {
      localStorage.setItem("auth_name", name);
    }
    setState((s) => ({ ...s, token, userName: name || s.userName }));
  };

  const setPhone = (phone: number) => {
    localStorage.setItem("auth_phone", String(phone));
    setState((s) => ({ ...s, userPhone: phone }));
  };

  const setVerified = () => {
    localStorage.setItem("auth_verified", "true");
    setState((s) => ({ ...s, isVerified: true }));
  };

  const logout = () => {
    localStorage.clear();
    setState({ token: null, userName: null, userPhone: null, isVerified: false });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, setPhone, setVerified, logout, isAuthenticated: !!state.token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
