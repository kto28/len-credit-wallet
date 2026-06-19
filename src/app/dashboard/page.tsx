"use client";

import { motion } from "framer-motion";
import { QrCode, Send, Clock, Users, CalendarDays, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import WalletCard from "@/components/WalletCard";
import BottomNav from "@/components/BottomNav";
import { useApp } from "@/lib/app-context";

const quickActions = [
  { icon: QrCode, label: "Scan QR", path: "/pay", color: "bg-primary" },
  { icon: Send, label: "Pay Merchant", path: "/pay", color: "bg-secondary" },
  { icon: Clock, label: "History", path: "/wallet", color: "bg-success" },
  { icon: Users, label: "Directory", path: "/directory", color: "bg-primary-light" },
  { icon: CalendarDays, label: "Events", path: "/notifications", color: "bg-warning" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, wallet, transactions } = useApp();

  // Show latest 4 transactions
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6 gradient-navy">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-white/60 text-sm">Welcome Back</p>
            <h1 className="text-white text-xl font-bold">{user.name}</h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-secondary/20 text-secondary text-xs font-medium rounded-full">
              {user.membershipTier}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{user.initials}</span>
          </div>
        </motion.div>

        <WalletCard
          balance={wallet.balance}
          expiry={wallet.expiry}
          renewalStatus={wallet.renewalStatus}
          loyaltyCredit={wallet.loyaltyCredit}
        />
      </div>

      <div className="px-5 -mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 border border-border shadow-sm mb-6"
        >
          <h3 className="text-sm font-semibold text-text mb-3">Quick Actions</h3>
          <div className="grid grid-cols-5 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.path)}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-text-muted font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text">Recent Transactions</h3>
            <button
              onClick={() => router.push("/wallet")}
              className="text-xs text-primary font-medium flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentTransactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center justify-between p-3.5 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    tx.type === "earned" ? "bg-success/10" : "bg-primary/5"
                  }`}>
                    {tx.type === "earned" ? (
                      <Send className="w-4 h-4 text-success rotate-180" />
                    ) : (
                      <Send className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{tx.title}</p>
                    <p className="text-xs text-text-muted">{tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  tx.type === "earned" ? "text-success" : "text-text"
                }`}>
                  {tx.amount > 0 ? "+" : ""}HKD {Math.abs(tx.amount)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
