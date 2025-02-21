export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          location: string | null
          image_url: string | null
          category: string
          price: number
          capacity: number
          organizer_id: string
          is_virtual: boolean
          stream_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          location?: string | null
          image_url?: string | null
          category: string
          price: number
          capacity: number
          organizer_id: string
          is_virtual?: boolean
          stream_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          location?: string | null
          image_url?: string | null
          category?: string
          price?: number
          capacity?: number
          organizer_id?: string
          is_virtual?: boolean
          stream_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          event_id: string
          user_id: string
          payment_id: string | null
          payment_status: string
          ticket_type: string
          price: number
          qr_code: string | null
          is_used: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          payment_id?: string | null
          payment_status?: string
          ticket_type: string
          price: number
          qr_code?: string | null
          is_used?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          payment_id?: string | null
          payment_status?: string
          ticket_type?: string
          price?: number
          qr_code?: string | null
          is_used?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          event_id: string
          user_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          message?: string
          created_at?: string
        }
      }
      breakout_rooms: {
        Row: {
          id: string
          event_id: string
          name: string
          capacity: number
          stream_url: string | null
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          capacity: number
          stream_url?: string | null
          start_time: string
          end_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          capacity?: number
          stream_url?: string | null
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}