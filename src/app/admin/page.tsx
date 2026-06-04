"use client";

import { motion } from "framer-motion";
import { Users, Store, CreditCard, ArrowLeftRight, Clock, TrendingUp, BarChart3, Shield } from "lucide-react";
import KPICard from "@/components/KPICard";

const settlements = [
  { id: 1, merchant: "ABC Design Studio", period: "Oct 2024", redeemed: "HKD 3,840", amount: "HKD 3,648", status: "Pending" },
  { id: 2, merchant: "XYZ Photography", period: "Oct 2024", redeemed: "HKD 2,100", amount: "HKD 1,995", status: "Approved" },
  { id: 3, merchant: "DEF Consulting", period: "Sep 2024", redeemed: "HKD 4,500", amount: "HKD 4,275", status: "Paid" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="px-5 pt-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-sm text-text-muted">LEN Head Office</p>
          <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <KPICard title="Total Members" value="1,247" icon={Users} trend="+3.2%" trendUp={true} />
          <KPICard title="Active Merchants" value="86" icon={Store} trend="+5" trendUp={true} />
          <KPICard title="Credits Issued" value="HKD 580K" icon={CreditCard} trend="+12%" trendUp={true} />
          <KPICard title="Credits Redeemed" value="HKD 342K" icon={ArrowLeftRight} trend="+8%" trendUp={true} />
          <KPICard title="Outstanding" value="HKD 45K" icon={Clock} trend="-4%" trendUp={false} />
          <KPICard title="Renewal Rate" value="78%" icon={TrendingUp} trend="+2%" trendUp={true} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text">Settlement Queue</h3>
            <button className="text-xs text-primary font-medium">Export All</button>
          </div>

          <div className="space-y-2">
            {settlements.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-text">{s.merchant}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    s.status === "Pending" ? "bg-warning/10 text-warning" :
                    s.status === "Approved" ? "bg-primary/10 text-primary" :
                    "bg-success/10 text-success"
                  }`}>
                    {s.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-text-muted">Period</p>
                    <p className="font-medium text-text">{s.period}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Redeemed</p>
                    <p className="font-medium text-text">{s.redeemed}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Settlement</p>
                    <p className="font-medium text-success">{s.amount}</p>
                  </div>
                </div>
                {s.status === "Pending" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <button className="flex-1 h-8 bg-primary text-white rounded-lg text-xs font-medium">Approve</button>
                    <button className="flex-1 h-8 bg-card border border-border rounded-lg text-xs font-medium text-text">Export PDF</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text">Blockchain Audit</h3>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-success" />
              <span className="text-[10px] text-success font-medium">Polygon Verified</span>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Daily Hash</span>
                <code className="text-[10px] text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">0x7f3a...b2c1</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Polygon TX</span>
                <code className="text-[10px] text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">0x4e2d...8f9a</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Status</span>
                <span className="flex items-center gap-1 text-xs text-success font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Timestamp</span>
                <span className="text-xs text-text font-medium">2024-10-28 00:00 UTC</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
