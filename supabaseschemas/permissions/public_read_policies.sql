-- ==========================================
-- UNIVERSAL PUBLIC READ POLICIES
-- ==========================================
-- This script safely grants SELECT access to ANY user (authenticated or anon)
-- to easily test the application functionality.

-- 1. Enable RLS on the tables (if not already enabled)
ALTER TABLE agentdata ENABLE ROW LEVEL SECURITY;
ALTER TABLE userdata ENABLE ROW LEVEL SECURITY;
ALTER TABLE agentreports ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- 2. Create Public Read Access Policies for `agentdata`
DROP POLICY IF EXISTS "Public can view all agentdata" ON agentdata;
CREATE POLICY "Public can view all agentdata"
ON agentdata
FOR SELECT
USING (true);

-- 3. Create Public Read Access Policies for `userdata`
DROP POLICY IF EXISTS "Public can view all userdata" ON userdata;
CREATE POLICY "Public can view all userdata"
ON userdata
FOR SELECT
USING (true);

-- 4. Create Public Read Access Policies for `agentreports`
DROP POLICY IF EXISTS "Public can view all agentreports" ON agentreports;
CREATE POLICY "Public can view all agentreports"
ON agentreports
FOR SELECT
USING (true);

-- 5. Create Public Read Access Policies for `token_transactions` 
DROP POLICY IF EXISTS "Public can view all token_transactions" ON token_transactions;
CREATE POLICY "Public can view all token_transactions"
ON token_transactions
FOR SELECT
USING (true);

-- 6. Create Public Read Access Policies for `roles`
DROP POLICY IF EXISTS "Public can view all roles" ON roles;
CREATE POLICY "Public can view all roles"
ON roles
FOR SELECT
USING (true);

-- 7. Create Public Read Access Policies for `pricing_plans`
DROP POLICY IF EXISTS "Public can view all pricing_plans" ON pricing_plans;
CREATE POLICY "Public can view all pricing_plans"
ON pricing_plans
FOR SELECT
USING (true);

-- NOTE FOR UPDATES: 
-- We still need ADMIN ONLY updates for approving tokens.
DROP POLICY IF EXISTS "Admins can update token_transactions" ON token_transactions;
CREATE POLICY "Admins can update token_transactions"
ON token_transactions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM roles
    WHERE roles.email = (select auth.jwt() ->> 'email')
    AND roles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can update agentdata" ON agentdata;
CREATE POLICY "Admins can update agentdata"
ON agentdata
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM roles
    WHERE roles.email = (select auth.jwt() ->> 'email')
    AND roles.role = 'admin'
  )
);
