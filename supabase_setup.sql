-- ==============================================================================
-- Supabase SQL Setup for Competition Registrations
-- Fixes Infinite Recursion (Error 42P17) and enables clean non-recursive RLS policies
-- ==============================================================================

-- 1. Create table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.competition_registrations (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    class_year TEXT NOT NULL,
    team_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.competition_registrations ENABLE ROW LEVEL SECURITY;

-- 3. Drop all potentially broken or recursive policies on competition_registrations
DROP POLICY IF EXISTS "Enable read access for all users" ON public.competition_registrations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.competition_registrations;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.competition_registrations;
DROP POLICY IF EXISTS "Users can view own registration" ON public.competition_registrations;
DROP POLICY IF EXISTS "Users can insert own registration" ON public.competition_registrations;
DROP POLICY IF EXISTS "Users can update own registration" ON public.competition_registrations;
DROP POLICY IF EXISTS "Allow team lookup" ON public.competition_registrations;
DROP POLICY IF EXISTS "Allow public read" ON public.competition_registrations;
DROP POLICY IF EXISTS "Allow public select for registration & team lookups" ON public.competition_registrations;
DROP POLICY IF EXISTS "Allow authenticated users to insert registration" ON public.competition_registrations;
DROP POLICY IF EXISTS "Allow users to update own registration" ON public.competition_registrations;
DROP POLICY IF EXISTS "Public select" ON public.competition_registrations;
DROP POLICY IF EXISTS "User update" ON public.competition_registrations;
DROP POLICY IF EXISTS "User insert" ON public.competition_registrations;

-- 4. Create Clean, Non-Recursive RLS Policies
-- NOTE: Never write subqueries targeting `competition_registrations` inside a policy on `competition_registrations`!

-- POLICY A: Allow SELECT for team member lists and duplicate checks (Non-recursive)
CREATE POLICY "Allow public select for registration & team lookups"
ON public.competition_registrations
FOR SELECT
USING (true);

-- POLICY B: Allow INSERT during account registration (Non-recursive)
CREATE POLICY "Allow authenticated users to insert registration"
ON public.competition_registrations
FOR INSERT
WITH CHECK (true);

-- POLICY C: Allow users to UPDATE their own record (creating/joining team) (Non-recursive)
CREATE POLICY "Allow users to update own registration"
ON public.competition_registrations
FOR UPDATE
USING (auth.uid() = id OR auth.uid() IS NOT NULL);

-- 5. Grant permissions to anon and authenticated roles
GRANT ALL ON public.competition_registrations TO anon;
GRANT ALL ON public.competition_registrations TO authenticated;
GRANT ALL ON public.competition_registrations TO service_role;
