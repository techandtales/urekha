create table public.ai_settings (
  id integer not null default 1,
  gemini_api_keys text[] null default '{}'::text[],
  gemini_models text[] null default '{}'::text[],
  openai_api_keys text[] null default '{}'::text[],
  openai_models text[] null default '{}'::text[],
  constraint ai_settings_pkey primary key (id)
) TABLESPACE pg_default;