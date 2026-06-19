"use client";

import { motion } from "framer-motion";
import { CreditCard, Clock, AlertTriangle, CheckCircle, CalendarDays, Send } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  credit: { icon: CreditCard, color: "text-success", bg: "bg-success/10" },
  clock: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  warning: { icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10" },
  success: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  event: { icon: CalendarDays, color: "text-primary", bg: "bg-primary/5" },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-primary font-medium"
          >
            Mark all read
          </button>
        </motion.div>

        <div className="space-y-2">
          {notifications.map((n, i) => {
            const mapping = iconMap[n.iconType] || iconMap.credit;
            const Icon = mapping.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => n.unread && markNotificationRead(n.id)}
                className={cn(
                  "flex items-start gap-3 p-4 bg-card rounded-xl border border-border cursor-pointer",
                  n.unread && "border-l-2 border-l-primary"
                )}
              >
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", mapping.bg)}>
                  <Icon className={cn("w-4 h-4", mapping.color)} />
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
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
