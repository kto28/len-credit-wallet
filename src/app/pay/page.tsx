"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Check, Store, CreditCard, Banknote } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

type PayStep = "scan" | "confirm" | "success";

export default function PayPage() {
  const [step, setStep] = useState<PayStep>("scan");
  const amount = 1000;
  const credit = 480;
  const remaining = amount - credit;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-text mb-6"
        >
          Pay
        </motion.h1>

        <AnimatePresence mode="wait">
          {step === "scan" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square max-w-[280px] bg-card border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <QrCode className="w-16 h-16 text-primary/30" />
                </motion.div>
                <p className="text-sm text-text-muted">Point camera at QR code</p>
              </div>

              <button
                onClick={() => setStep("confirm")}
                className="w-full h-13 bg-primary text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20"
              >
                Simulate QR Scan
              </button>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text">ABC Design Studio</p>
                    <p className="text-xs text-text-muted">Creative Services</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-muted">Amount</span>
                    </div>
                    <span className="text-lg font-bold text-text">HKD {amount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-text-muted">Apply Credit</span>
                    </div>
                    <span className="text-lg font-bold text-success">-HKD {credit}</span>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">Remaining Cash</span>
                    <span className="text-xl font-bold text-primary">HKD {remaining}</span>
                  </div>
                </div>
              </div>

              <div className="bg-success/5 border border-success/20 rounded-xl p-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-success" />
                <p className="text-xs text-success font-medium">
                  Using maximum available credit: HKD {credit}
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("success")}
                className="w-full h-14 bg-primary text-white rounded-xl font-semibold text-base shadow-lg shadow-primary/20"
              >
                Confirm Payment
              </motion.button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center pt-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-6"
              >
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-text mb-2"
              >
                Payment Successful
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-text-muted text-sm mb-8"
              >
                HKD {credit} credit applied to ABC Design Studio
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => setStep("scan")}
                className="px-6 h-11 bg-card border border-border rounded-xl text-sm font-medium text-text"
              >
                Done
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
