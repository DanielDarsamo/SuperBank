export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string;
          pin_hash?: string;
          role: 'client' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          pin_hash?: string;
          role?: 'client' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          pin_hash?: string;
          role?: 'client' | 'admin';
          updated_at?: string;
        };
      };
      account_applications: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          id_number: string;
          nuit: string;
          income_document_url?: string;
          id_document_url?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
          admin_notes?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          id_number?: string;
          nuit?: string;
          income_document_url?: string;
          id_document_url?: string;
          status?: 'pending' | 'approved' | 'rejected';
          updated_at?: string;
          admin_notes?: string;
        };
      };
      queue_entries: {
        Row: {
          id: string;
          user_id: string;
          branch_id: string;
          queue_number: number;
          status: 'waiting' | 'called' | 'being_served' | 'completed' | 'cancelled';
          service_type: string;
          created_at: string;
          updated_at: string;
          estimated_wait_time?: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          branch_id: string;
          queue_number?: number;
          status?: 'waiting' | 'called' | 'being_served' | 'completed' | 'cancelled';
          service_type: string;
          created_at?: string;
          updated_at?: string;
          estimated_wait_time?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          branch_id?: string;
          queue_number?: number;
          status?: 'waiting' | 'called' | 'being_served' | 'completed' | 'cancelled';
          service_type?: string;
          updated_at?: string;
          estimated_wait_time?: number;
        };
      };
      branches: {
        Row: {
          id: string;
          name: string;
          address: string;
          phone: string;
          current_queue_count: number;
          average_service_time: number;
          status: 'open' | 'closed';
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          phone: string;
          current_queue_count?: number;
          average_service_time?: number;
          status?: 'open' | 'closed';
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          phone?: string;
          current_queue_count?: number;
          average_service_time?: number;
          status?: 'open' | 'closed';
        };
      };
      faqs: {
        Row: {
          id: string;
          question_en: string;
          question_pt: string;
          answer_en: string;
          answer_pt: string;
          keyword: string;
          category: string;
        };
        Insert: {
          id?: string;
          question_en: string;
          question_pt: string;
          answer_en: string;
          answer_pt: string;
          keyword: string;
          category: string;
        };
        Update: {
          id?: string;
          question_en?: string;
          question_pt?: string;
          answer_en?: string;
          answer_pt?: string;
          keyword?: string;
          category?: string;
        };
      };
    };
  };
}