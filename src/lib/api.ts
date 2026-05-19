import { supabase } from './supabaseClient';
import { Database } from './database.types';
import {
  Dietitian,
  Client,
  FoodItem,
  AlternativeProduct,
  DietPlan,
  DietPlanItem,
  MealLog,
  MealLogItem,
  Appointment,
  Payment
} from '../types';

export const api = {
  // Dietitians
  getDietitians: async (): Promise<Dietitian[]> => {
    const { data, error } = await supabase.from('dietitians').select('*');
    if (error) throw error;
    return (data || []).map(d => ({
      DietitianID: d.id,
      Name: d.name,
      Email: d.email,
      Phone: d.phone || ''
    }));
  },
  
  // Clients
  getClients: async (): Promise<Client[]> => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw error;
    return (data || []).map(c => ({
      ClientID: c.id,
      Name: c.name,
      Age: c.age || 0,
      Gender: c.gender || '',
      Weight: c.weight || 0,
      Height: c.height || 0,
      Goal: c.goal || '',
      MedicalHistory: c.medical_history || '',
      Phone: c.phone || '',
      DietitianID: c.dietitian_id || undefined,
      Email: c.email || undefined
    }));
  },

  // Food Database
  getFoodItems: async (): Promise<FoodItem[]> => {
    const { data, error } = await supabase.from('food_items').select('*');
    if (error) throw error;
    return (data || []).map(f => ({
      FoodID: f.id,
      Name: f.name,
      Calories: f.calories,
      Protein: f.protein,
      Carbs: f.carbs,
      Fat: f.fat,
      DefaultPortion: f.default_portion || undefined
    }));
  },

  getAlternativeProducts: async (foodId?: string): Promise<AlternativeProduct[]> => {
    let query = supabase.from('alternative_products').select('*');
    if (foodId) {
      query = query.eq('food_id', foodId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(a => ({
      AltProductID: a.id,
      FoodID: a.food_id,
      Name: a.name,
      Calories: a.calories,
      Protein: a.protein || undefined,
      Carbs: a.carbs || undefined,
      Fat: a.fat || undefined,
      Notes: a.notes || ''
    }));
  },

  // Diet Plans
  getDietPlans: async (clientId?: string): Promise<DietPlan[]> => {
    let query = supabase.from('diet_plans').select('*, diet_plan_items(*, food_items(*))');
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((p: any) => ({
      PlanID: p.id,
      DietitianID: p.dietitian_id,
      ClientID: p.client_id,
      PlanName: p.plan_name,
      StartDate: p.start_date,
      Calories: p.calories,
      Protein: p.protein,
      Carbs: p.carbs,
      Fat: p.fat,
      Items: (p.diet_plan_items || []).map((i: any): DietPlanItem => ({
        id: i.id,
        MealType: i.meal_type as any,
        FoodID: i.food_id,
        Name: i.food_items?.name || 'Unknown', // Needs manual mapping or join if not included, but currently we just fetch items
        PortionSize: i.portion_size,
        Calories: i.food_items?.calories || 0,
        Protein: i.food_items?.protein || 0,
        Carbs: i.food_items?.carbs || 0,
        Fat: i.food_items?.fat || 0
      }))
    }));
  },

  // Meal Logs
  getMealLogs: async (clientId?: string): Promise<MealLog[]> => {
    let query = supabase.from('meal_logs').select('*, meal_log_items(*)');
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((l: any) => ({
      LogID: l.id,
      ClientID: l.client_id,
      Date: l.date,
      MealType: l.meal_type as any,
      Notes: l.notes || '',
      PhotoUrl: l.photo_url || undefined,
      LoggedAt: l.logged_at,
      Items: (l.meal_log_items || []).map((i: any): MealLogItem => ({
        id: i.id,
        Name: i.name,
        Calories: i.calories,
        Protein: i.protein,
        Carbs: i.carbs,
        Fat: i.fat,
        PortionSize: i.portion_size,
        IsAlternative: i.is_alternative
      }))
    }));
  },

  createMealLog: async (log: Omit<MealLog, 'LogID' | 'LoggedAt'>, items: Omit<MealLogItem, 'id'>[]) => {
    const dbLog = {
      client_id: log.ClientID,
      date: log.Date,
      meal_type: log.MealType,
      notes: log.Notes,
      photo_url: log.PhotoUrl,
      logged_at: new Date().toISOString()
    };
    
    const { data: logData, error: logError } = await supabase.from('meal_logs').insert(dbLog).select().single();
    if (logError) throw logError;

    if (items.length > 0) {
      const itemsToInsert = items.map(item => ({
        meal_log_id: logData.id,
        name: item.Name,
        calories: item.Calories,
        protein: item.Protein,
        carbs: item.Carbs,
        fat: item.Fat,
        portion_size: item.PortionSize,
        is_alternative: item.IsAlternative || false
      }));
      const { error: itemsError } = await supabase.from('meal_log_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;
    }
    
    return logData;
  },

  // Appointments
  getAppointments: async (clientId?: string): Promise<Appointment[]> => {
    let query = supabase.from('appointments').select('*');
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(a => ({
      AppointmentID: a.id,
      ClientID: a.client_id,
      Date: a.date,
      Time: a.time,
      Status: a.status as any
    }));
  },

  // Payments
  getPayments: async (clientId?: string): Promise<Payment[]> => {
    let query = supabase.from('payments').select('*');
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(p => ({
      PaymentID: p.id,
      ClientID: p.client_id,
      Amount: p.amount,
      PaymentDate: p.payment_date,
      Status: p.status as any,
      Method: p.method
    }));
  }
};
