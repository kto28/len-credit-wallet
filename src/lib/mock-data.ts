// ─── Types ──────────────────────────────────────────────────────────────────

export type UserRole = "member" | "merchant" | "admin";

export interface User {
  id: string;
  name: string;
  initials: string;
  mobile: string;
  email: string;
  membershipTier: string;
  role: UserRole;
}

export type TransactionType = "earned" | "used" | "expired";

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  date: string;
  type: TransactionType;
  status: string;
}

export interface WalletInfo {
  balance: number;
  totalEarned: number;
  totalUsed: number;
  expiry: string;
  renewalStatus: string;
  loyaltyCredit: string;
}

export interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  iconType: "credit" | "clock" | "warning" | "success" | "event";
  color: string;
  bg: string;
  unread: boolean;
}

export interface Member {
  id: number;
  name: string;
  business: string;
  photo: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  joinDate?: string;
  chapter?: string;
}

export interface MerchantCustomer {
  id: number;
  name: string;
  amount: number;
  date: string;
}

export interface MerchantInfo {
  name: string;
  pendingSettlement: string;
  transactions: string;
  customers: string;
  monthlyGrowth: string;
}

export type SettlementStatus = "Pending" | "Approved" | "Paid";

export interface Settlement {
  id: number;
  merchant: string;
  period: string;
  redeemed: string;
  amount: string;
  status: SettlementStatus;
}

export interface AdminKPIs {
  totalMembers: string;
  activeMerchants: string;
  creditsIssued: string;
  creditsRedeemed: string;
  outstanding: string;
  renewalRate: string;
}

