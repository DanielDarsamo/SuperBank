export interface User {
  id: string;
  phone: string;
  pin_hash?: string;
  role: 'client' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface AccountApplication {
  id: string;
  user_id: string;
  full_name: string;
  id_number: string;
  nuit: string;
  income_document_url?: string;
  id_document_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  admin_notes?: string;
}

export interface QueueEntry {
  id: string;
  user_id: string;
  branch_id: string;
  queue_number: number;
  status: 'waiting' | 'called' | 'being_served' | 'completed' | 'cancelled';
  service_type: string;
  created_at: string;
  updated_at: string;
  estimated_wait_time?: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  current_queue_count: number;
  average_service_time: number;
  status: 'open' | 'closed';
}

export interface BankingTransaction {
  id: string;
  user_id: string;
  type: 'balance' | 'transfer' | 'payment';
  amount?: number;
  recipient?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface FAQ {
  id: string;
  question_en: string;
  question_pt: string;
  answer_en: string;
  answer_pt: string;
  keyword: string;
  category: string;
}

export type Language = 'en' | 'pt';

export interface AppState {
  user: User | null;
  language: Language;
  isAuthenticated: boolean;
  currentQueue: QueueEntry | null;
}