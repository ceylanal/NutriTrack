/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dietitian, Client, FoodItem, AlternativeProduct, DietPlan, MealLog, Appointment, Payment } from './types';

export const initialDietitians: Dietitian[] = [
  {
    DietitianID: 'D01',
    Name: 'Dr. Clara Rivers, PhD',
    Email: 'clara.rivers@nutritrack.com',
    Phone: '+90 532 999 8877'
  },
  {
    DietitianID: 'D02',
    Name: 'Marcus Vance, RD',
    Email: 'marcus.vance@nutritrack.com',
    Phone: '+90 533 888 7766'
  }
];

export const initialClients: Client[] = [
  {
    ClientID: 'C01',
    Name: 'Sarah Jenkins',
    Age: 28,
    Gender: 'Female',
    Weight: 68.5,
    Height: 165,
    Goal: 'Weight Loss & Healthy Eating',
    MedicalHistory: 'Mild iron deficiency, sensitive to gluten',
    Phone: '+90 532 111 2222',
    Email: 'sarah.j@example.com',
    DietitianID: 'D01'
  },
  {
    ClientID: 'C02',
    Name: 'Michael Brown',
    Age: 34,
    Gender: 'Male',
    Weight: 84.0,
    Height: 182,
    Goal: 'Muscle Gain & Performance',
    MedicalHistory: 'None. Lactose sensitive occasionally',
    Phone: '+90 533 333 4444',
    Email: 'michael.b88@example.com',
    DietitianID: 'D01'
  },
  {
    ClientID: 'C03',
    Name: 'Emma Watson',
    Age: 42,
    Gender: 'Female',
    Weight: 61.2,
    Height: 168,
    Goal: 'Cardiovascular Health Maintenance',
    MedicalHistory: 'Mild hypertension, lactose intolerance',
    Phone: '+90 544 555 6666',
    Email: 'emma.watson@example.com',
    DietitianID: 'D02'
  },
  {
    ClientID: 'C04',
    Name: 'Alice Smith',
    Age: 31,
    Gender: 'Female',
    Weight: 74.3,
    Height: 160,
    Goal: 'Weight Loss & Metabolism Boost',
    MedicalHistory: 'Thyroid underactive, controlled',
    Phone: '+90 532 777 8888',
    Email: 'alice.smith@example.com',
    DietitianID: 'D02'
  }
];

export const initialFoodDatabase: FoodItem[] = [
  { FoodID: 'F01', Name: 'Oatmeal (Raw Oats)', Calories: 150, Protein: 6, Carbs: 27, Fat: 3, DefaultPortion: '40g dry' },
  { FoodID: 'F02', Name: 'Grilled Chicken Breast', Calories: 165, Protein: 31, Carbs: 0, Fat: 3.6, DefaultPortion: '100g' },
  { FoodID: 'F03', Name: 'Brown Rice (Cooked)', Calories: 111, Protein: 2.6, Carbs: 23, Fat: 0.9, DefaultPortion: '100g' },
  { FoodID: 'F04', Name: 'Avocado', Calories: 160, Protein: 2, Carbs: 8.5, Fat: 14.7, DefaultPortion: '1/2 medium' },
  { FoodID: 'F05', Name: 'Salmon Fillet (Baked)', Calories: 208, Protein: 20, Carbs: 0, Fat: 13, DefaultPortion: '100g' },
  { FoodID: 'F06', Name: 'Greek Yogurt (Nonfat)', Calories: 59, Protein: 10, Carbs: 3.6, Fat: 0.4, DefaultPortion: '100g' },
  { FoodID: 'F07', Name: 'Almonds', Calories: 164, Protein: 6, Carbs: 6, Fat: 14, DefaultPortion: '28g / 23 units' },
  { FoodID: 'F08', Name: 'Banana', Calories: 89, Protein: 1.1, Carbs: 23, Fat: 0.3, DefaultPortion: '1 medium' },
  { FoodID: 'F09', Name: 'Whole Wheat Bread', Calories: 100, Protein: 4, Carbs: 19, Fat: 1.5, DefaultPortion: '1 slice / 40g' },
  { FoodID: 'F10', Name: 'Spinach (Raw)', Calories: 23, Protein: 2.9, Carbs: 3.6, Fat: 0.4, DefaultPortion: '100g' },
  { FoodID: 'F11', Name: 'Boiled Egg', Calories: 78, Protein: 6.3, Carbs: 0.6, Fat: 5.3, DefaultPortion: '1 large' },
  { FoodID: 'F12', Name: 'Olive Oil', Calories: 119, Protein: 0, Carbs: 0, Fat: 13.5, DefaultPortion: '1 tbsp / 13.5g' },
  { FoodID: 'F13', Name: 'Leit Cow Milk (Low Fat)', Calories: 120, Protein: 8, Carbs: 12, Fat: 5, DefaultPortion: '240ml' }
];

