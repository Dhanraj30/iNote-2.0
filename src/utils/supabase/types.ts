export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: number;
          userId: string;
          name: string;
          createdAt: string;
          content: Json | null;
        };
        Insert: {
          id?: number;
          userId: string;
          name: string;
          createdAt?: string;
          content?: Json | null;
        };
        Update: {
          id?: number;
          userId?: string;
          name?: string;
          createdAt?: string;
          content?: Json | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};