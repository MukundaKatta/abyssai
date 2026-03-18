import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant";
          content: string;
          thinking: string | null;
          reasoning_tree: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: "user" | "assistant";
          content: string;
          thinking?: string | null;
          reasoning_tree?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          thinking?: string | null;
        };
      };
      benchmark_entries: {
        Row: {
          id: string;
          model_name: string;
          provider: string;
          source: string;
          metric: string;
          score: number;
          updated_at: string;
        };
        Insert: {
          model_name: string;
          provider: string;
          source: string;
          metric: string;
          score: number;
        };
        Update: {
          score?: number;
          updated_at?: string;
        };
      };
      papers: {
        Row: {
          id: string;
          title: string;
          authors: string;
          abstract: string;
          summary: string;
          url: string;
          source: string;
          published_at: string;
          created_at: string;
        };
        Insert: {
          title: string;
          authors: string;
          abstract: string;
          summary?: string;
          url: string;
          source: string;
          published_at: string;
        };
        Update: {
          summary?: string;
        };
      };
      downloads: {
        Row: {
          id: string;
          model_name: string;
          repo_url: string;
          file_name: string;
          file_size: number;
          sha256: string;
          status: "pending" | "downloading" | "verifying" | "complete" | "failed";
          progress: number;
          created_at: string;
        };
        Insert: {
          model_name: string;
          repo_url: string;
          file_name: string;
          file_size: number;
          sha256: string;
        };
        Update: {
          status?: string;
          progress?: number;
        };
      };
    };
  };
};
