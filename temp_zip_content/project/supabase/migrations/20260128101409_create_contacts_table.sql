/*
  # Create contacts table for contact form submissions

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key) - Unique identifier for each contact submission
      - `name` (text) - Name of the person contacting
      - `email` (text) - Email address for reply
      - `subject` (text) - Subject of the inquiry
      - `message` (text) - Message content
      - `gdpr_consent` (boolean) - GDPR consent checkbox status
      - `ip_address` (text, nullable) - IP address for security/spam prevention
      - `created_at` (timestamptz) - Timestamp of submission
      - `processed` (boolean) - Whether the inquiry has been handled
      - `notes` (text, nullable) - Internal notes for admin

  2. Security
    - Enable RLS on `contacts` table
    - Add policy for inserting new contact submissions (public access with rate limiting consideration)
    - No public read access (only admin should see submissions)
    
  3. Indexes
    - Index on `created_at` for sorting
    - Index on `processed` for filtering unprocessed inquiries

  ## GDPR Compliance Notes
  - `gdpr_consent` field ensures explicit consent is recorded
  - Data is kept only as long as necessary for processing inquiries
  - Users can request deletion of their data by contacting support
*/

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  gdpr_consent boolean NOT NULL DEFAULT false,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false,
  notes text
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert contact submissions (with GDPR consent)
-- This allows the public contact form to work
CREATE POLICY "Anyone can submit contact form"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (gdpr_consent = true);

-- Policy: Only authenticated users (admins) can read contacts
-- You'll need to add authentication later for admin access
CREATE POLICY "Only authenticated users can view contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update contacts (mark as processed, add notes)
CREATE POLICY "Only authenticated users can update contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_processed ON contacts(processed);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);