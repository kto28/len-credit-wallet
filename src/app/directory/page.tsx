"use client";

import { motion } from "framer-motion";
import { Search, Phone, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const members = [
  { id: 1, name: "Bryan Cheung", business: "人工智能辦公室應用", photo: "BC" },
  { id: 2, name: "Eddy To", business: "保險及強積金 / 理財顧問", photo: "ET" },
  { id: 3, name: "Jacky Chiu", business: "營銷科技學院", photo: "JC" },
  { id: 4, name: "Joseph Ng", business: "舞蹈治療", photo: "JN" },
  { id: 5, name: "Miranda Mok", business: "基因抗衰老產品", photo: "MM" },
  { id: 6, name: "Jason Li", business: "投資教育", photo: "JL" },
  { id: 7, name: "Anita Cheung", business: "交友約會", photo: "AC" },
  { id: 8, name: "Fanny Lam", business: "皮膚護理及減壓按摩服務", photo: "FL" },
  { id: 9, name: "Horace Lai", business: "會計核數", photo: "HL" },
  { id: 10, name: "Jenny Tse", business: "企業文化諮詢顧問", photo: "JT" },
  { id: 11, name: "Marco Leung", business: "商舖地產代理", photo: "ML" },
  { id: 12, name: "Fung Lo", business: "泰式到會服務 / 到會餐飲", photo: "FL" },
  { id: 13, name: "Cathy Wong", business: "ERP 企業管理系統顧問", photo: "CW" },
];

export default function DirectoryPage() {
  const [search, setSearch] = useState("");

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.business.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-text mb-4"
        >
          Member Directory
        </motion.h1>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search members or businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full gradient-navy flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-semibold">{member.photo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text text-sm">{member.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] px-2 py-0.5 bg-primary/5 text-primary rounded-full font-medium">
                      {member.business}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button className="flex-1 h-9 bg-primary/5 text-primary rounded-lg text-xs font-medium flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Call
                </button>
                <button className="flex-1 h-9 bg-success/5 text-success rounded-lg text-xs font-medium flex items-center justify-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </button>
                <button className="flex-1 h-9 bg-secondary/10 text-secondary rounded-lg text-xs font-medium flex items-center justify-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Website
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
