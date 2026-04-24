create table public.user_reports (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  birthdetails jsonb not null,
  payment_mode text null,
  transaction_id text null,
  paid_amount numeric(10, 2) null,
  tokens_used numeric(10, 2) null,
  download_url text null,
  status text null default 'processing'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  plan_id bigint null,
  constraint user_reports_pkey primary key (id),
  constraint user_reports_plan_id_fkey foreign KEY (plan_id) references pricing_plans (id) on update CASCADE on delete CASCADE,
  constraint user_reports_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint user_reports_payment_mode_check check (
    (
      payment_mode = any (array['token'::text, 'online'::text])
    )
  )
) TABLESPACE pg_default;
-- Enable Row Level Security
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reports
CREATE POLICY "Users can view their own reports" ON public.user_reports 
FOR SELECT USING (
  auth.uid() = user_id
);

-- Policy: Users can insert their own reports
CREATE POLICY "Users can insert their own reports" ON public.user_reports 
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Policy: Users can update their own reports
CREATE POLICY "Users can update their own reports" ON public.user_reports 
FOR UPDATE USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);
