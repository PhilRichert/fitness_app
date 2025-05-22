/*
  # Initial Schema Setup for Fitness Tracking App

  1. New Tables
    - `workouts`: Stores workout templates
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `created_at` (timestamptz)

    - `exercises`: Stores exercises within workouts
      - `id` (uuid, primary key)
      - `workout_id` (uuid, references workouts)
      - `name` (text)
      - `sets` (integer)
      - `reps` (integer)
      - `weight` (numeric)
      - `created_at` (timestamptz)

    - `workout_logs`: Stores completed workout sessions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `workout_id` (uuid, references workouts)
      - `completed_at` (timestamptz)

    - `weight_logs`: Stores user weight tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `weight` (numeric)
      - `recorded_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create workouts table
CREATE TABLE workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own workouts"
  ON workouts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create exercises table
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  sets integer NOT NULL,
  reps integer NOT NULL,
  weight numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage exercises in their workouts"
  ON exercises
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- Create workout_logs table
CREATE TABLE workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  workout_id uuid REFERENCES workouts NOT NULL,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own workout logs"
  ON workout_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create weight_logs table
CREATE TABLE weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  weight numeric NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own weight logs"
  ON weight_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);