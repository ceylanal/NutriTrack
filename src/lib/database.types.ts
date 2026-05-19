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
      dietitians: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          dietitian_id: string | null
          name: string
          email: string | null
          phone: string | null
          age: number | null
          gender: string | null
          weight: number | null
          height: number | null
          goal: string | null
          medical_history: string | null
          created_at: string
        }
        Insert: {
          id?: string
          dietitian_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          age?: number | null
          gender?: string | null
          weight?: number | null
          height?: number | null
          goal?: string | null
          medical_history?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          dietitian_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          age?: number | null
          gender?: string | null
          weight?: number | null
          height?: number | null
          goal?: string | null
          medical_history?: string | null
          created_at?: string
        }
      }
      food_items: {
        Row: {
          id: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          default_portion: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          default_portion?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          default_portion?: string | null
          created_at?: string
        }
      }
      alternative_products: {
        Row: {
          id: string
          food_id: string
          name: string
          calories: number
          protein: number | null
          carbs: number | null
          fat: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          food_id: string
          name: string
          calories: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          food_id?: string
          name?: string
          calories?: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      diet_plans: {
        Row: {
          id: string
          dietitian_id: string
          client_id: string
          plan_name: string
          start_date: string
          calories: number
          protein: number
          carbs: number
          fat: number
          created_at: string
        }
        Insert: {
          id?: string
          dietitian_id: string
          client_id: string
          plan_name: string
          start_date: string
          calories: number
          protein: number
          carbs: number
          fat: number
          created_at?: string
        }
        Update: {
          id?: string
          dietitian_id?: string
          client_id?: string
          plan_name?: string
          start_date?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          created_at?: string
        }
      }
      diet_plan_items: {
        Row: {
          id: string
          plan_id: string
          meal_type: string
          food_id: string
          portion_size: string
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          meal_type: string
          food_id: string
          portion_size: string
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          meal_type?: string
          food_id?: string
          portion_size?: string
          created_at?: string
        }
      }
      meal_logs: {
        Row: {
          id: string
          client_id: string
          date: string
          meal_type: string
          notes: string | null
          photo_url: string | null
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          date: string
          meal_type: string
          notes?: string | null
          photo_url?: string | null
          logged_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          date?: string
          meal_type?: string
          notes?: string | null
          photo_url?: string | null
          logged_at?: string
          created_at?: string
        }
      }
      meal_log_items: {
        Row: {
          id: string
          meal_log_id: string
          food_id: string | null
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          portion_size: string
          is_alternative: boolean
          created_at: string
        }
        Insert: {
          id?: string
          meal_log_id: string
          food_id?: string | null
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          portion_size: string
          is_alternative?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          meal_log_id?: string
          food_id?: string | null
          name?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          portion_size?: string
          is_alternative?: boolean
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          client_id: string
          date: string
          time: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          date: string
          time: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          date?: string
          time?: string
          status?: string
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          client_id: string
          amount: number
          payment_date: string
          status: string
          method: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          amount: number
          payment_date: string
          status?: string
          method: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          amount?: number
          payment_date?: string
          status?: string
          method?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
