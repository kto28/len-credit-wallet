"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Wallet, QrCode, Users, Bell, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: QrCode, label: "Pay", path: "/pay" },
  { icon: Users, label: "Directory", path: "/directory" },
  { icon: Bell, label: "Alerts", path: "/notifications" },
  { icon: UserCircle, label: "ME", path: "/me" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
          const showBadge = item.path === "/notifications" && unreadCount > 0;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-14 rounded-xl transition-colors",
                isActive ? "text-primary" : "text-text-muted"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/5 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative">
                <item.icon className={cn("w-5 h-5 relative z-10", isActive && "stroke-[2.5px]")} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center z-20">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
