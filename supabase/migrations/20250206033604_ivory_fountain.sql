/*
  # Event Management System Schema

  1. New Tables
    - `profiles`
      - Extended user profile data
      - Linked to auth.users
    - `events`
      - Core event information
      - Supports virtual and physical events
    - `tickets`
      - Ticket management
      - Tracks purchases and attendance
    - `chat_messages`
      - Real-time chat for virtual events
    - `breakout_rooms`
      - Virtual event breakout sessions

  2. Security
    - RLS policies for all tables
    - Secure access patterns
    - Organizer-specific permissions
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE,
  full_name text,
  avatar_url text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text,
  image_url text,
  category text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  capacity integer NOT NULL,
  organizer_id uuid REFERENCES profiles(id),
  is_virtual boolean DEFAULT false,
  stream_url text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Organizers can manage their events"
  ON events FOR ALL
  USING (auth.uid() = organizer_id);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id),
  user_id uuid REFERENCES profiles(id),
  payment_id text,
  payment_status text DEFAULT 'pending',
  ticket_type text NOT NULL,
  price decimal(10,2) NOT NULL,
  qr_code text UNIQUE,
  is_used boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Event organizers can view event tickets"
  ON tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id),
  user_id uuid REFERENCES profiles(id),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat messages are viewable by event attendees"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.event_id = chat_messages.event_id
      AND tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send chat messages if they have a ticket"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.event_id = chat_messages.event_id
      AND tickets.user_id = auth.uid()
    )
  );

-- Create breakout_rooms table
CREATE TABLE IF NOT EXISTS breakout_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id),
  name text NOT NULL,
  capacity integer NOT NULL,
  stream_url text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE breakout_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Breakout rooms are viewable by event attendees"
  ON breakout_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.event_id = breakout_rooms.event_id
      AND tickets.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_breakout_rooms_updated_at
  BEFORE UPDATE ON breakout_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();