export const initialAlternativeProducts: AlternativeProduct[] = [
  {
    AltProductID: 'A01',
    FoodID: 'F13', // Refers to Leit Cow Milk
    Name: 'Unsweetened Almond Milk',
    Calories: 30,
    Protein: 1,
    Carbs: 1,
    Fat: 2.5,
    Notes: 'Lactose-free & Vegan. Saves 90 kcal per glass compared to whole milk'
  },
  {
    AltProductID: 'A02',
    FoodID: 'F02', // Refers to Grilled Chicken Breast
    Name: 'Firm Tofu (Pan-seared)',
    Calories: 144,
    Protein: 15,
    Carbs: 3,
    Fat: 8,
    Notes: 'High-protein plant-based substitution'
  },
  {
    AltProductID: 'A03',
    FoodID: 'F03', // Refers to Brown Rice
    Name: 'Sautéed Cauliflower Rice',
    Calories: 25,
    Protein: 2,
    Carbs: 5,
    Fat: 0.5,
    Notes: 'Keto-friendly, extremely low in carbohydrates. Great for strict weight loss'
  },
  {
    AltProductID: 'A04',
    FoodID: 'F09', // Refers to Whole Wheat Bread
    Name: 'Gluten-Free Bread (Schar)',
    Calories: 105,
    Protein: 2.5,
    Carbs: 20,
    Fat: 2,
    Notes: 'Celiac and gluten sensitive alternative'
  },
  {
    AltProductID: 'A05',
    FoodID: 'F06', // Refers to Greek Yogurt
    Name: 'Coconut Yogurt (Dairy-Free)',
    Calories: 80,
    Protein: 1.5,
    Carbs: 8,
    Fat: 5,
    Notes: 'Dairy-free, gut-friendly substitution with direct vegan probiotics'
  }
];

