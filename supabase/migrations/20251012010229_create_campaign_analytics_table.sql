/*
  # Create Campaign Analytics Table

  1. New Tables
    - `campaign_analytics`
      - `id` (uuid, primary key)
      - `client_key` (text) - identifies which client the data belongs to
      - `total_reply_count` (integer) - total number of replies
      - `total_emails_sent_count` (integer) - total emails sent
      - `total_new_leads_contacted_count` (integer) - new leads contacted
      - `total_opportunities` (integer) - total opportunities
      - `total_opportunity_value` (numeric) - total opportunity value in dollars
      - `daily_analytics` (jsonb) - daily breakdown data
      - `created_at` (timestamptz) - when the record was created
      - `updated_at` (timestamptz) - when the record was last updated

  2. Security
    - Enable RLS on `campaign_analytics` table
    - Add policy for public inserts (webhook endpoint)
    - Add policy for public reads (dashboard display)
*/

CREATE TABLE IF NOT EXISTS campaign_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key text NOT NULL,
  total_reply_count integer DEFAULT 0,
  total_emails_sent_count integer DEFAULT 0,
  total_new_leads_contacted_count integer DEFAULT 0,
  total_opportunities integer DEFAULT 0,
  total_opportunity_value numeric DEFAULT 0,
  daily_analytics jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for webhooks"
  ON campaign_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read for dashboard"
  ON campaign_analytics
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_campaign_analytics_client_key ON campaign_analytics(client_key);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_created_at ON campaign_analytics(created_at DESC);