-- ==========================================
-- SUPERADMIN INSERT, UPDATE AND DELETE POLICIES
-- ==========================================
-- This script safely grants INSERT, UPDATE, and DELETE access to 
-- users who have 'superadmin' role in the `roles` table.

-- 1. First, create a SECURITY DEFINER function to check superadmin status.
-- This prevents infinite recursion if RLS is enabled on the `roles` table itself.
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM roles
    WHERE email = auth.jwt() ->> 'email'
      AND role = 'superadmin'
  );
$$;

-- 2. Use a DO block to dynamically create these policies on ALL tables in the public schema
DO $do$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        -- Drop existing policies if they already exist
        EXECUTE format('DROP POLICY IF EXISTS "Superadmin insert access" ON %I;', r.tablename);
        EXECUTE format('DROP POLICY IF EXISTS "Superadmin update access" ON %I;', r.tablename);
        EXECUTE format('DROP POLICY IF EXISTS "Superadmin delete access" ON %I;', r.tablename);

        -- Create INSERT policy
        EXECUTE format('CREATE POLICY "Superadmin insert access" ON %I 
                        FOR INSERT 
                        TO authenticated 
                        WITH CHECK (public.is_superadmin());', r.tablename);
                        
        -- Create UPDATE policy
        EXECUTE format('CREATE POLICY "Superadmin update access" ON %I 
                        FOR UPDATE 
                        TO authenticated 
                        USING (public.is_superadmin());', r.tablename);

        -- Create DELETE policy
        EXECUTE format('CREATE POLICY "Superadmin delete access" ON %I 
                        FOR DELETE 
                        TO authenticated 
                        USING (public.is_superadmin());', r.tablename);
    END LOOP;
END
$do$;
