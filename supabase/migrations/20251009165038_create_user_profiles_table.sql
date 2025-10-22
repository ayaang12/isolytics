/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `age` (integer)
      - `height` (numeric) - in centimeters
      - `weight` (numeric) - in kilograms
      - `waist` (numeric) - in centimeters
      - `neck` (numeric) - in centimeters
      - `hip` (numeric) - in centimeters
      - `gender` (text) - m or f
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to read their own profile
    - Add policy for users to insert their own profile
    - Add policy for users to update their own profile

  3. Important Notes
    - Each user can only have one profile
    - Profile data is private to each user
    - Height, weight, waist, neck, and hip use metric system for consistency
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
