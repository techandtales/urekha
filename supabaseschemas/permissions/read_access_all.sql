-- ====================================================
-- GRANT UNRESTRICTED READ ACCESS TO ALL TABLES
-- ====================================================
-- This script ensures that any user (logged in or not) can READ
-- from any of your project's tables. It will fix any "empty data" 
-- issues in your frontend components.

-- Enable Row Level Security (Required for policies to work)
ALTER TABLE IF EXISTS agentdata ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS userdata ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS agentreports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS branch ENABLE ROW LEVEL SECURITY;

-- 1. AGENTDATA
DROP POLICY IF EXISTS "Enable read access for all users" ON agentdata;
CREATE POLICY "Enable read access for all users"
ON agentdata FOR SELECT USING (true);

-- 2. USERDATA
DROP POLICY IF EXISTS "Enable read access for all users" ON userdata;
CREATE POLICY "Enable read access for all users"
ON userdata FOR SELECT USING (true);

-- 3. AGENTREPORTS
DROP POLICY IF EXISTS "Enable read access for all users" ON agentreports;
CREATE POLICY "Enable read access for all users"
ON agentreports FOR SELECT USING (true);

-- 4. TOKEN_TRANSACTIONS
DROP POLICY IF EXISTS "Enable read access for all users" ON token_transactions;
CREATE POLICY "Enable read access for all users"
ON token_transactions FOR SELECT USING (true);

-- 5. ROLES
DROP POLICY IF EXISTS "Enable read access for all users" ON roles;
CREATE POLICY "Enable read access for all users"
ON roles FOR SELECT USING (true);

-- 6. PRICING_PLANS
DROP POLICY IF EXISTS "Enable read access for all users" ON pricing_plans;
CREATE POLICY "Enable read access for all users"
ON pricing_plans FOR SELECT USING (true);

-- 7. BRANCH
DROP POLICY IF EXISTS "Enable read access for all users" ON branch;
CREATE POLICY "Enable read access for all users"
ON branch FOR SELECT USING (true);

-- Ensure anon and authenticated roles have baseline usage rights
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