export const initialDietPlans: DietPlan[] = [
  {
    PlanID: 'P01',
    DietitianID: 'D01',
    ClientID: 'C01', // Sarah Jenkins
    PlanName: 'Metabolic Reboot Plan (Low Gluten)',
    StartDate: '2026-05-18',
    Calories: 1500,
    Protein: 95,
    Carbs: 150,
    Fat: 50,
    Items: [
      { id: 'item01', MealType: 'breakfast', FoodID: 'F01', Name: 'Oatmeal (Raw Oats)', PortionSize: '50g', Calories: 188, Protein: 7.5, Carbs: 34, Fat: 3.8 },
      { id: 'item02', MealType: 'breakfast', FoodID: 'F06', Name: 'Greek Yogurt (Nonfat)', PortionSize: '150g', Calories: 89, Protein: 15, Carbs: 5.4, Fat: 0.6 },
      { id: 'item03', MealType: 'breakfast', FoodID: 'F08', Name: 'Banana', PortionSize: '1 medium', Calories: 89, Protein: 1.1, Carbs: 23, Fat: 0.3 },
      { id: 'item04', MealType: 'lunch', FoodID: 'F02', Name: 'Grilled Chicken Breast', PortionSize: '150g', Calories: 248, Protein: 46.5, Carbs: 0, Fat: 5.4 },
      { id: 'item05', MealType: 'lunch', FoodID: 'F03', Name: 'Brown Rice (Cooked)', PortionSize: '120g', Calories: 133, Protein: 3.1, Carbs: 27.6, Fat: 1.1 },
      { id: 'item06', MealType: 'lunch', FoodID: 'F10', Name: 'Spinach (Raw)', PortionSize: '100g salad', Calories: 23, Protein: 2.9, Carbs: 3.6, Fat: 0.4 },
      { id: 'item07', MealType: 'lunch', FoodID: 'F12', Name: 'Olive Oil', PortionSize: '1 tbsp', Calories: 119, Protein: 0, Carbs: 0, Fat: 13.5 },
      { id: 'item08', MealType: 'snack', FoodID: 'F07', Name: 'Almonds', PortionSize: '28g', Calories: 164, Protein: 6, Carbs: 6, Fat: 14 },
      { id: 'item09', MealType: 'dinner', FoodID: 'F05', Name: 'Salmon Fillet (Baked)', PortionSize: '150g', Calories: 312, Protein: 30, Carbs: 0, Fat: 19.5 },
      { id: 'item10', MealType: 'dinner', FoodID: 'F10', Name: 'Spinach (Raw)', PortionSize: '150g steamed', Calories: 35, Protein: 4.4, Carbs: 5.4, Fat: 0.6 }
    ]
  },
  {
    PlanID: 'P02',
    DietitianID: 'D01',
    ClientID: 'C02', // Michael Brown
    PlanName: 'Lean Mass Hypertrophy Fuel',
    StartDate: '2026-05-15',
    Calories: 2600,
    Protein: 175,
    Carbs: 310,
    Fat: 70,
    Items: [
      { id: 'item11', MealType: 'breakfast', FoodID: 'F11', Name: 'Boiled Egg', PortionSize: '3 large', Calories: 234, Protein: 18.9, Carbs: 1.8, Fat: 15.9 },
      { id: 'item12', MealType: 'breakfast', FoodID: 'F09', Name: 'Whole Wheat Bread', PortionSize: '3 slices', Calories: 300, Protein: 12, Carbs: 57, Fat: 4.5 },
      { id: 'item13', MealType: 'breakfast', FoodID: 'F04', Name: 'Avocado', PortionSize: '1 whole', Calories: 320, Protein: 4, Carbs: 17, Fat: 29.4 },
      { id: 'item14', MealType: 'lunch', FoodID: 'F02', Name: 'Grilled Chicken Breast', PortionSize: '200g', Calories: 330, Protein: 62, Carbs: 0, Fat: 7.2 },
      { id: 'item15', MealType: 'lunch', FoodID: 'F03', Name: 'Brown Rice (Cooked)', PortionSize: '250g', Calories: 278, Protein: 6.5, Carbs: 57.5, Fat: 2.3 },
      { id: 'item16', MealType: 'snack', FoodID: 'F06', Name: 'Greek Yogurt (Nonfat)', PortionSize: '250g', Calories: 148, Protein: 25, Carbs: 9, Fat: 1 },
      { id: 'item17', MealType: 'snack', FoodID: 'F08', Name: 'Banana', PortionSize: '2 medium', Calories: 178, Protein: 2.2, Carbs: 46, Fat: 0.6 },
      { id: 'item18', MealType: 'dinner', FoodID: 'F05', Name: 'Salmon Fillet (Baked)', PortionSize: '200g', Calories: 416, Protein: 40, Carbs: 0, Fat: 26 }
    ]
  }
];

