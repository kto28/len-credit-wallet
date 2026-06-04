"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Wallet, QrCode, Users, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: QrCode, label: "Pay", path: "/pay" },
  { icon: Users, label: "Directory", path: "/directory" },
  { icon: Bell, label: "Alerts", path: "/notifications" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-colors",
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
              <item.icon className={cn("w-5 h-5 relative z-10", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] mt-0.5 font-medium relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
