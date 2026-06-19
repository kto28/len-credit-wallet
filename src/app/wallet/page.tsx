"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, XCircle, Filter } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";

const filters = ["All", "Earned", "Used", "Expired"];

export default function WalletPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { wallet, transactions } = useApp();

  const filtered = activeFilter === "All"
    ? transactions
    : transactions.filter((t) => t.type === activeFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-text mb-6"
        >
          Credit Wallet
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-xl font-bold text-text">{wallet.balance}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Balance</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-xl font-bold text-success">{wallet.totalEarned}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Earned</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-xl font-bold text-text">{wallet.totalUsed}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Used</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-text-muted" />
          <div className="flex gap-1.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  activeFilter === f
                    ? "bg-primary text-white"
                    : "bg-card border border-border text-text-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  tx.type === "earned" && "bg-success/10",
                  tx.type === "used" && "bg-primary/5",
                  tx.type === "expired" && "bg-danger/10"
                )}>
                  {tx.type === "earned" && <ArrowDownLeft className="w-4 h-4 text-success" />}
                  {tx.type === "used" && <ArrowUpRight className="w-4 h-4 text-primary" />}
                  {tx.type === "expired" && <XCircle className="w-4 h-4 text-danger" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{tx.title}</p>
                  <p className="text-xs text-text-muted">{tx.date}</p>
                </div>
              </div>
              <span className={cn(
                "text-sm font-semibold",
                tx.type === "earned" && "text-success",
                tx.type === "used" && "text-text",
                tx.type === "expired" && "text-danger"
              )}>
                {tx.amount > 0 ? "+" : ""}HKD {Math.abs(tx.amount)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
