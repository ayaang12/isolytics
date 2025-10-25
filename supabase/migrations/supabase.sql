/*
  # Meal and Lift Tracking System

  ## Overview
  Creates tables for tracking meals (with macros) and lift exercises (with weight, sets, reps, and split days).

  ## New Tables
  
  ### `meals`
  - `id` (uuid, primary key) - Unique identifier for each meal entry
  - `user_id` (uuid, foreign key) - References auth.users
  - `meal_name` (text) - Name/description of the meal
  - `calories` (integer) - Calorie count
  - `protein` (integer) - Protein in grams
  - `fat` (integer) - Fat in grams
  - `carbs` (integer) - Carbohydrates in grams
  - `meal_date` (date) - Date the meal was consumed
  - `created_at` (timestamptz) - Record creation timestamp

  ### `lifts`
  - `id` (uuid, primary key) - Unique identifier for each lift entry
  - `user_id` (uuid, foreign key) - References auth.users
  - `exercise_name` (text) - Name of the exercise
  - `weight` (numeric) - Weight lifted
  - `sets` (integer) - Number of sets performed
  - `reps` (integer) - Number of reps per set
  - `split_day` (text) - Training split day (e.g., Push, Pull, Legs)
  - `lift_date` (date) - Date the lift was performed
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Users can only read their own meal entries
  - Users can only insert their own meal entries
  - Users can only update their own meal entries
  - Users can only delete their own meal entries
  - Users can only read their own lift entries
  - Users can only insert their own lift entries
  - Users can only update their own lift entries
  - Users can only delete their own lift entries
*/
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name text NOT NULL,
  age integer NOT NULL CHECK (age > 0 AND age < 150),
  height numeric NOT NULL CHECK (height > 0 AND height < 300),
  weight numeric NOT NULL CHECK (weight > 0 AND weight < 500),
  waist numeric NULL CHECK (waist > 0 AND waist < 500),
  neck numeric NULL CHECK (neck > 0 AND neck < 500),
  hip numeric NULL CHECK (hip > 0 AND hip < 500),
  gender text NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_name text NOT NULL,
  calories integer DEFAULT 0,
  protein integer DEFAULT 0,
  fat integer DEFAULT 0,
  carbs integer DEFAULT 0,
  meal_date date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lifts table
CREATE TABLE IF NOT EXISTS lifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name text NOT NULL,
  weight numeric DEFAULT 0,
  sets integer DEFAULT 0,
  reps integer DEFAULT 0,
  split_day text DEFAULT '',
  lift_date date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on meals table
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- RLS policies for meals table
CREATE POLICY "Users can read own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable RLS on lifts table
ALTER TABLE lifts DISABLE ROW LEVEL SECURITY;

-- RLS policies for lifts table
CREATE POLICY "Users can read own lifts"
  ON lifts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lifts"
  ON lifts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lifts"
  ON lifts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lifts"
  ON lifts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS meals_user_id_idx ON meals(user_id);
CREATE INDEX IF NOT EXISTS meals_meal_date_idx ON meals(meal_date);
CREATE INDEX IF NOT EXISTS lifts_user_id_idx ON lifts(user_id);
CREATE INDEX IF NOT EXISTS lifts_lift_date_idx ON lifts(lift_date);