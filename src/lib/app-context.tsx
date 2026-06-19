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
import { createClient } from "./supabase/client";
import type { DbProfile, DbWallet, DbTransaction, DbNotification, DbMember, DbSettlement } from "./supabase/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

const isSupabaseConfigured = () =>
  typeof window !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://YOUR_PROJECT.supabase.co";

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
  loginWithSupabase: (mobile: string, email: string) => Promise<{ error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ error?: string }>;
  logout: () => void;
  isSupabase: boolean;
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

  const isSupabase = isSupabaseConfigured();

  // ── Load Supabase session on mount ────────────────────────────────────

  useEffect(() => {
    if (!isSupabase) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const loadSession = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setIsLoggedIn(true);
          await loadUserData(authUser.id);
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setIsLoggedIn(true);
          await loadUserData(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setIsLoggedIn(false);
          setUser(defaultUser);
          setWallet(defaultWallet);
          setTransactions(defaultTransactions);
          setNotifications(defaultNotifications);
        }
      }
    );

    loadSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabase]);

  // ── Load user data from Supabase ──────────────────────────────────────

  const loadUserData = async (userId: string) => {
    const supabase = createClient();

    // Load profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single<DbProfile>();

    if (profile) {
      setUser({
        id: profile.id,
        name: profile.name,
        initials: profile.initials,
        mobile: profile.mobile,
        email: profile.email,
        membershipTier: profile.membership_tier,
        role: profile.role,
      });
    }

    // Load wallet
    const { data: walletData } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single<DbWallet>();

    if (walletData) {
      setWallet({
        balance: walletData.balance,
        totalEarned: walletData.total_earned,
        totalUsed: walletData.total_used,
        expiry: walletData.expiry,
        renewalStatus: walletData.renewal_status,
        loyaltyCredit: walletData.loyalty_credit,
      });
    }

    // Load transactions
    const { data: txData } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .returns<DbTransaction[]>();

    if (txData) {
      setTransactions(
        txData.map((t) => ({
          id: t.id,
          title: t.title,
          amount: t.amount,
          date: timeAgo(t.created_at),
          type: t.type,
          status: t.status,
        }))
      );
    }

    // Load notifications
    const { data: notifData } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .returns<DbNotification[]>();

    if (notifData) {
      setNotifications(
        notifData.map((n) => ({
          id: n.id,
          title: n.title,
          desc: n.description,
          time: timeAgo(n.created_at),
          iconType: n.icon_type as Notification["iconType"],
          color: "",
          bg: "",
          unread: n.unread,
        }))
      );
    }

    // Load members directory
    const { data: memberData } = await supabase
      .from("members")
      .select("*")
      .order("name")
      .returns<DbMember[]>();

    if (memberData) {
      setMembers(
        memberData.map((m) => ({
          id: m.id,
          name: m.name,
          business: m.business,
          photo: m.photo,
          phone: m.phone || undefined,
          whatsapp: m.whatsapp || undefined,
          website: m.website || undefined,
        }))
      );
    }

    // Load settlements
    const { data: settlData } = await supabase
      .from("settlements")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<DbSettlement[]>();

    if (settlData) {
      setSettlements(
        settlData.map((s) => ({
          id: s.id,
          merchant: s.merchant,
          period: s.period,
          redeemed: s.redeemed,
          amount: s.amount,
          status: s.status,
        }))
      );
    }
  };

  // ── Auth ────────────────────────────────────────────────────────────────

  const login = useCallback((mobile: string, email: string) => {
    setUser((prev) => ({ ...prev, mobile, email }));
    setIsLoggedIn(true);
  }, []);

  const loginWithSupabase = useCallback(async (mobile: string, email: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { mobile, name: "", initials: "" },
      },
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const logout = useCallback(async () => {
    if (isSupabase) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
  }, [isSupabase]);

  // ── Wallet / Payment ───────────────────────────────────────────────────

  const processPayment = useCallback(async (merchant: string, amount: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const dateStr = `Today, ${timeStr}`;

    if (isSupabase) {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Insert transaction
      await supabase.from("transactions").insert({
        user_id: authUser.id,
        title: merchant,
        amount: -amount,
        type: "used",
        status: "completed",
      });

      // Update wallet balance
      const { data: w } = await supabase
        .from("wallets")
        .select("balance, total_used")
        .eq("user_id", authUser.id)
        .single();
      if (w) {
        await supabase
          .from("wallets")
          .update({
            balance: (w as { balance: number; total_used: number }).balance - amount,
            total_used: (w as { balance: number; total_used: number }).total_used + amount,
          })
          .eq("user_id", authUser.id);
      }

      // Insert notification
      await supabase.from("notifications").insert({
        user_id: authUser.id,
        title: "Payment Sent",
        description: `HKD ${amount} credit used at ${merchant}`,
        icon_type: "credit",
        unread: true,
      });

      // Reload data
      await loadUserData(authUser.id);
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
  }, [isSupabase, user.name]);

  // ── Notifications ──────────────────────────────────────────────────────

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markNotificationRead = useCallback(async (id: number) => {
    if (isSupabase) {
      const supabase = createClient();
      await supabase.from("notifications").update({ unread: false }).eq("id", id);
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, [isSupabase]);

  const markAllNotificationsRead = useCallback(async () => {
    if (isSupabase) {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await supabase
          .from("notifications")
          .update({ unread: false })
          .eq("user_id", authUser.id);
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, [isSupabase]);

  // ── Admin ──────────────────────────────────────────────────────────────

  const approveSettlement = useCallback(async (id: number) => {
    if (isSupabase) {
      const supabase = createClient();
      await supabase
        .from("settlements")
        .update({ status: "Approved" })
        .eq("id", id);
    }
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "Approved" as SettlementStatus } : s
      )
    );
  }, [isSupabase]);

  // ── Value ──────────────────────────────────────────────────────────────

  const value: AppState = {
    isLoggedIn,
    user,
    login,
    loginWithSupabase,
    verifyOtp,
    logout,
    isSupabase,
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
