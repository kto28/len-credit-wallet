"use client";

import { motion } from "framer-motion";
import { Search, Phone, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const members = [
  { id: 1, name: "Alice Wong", business: "ABC Design Studio", category: "Creative Services", chapter: "Central", photo: "AW" },
  { id: 2, name: "Bob Lee", business: "XYZ Photography", category: "Photography", chapter: "Kowloon", photo: "BL" },
  { id: 3, name: "Charlie Ng", business: "DEF Consulting", category: "Business Consulting", chapter: "Central", photo: "CN" },
  { id: 4, name: "Diana Cheung", business: "GHI Marketing", category: "Digital Marketing", chapter: "Wan Chai", photo: "DC" },
  { id: 5, name: "Edward Lam", business: "JKL Legal", category: "Legal Services", chapter: "Admiralty", photo: "EL" },
  { id: 6, name: "Fiona Ho", business: "MNO Finance", category: "Financial Advisory", chapter: "Central", photo: "FH" },
];

const categories = ["All", "Creative", "Consulting", "Marketing", "Legal", "Finance"];

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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

        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-card border border-border text-text-muted"
              }`}
            >
              {cat}
            </button>
          ))}
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
                  <p className="text-xs text-text-muted">{member.business}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-primary/5 text-primary rounded-full font-medium">
                      {member.category}
                    </span>
                    <span className="text-[10px] text-text-muted">{member.chapter}</span>
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
