ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone with an 'agent' or 'admin' role to read the AI settings
CREATE POLICY "Agents can view ai_settings"
ON public.ai_settings
FOR SELECT
TO authenticated
USING (
  exists (
    select 1 
    from public.roles 
    where roles.email = (auth.jwt() ->> 'email')
    and roles.role IN ('agent', 'admin')
  )
);

-- Policy to allow anyone with an 'agent' or 'admin' role to update the AI settings
CREATE POLICY "Agents can update ai_settings"
ON public.ai_settings
FOR UPDATE
TO authenticated
USING (
  exists (
    select 1 
    from public.roles 
    where roles.email = (auth.jwt() ->> 'email')
    and roles.role IN ('agent', 'admin')
  )
)
WITH CHECK (
  exists (
    select 1 
    from public.roles 
    where roles.email = (auth.jwt() ->> 'email')
    and roles.role IN ('agent', 'admin')
  )
);
