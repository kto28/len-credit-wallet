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
  defaultMerchantInfo,
  defaultMerchantCustomers,
  defaultAdminKPIs,
  defaultBlockchainAudit,
} from "./mock-data";

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const emptyUser: User = { id: "", name: "", initials: "", mobile: "", email: "", membershipTier: "", role: "member" };
const emptyWallet: WalletInfo = { balance: 0, totalEarned: 0, totalUsed: 0, expiry: "", renewalStatus: "", loyaltyCredit: "" };

// ─── Context shape ──────────────────────────────────────────────────────────

interface AppState {
  // Auth
  isLoggedIn: boolean;
  user: User;
  sendOtp: (mobile: string, email: string) => Promise<{ error?: string }>;
  verifyOtp: (mobile: string, email: string, code: string) => Promise<{ error?: string }>;
  logout: () => void;
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
  const [user, setUser] = useState<User>(emptyUser);
  const [wallet, setWallet] = useState<WalletInfo>(emptyWallet);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [merchantInfo] = useState<MerchantInfo>(defaultMerchantInfo);
  const [merchantCustomers, setMerchantCustomers] = useState<MerchantCustomer[]>(defaultMerchantCustomers);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [adminKPIs] = useState<AdminKPIs>(defaultAdminKPIs);
  const [blockchainAudit] = useState<BlockchainAudit>(defaultBlockchainAudit);
  const [loading, setLoading] = useState(true);

  // ── Check existing session on mount ────────────────────────────────────

  useEffect(() => {
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
  }, []);

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

  const sendOtp = useCallback(async (mobile: string, email: string) => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Failed to send OTP" };
      return {};
    } catch {
      return { error: "Network error" };
    }
  }, []);

  const verifyOtp = useCallback(async (mobile: string, email: string, code: string) => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile, code }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Verification failed" };

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
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setUser(emptyUser);
    setWallet(emptyWallet);
    setTransactions([]);
    setNotifications([]);
  }, []);

  // ── Wallet / Payment ───────────────────────────────────────────────────

  const processPayment = useCallback(async (merchant: string, amount: number) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchant, amount }),
    });
    if (res.ok) {
      await loadData();
    }
  }, []);

  // ── Notifications ──────────────────────────────────────────────────────

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markNotificationRead = useCallback(async (id: number) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  // ── Admin ──────────────────────────────────────────────────────────────

  const approveSettlement = useCallback(async (id: number) => {
    await fetch("/api/settlements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "Approved" as SettlementStatus } : s
      )
    );
  }, []);

  // ── Value ──────────────────────────────────────────────────────────────

  const value: AppState = {
    isLoggedIn,
    user,
    sendOtp,
    verifyOtp,
    logout,
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
