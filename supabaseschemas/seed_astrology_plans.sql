-- ==========================================
-- SEED DATA FOR ASTROLOGY PLANS & PROMPTS
-- ==========================================

-- 1. Insert Pricing Plans (Agent Facing)
-- For agents, price = 0 (purchased via bulk) or the generation cost.
-- token_cost is what is deducted when a report is generated.
INSERT INTO public.pricing_plans (target_audience, name, description, price, token_cost, is_popular, is_active, display_order, features) VALUES
('agent', 'Basic Astrology Report', '53 Pages (Core + 23 Extra), Lifelong Overview + 5-Year Forecast', 1200, 1200, false, true, 1, '["Core Prediction", "23 Extra Pages", "Lifelong Overview", "5-Year Forecast"]'::jsonb),
('agent', 'Standard Astrology Report', '73 Pages (Core + 43 Extra), Lifelong Overview + 10-Year Forecast', 1500, 1500, true, true, 2, '["Core Prediction", "43 Extra Pages", "Lifelong Overview", "10-Year Forecast"]'::jsonb),
('agent', 'Premium Astrology Report', '103 Pages (Core + 73 Extra), Lifelong Overview + 15-Year Forecast', 2000, 2000, false, true, 3, '["Core Prediction", "73 Extra Pages", "Lifelong Overview", "15-Year Forecast"]'::jsonb);

-- 2. Insert Prompts
-- We define distinct prompts for each tier (1200, 1500, 2000) so input data and word count can vary.

-- ================== BASIC PLAN PROMPTS (1200rs) ==================
INSERT INTO public.prompts (name, slug, prompt_template, input_data_codes, word_count_target) VALUES
('Personal Insight', 'personal-insight-1200', 'Analyze nature, character, and core personality traits using {{DATA}}.', '["divisional_chart_D1"]', 600),
('Health Analysis', 'health-1200', 'Analyze vitality and physical well-being using {{DATA}}.', '["divisional_chart_D1"]', 600),
('Career Analysis', 'career-1200', 'Analyze professional growth and job success using {{DATA}}.', '["divisional_chart_D1"]', 600),
('Education Analysis', 'education-1200', 'Analyze academic success and learning paths using {{DATA}}.', '["divisional_chart_D1"]', 600),
('Enemy & Challenges', 'enemies-1200', 'Analyze competition, legal hurdles, and obstacles using {{DATA}}.', '["divisional_chart_D1"]', 600),
('Finance Analysis', 'finance-1200', 'Analyze wealth accumulation and investments using {{DATA}}.', '["divisional_chart_D1"]', 600),
('Love & Relation', 'love-relation-1200', 'Analyze social life and romantic inclinations using {{DATA}}.', '["divisional_chart_D1"]', 600),
('Family Relation', 'family-relation-1200', 'Analyze bonds with parents and domestic environment using {{DATA}}.', '["divisional_chart_D1"]', 600),
('Spirituality', 'spirituality-1200', 'Analyze inner growth and mental peace using {{DATA}}.', '["divisional_chart_D1"]', 600),
('Marriage Analysis', 'marriage-1200', 'Analyze marital harmony and timing using {{DATA}}.', '["divisional_chart_D1"]', 800),
('Children & Relation', 'children-1200', 'Analyze progeny prospects and relationships using {{DATA}}.', '["divisional_chart_D1"]', 800),
('Travel Analysis', 'travel-1200', 'Analyze foreign travel and relocation prospects using {{DATA}}.', '["divisional_chart_D1"]', 800),
('Lifelong Overview', 'lifelong-overview-1200', 'Provide a high-level lifelong overview and core destiny map using {{DATA}}.', '["divisional_chart_D1", "dasha_maha"]', 1000),
('5-Year Prediction', '5-year-forecast-1200', 'Generate a 5-year forecast in 2 periods (3+2 years) using {{DATA}}.', '["dasha_current_maha_full"]', 800);

-- ================== STANDARD PLAN PROMPTS (1500rs) ==================
INSERT INTO public.prompts (name, slug, prompt_template, input_data_codes, word_count_target) VALUES
('Personal Insight', 'personal-insight-1500', 'Analyze nature, character, and core traits in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details"]', 1000),
('Health Analysis', 'health-1500', 'Analyze vitality and physical well-being in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details"]', 1000),
('Career Analysis', 'career-1500', 'Analyze professional growth and job success in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "divisional_chart_D10"]', 1000),
('Education Analysis', 'education-1500', 'Analyze academic success and learning paths in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "divisional_chart_D24"]', 1000),
('Enemy & Challenges', 'enemies-1500', 'Analyze competition, legal hurdles, and obstacles in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "dosha_mangal", "dosha_kaalsarp"]', 1000),
('Finance Analysis', 'finance-1500', 'Analyze wealth accumulation and investments in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "divisional_chart_D2"]', 1000),
('Love & Relation', 'love-relation-1500', 'Analyze social life and romantic inclinations in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "divisional_chart_D9"]', 1000),
('Family Relation', 'family-relation-1500', 'Analyze bonds with parents and domestic environment in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "divisional_chart_D2"]', 1000),
('Spirituality', 'spirituality-1500', 'Analyze inner growth and mental peace in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "divisional_chart_D9"]', 1000),
('Marriage Analysis', 'marriage-1500', 'Analyze marital harmony and timing in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "divisional_chart_D9", "dosha_manglik"]', 1200),
('Children & Relation', 'children-1500', 'Analyze progeny prospects and relationships in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "divisional_chart_D7"]', 1200),
('Travel Analysis', 'travel-1500', 'Analyze foreign travel and relocation prospects in detail using {{DATA}}.', '["divisional_chart_D1", "planet_details", "divisional_chart_D9", "divisional_chart_D4"]', 1200),
('Lifelong Overview', 'lifelong-overview-1500', 'Provide a high-level lifelong overview and core destiny map in detail using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D9", "dasha_maha", "planet_details"]', 1500),
('10-Year Prediction', '10-year-forecast-1500', 'Generate a 10-year forecast in 3 periods (3+3+4 years) using {{DATA}}.', '["dasha_maha", "dasha_yogini_main"]', 1500);

