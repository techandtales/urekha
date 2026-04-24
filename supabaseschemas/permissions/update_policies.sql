-- ==========================================
-- SECURE SELF-UPDATE POLICIES
-- ==========================================
-- This script replaces the previous broad UPDATE policies
-- with secure Row Level Security (RLS) policies.
-- Users and Agents can now ONLY update rows where the 'email'
-- column matches their authenticated JWT email.

-- 1. Secure UPDATE policy for agentdata
DROP POLICY IF EXISTS "Enable update for all authenticated users" ON agentdata;
DROP POLICY IF EXISTS "Agents can update their own data" ON agentdata;

CREATE POLICY "Agents can update their own data"
ON agentdata
FOR UPDATE
TO authenticated
USING (
  agent_uuid = auth.uid()
)
WITH CHECK (
  agent_uuid = auth.uid()
);

-- 2. Secure UPDATE policy for userdata
DROP POLICY IF EXISTS "Enable update for all authenticated users" ON userdata;
DROP POLICY IF EXISTS "Users can update their own data" ON userdata;

CREATE POLICY "Users can update their own data"
ON userdata
FOR UPDATE
TO authenticated
USING (
  email = (select auth.jwt() ->> 'email')
)
WITH CHECK (
  email = (select auth.jwt() ->> 'email')
);

-- 3. Ensure explicit INSERT permissions are active for signup operations
-- Note: During signup via server action, the row is inserted AFTER the auth session is created,
-- or it is inserted via Service Role. If inserted via SSR client, they can only insert their own row.
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON agentdata;
DROP POLICY IF EXISTS "Users can insert their own row" ON agentdata;

CREATE POLICY "Users can insert their own row"
ON agentdata
FOR INSERT
TO authenticated
WITH CHECK (
  email = (select auth.jwt() ->> 'email')
);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON userdata;
DROP POLICY IF EXISTS "Users can insert their own row" ON userdata;

CREATE POLICY "Users can insert their own row"
ON userdata
FOR INSERT
TO authenticated
WITH CHECK (
  email = (select auth.jwt() ->> 'email')
);

-- 4. Maintain Admin privilege to update agentdata (for token approval)
DROP POLICY IF EXISTS "Admins can update agentdata" ON agentdata;
CREATE POLICY "Admins can update agentdata"
ON agentdata
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM roles
    WHERE roles.user_id = auth.uid()
    AND roles.role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM roles
    WHERE roles.user_id = auth.uid()
    AND roles.role IN ('admin', 'superadmin')
  )
);
