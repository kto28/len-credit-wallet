"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Store, CreditCard, Banknote, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import BottomNav from "@/components/BottomNav";
import { useApp } from "@/lib/app-context";

type PayStep = "scan" | "confirm" | "success";

const SCANNER_ID = "len-qr-reader";

export default function PayPage() {
  const [step, setStep] = useState<PayStep>("scan");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { wallet, processPayment } = useApp();

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        if (scanner.isScanning) await scanner.stop();
        scanner.clear();
      } catch {
        /* ignore */
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const handleResult = (decoded: string) => {
    try {
      const data = JSON.parse(decoded);
      if (data?.t !== "LEN_PAY" || !data?.a) {
        setError("Not a valid LEN payment QR code.");
        return;
      }
      setMerchant(typeof data.m === "string" ? data.m : "LEN Merchant");
      setAmount(Number(data.a) || 0);
      stopScanner();
      setError("");
      setStep("confirm");
    } catch {
      setError("Could not read this QR code. Try again.");
    }
  };

  const startScan = async () => {
    setError("");
    setScanning(true);
    try {
      const scanner = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded) => handleResult(decoded),
        undefined
      );
    } catch {
      setError("Camera access denied or unavailable.");
      setScanning(false);
    }
  };

  const handleConfirmPayment = () => {
    processPayment(merchant, amount);
    setStep("success");
  };

  const resetFlow = async () => {
    await stopScanner();
    setMerchant("");
    setAmount(0);
    setError("");
    setStep("scan");
  };

  const creditApplied = Math.min(amount, wallet.balance);
  const remainingCash = Math.max(0, amount - wallet.balance);

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
              <div className="relative w-full aspect-square max-w-[300px] bg-black rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <div id={SCANNER_ID} className="w-full h-full [&_video]:object-cover" />
                {!scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card border-2 border-dashed border-border rounded-2xl">
                    <Camera className="w-14 h-14 text-primary/30" />
                    <p className="text-sm text-text-muted">Tap below to open camera</p>
                  </div>
                )}
                {scanning && (
                  <div className="pointer-events-none absolute inset-8 border-2 border-secondary/80 rounded-xl" />
                )}
              </div>

              {error && (
                <div className="w-full bg-danger/5 border border-danger/20 rounded-xl p-3 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-danger shrink-0" />
                  <p className="text-xs text-danger font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={scanning ? stopScanner : startScan}
                className="w-full h-13 bg-primary text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {scanning ? "Stop Camera" : "Scan Merchant QR"}
              </button>

              <p className="text-xs text-text-muted mt-3">
                Available credit: <span className="font-semibold text-primary">HKD {wallet.balance.toLocaleString()}</span>
              </p>
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
                    <p className="font-semibold text-text">{merchant}</p>
                    <p className="text-xs text-text-muted">LEN Merchant</p>
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
                    <span className="text-lg font-bold text-success">-HKD {creditApplied.toLocaleString()}</span>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">Remaining Cash</span>
                    <span className="text-xl font-bold text-primary">HKD {remainingCash.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {remainingCash === 0 ? (
                <div className="bg-success/5 border border-success/20 rounded-xl p-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-success" />
                  <p className="text-xs text-success font-medium">
                    Fully paid with LEN credit: HKD {creditApplied.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="bg-warning/5 border border-warning/20 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <p className="text-xs text-warning font-medium">
                    Insufficient credit. HKD {remainingCash.toLocaleString()} needs cash payment.
                  </p>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmPayment}
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
                HKD {amount.toLocaleString()} credit applied to {merchant}
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={resetFlow}
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
