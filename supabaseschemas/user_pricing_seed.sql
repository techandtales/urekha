-- ==========================================
-- PRICING PLANS SEED DATA (USERS & AGENTS)
-- ==========================================
-- This script inserts the default pricing plans for both
-- standard Users (to buy tokens) and Agents (for report generation).

-- Clear existing plans (optional, but helps avoid duplicates during testing)
-- DELETE FROM public.pricing_plans;

-- 1. Insert User Pricing Plans (For direct users buying tokens)
INSERT INTO public.pricing_plans (target_audience, name, description, price, currency, billing_cycle, tokens_included, token_cost, features, is_popular, is_active, display_order)
VALUES
(
  'user', 
  'Basic Cosmic Tier', 
  'Perfect for personal insights and basic charting.', 
  499, 
  'INR', 
  'one-time', 
  50, 
  0, 
  '["Basic Birth Chart", "Daily Horoscope Access", "1 Detailed Numerology Report", "Limited Email Support"]'::jsonb, 
  false, 
  true, 
  1
),
(
  'user', 
  'Deep Matrix Tier', 
  'For those seeking deep deterministic analysis.', 
  1499, 
  'INR', 
  'one-time', 
  200, 
  0, 
  '["Everything in Basic", "5 Deep Predictive Reports", "Compatibility Matrix Sync", "Priority System Support", "Access to AI Interpretation"]'::jsonb, 
  true, 
  true, 
  2
),
(
  'user', 
  'Architects Void', 
  'Full unrestricted ecosystem access for serious seekers.', 
  4999, 
  'INR', 
  'yearly', 
  1000, 
  0, 
  '["Unlimited Predictive Reports", "Direct Astrologer API Access", "Custom Dashboards", "24/7 VIP Support"]'::jsonb, 
  false, 
  true, 
  3
)
ON CONFLICT DO NOTHING;

-- 2. Insert Agent Pricing Plans (For agents generating reports to sell)
INSERT INTO public.pricing_plans (target_audience, name, description, price, currency, billing_cycle, tokens_included, token_cost, features, is_popular, is_active, display_order)
VALUES
(
  'agent', 
  'Standard Report Print', 
  'Basic 50-page Kundli generation for clients.', 
  0, 
  'INR', 
  null, 
  0, 
  2000, 
  '["50-Page Dynamic PDF", "Basic Astro Calculations", "White-labeled Cover"]'::jsonb, 
  false, 
  true, 
  1
),
(
  'agent', 
  'Premium AI Analysis', 
  'Extensive 100-page report with AI breakdown.', 
  0, 
  'INR', 
  null, 
  0, 
  3500, 
  '["100-Page Dynamic PDF", "Advanced Predictive Models", "Custom Hardware Print Queue", "Priority Rendering"]'::jsonb, 
  true, 
  true, 
  2
)
ON CONFLICT DO NOTHING;
