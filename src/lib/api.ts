import { supabase } from './supabaseClient';
import { Database } from './database.types';

type Dietitian = Database['public']['Tables']['dietitians']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];
type FoodItem = Database['public']['Tables']['food_items']['Row'];
type AlternativeProduct = Database['public']['Tables']['alternative_products']['Row'];
type DietPlan = Database['public']['Tables']['diet_plans']['Row'];
type DietPlanItem = Database['public']['Tables']['diet_plan_items']['Row'];
type MealLog = Database['public']['Tables']['meal_logs']['Row'];
type MealLogItem = Database['public']['Tables']['meal_log_items']['Row'];
type Appointment = Database['public']['Tables']['appointments']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

export const api = {
  // Dietitians
  getDietitians: async () => {
    const { data, error } = await supabase.from('dietitians').select('*');
    if (error) throw error;
    return data as Dietitian[];
  },
  
  // Clients
  getClients: async () => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw error;
    return data as Client[];
  },
  
  getClientById: async (id: string) => {
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Client;
  },

  // Food Database
  getFoodItems: async () => {
    const { data, error } = await supabase.from('food_items').select('*');
    if (error) throw error;
    return data as FoodItem[];
  },

  getAlternativeProducts: async (foodId?: string) => {
    let query = supabase.from('alternative_products').select('*, food_items(*)');
    if (foodId) {
      query = query.eq('food_id', foodId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Diet Plans
  getDietPlans: async (clientId?: string) => {
    let query = supabase.from('diet_plans').select('*, diet_plan_items(*, food_items(*))');
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Meal Logs
  getMealLogs: async (clientId?: string) => {
    let query = supabase.from('meal_logs').select('*, meal_log_items(*)');
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  createMealLog: async (log: Omit<MealLog, 'id' | 'created_at'>, items: Omit<MealLogItem, 'id' | 'meal_log_id' | 'created_at'>[]) => {
    const { data: logData, error: logError } = await supabase.from('meal_logs').insert(log).select().single();
    if (logError) throw logError;

    if (items.length > 0) {
      const itemsToInsert = items.map(item => ({ ...item, meal_log_id: logData.id }));
      const { error: itemsError } = await supabase.from('meal_log_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;
    }
    
    return logData;
  },

  // Appointments
  getAppointments: async (clientId?: string) => {
    let query = supabase.from('appointments').select('*');
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as Appointment[];
  },

  // Payments
  getPayments: async (clientId?: string) => {
    let query = supabase.from('payments').select('*');
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as Payment[];
  }
};
