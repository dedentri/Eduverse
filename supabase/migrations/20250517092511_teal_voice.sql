/*
  # Initial Database Schema

  1. New Tables
    - users (extends Supabase Auth)
      - id (uuid, from auth.users)
      - username (text)
      - name (text)
      - role (text)
      - is_active (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - model_config
      - id (uuid)
      - endpoint_url (text)
      - access_token (text)
      - chunk_size (integer)
      - chunk_overlap (integer)
      - use_cpu_or_gpu (text)
      - return_source_document (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)

    - subjects
      - id (uuid)
      - name (text)
      - created_at (timestamp)
      - updated_at (timestamp)

    - learning_materials
      - id (uuid) 
      - title (text)
      - file_path (text)
      - file_type (text)
      - file_size (bigint)
      - subject_id (uuid, references subjects)
      - teacher_id (uuid, references users)
      - created_at (timestamp)
      - updated_at (timestamp)

    - chats
      - id (uuid)
      - sender_id (uuid, references users)
      - receiver_id (uuid, references users)
      - message (text)
      - is_read (boolean)
      - created_at (timestamp)

    - activity_logs
      - id (uuid)
      - user_id (uuid, references users)
      - activity_type (text)
      - details (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each role
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Model configuration table
CREATE TABLE model_config (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint_url text NOT NULL,
  access_token text,
  chunk_size integer DEFAULT 500,
  chunk_overlap integer DEFAULT 50,
  use_cpu_or_gpu text DEFAULT 'CPU' CHECK (use_cpu_or_gpu IN ('CPU', 'GPU')),
  return_source_document boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subjects table
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Learning materials table
CREATE TABLE learning_materials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chats table
CREATE TABLE chats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activity logs table
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  details text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON users
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Model config policies
CREATE POLICY "Only admins can manage model config"
  ON model_config
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "All authenticated users can view model config"
  ON model_config
  FOR SELECT
  TO authenticated
  USING (true);

-- Subjects policies
CREATE POLICY "All authenticated users can view subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage subjects"
  ON subjects
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Learning materials policies
CREATE POLICY "Teachers can manage their own materials"
  ON learning_materials
  TO authenticated
  USING (
    teacher_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Students can view materials"
  ON learning_materials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('student', 'teacher', 'admin'))
  );

-- Chats policies
CREATE POLICY "Users can manage their own chats"
  ON chats
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Activity logs policies
CREATE POLICY "Users can view their own logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Teachers can view student logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );

-- Insert default subjects
INSERT INTO subjects (name) VALUES
  ('Bahasa Inggris'),
  ('Bahasa Indonesia'),
  ('Matematika'),
  ('IPA'),
  ('IPS'),
  ('Pendidikan Agama'),
  ('PPKN'),
  ('Seni Budaya');

-- Create default users (passwords will be set through Supabase Auth)
-- Note: In production, you would set these up through Supabase Auth UI or API
INSERT INTO users (id, username, name, role, is_active) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin', 'Admin User', 'admin', true),
  ('00000000-0000-0000-0000-000000000002', 'teacher', 'Teacher User', 'teacher', true),
  ('00000000-0000-0000-0000-000000000003', 'student', 'Student User', 'student', true);

-- Insert default model config
INSERT INTO model_config (endpoint_url, chunk_size, chunk_overlap, use_cpu_or_gpu) VALUES
  ('https://api.example.com/v1/chat', 500, 50, 'CPU');