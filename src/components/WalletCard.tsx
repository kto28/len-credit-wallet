"use client";

import { motion } from "framer-motion";
import { CreditCard, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface WalletCardProps {
  balance: number;
  expiry: string;
  renewalStatus: string;
  loyaltyCredit: string;
}

export default function WalletCard({ balance, expiry, renewalStatus, loyaltyCredit }: WalletCardProps) {
  const [displayBalance, setDisplayBalance] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = balance / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= balance) {
        setDisplayBalance(balance);
        clearInterval(timer);
      } else {
        setDisplayBalance(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [balance]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl gradient-navy p-6 wallet-card-shadow"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-secondary" />
            <span className="text-white/70 text-sm font-medium">Available Credits</span>
          </div>
          <Shield className="w-4 h-4 text-success" />
        </div>

        <div className="mb-6">
          <motion.p
            className="text-4xl font-bold text-white tracking-tight"
            key={displayBalance}
          >
            HKD {displayBalance.toLocaleString()}
          </motion.p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-white/50 text-xs">Expiry</p>
            <p className="text-white/90 font-medium">{expiry}</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs">{renewalStatus}</p>
            <p className="text-secondary font-medium">{loyaltyCredit}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
