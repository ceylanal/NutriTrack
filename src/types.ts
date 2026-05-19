/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Dietitian {
  DietitianID: string;
  Name: string;
  Email: string;
  Phone: string;
}

export interface Client {
  ClientID: string;
  Name: string;
  Age: number;
  Gender: string;
  Weight: number; // in kg
  Height: number; // in cm
  Goal: string;
  MedicalHistory: string;
  Phone: string;
  DietitianID?: string;
  Email?: string;
}

export interface DietPlanItem {
  id: string; // internal React key
  MealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  FoodID: string;
  Name: string;
  PortionSize: string; // e.g. "1 medium", "150g"
  Calories: number;
  Protein: number;
  Carbs: number;
  Fat: number;
}

export interface DietPlan {
  PlanID: string;
  DietitianID: string;
  ClientID: string;
  PlanName: string;
  StartDate: string;
  Calories: number;
  Protein: number; // Target total Protein
  Carbs: number;   // Target total Carbs
  Fat: number;     // Target total Fat
  Items: DietPlanItem[];
}

export interface MealLogItem {
  id: string;
  Name: string;
  Calories: number;
  Protein: number;
  Carbs: number;
  Fat: number;
  PortionSize: string;
  IsAlternative?: boolean;
}

export interface MealLog {
  LogID: string;
  ClientID: string;
  Date: string; // YYYY-MM-DD
  MealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  Notes: string;
  PhotoUrl?: string; // Optional image upload
  Items: MealLogItem[];
  LoggedAt: string; // Timestamp
}

export interface Appointment {
  AppointmentID: string;
  ClientID: string;
  Date: string; // YYYY-MM-DD
  Time: string; // HH:MM
  Status: 'scheduled' | 'completed' | 'canceled';
}

export interface Payment {
  PaymentID: string;
  ClientID: string;
  Amount: number;
  PaymentDate: string; // YYYY-MM-DD
  Status: 'success' | 'pending' | 'failed' | 'refunded';
  Method: string; // e.g. "Credit Card (iyzico)", "Bank Transfer"
}

export interface FoodItem {
  FoodID: string;
  Name: string;
  Calories: number;
  Protein: number;
  Carbs: number;
  Fat: number;
  DefaultPortion?: string;
}

export interface AlternativeProduct {
  AltProductID: string;
  FoodID: string; // Links to the original FoodID
  Name: string;
  Calories: number;
  Notes: string;
  Protein?: number;
  Carbs?: number;
  Fat?: number;
}

export type UserRole = 'dietitian' | 'client' | 'assistant' | 'admin';
