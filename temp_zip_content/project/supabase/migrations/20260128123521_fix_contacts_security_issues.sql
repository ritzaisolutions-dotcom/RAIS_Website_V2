/*
  # Fix Security Issues in Contacts Table

  ## Changes Made

  1. **Remove Unused Indexes**
     - Drop `idx_contacts_created_at` - not currently used by any queries
     - Drop `idx_contacts_processed` - not currently used by any queries
     - Drop `idx_contacts_email` - not currently used by any queries
     
     Note: These can be re-added later when an admin dashboard is implemented
     that actually queries using these fields.

  2. **Fix Overly Permissive RLS Policy**
     - Drop the `Only authenticated users can update contacts` policy that had
       `USING (true)` and `WITH CHECK (true)`, which allowed ANY authenticated
       user to update ANY contact record
     - Remove the overly permissive SELECT policy as well
     
     Note: Proper admin authentication with role-based access control should be
     implemented before re-enabling update capabilities. Consider using:
     - Custom claims in JWT tokens
     - A separate admin_users table with proper role checks
     - Service role key for backend admin operations only

  3. **Current Security Posture**
     - Public users can INSERT contacts (with GDPR consent requirement)
     - NO ONE can SELECT or UPDATE contacts via RLS (must use service role)
     - This ensures maximum security until proper admin auth is implemented

  ## Next Steps for Admin Access
  
  When ready to add admin functionality:
  1. Implement proper authentication with admin roles
  2. Add RLS policies that check for admin role in JWT
  3. Re-add necessary indexes based on actual query patterns
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_contacts_created_at;
DROP INDEX IF EXISTS idx_contacts_processed;
DROP INDEX IF EXISTS idx_contacts_email;

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Only authenticated users can view contacts" ON contacts;
DROP POLICY IF EXISTS "Only authenticated users can update contacts" ON contacts;

-- The only remaining policy is the INSERT policy for public contact form submissions
-- which requires GDPR consent. This is secure and appropriate.

-- For admin access, use the service role key from your backend/edge functions only.
-- This ensures proper security boundaries.