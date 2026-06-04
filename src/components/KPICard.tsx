"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export default function KPICard({ title, value, icon: Icon, trend, trendUp, className }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card rounded-xl p-4 border border-border shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            trendUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          )}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-text tracking-tight">{value}</p>
      <p className="text-xs text-text-muted mt-0.5">{title}</p>
    </motion.div>
  );
}
