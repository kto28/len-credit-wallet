// Database types matching the Supabase schema

export interface DbProfile {
  id: string;
  name: string;
  initials: string;
  mobile: string;
  email: string;
  membership_tier: string;
  role: "member" | "merchant" | "admin";
  created_at: string;
}

export interface DbWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_used: number;
  expiry: string;
  renewal_status: string;
  loyalty_credit: string;
  created_at: string;
}

export interface DbTransaction {
  id: number;
  user_id: string;
  title: string;
  amount: number;
  type: "earned" | "used" | "expired";
  status: string;
  created_at: string;
}

export interface DbNotification {
  id: number;
  user_id: string;
  title: string;
  description: string;
  icon_type: string;
  unread: boolean;
  created_at: string;
}

export interface DbMember {
  id: number;
  name: string;
  business: string;
  photo: string;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  created_at: string;
}

export interface DbSettlement {
  id: number;
  merchant: string;
  period: string;
  redeemed: string;
  amount: string;
  status: "Pending" | "Approved" | "Paid";
  created_at: string;
}
