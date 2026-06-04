"use client";

import { motion } from "framer-motion";
import { QrCode, Receipt, Building2, TrendingUp, Users, DollarSign, ChevronRight } from "lucide-react";
import KPICard from "@/components/KPICard";
import BottomNav from "@/components/BottomNav";

const recentCustomers = [
  { id: 1, name: "David Chan", amount: 480, date: "Today 2:30 PM" },
  { id: 2, name: "Emily Wong", amount: 200, date: "Today 11:00 AM" },
  { id: 3, name: "Frank Lau", amount: 350, date: "Yesterday 4:15 PM" },
  { id: 4, name: "Grace Ng", amount: 150, date: "Yesterday 10:00 AM" },
];

export default function MerchantPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-text">Merchant Portal</h1>
            <p className="text-sm text-text-muted">ABC Design Studio</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <KPICard title="Pending Settlement" value="HKD 3,840" icon={DollarSign} trend="+12%" trendUp={true} />
          <KPICard title="Transactions" value="26" icon={Receipt} trend="+8%" trendUp={true} />
          <KPICard title="Customers" value="18" icon={Users} trend="+5%" trendUp={true} />
          <KPICard title="Monthly Growth" value="+15%" icon={TrendingUp} trend="Good" trendUp={true} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="h-14 bg-primary text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <QrCode className="w-4 h-4" /> Create QR
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="h-14 bg-card border border-border rounded-xl font-semibold text-sm text-text flex items-center justify-center gap-2"
          >
            <Receipt className="w-4 h-4" /> Settlements
          </motion.button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text">Recent Customers</h3>
            <button className="text-xs text-primary font-medium flex items-center gap-0.5">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentCustomers.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3.5 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-navy flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">{c.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{c.name}</p>
                    <p className="text-xs text-text-muted">{c.date}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-success">+HKD {c.amount}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
