"use client";

import { motion } from "framer-motion";
import { Users, Store, CreditCard, ArrowLeftRight, Clock, TrendingUp, Shield } from "lucide-react";
import KPICard from "@/components/KPICard";
import { useApp } from "@/lib/app-context";

export default function AdminPage() {
  const { settlements, adminKPIs, blockchainAudit, approveSettlement } = useApp();

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
          <KPICard title="Total Members" value={adminKPIs.totalMembers} icon={Users} trend="+3.2%" trendUp={true} />
          <KPICard title="Active Merchants" value={adminKPIs.activeMerchants} icon={Store} trend="+5" trendUp={true} />
          <KPICard title="Credits Issued" value={adminKPIs.creditsIssued} icon={CreditCard} trend="+12%" trendUp={true} />
          <KPICard title="Credits Redeemed" value={adminKPIs.creditsRedeemed} icon={ArrowLeftRight} trend="+8%" trendUp={true} />
          <KPICard title="Outstanding" value={adminKPIs.outstanding} icon={Clock} trend="-4%" trendUp={false} />
          <KPICard title="Renewal Rate" value={adminKPIs.renewalRate} icon={TrendingUp} trend="+2%" trendUp={true} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text">Settlement Queue</h3>
            <button
              onClick={() => {
                const data = settlements.map(s => `${s.merchant},${s.period},${s.redeemed},${s.amount},${s.status}`).join("\n");
                const blob = new Blob([`Merchant,Period,Redeemed,Settlement,Status\n${data}`], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "settlements.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-xs text-primary font-medium"
            >
              Export All
            </button>
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
                    <button
                      onClick={() => approveSettlement(s.id)}
                      className="flex-1 h-8 bg-primary text-white rounded-lg text-xs font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const content = `Settlement Report\n\nMerchant: ${s.merchant}\nPeriod: ${s.period}\nRedeemed: ${s.redeemed}\nSettlement: ${s.amount}\nStatus: ${s.status}`;
                        const blob = new Blob([content], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `settlement-${s.merchant.replace(/\s+/g, "-")}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex-1 h-8 bg-card border border-border rounded-lg text-xs font-medium text-text"
                    >
                      Export PDF
                    </button>
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
                <code className="text-[10px] text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">{blockchainAudit.dailyHash}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Polygon TX</span>
                <code className="text-[10px] text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">{blockchainAudit.polygonTx}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Status</span>
                <span className="flex items-center gap-1 text-xs text-success font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> {blockchainAudit.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Timestamp</span>
                <span className="text-xs text-text font-medium">{blockchainAudit.timestamp}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
