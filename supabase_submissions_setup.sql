-- ==============================================================================
-- Supabase SQL Setup for Competition Submissions
-- Supports team resubmissions, versioning, timestamping, and SHA-256 cryptographic hashing
-- ==============================================================================

-- 1. Create table for competition submissions
CREATE TABLE IF NOT EXISTS public.competition_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name TEXT NOT NULL,
    submitted_by_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    submitted_by_email TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    is_latest BOOLEAN NOT NULL DEFAULT true,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    crypto_hash TEXT NOT NULL,
    
    -- Deliverable 1: Research Memo
    research_memo_title TEXT,
    research_memo_content TEXT,
    research_memo_file_name TEXT,
    research_memo_file_data TEXT,

    -- Deliverable 2: Strategy Code
    strategy_code_filename TEXT,
    strategy_code_content TEXT,
    entry_point TEXT,
    dependencies TEXT,

    -- Deliverable 3: Backtest Metrics (JSON)
    backtest_metrics JSONB,

    -- Deliverable 4: Data Provenance
    data_provenance TEXT,

    -- Deliverable 5: Reproduction & Risk Confirmation
    reproduction_instructions TEXT,
    signed_confirmation BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by team_name and latest status
CREATE INDEX IF NOT EXISTS idx_competition_submissions_team ON public.competition_submissions(team_name, is_latest);
CREATE INDEX IF NOT EXISTS idx_competition_submissions_hash ON public.competition_submissions(crypto_hash);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.competition_submissions ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any
DROP POLICY IF EXISTS "Allow public select for competition submissions" ON public.competition_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to insert submissions" ON public.competition_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update submissions" ON public.competition_submissions;

-- 4. Create Non-Recursive RLS Policies

-- Policy A: Allow SELECT for submission lookups and team status
CREATE POLICY "Allow public select for competition submissions"
ON public.competition_submissions
FOR SELECT
USING (true);

-- Policy B: Allow authenticated users to INSERT a submission
CREATE POLICY "Allow authenticated users to insert submissions"
ON public.competition_submissions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy C: Allow authenticated users to UPDATE existing submission status
CREATE POLICY "Allow authenticated users to update submissions"
ON public.competition_submissions
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- 5. Grant permissions to anon, authenticated, and service_role
GRANT ALL ON public.competition_submissions TO anon;
GRANT ALL ON public.competition_submissions TO authenticated;
GRANT ALL ON public.competition_submissions TO service_role;
