-- Drop existing tables
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS meal_log_items CASCADE;
DROP TABLE IF EXISTS meal_logs CASCADE;
DROP TABLE IF EXISTS diet_plan_items CASCADE;
DROP TABLE IF EXISTS diet_plans CASCADE;
DROP TABLE IF EXISTS alternative_products CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS dietitians CASCADE;

-- Create tables
CREATE TABLE dietitians (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
  id VARCHAR(50) PRIMARY KEY,
  dietitian_id VARCHAR(50) REFERENCES dietitians(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  age INT,
  gender VARCHAR(50),
  weight NUMERIC,
  height NUMERIC,
  goal TEXT,
  medical_history TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_items (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fat NUMERIC NOT NULL,
  default_portion VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alternative_products (
  id VARCHAR(50) PRIMARY KEY,
  food_id VARCHAR(50) REFERENCES food_items(id),
  name VARCHAR(255) NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE diet_plans (
  id VARCHAR(50) PRIMARY KEY,
  dietitian_id VARCHAR(50) REFERENCES dietitians(id),
  client_id VARCHAR(50) REFERENCES clients(id),
  plan_name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fat NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE diet_plan_items (
  id VARCHAR(50) PRIMARY KEY,
  plan_id VARCHAR(50) REFERENCES diet_plans(id),
  meal_type VARCHAR(50) NOT NULL,
  food_id VARCHAR(50) REFERENCES food_items(id),
  portion_size VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meal_logs (
  id VARCHAR(50) PRIMARY KEY,
  client_id VARCHAR(50) REFERENCES clients(id),
  date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL,
  notes TEXT,
  photo_url TEXT,
  logged_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meal_log_items (
  id VARCHAR(50) PRIMARY KEY,
  meal_log_id VARCHAR(50) REFERENCES meal_logs(id),
  food_id VARCHAR(50) REFERENCES food_items(id),
  name VARCHAR(255) NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fat NUMERIC NOT NULL,
  portion_size VARCHAR(100) NOT NULL,
  is_alternative BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id VARCHAR(50) PRIMARY KEY,
  client_id VARCHAR(50) REFERENCES clients(id),
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id VARCHAR(50) PRIMARY KEY,
  client_id VARCHAR(50) REFERENCES clients(id),
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  method VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data
INSERT INTO dietitians (id, name, email, phone) VALUES 
('D01', 'Dr. Clara Rivers, PhD', 'clara.rivers@nutritrack.com', '+90 532 999 8877'),
('D02', 'Marcus Vance, RD', 'marcus.vance@nutritrack.com', '+90 533 888 7766');

INSERT INTO clients (id, dietitian_id, name, email, phone, age, gender, weight, height, goal, medical_history) VALUES 
('C01', 'D01', 'Sarah Jenkins', 'sarah.j@example.com', '+90 532 111 2222', 28, 'Female', 68.5, 165, 'Weight Loss & Healthy Eating', 'Mild iron deficiency, sensitive to gluten'),
('C02', 'D01', 'Michael Brown', 'michael.b88@example.com', '+90 533 333 4444', 34, 'Male', 84.0, 182, 'Muscle Gain & Performance', 'None. Lactose sensitive occasionally'),
('C03', 'D02', 'Emma Watson', 'emma.watson@example.com', '+90 544 555 6666', 42, 'Female', 61.2, 168, 'Cardiovascular Health Maintenance', 'Mild hypertension, lactose intolerance'),
('C04', 'D02', 'Alice Smith', 'alice.smith@example.com', '+90 532 777 8888', 31, 'Female', 74.3, 160, 'Weight Loss & Metabolism Boost', 'Thyroid underactive, controlled');

INSERT INTO food_items (id, name, calories, protein, carbs, fat, default_portion) VALUES 
('F01', 'Oatmeal (Raw Oats)', 150, 6, 27, 3, '40g dry'),
('F02', 'Grilled Chicken Breast', 165, 31, 0, 3.6, '100g'),
('F03', 'Brown Rice (Cooked)', 111, 2.6, 23, 0.9, '100g'),
('F04', 'Avocado', 160, 2, 8.5, 14.7, '1/2 medium'),
('F05', 'Salmon Fillet (Baked)', 208, 20, 0, 13, '100g'),
('F06', 'Greek Yogurt (Nonfat)', 59, 10, 3.6, 0.4, '100g'),
('F07', 'Almonds', 164, 6, 6, 14, '28g / 23 units'),
('F08', 'Banana', 89, 1.1, 23, 0.3, '1 medium'),
('F09', 'Whole Wheat Bread', 100, 4, 19, 1.5, '1 slice / 40g'),
('F10', 'Spinach (Raw)', 23, 2.9, 3.6, 0.4, '100g'),
('F11', 'Boiled Egg', 78, 6.3, 0.6, 5.3, '1 large'),
('F12', 'Olive Oil', 119, 0, 0, 13.5, '1 tbsp / 13.5g'),
('F13', 'Leit Cow Milk (Low Fat)', 120, 8, 12, 5, '240ml');

INSERT INTO alternative_products (id, food_id, name, calories, protein, carbs, fat, notes) VALUES 
('A01', 'F13', 'Unsweetened Almond Milk', 30, 1, 1, 2.5, 'Lactose-free & Vegan. Saves 90 kcal per glass compared to whole milk'),
('A02', 'F02', 'Firm Tofu (Pan-seared)', 144, 15, 3, 8, 'High-protein plant-based substitution'),
('A03', 'F03', 'Sautéed Cauliflower Rice', 25, 2, 5, 0.5, 'Keto-friendly, extremely low in carbohydrates. Great for strict weight loss'),
('A04', 'F09', 'Gluten-Free Bread (Schar)', 105, 2.5, 20, 2, 'Celiac and gluten sensitive alternative'),
('A05', 'F06', 'Coconut Yogurt (Dairy-Free)', 80, 1.5, 8, 5, 'Dairy-free, gut-friendly substitution with direct vegan probiotics');

INSERT INTO diet_plans (id, dietitian_id, client_id, plan_name, start_date, calories, protein, carbs, fat) VALUES 
('P01', 'D01', 'C01', 'Metabolic Reboot Plan (Low Gluten)', '2026-05-18', 1500, 95, 150, 50),
('P02', 'D01', 'C02', 'Lean Mass Hypertrophy Fuel', '2026-05-15', 2600, 175, 310, 70);

INSERT INTO diet_plan_items (id, plan_id, meal_type, food_id, portion_size) VALUES 
('item01', 'P01', 'breakfast', 'F01', '50g'),
('item02', 'P01', 'breakfast', 'F06', '150g'),
('item03', 'P01', 'breakfast', 'F08', '1 medium'),
('item04', 'P01', 'lunch', 'F02', '150g'),
('item05', 'P01', 'lunch', 'F03', '120g'),
('item06', 'P01', 'lunch', 'F10', '100g salad'),
('item07', 'P01', 'lunch', 'F12', '1 tbsp'),
('item08', 'P01', 'snack', 'F07', '28g'),
('item09', 'P01', 'dinner', 'F05', '150g'),
('item10', 'P01', 'dinner', 'F10', '150g steamed'),
('item11', 'P02', 'breakfast', 'F11', '3 large'),
('item12', 'P02', 'breakfast', 'F09', '3 slices'),
('item13', 'P02', 'breakfast', 'F04', '1 whole'),
('item14', 'P02', 'lunch', 'F02', '200g'),
('item15', 'P02', 'lunch', 'F03', '250g'),
('item16', 'P02', 'snack', 'F06', '250g'),
('item17', 'P02', 'snack', 'F08', '2 medium'),
('item18', 'P02', 'dinner', 'F05', '200g');

INSERT INTO meal_logs (id, client_id, date, meal_type, notes, photo_url, logged_at) VALUES 
('L01', 'C01', '2026-05-18', 'breakfast', 'Felt very energized. Added organic berries on the side.', 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&q=80&w=400', '2026-05-18 08:30:00'),
('L02', 'C01', '2026-05-18', 'lunch', 'Substituted standard cow milk with Almond Milk in the recipe.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', '2026-05-18 13:15:00'),
('L03', 'C02', '2026-05-19', 'breakfast', 'Huge breakfast before leg day.', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400', '2026-05-19 07:45:00');

INSERT INTO meal_log_items (id, meal_log_id, food_id, name, calories, protein, carbs, fat, portion_size, is_alternative) VALUES 
('mli1', 'L01', NULL, 'Oatmeal (Raw Oats)', 188, 7.5, 34, 3.8, '50g', FALSE),
('mli2', 'L01', NULL, 'Greek Yogurt (Nonfat)', 89, 15, 5.4, 0.6, '150g', FALSE),
('mli3', 'L02', NULL, 'Grilled Chicken Breast', 248, 46.5, 0, 5.4, '150g', FALSE),
('mli4', 'L02', NULL, 'Unsweetened Almond Milk', 30, 1, 1, 2.5, '240ml', TRUE),
('mli5', 'L03', NULL, 'Boiled Egg', 234, 18.9, 1.8, 15.9, '3 large', FALSE),
('mli6', 'L03', NULL, 'Whole Wheat Bread', 300, 12, 57, 4.5, '3 slices', FALSE);

INSERT INTO appointments (id, client_id, date, time, status) VALUES 
('A901', 'C01', '2026-05-20', '10:00', 'scheduled'),
('A902', 'C02', '2026-05-20', '11:30', 'scheduled'),
('A903', 'C03', '2026-05-21', '14:00', 'scheduled'),
('A904', 'C04', '2026-05-18', '09:30', 'completed'),
('A905', 'C01', '2026-05-15', '15:15', 'completed'),
('A906', 'C02', '2026-05-12', '16:00', 'completed');

INSERT INTO payments (id, client_id, amount, payment_date, status, method) VALUES 
('PAY01', 'C01', 120.00, '2026-05-15', 'success', 'Credit Card (iyzico)'),
('PAY02', 'C02', 180.00, '2026-05-14', 'success', 'Credit Card (iyzico)'),
('PAY03', 'C03', 120.00, '2026-05-18', 'success', 'Credit Card (iyzico)'),
('PAY04', 'C04', 150.00, '2026-05-19', 'pending', 'Credit Card (iyzico)'),
('PAY05', 'C01', 120.00, '2026-04-15', 'success', 'Credit Card (iyzico)'),
('PAY06', 'C02', 180.00, '2026-04-14', 'success', 'Credit Card (iyzico)');

-- =============================================
-- Disable Row Level Security (RLS) on all tables
-- This allows the anon key to read/write data.
-- For production, replace with proper RLS policies.
-- =============================================
ALTER TABLE dietitians DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE food_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plan_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_log_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
