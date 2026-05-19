import { Client } from 'pg';
import * as dotenv from 'dotenv';
import {
  initialDietitians,
  initialClients,
  initialFoodDatabase,
  initialAlternativeProducts,
  initialDietPlans,
  initialMealLogs,
  initialAppointments,
  initialPayments
} from './src/mockData';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || `postgres://postgres.tvctqwxghifabguczelj:${process.env.SUPABASE_DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

const client = new Client({
  connectionString: dbUrl,
});

async function seed() {
  await client.connect();
  console.log('Connected to database.');

  try {
    console.log('Dropping existing tables if any...');
    await client.query(`
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
    `);

    console.log('Creating tables...');
    await client.query(`
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
    `);
    
    console.log('Tables created. Seeding data...');

    // Dietitians
    for (const d of initialDietitians) {
      await client.query(
        'INSERT INTO dietitians (id, name, email, phone) VALUES ($1, $2, $3, $4)',
        [d.DietitianID, d.Name, d.Email, d.Phone]
      );
    }

    // Clients
    for (const c of initialClients) {
      await client.query(
        'INSERT INTO clients (id, dietitian_id, name, email, phone, age, gender, weight, height, goal, medical_history) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [c.ClientID, c.DietitianID, c.Name, c.Email, c.Phone, c.Age, c.Gender, c.Weight, c.Height, c.Goal, c.MedicalHistory]
      );
    }

    // Food Items
    for (const f of initialFoodDatabase) {
      await client.query(
        'INSERT INTO food_items (id, name, calories, protein, carbs, fat, default_portion) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [f.FoodID, f.Name, f.Calories, f.Protein, f.Carbs, f.Fat, f.DefaultPortion]
      );
    }

    // Alternative Products
    for (const a of initialAlternativeProducts) {
      await client.query(
        'INSERT INTO alternative_products (id, food_id, name, calories, protein, carbs, fat, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [a.AltProductID, a.FoodID, a.Name, a.Calories, a.Protein, a.Carbs, a.Fat, a.Notes]
      );
    }

    // Diet Plans
    for (const p of initialDietPlans) {
      await client.query(
        'INSERT INTO diet_plans (id, dietitian_id, client_id, plan_name, start_date, calories, protein, carbs, fat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [p.PlanID, p.DietitianID, p.ClientID, p.PlanName, p.StartDate, p.Calories, p.Protein, p.Carbs, p.Fat]
      );
      for (const i of p.Items) {
        await client.query(
          'INSERT INTO diet_plan_items (id, plan_id, meal_type, food_id, portion_size) VALUES ($1, $2, $3, $4, $5)',
          [i.id, p.PlanID, i.MealType, i.FoodID, i.PortionSize]
        );
      }
    }

    // Meal Logs
    for (const ml of initialMealLogs) {
      await client.query(
        'INSERT INTO meal_logs (id, client_id, date, meal_type, notes, photo_url, logged_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [ml.LogID, ml.ClientID, ml.Date, ml.MealType, ml.Notes, ml.PhotoUrl, ml.LoggedAt]
      );
      for (const i of ml.Items) {
        // Need to resolve food_id. The mock log items just have 'Name', maybe we can just insert null for food_id if not mapped
        // In the mock, food_id isn't directly on MealLogItem but Name is. Wait, let's look at MealLogItem.
        // I will just insert NULL for food_id, since the schema allows it.
        await client.query(
          'INSERT INTO meal_log_items (id, meal_log_id, food_id, name, calories, protein, carbs, fat, portion_size, is_alternative) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          [i.id, ml.LogID, null, i.Name, i.Calories, i.Protein, i.Carbs, i.Fat, i.PortionSize, i.IsAlternative || false]
        );
      }
    }

    // Appointments
    for (const appt of initialAppointments) {
      await client.query(
        'INSERT INTO appointments (id, client_id, date, time, status) VALUES ($1, $2, $3, $4, $5)',
        [appt.AppointmentID, appt.ClientID, appt.Date, appt.Time, appt.Status]
      );
    }

    // Payments
    for (const pay of initialPayments) {
      await client.query(
        'INSERT INTO payments (id, client_id, amount, payment_date, status, method) VALUES ($1, $2, $3, $4, $5, $6)',
        [pay.PaymentID, pay.ClientID, pay.Amount, pay.PaymentDate, pay.Status, pay.Method]
      );
    }

    console.log('Seeding completed successfully.');

  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.end();
  }
}

seed();