export interface BlockchainAudit {
  dailyHash: string;
  polygonTx: string;
  status: string;
  timestamp: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

export const defaultUser: User = {
  id: "u-004",
  name: "Eddy To",
  initials: "ET",
  mobile: "97796855",
  email: "eddyto@gmail.com",
  membershipTier: "Gold Member",
  role: "member",
};

export const defaultWallet: WalletInfo = {
  balance: 500,
  totalEarned: 850,
  totalUsed: 350,
  expiry: "28 Oct 2027",
  renewalStatus: "Third Renewal",
  loyaltyCredit: "10% Loyalty Credit",
};

export const defaultTransactions: Transaction[] = [
  { id: 1, title: "ABC Design Studio", amount: -120, date: "Today, 2:30 PM", type: "used", status: "completed" },
  { id: 2, title: "LEN Renewal Credit", amount: 500, date: "18 Jun 2025", type: "earned", status: "completed" },
  { id: 3, title: "XYZ Photography", amount: -80, date: "15 Jun 2025", type: "used", status: "completed" },
  { id: 4, title: "Welcome Bonus", amount: 100, date: "13 Jun 2025", type: "earned", status: "completed" },
  { id: 5, title: "Referral Bonus", amount: 250, date: "6 Jun 2025", type: "earned", status: "completed" },
  { id: 6, title: "Expired Q2 Credit", amount: -150, date: "20 May 2025", type: "expired", status: "expired" },
];

export const defaultNotifications: Notification[] = [
  { id: 1, title: "Credit Issued", desc: "HKD 480 renewal credit added to your wallet", time: "2h ago", iconType: "credit", color: "text-success", bg: "bg-success/10", unread: true },
  { id: 2, title: "Renewal Reminder", desc: "Your membership expires in 30 days", time: "1d ago", iconType: "clock", color: "text-warning", bg: "bg-warning/10", unread: true },
  { id: 3, title: "Credit Expiry Warning", desc: "HKD 50 credit expires in 7 days", time: "2d ago", iconType: "warning", color: "text-danger", bg: "bg-danger/10", unread: false },
  { id: 4, title: "Settlement Paid", desc: "March settlement of HKD 3,840 processed", time: "5d ago", iconType: "success", color: "text-success", bg: "bg-success/10", unread: false },
  { id: 5, title: "Upcoming Event", desc: "LEN Monthly Mixer - 15 Nov at Central", time: "1w ago", iconType: "event", color: "text-primary", bg: "bg-primary/5", unread: false },
];

export const defaultMembers: Member[] = [
  { id: 1, name: "Bryan Cheung", business: "人工智能辦公室應用", photo: "BC", phone: "91001001", whatsapp: "85291001001", website: "https://example.com" },
  { id: 2, name: "Eddy To", business: "保險及強積金 / 理財顧問", photo: "ET", phone: "97796855", whatsapp: "85297796855", website: "https://www.eddyto.com" },
  { id: 3, name: "Jacky Chiu", business: "營銷科技學院", photo: "JC", phone: "91001003", whatsapp: "85291001003", website: "https://example.com" },
  { id: 4, name: "Joseph Ng", business: "舞蹈治療", photo: "JN", phone: "91001004", whatsapp: "85291001004", website: "https://example.com" },
  { id: 5, name: "Miranda Mok", business: "基因抗衰老產品", photo: "MM", phone: "91001005", whatsapp: "85291001005", website: "https://example.com" },
  { id: 6, name: "Jason Li", business: "投資教育", photo: "JL", phone: "91001006", whatsapp: "85291001006", website: "https://example.com" },
  { id: 7, name: "Anita Cheung", business: "交友約會", photo: "AC", phone: "91001007", whatsapp: "85291001007", website: "https://example.com" },
  { id: 8, name: "Fanny Lam", business: "皮膚護理及減壓按摩服務", photo: "FL", phone: "91001008", whatsapp: "85291001008", website: "https://example.com" },
  { id: 9, name: "Horace Lai", business: "會計核數", photo: "HL", phone: "91001009", whatsapp: "85291001009", website: "https://example.com" },
  { id: 10, name: "Jenny Tse", business: "企業文化諮詢顧問", photo: "JT", phone: "91001010", whatsapp: "85291001010", website: "https://example.com" },
  { id: 11, name: "Marco Leung", business: "商舖地產代理", photo: "ML", phone: "91001011", whatsapp: "85291001011", website: "https://example.com" },
  { id: 12, name: "Fung Lo", business: "泰式到會服務 / 到會餐飲", photo: "FL", phone: "91001012", whatsapp: "85291001012", website: "https://example.com" },
  { id: 13, name: "Cathy Wong", business: "ERP 企業管理系統顧問", photo: "CW", phone: "91001013", whatsapp: "85291001013", website: "https://example.com" },
];

export const defaultMerchantInfo: MerchantInfo = {
  name: "ABC Design Studio",
  pendingSettlement: "HKD 3,840",
  transactions: "26",
  customers: "18",
  monthlyGrowth: "+15%",
};

export const defaultMerchantCustomers: MerchantCustomer[] = [
  { id: 1, name: "David Chan", amount: 480, date: "Today 2:30 PM" },
  { id: 2, name: "Emily Wong", amount: 200, date: "Today 11:00 AM" },
  { id: 3, name: "Frank Lau", amount: 350, date: "Yesterday 4:15 PM" },
  { id: 4, name: "Grace Ng", amount: 150, date: "Yesterday 10:00 AM" },
];

export const defaultSettlements: Settlement[] = [
  { id: 1, merchant: "ABC Design Studio", period: "Oct 2024", redeemed: "HKD 3,840", amount: "HKD 3,648", status: "Pending" },
  { id: 2, merchant: "XYZ Photography", period: "Oct 2024", redeemed: "HKD 2,100", amount: "HKD 1,995", status: "Approved" },
  { id: 3, merchant: "DEF Consulting", period: "Sep 2024", redeemed: "HKD 4,500", amount: "HKD 4,275", status: "Paid" },
];

export const defaultAdminKPIs: AdminKPIs = {
  totalMembers: "1,247",
  activeMerchants: "86",
  creditsIssued: "HKD 580K",
  creditsRedeemed: "HKD 342K",
  outstanding: "HKD 45K",
  renewalRate: "78%",
};

export const defaultBlockchainAudit: BlockchainAudit = {
  dailyHash: "0x7f3a...b2c1",
  polygonTx: "0x4e2d...8f9a",
  status: "Verified",
  timestamp: "2024-10-28 00:00 UTC",
};
