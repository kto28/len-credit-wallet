# LEN Credit Wallet PWA

A premium mobile-first Progressive Web App (PWA) for the **LEN Business Network** — enabling members to receive renewal credits, spend credits with fellow members, and facilitating automatic settlement by LEN Head Office.

Powered by **ZYWRK**

---

## Overview

LEN Credit Wallet is a modern fintech-style wallet application designed for:

- **LEN Members** — View balance, spend credits, browse member directory
- **LEN Merchants** — Accept credit payments via QR, track settlements
- **LEN ELT Leaders** — Monitor network activity
- **LEN Head Office Administrators** — Manage members, merchants, settlements, and blockchain audit

---

## Features

| Feature | Description |
|---------|-------------|
| OTP Login | Mobile + Email OTP authentication |
| Credit Wallet | View balance, earned, used, and expired credits |
| QR Payment | Scan merchant QR, auto-apply credit, confirm payment |
| Merchant Portal | Create QR, track customers, view pending settlements |
| Admin Dashboard | KPI widgets, settlement queue, approve/export |
| Blockchain Audit | Polygon-verified daily transaction hashes |
| Member Directory | Search by industry, chapter, category |
| Notifications | In-app alerts for credits, renewals, settlements |
| PWA | Installable on iPhone & Android home screen |

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org) | React framework (App Router) |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & micro-interactions |
| [Lucide React](https://lucide.dev) | Icon library |

---

## Design System

| Token | Value |
|-------|-------|
| Primary | `#0B1F3A` (Deep Navy) |
| Secondary | `#D4AF37` (Gold) |
| Background | `#F8FAFC` |
| Success | `#16A34A` |
| Warning | `#F59E0B` |
| Danger | `#DC2626` |
| Font | Inter |
| Style | Minimal, Glassmorphism, Rounded Corners |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Login (Mobile + Email → OTP) |
| `/dashboard` | Member dashboard with wallet card |
| `/wallet` | Credit wallet with transaction timeline |
| `/pay` | QR scan → Confirm → Success payment flow |
| `/directory` | Member directory with search & filters |
| `/notifications` | In-app notification center |
| `/merchant` | Merchant portal (KPIs, QR, customers) |
| `/admin` | Admin dashboard (settlements, audit) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Demo Login

This is a UI prototype — no backend required.

- **Mobile:** Any number (e.g. `91234567`)
- **Email:** Any email (e.g. `demo@len.hk`)
- **OTP:** Any 6 digits (e.g. `123456`)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Login + OTP
│   ├── dashboard/        # Member dashboard
│   ├── wallet/           # Credit wallet
│   ├── pay/              # QR payment flow
│   ├── directory/        # Member directory
│   ├── notifications/    # Notification center
│   ├── merchant/         # Merchant portal
│   └── admin/            # Admin dashboard
├── components/
│   ├── BottomNav.tsx     # Bottom navigation bar
│   ├── WalletCard.tsx    # Animated wallet card
│   └── KPICard.tsx       # KPI metric card
└── lib/
    └── utils.ts          # Utility functions (cn)
```

---

## License

Private — LEN Business Network © 2024

---

**Powered by ZYWRK**