-- ================== PREMIUM PLAN PROMPTS (2000rs) ==================
INSERT INTO public.prompts (name, slug, prompt_template, input_data_codes, word_count_target) VALUES
('Personal Insight', 'personal-insight-2000', 'Analyze nature, character, and psychological profile comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D9", "ascendant_report", "planet_details"]', 1500),
('Health Analysis', 'health-2000', 'Analyze vitality and long-term health comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D9", "planet_details", "dasha_current_maha"]', 1500),
('Career Analysis', 'career-2000', 'Analyze professional strategy, setbacks, and triumphs comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D9", "divisional_chart_D10", "planet_details", "dasha_maha", "binnashtakvarga_Saturn"]', 1500),
('Education Analysis', 'education-2000', 'Analyze higher education and specializations comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D9", "divisional_chart_D24", "planet_details"]', 1500),
('Enemy & Challenges', 'enemies-2000', 'Analyze hidden fears, adversaries, and protective remedies comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D6", "planet_details", "dosha_mangal", "dosha_kaalsarp"]', 1500),
('Finance Analysis', 'finance-2000', 'Analyze lifetime wealth geometry comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D2", "divisional_chart_D11", "planet_details", "ashtakvarga", "binnashtakvarga_Jupiter"]', 1500),
('Love & Relation', 'love-relation-2000', 'Analyze soulmate connections and karmic ties comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D9", "planet_details", "dosha_manglik", "extended_friendship_table"]', 1500),
('Family Relation', 'family-relation-2000', 'Analyze ancestral dynamics and family harmony comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D2", "planet_details"]', 1500),
('Spirituality', 'spirituality-2000', 'Analyze spiritual awakening and mystical experiences comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D9", "divisional_chart_D20", "planet_details"]', 1500),
('Marriage Analysis', 'marriage-2000', 'Analyze spousal characteristics and marital destiny comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D9", "planet_details", "dosha_manglik", "ashtakvarga", "binnashtakvarga_Venus"]', 1800),
('Children & Relation', 'children-2000', 'Analyze future lineage and parenting journey comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D7", "divisional_chart_D9", "planet_details"]', 1800),
('Travel Analysis', 'travel-2000', 'Analyze immigration and foreign settlements comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D4", "divisional_chart_D9", "divisional_chart_D12", "extended_planets_kp"]', 1800),
('Lifelong Overview', 'lifelong-overview-2000', 'Provide a profound lifelong overview and overarching destiny map comprehensively using {{DATA}}.', '["divisional_chart_D1", "divisional_chart_D9", "divisional_chart_D60", "dasha_maha", "planet_details"]', 2500),
('15-Year Prediction', '15-year-forecast-2000', 'Generate a 15-year forecast in 4 periods (3+3+4+5 years) comprehensively using {{DATA}}.', '["dasha_maha", "dasha_yogini_main", "dasha_specific_sub"]', 3000);


-- 3. Link Prompts to Plans (pricing_plan_prompts)
-- Mapping for 1200rs Plan (Basic): 5 categories + 5-year forecast + lifelong
WITH plan AS (SELECT id FROM pricing_plans WHERE price = 1200 LIMIT 1)
INSERT INTO public.pricing_plan_prompts (plan_id, prompt_id, display_order)
SELECT plan.id, p.id, row_number() OVER () 
FROM plan, prompts p 
WHERE p.slug IN ('personal-insight-1200', 'education-1200', 'career-1200', 'health-1200', 'enemies-1200', 'lifelong-overview-1200', '5-year-forecast-1200');

-- Mapping for 1500rs Plan (Standard): 9 categories + 10-year forecast + lifelong
WITH plan AS (SELECT id FROM pricing_plans WHERE price = 1500 LIMIT 1)
INSERT INTO public.pricing_plan_prompts (plan_id, prompt_id, display_order)
SELECT plan.id, p.id, row_number() OVER () 
FROM plan, prompts p 
WHERE p.slug IN ('personal-insight-1500', 'education-1500', 'career-1500', 'health-1500', 'finance-1500', 'love-relation-1500', 'family-relation-1500', 'enemies-1500', 'spirituality-1500', 'lifelong-overview-1500', '10-year-forecast-1500');

-- Mapping for 2000rs Plan (Premium): All 12 categories + 15-year forecast + lifelong
WITH plan AS (SELECT id FROM pricing_plans WHERE price = 2000 LIMIT 1)
INSERT INTO public.pricing_plan_prompts (plan_id, prompt_id, display_order)
SELECT plan.id, p.id, row_number() OVER () 
FROM plan, prompts p 
WHERE p.slug LIKE '%-2000';