export const initialMealLogs: MealLog[] = [
  {
    LogID: 'L01',
    ClientID: 'C01', // Sarah Jenkins
    Date: '2026-05-18',
    MealType: 'breakfast',
    Notes: 'Felt very energized. Added organic berries on the side.',
    PhotoUrl: 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&q=80&w=400',
    LoggedAt: '2026-05-18T08:30:00Z',
    Items: [
      { id: 'mli1', Name: 'Oatmeal (Raw Oats)', Calories: 188, Protein: 7.5, Carbs: 34, Fat: 3.8, PortionSize: '50g' },
      { id: 'mli2', Name: 'Greek Yogurt (Nonfat)', Calories: 89, Protein: 15, Carbs: 5.4, Fat: 0.6, PortionSize: '150g' }
    ]
  },
  {
    LogID: 'L02',
    ClientID: 'C01', // Sarah Jenkins
    Date: '2026-05-18',
    MealType: 'lunch',
    Notes: 'Substituted standard cow milk with Almond Milk in the recipe.',
    PhotoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    LoggedAt: '2026-05-18T13:15:00Z',
    Items: [
      { id: 'mli3', Name: 'Grilled Chicken Breast', Calories: 248, Protein: 46.5, Carbs: 0, Fat: 5.4, PortionSize: '150g' },
      { id: 'mli4', Name: 'Unsweetened Almond Milk', Calories: 30, Protein: 1, Carbs: 1, Fat: 2.5, PortionSize: '240ml', IsAlternative: true }
    ]
  },
  {
    LogID: 'L03',
    ClientID: 'C02', // Michael Brown
    Date: '2026-05-19',
    MealType: 'breakfast',
    Notes: 'Huge breakfast before leg day.',
    PhotoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400',
    LoggedAt: '2026-05-19T07:45:00Z',
    Items: [
      { id: 'mli5', Name: 'Boiled Egg', Calories: 234, Protein: 18.9, Carbs: 1.8, Fat: 15.9, PortionSize: '3 large' },
      { id: 'mli6', Name: 'Whole Wheat Bread', Calories: 300, Protein: 12, Carbs: 57, Fat: 4.5, PortionSize: '3 slices' }
    ]
  }
];

export const initialAppointments: Appointment[] = [
  { AppointmentID: 'A901', ClientID: 'C01', Date: '2026-05-20', Time: '10:00', Status: 'scheduled' },
  { AppointmentID: 'A902', ClientID: 'C02', Date: '2026-05-20', Time: '11:30', Status: 'scheduled' },
  { AppointmentID: 'A903', ClientID: 'C03', Date: '2026-05-21', Time: '14:00', Status: 'scheduled' },
  { AppointmentID: 'A904', ClientID: 'C04', Date: '2026-05-18', Time: '09:30', Status: 'completed' },
  { AppointmentID: 'A905', ClientID: 'C01', Date: '2026-05-15', Time: '15:15', Status: 'completed' },
  { AppointmentID: 'A906', ClientID: 'C02', Date: '2026-05-12', Time: '16:00', Status: 'completed' }
];

export const initialPayments: Payment[] = [
  { PaymentID: 'PAY01', ClientID: 'C01', Amount: 120.00, PaymentDate: '2026-05-15', Status: 'success', Method: 'Credit Card (iyzico)' },
  { PaymentID: 'PAY02', ClientID: 'C02', Amount: 180.00, PaymentDate: '2026-05-14', Status: 'success', Method: 'Credit Card (iyzico)' },
  { PaymentID: 'PAY03', ClientID: 'C03', Amount: 120.00, PaymentDate: '2026-05-18', Status: 'success', Method: 'Credit Card (iyzico)' },
  { PaymentID: 'PAY04', ClientID: 'C04', Amount: 150.00, PaymentDate: '2026-05-19', Status: 'pending', Method: 'Credit Card (iyzico)' },
  { PaymentID: 'PAY05', ClientID: 'C01', Amount: 120.00, PaymentDate: '2026-04-15', Status: 'success', Method: 'Credit Card (iyzico)' },
  { PaymentID: 'PAY06', ClientID: 'C02', Amount: 180.00, PaymentDate: '2026-04-14', Status: 'success', Method: 'Credit Card (iyzico)' }
];
