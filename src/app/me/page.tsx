"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Store, Banknote, RefreshCw, Delete } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const MERCHANT = "ABC Design Studio";

type MeStep = "input" | "qr";

export default function MePage() {
  const [step, setStep] = useState<MeStep>("input");
  const [amount, setAmount] = useState("");

  const numericAmount = parseInt(amount || "0", 10);
  const canGenerate = numericAmount > 0;

  const qrPayload = JSON.stringify({
    t: "LEN_PAY",
    m: MERCHANT,
    a: numericAmount,
    id: `LEN-${Date.now()}`,
  });

  const pressKey = (key: string) => {
    if (key === "del") {
      setAmount((a) => a.slice(0, -1));
      return;
    }
    setAmount((a) => {
      const next = (a + key).replace(/^0+/, "");
      if (next.length > 7) return a;
      return next;
    });
  };

  const reset = () => {
    setAmount("");
    setStep("input");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-text">Receive Credit</h1>
            <p className="text-sm text-text-muted">{MERCHANT}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-card rounded-2xl border border-border p-6 mb-5 text-center">
                <p className="text-sm text-text-muted mb-2 flex items-center justify-center gap-1.5">
                  <Banknote className="w-4 h-4" /> Credit Amount
                </p>
                <div className="flex items-end justify-center gap-1.5">
                  <span className="text-lg font-semibold text-text-muted mb-1">HKD</span>
                  <span className="text-5xl font-bold text-primary tabular-nums">
                    {numericAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
                  k === "" ? (
                    <div key={i} />
                  ) : (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => pressKey(k)}
                      className="h-14 bg-card border border-border rounded-xl flex items-center justify-center text-xl font-semibold text-text"
                    >
                      {k === "del" ? <Delete className="w-5 h-5 text-text-muted" /> : k}
                    </motion.button>
                  )
                )}
              </div>

              <motion.button
                whileTap={{ scale: canGenerate ? 0.98 : 1 }}
                disabled={!canGenerate}
                onClick={() => setStep("qr")}
                className="w-full h-14 bg-primary text-white rounded-xl font-semibold text-base shadow-lg shadow-primary/20 disabled:opacity-40"
              >
                Generate QR Code
              </motion.button>
            </motion.div>
          )}

          {step === "qr" && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div className="bg-card rounded-2xl border border-border p-6 w-full flex flex-col items-center mb-5">
                <p className="text-sm text-text-muted mb-1">Amount to receive</p>
                <p className="text-3xl font-bold text-primary mb-5">
                  HKD {numericAmount.toLocaleString()}
                </p>
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <QRCodeSVG
                    value={qrPayload}
                    size={220}
                    level="M"
                    fgColor="#0B1F3A"
                    bgColor="#FFFFFF"
                  />
                </div>
                <p className="text-xs text-text-muted mt-5 text-center max-w-[240px]">
                  Ask the LEN member to scan this code from the <span className="font-semibold text-text">Pay</span> screen
                </p>
              </div>

              <button
                onClick={reset}
                className="w-full h-12 bg-card border border-border rounded-xl text-sm font-medium text-text flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> New Amount
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
