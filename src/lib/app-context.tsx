"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import {
  User,
  Transaction,
  Notification,
  Member,
  WalletInfo,
  MerchantInfo,
  MerchantCustomer,
  Settlement,
  SettlementStatus,
  AdminKPIs,
  BlockchainAudit,
  defaultUser,
  defaultWallet,
  defaultTransactions,
  defaultNotifications,
  defaultMembers,
  defaultMerchantInfo,
  defaultMerchantCustomers,
  defaultSettlements,
  defaultAdminKPIs,
  defaultBlockchainAudit,
} from "./mock-data";

// ─── Helpers ────────────────────────────────────────────────────────────────

type BackendMode = "mock" | "mysql";

function getBackendMode(): BackendMode {
  if (typeof window === "undefined") return "mock";
  if (process.env.NEXT_PUBLIC_API_MODE === "mysql") return "mysql";
  return "mock";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// ─── Context shape ──────────────────────────────────────────────────────────

interface AppState {
  // Auth
  isLoggedIn: boolean;
  user: User;
  login: (mobile: string, email: string) => void;
  loginWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  backendMode: BackendMode;
  loading: boolean;

  // Wallet
  wallet: WalletInfo;
  transactions: Transaction[];
  processPayment: (merchant: string, amount: number) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;

  // Directory
  members: Member[];

  // Merchant
  merchantInfo: MerchantInfo;
  merchantCustomers: MerchantCustomer[];

  // Admin
  settlements: Settlement[];
  adminKPIs: AdminKPIs;
  blockchainAudit: BlockchainAudit;
  approveSettlement: (id: number) => void;
}

const AppContext = createContext<AppState | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [wallet, setWallet] = useState<WalletInfo>(defaultWallet);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const [merchantInfo] = useState<MerchantInfo>(defaultMerchantInfo);
  const [merchantCustomers, setMerchantCustomers] = useState<MerchantCustomer[]>(defaultMerchantCustomers);
  const [settlements, setSettlements] = useState<Settlement[]>(defaultSettlements);
  const [adminKPIs] = useState<AdminKPIs>(defaultAdminKPIs);
  const [blockchainAudit] = useState<BlockchainAudit>(defaultBlockchainAudit);
  const [loading, setLoading] = useState(true);

  const backendMode = getBackendMode();

  // ── Load session on mount (MySQL API mode) ────────────────────────────

  useEffect(() => {
    if (backendMode !== "mysql") {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.user) {
          setUser({
            id: String(data.user.id),
            name: data.user.name,
            initials: data.user.initials,
            mobile: data.user.mobile,
            email: data.user.email,
            membershipTier: data.user.membershipTier,
            role: data.user.role,
          });
          setIsLoggedIn(true);
          await loadData();
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [backendMode]);

  // ── Load all data from API ────────────────────────────────────────────

  const loadData = async () => {
    try {
      const [walletRes, txRes, notifRes, membersRes, settlementsRes] = await Promise.all([
        fetch("/api/wallet"),
        fetch("/api/transactions"),
        fetch("/api/notifications"),
        fetch("/api/members"),
        fetch("/api/settlements"),
      ]);

      const walletData = await walletRes.json();
      if (walletData.wallet) setWallet(walletData.wallet);

      const txData = await txRes.json();
      if (txData.transactions) {
        setTransactions(txData.transactions.map((t: { id: number; title: string; amount: number; type: string; status: string; date: string }) => ({
          ...t,
          date: timeAgo(t.date),
        })));
      }

      const notifData = await notifRes.json();
      if (notifData.notifications) {
        setNotifications(notifData.notifications.map((n: { id: number; title: string; desc: string; iconType: string; unread: boolean; time: string }) => ({
          ...n,
          time: timeAgo(n.time),
          color: "",
          bg: "",
        })));
      }

      const membersData = await membersRes.json();
      if (membersData.members) setMembers(membersData.members);

      const settlementsData = await settlementsRes.json();
      if (settlementsData.settlements) setSettlements(settlementsData.settlements);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  // ── Auth ────────────────────────────────────────────────────────────────

  const login = useCallback((mobile: string, email: string) => {
    // Mock mode login
    setUser((prev) => ({ ...prev, mobile, email }));
    setIsLoggedIn(true);
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) return { error: data.error || "Login failed" };

      setUser({
        id: String(data.user.id),
        name: data.user.name,
        initials: data.user.initials,
        mobile: data.user.mobile,
        email: data.user.email,
        membershipTier: data.user.membershipTier,
        role: data.user.role,
      });
      setIsLoggedIn(true);
      await loadData();
      return {};
    } catch {
      return { error: "Network error" };
    }
  }, []);

  const logout = useCallback(async () => {
    if (backendMode === "mysql") {
      await fetch("/api/auth/logout", { method: "POST" });
    }
    setIsLoggedIn(false);
    setUser(defaultUser);
    setWallet(defaultWallet);
    setTransactions(defaultTransactions);
    setNotifications(defaultNotifications);
  }, [backendMode]);

  // ── Wallet / Payment ───────────────────────────────────────────────────

  const processPayment = useCallback(async (merchant: string, amount: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const dateStr = `Today, ${timeStr}`;

    if (backendMode === "mysql") {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchant, amount }),
      });
      if (res.ok) {
        await loadData(); // Refresh all data from server
      }
    } else {
      // Mock mode
      const newTx: Transaction = {
        id: Date.now(),
        title: merchant,
        amount: -amount,
        date: dateStr,
        type: "used",
        status: "completed",
      };

      setTransactions((prev) => [newTx, ...prev]);
      setWallet((prev) => ({
        ...prev,
        balance: prev.balance - amount,
        totalUsed: prev.totalUsed + amount,
      }));

      setMerchantCustomers((prev) => [
        { id: Date.now(), name: user.name, amount, date: dateStr },
        ...prev,
      ]);

      setNotifications((prev) => [
        {
          id: Date.now(),
          title: "Payment Sent",
          desc: `HKD ${amount} credit used at ${merchant}`,
          time: "Just now",
          iconType: "credit" as const,
          color: "text-primary",
          bg: "bg-primary/5",
          unread: true,
        },
        ...prev,
      ]);
    }
  }, [backendMode, user.name]);

  // ── Notifications ──────────────────────────────────────────────────────

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markNotificationRead = useCallback(async (id: number) => {
    if (backendMode === "mysql") {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, [backendMode]);

  const markAllNotificationsRead = useCallback(async () => {
    if (backendMode === "mysql") {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, [backendMode]);

  // ── Admin ──────────────────────────────────────────────────────────────

  const approveSettlement = useCallback(async (id: number) => {
    if (backendMode === "mysql") {
      await fetch("/api/settlements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "Approved" as SettlementStatus } : s
      )
    );
  }, [backendMode]);

  // ── Value ──────────────────────────────────────────────────────────────

  const value: AppState = {
    isLoggedIn,
    user,
    login,
    loginWithPassword,
    logout,
    backendMode,
    loading,
    wallet,
    transactions,
    processPayment,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    members,
    merchantInfo,
    merchantCustomers,
    settlements,
    adminKPIs,
    blockchainAudit,
    approveSettlement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
