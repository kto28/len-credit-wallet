"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, ArrowRight, Shield, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, loginWithPassword, backendMode } = useApp();

  const isMysql = backendMode === "mysql";

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isMysql) {
      // MySQL mode: direct password login
      setVerifying(true);
      const result = await loginWithPassword(email, password);
      if (result.error) {
        setError(result.error);
        setVerifying(false);
        return;
      }
      router.push("/dashboard");
    } else {
      // Mock mode: OTP flow
      setStep("otp");
      startCountdown();
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      setVerifying(true);
      setTimeout(() => {
        login(mobile, email);
        router.push("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 gradient-navy rounded-2xl flex items-center justify-center mx-auto mb-4 wallet-card-shadow"
          >
            <span className="text-secondary font-bold text-xl">L</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-text">LEN Credit Wallet</h1>
          <p className="text-text-muted text-sm mt-1">Premium Business Network</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {!isMysql && (
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full h-13 pl-11 pr-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required={!isMysql}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-13 pl-11 pr-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              {isMysql && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-13 pl-11 pr-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              )}

              {error && (
                <p className="text-xs text-danger text-center">{error}</p>
              )}

              {verifying ? (
                <div className="flex justify-center py-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full h-13 bg-primary text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-light transition-colors"
                >
                  {isMysql ? "Login" : "Send OTP"}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}

              <div className="flex items-center justify-center gap-2 mt-6">
                <Shield className="w-3.5 h-3.5 text-success" />
                <span className="text-xs text-text-muted">End-to-end encrypted</span>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-lg font-semibold text-text">Verify OTP</h2>
                <p className="text-sm text-text-muted mt-1">
                  Sent to {mobile || "+852 ****"}
                </p>
              </div>

              <div className="flex gap-2.5 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                ))}
              </div>

              {verifying ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  />
                  <p className="text-sm text-text-muted">Verifying...</p>
                </motion.div>
              ) : (
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-text-muted">
                      Resend in <span className="font-semibold text-primary">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={() => startCountdown()}
                      className="text-sm font-semibold text-primary"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[11px] text-text-muted/60">Powered by <span className="font-semibold text-text-muted">ZYWRK</span></p>
      </div>
    </div>
  );
}
