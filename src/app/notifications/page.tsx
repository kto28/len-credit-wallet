"use client";

import { motion } from "framer-motion";
import { CreditCard, Clock, AlertTriangle, CheckCircle, CalendarDays } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";

const notifications = [
  { id: 1, title: "Credit Issued", desc: "HKD 480 renewal credit added to your wallet", time: "2h ago", icon: CreditCard, color: "text-success", bg: "bg-success/10", unread: true },
  { id: 2, title: "Renewal Reminder", desc: "Your membership expires in 30 days", time: "1d ago", icon: Clock, color: "text-warning", bg: "bg-warning/10", unread: true },
  { id: 3, title: "Credit Expiry Warning", desc: "HKD 50 credit expires in 7 days", time: "2d ago", icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10", unread: false },
  { id: 4, title: "Settlement Paid", desc: "March settlement of HKD 3,840 processed", time: "5d ago", icon: CheckCircle, color: "text-success", bg: "bg-success/10", unread: false },
  { id: 5, title: "Upcoming Event", desc: "LEN Monthly Mixer - 15 Nov at Central", time: "1w ago", icon: CalendarDays, color: "text-primary", bg: "bg-primary/5", unread: false },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          <button className="text-xs text-primary font-medium">Mark all read</button>
        </motion.div>

        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-start gap-3 p-4 bg-card rounded-xl border border-border",
                n.unread && "border-l-2 border-l-primary"
              )}
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", n.bg)}>
                <n.icon className={cn("w-4 h-4", n.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn("text-sm font-medium", n.unread ? "text-text" : "text-text-muted")}>{n.title}</p>
                  <span className="text-[10px] text-text-muted">{n.time}</span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">{n.desc}</p>
              </div>
              {n.unread && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
