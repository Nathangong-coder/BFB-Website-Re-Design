-- ==============================================================================
-- Supabase SQL Setup for Competition Access Control
-- Run AFTER supabase_setup.sql and supabase_submissions_setup.sql (re-running
-- either of those re-opens public access, so run this file again afterwards).
--
-- - Registrations: users read only their own row; admins read all.
-- - Submissions: users read only their own team's rows; admins read all.
-- - All writes go through the SECURITY DEFINER functions below; clients have
--   no direct INSERT/UPDATE/DELETE on either table.
-- - Admins are listed in competition_admins and must have a confirmed email.
-- - Submissions and team changes close at competition_settings.submission_deadline.
-- ==============================================================================

BEGIN;

-- 0. Stop if existing submissions would violate the new unique indexes
DO $$
DECLARE
    dup TEXT;
BEGIN
    SELECT string_agg(d.label, ', ') INTO dup FROM (
        SELECT lower(trim(team_name)) || ' (multiple latest rows)' AS label
        FROM public.competition_submissions
        WHERE is_latest
        GROUP BY lower(trim(team_name))
        HAVING count(*) > 1
        UNION ALL
        SELECT lower(trim(team_name)) || ' v' || version
        FROM public.competition_submissions
        GROUP BY lower(trim(team_name)), version
        HAVING count(*) > 1
    ) d;

    IF dup IS NOT NULL THEN
        RAISE EXCEPTION 'Fix duplicate submissions before running this file: %', dup;
    END IF;
END $$;

-- 1. Admin allowlist
CREATE TABLE IF NOT EXISTS public.competition_admins (
    email TEXT PRIMARY KEY CHECK (email = lower(email)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.competition_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.competition_admins FROM anon, authenticated;

-- Add organizers here (lowercase), e.g.:
-- INSERT INTO public.competition_admins (email) VALUES ('organizer@example.com') ON CONFLICT DO NOTHING;

-- 2. Helpers used by policies (SECURITY DEFINER avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM auth.users u
        JOIN public.competition_admins a ON a.email = lower(u.email)
        WHERE u.id = auth.uid()
          AND u.email_confirmed_at IS NOT NULL
    );
$$;

CREATE OR REPLACE FUNCTION public.my_team_key()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT lower(trim(team_name))
    FROM public.competition_registrations
    WHERE id = auth.uid();
$$;

-- 3. Registrations: own row (or admin) read-only
DROP POLICY IF EXISTS "Allow public select for registration & team lookups" ON public.competition_registrations;
DROP POLICY IF EXISTS "Allow authenticated users to insert registration" ON public.competition_registrations;
DROP POLICY IF EXISTS "Allow users to update own registration" ON public.competition_registrations;
DROP POLICY IF EXISTS "Registrations: read own row or admin" ON public.competition_registrations;

CREATE POLICY "Registrations: read own row or admin"
ON public.competition_registrations
FOR SELECT
TO authenticated
USING (id = auth.uid() OR (SELECT public.is_admin()));

REVOKE ALL ON public.competition_registrations FROM anon, authenticated;
GRANT SELECT ON public.competition_registrations TO authenticated;

-- 4. Submissions: own team (or admin) read-only
DROP POLICY IF EXISTS "Allow public select for competition submissions" ON public.competition_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to insert submissions" ON public.competition_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update submissions" ON public.competition_submissions;
DROP POLICY IF EXISTS "Submissions: read own team or admin" ON public.competition_submissions;

CREATE POLICY "Submissions: read own team or admin"
ON public.competition_submissions
FOR SELECT
TO authenticated
USING (
    lower(trim(team_name)) = (SELECT public.my_team_key())
    OR (SELECT public.is_admin())
);

REVOKE ALL ON public.competition_submissions FROM anon, authenticated;
GRANT SELECT ON public.competition_submissions TO authenticated;

CREATE UNIQUE INDEX IF NOT EXISTS uq_competition_submissions_latest
    ON public.competition_submissions (lower(trim(team_name))) WHERE is_latest;
CREATE UNIQUE INDEX IF NOT EXISTS uq_competition_submissions_version
    ON public.competition_submissions (lower(trim(team_name)), version);

-- 5. Create the registration row at signup (the client has no session yet
--    when email confirmation is on). Google users have no class_year in their
--    metadata and create their row in profile setup instead.
CREATE OR REPLACE FUNCTION public.handle_new_competition_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_name TEXT := nullif(trim(NEW.raw_user_meta_data->>'full_name'), '');
    v_year TEXT := NEW.raw_user_meta_data->>'class_year';
BEGIN
    IF v_name IS NOT NULL AND v_year IN ('2026', '2027', '2028', '2029', '2030') THEN
        INSERT INTO public.competition_registrations (id, full_name, email, class_year)
        VALUES (NEW.id, left(v_name, 120), lower(NEW.email), v_year)
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Never block signup; the user can finish their profile afterwards
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_competition ON auth.users;
CREATE TRIGGER on_auth_user_created_competition
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_competition_user();

-- 5b. Submission deadline: Sun, Nov 22, 2026 11:59 PM PT (PST = UTC-8).
--     Submissions and team create/join/leave are refused once it passes.
--     Re-running this file keeps an edited deadline; change it with
--     UPDATE public.competition_settings SET submission_deadline = '...';
CREATE TABLE IF NOT EXISTS public.competition_settings (
    id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id),
    submission_deadline TIMESTAMP WITH TIME ZONE NOT NULL
);
ALTER TABLE public.competition_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.competition_settings FROM anon, authenticated;

INSERT INTO public.competition_settings (id, submission_deadline)
VALUES (true, '2026-11-23 08:00:00+00')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.assert_competition_open()
RETURNS VOID
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF NOW() >= (SELECT submission_deadline FROM public.competition_settings) THEN
        RAISE EXCEPTION 'The submission deadline has passed. Submissions and team changes are closed.' USING HINT = 'deadline_passed';
    END IF;
END;
$$;

-- 6. Profile and team functions
CREATE OR REPLACE FUNCTION public.save_competition_profile(p_full_name TEXT, p_class_year TEXT)
RETURNS public.competition_registrations
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_name TEXT := trim(coalesce(p_full_name, ''));
    v_email TEXT;
    v_row public.competition_registrations;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Please sign in first.' USING HINT = 'not_signed_in';
    END IF;
    IF v_name = '' OR length(v_name) > 120 THEN
        RAISE EXCEPTION 'Please enter your first and last name.' USING HINT = 'invalid_name';
    END IF;
    IF p_class_year IS NULL OR p_class_year NOT IN ('2026', '2027', '2028', '2029', '2030') THEN
        RAISE EXCEPTION 'Please select a graduation year between 2026 and 2030.' USING HINT = 'invalid_class_year';
    END IF;

    SELECT lower(email) INTO v_email FROM auth.users WHERE id = auth.uid();

    INSERT INTO public.competition_registrations (id, full_name, email, class_year, updated_at)
    VALUES (auth.uid(), v_name, v_email, p_class_year, NOW())
    ON CONFLICT (id) DO UPDATE
        SET full_name = EXCLUDED.full_name,
            class_year = EXCLUDED.class_year,
            updated_at = NOW()
    RETURNING * INTO v_row;

    RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.lock_my_competition_registration()
RETURNS public.competition_registrations
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_row public.competition_registrations;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Please sign in first.' USING HINT = 'not_signed_in';
    END IF;

    SELECT * INTO v_row FROM public.competition_registrations WHERE id = auth.uid() FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Please complete your profile first.' USING HINT = 'profile_required';
    END IF;

    RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.list_team_names()
RETURNS SETOF TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT DISTINCT ON (lower(trim(team_name))) trim(team_name)
    FROM public.competition_registrations
    WHERE team_name IS NOT NULL AND trim(team_name) <> ''
    ORDER BY lower(trim(team_name)), created_at;
$$;

CREATE OR REPLACE FUNCTION public.get_my_team_members()
RETURNS TABLE (full_name TEXT, email TEXT, class_year TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT r.full_name, r.email, r.class_year
    FROM public.competition_registrations r
    WHERE lower(trim(r.team_name)) = public.my_team_key()
    ORDER BY r.created_at;
$$;

CREATE OR REPLACE FUNCTION public.create_team(p_team_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_name TEXT := trim(coalesce(p_team_name, ''));
    v_reg public.competition_registrations;
BEGIN
    PERFORM public.assert_competition_open();
    v_reg := public.lock_my_competition_registration();

    IF v_reg.team_name IS NOT NULL THEN
        RAISE EXCEPTION 'You are already on team ''%''. Leave it first.', v_reg.team_name USING HINT = 'already_on_team';
    END IF;
    IF v_name = '' OR length(v_name) > 50 OR v_name !~ '^[[:print:]]+$' THEN
        RAISE EXCEPTION 'Team names must be 1-50 printable characters.' USING HINT = 'invalid_team_name';
    END IF;

    PERFORM pg_advisory_xact_lock(hashtext('competition_team:' || lower(v_name)));

    -- A name stays taken while it has members or past submissions, so a new
    -- team can never inherit another team's submissions.
    IF EXISTS (SELECT 1 FROM public.competition_registrations WHERE lower(trim(team_name)) = lower(v_name))
       OR EXISTS (SELECT 1 FROM public.competition_submissions WHERE lower(trim(team_name)) = lower(v_name)) THEN
        RAISE EXCEPTION 'Team name ''%'' is already taken. Please choose a different team name or join the existing team.', v_name USING HINT = 'team_name_taken';
    END IF;

    UPDATE public.competition_registrations
    SET team_name = v_name, updated_at = NOW()
    WHERE id = auth.uid();

    RETURN v_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_team(p_team_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_key TEXT := lower(trim(coalesce(p_team_name, '')));
    v_reg public.competition_registrations;
    v_canonical TEXT;
    v_count INTEGER;
BEGIN
    PERFORM public.assert_competition_open();
    v_reg := public.lock_my_competition_registration();

    IF v_reg.team_name IS NOT NULL THEN
        RAISE EXCEPTION 'You are already on team ''%''. Leave it first.', v_reg.team_name USING HINT = 'already_on_team';
    END IF;

    PERFORM pg_advisory_xact_lock(hashtext('competition_team:' || v_key));

    SELECT count(*), min(trim(team_name)) INTO v_count, v_canonical
    FROM public.competition_registrations
    WHERE lower(trim(team_name)) = v_key;

    IF v_count = 0 THEN
        RAISE EXCEPTION 'Team ''%'' was not found. Please check the spelling or create a new team.', trim(p_team_name) USING HINT = 'team_not_found';
    END IF;
    IF v_count >= 3 THEN
        RAISE EXCEPTION 'Team ''%'' is full (maximum 3 members per team reached).', v_canonical USING HINT = 'team_full';
    END IF;

    UPDATE public.competition_registrations
    SET team_name = v_canonical, updated_at = NOW()
    WHERE id = auth.uid();

    RETURN v_canonical;
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_team()
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_reg public.competition_registrations;
BEGIN
    PERFORM public.assert_competition_open();
    v_reg := public.lock_my_competition_registration();
    IF v_reg.team_name IS NULL THEN
        RETURN;
    END IF;

    PERFORM pg_advisory_xact_lock(hashtext('competition_team:' || lower(trim(v_reg.team_name))));

    UPDATE public.competition_registrations
    SET team_name = NULL, updated_at = NOW()
    WHERE id = auth.uid();
END;
$$;

-- 7. Submission functions
CREATE OR REPLACE FUNCTION public.get_my_latest_submission()
RETURNS SETOF public.competition_submissions
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT *
    FROM public.competition_submissions
    WHERE lower(trim(team_name)) = public.my_team_key()
      AND is_latest
    ORDER BY version DESC
    LIMIT 1;
$$;

-- p: expected_version, submitted_at, crypto_hash, team_name, submitted_by_email,
--    signed_confirmation, language, research_memo_*, strategy_code_filename,
--    strategy_code_content, entry_point, dependencies,
--    data_provenance, reproduction_instructions.
-- team_name, email, version and submitted_at are part of the client-computed
-- hash, so they're checked against the server's values rather than replaced.
CREATE OR REPLACE FUNCTION public.submit_version(p JSONB)
RETURNS public.competition_submissions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_reg public.competition_registrations;
    v_key TEXT;
    v_email TEXT;
    v_next INTEGER;
    v_expected INTEGER;
    v_submitted_at TIMESTAMP WITH TIME ZONE;
    v_row public.competition_submissions;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Please sign in to submit.' USING HINT = 'not_signed_in';
    END IF;
    PERFORM public.assert_competition_open();

    SELECT * INTO v_reg FROM public.competition_registrations WHERE id = auth.uid();
    IF NOT FOUND OR v_reg.team_name IS NULL THEN
        RAISE EXCEPTION 'Join or create a team before submitting.' USING HINT = 'no_team';
    END IF;
    v_key := lower(trim(v_reg.team_name));

    IF lower(trim(coalesce(p->>'team_name', ''))) <> v_key THEN
        RAISE EXCEPTION 'Your team changed since this page loaded. Reload and try again.' USING HINT = 'team_mismatch';
    END IF;

    SELECT lower(email) INTO v_email FROM auth.users WHERE id = auth.uid();
    IF lower(trim(coalesce(p->>'submitted_by_email', ''))) <> v_email THEN
        RAISE EXCEPTION 'Your account changed since this page loaded. Reload and try again.' USING HINT = 'email_mismatch';
    END IF;

    BEGIN
        v_expected := (p->>'expected_version')::INTEGER;
        v_submitted_at := (p->>'submitted_at')::TIMESTAMP WITH TIME ZONE;
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Invalid submission payload.' USING HINT = 'invalid_payload';
    END;

    IF v_submitted_at IS NULL OR abs(extract(EPOCH FROM (NOW() - v_submitted_at))) > 300 THEN
        RAISE EXCEPTION 'Your device clock is more than 5 minutes off. Correct it and submit again.' USING HINT = 'clock_skew';
    END IF;
    IF coalesce(p->>'signed_confirmation', 'false') <> 'true' THEN
        RAISE EXCEPTION 'Please accept the submission terms to submit.' USING HINT = 'terms_required';
    END IF;
    IF coalesce(p->>'crypto_hash', '') !~ '^[0-9a-f]{64}$' THEN
        RAISE EXCEPTION 'Invalid submission hash.' USING HINT = 'invalid_hash';
    END IF;
    IF coalesce(p->>'language', '') NOT IN ('python', 'cpp') THEN
        RAISE EXCEPTION 'Language must be Python or C++.' USING HINT = 'invalid_language';
    END IF;
    IF nullif(trim(coalesce(p->>'strategy_code_content', '')), '') IS NULL THEN
        RAISE EXCEPTION 'Please provide your runnable strategy code or script.' USING HINT = 'code_required';
    END IF;
    IF length(coalesce(p->>'strategy_code_content', '')) > 1000000
       OR length(coalesce(p->>'research_memo_content', '')) > 1000000 THEN
        RAISE EXCEPTION 'Code and memo are limited to 1,000,000 characters each.' USING HINT = 'too_large';
    END IF;

    -- Serialize submissions per team so two teammates can't both write version N
    PERFORM pg_advisory_xact_lock(hashtext('competition_team:' || v_key));

    SELECT coalesce(max(version), 0) + 1 INTO v_next
    FROM public.competition_submissions
    WHERE lower(trim(team_name)) = v_key;

    IF v_expected IS DISTINCT FROM v_next THEN
        RAISE EXCEPTION 'A teammate just submitted version %. Reload to see it before submitting again.', v_next - 1 USING HINT = 'stale_version';
    END IF;

    UPDATE public.competition_submissions
    SET is_latest = false, updated_at = NOW()
    WHERE lower(trim(team_name)) = v_key AND is_latest;

    INSERT INTO public.competition_submissions (
        team_name, submitted_by_id, submitted_by_email, version, is_latest,
        submitted_at, crypto_hash, language,
        research_memo_title, research_memo_content, research_memo_file_name,
        strategy_code_filename, strategy_code_content, entry_point, dependencies,
        data_provenance, reproduction_instructions,
        signed_confirmation, terms_accepted_at
    ) VALUES (
        trim(v_reg.team_name), auth.uid(), v_email, v_next, true,
        v_submitted_at, p->>'crypto_hash', p->>'language',
        p->>'research_memo_title', p->>'research_memo_content', p->>'research_memo_file_name',
        p->>'strategy_code_filename', p->>'strategy_code_content', p->>'entry_point', p->>'dependencies',
        p->>'data_provenance', p->>'reproduction_instructions',
        true, NOW()
    )
    RETURNING * INTO v_row;

    RETURN v_row;
END;
$$;

-- 8. Function permissions: signed-in users only; helpers stay private
REVOKE EXECUTE ON FUNCTION
    public.is_admin(),
    public.my_team_key(),
    public.handle_new_competition_user(),
    public.assert_competition_open(),
    public.save_competition_profile(TEXT, TEXT),
    public.lock_my_competition_registration(),
    public.list_team_names(),
    public.get_my_team_members(),
    public.create_team(TEXT),
    public.join_team(TEXT),
    public.leave_team(),
    public.get_my_latest_submission(),
    public.submit_version(JSONB)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.is_admin(),
    public.my_team_key(),
    public.save_competition_profile(TEXT, TEXT),
    public.list_team_names(),
    public.get_my_team_members(),
    public.create_team(TEXT),
    public.join_team(TEXT),
    public.leave_team(),
    public.get_my_latest_submission(),
    public.submit_version(JSONB)
TO authenticated;

COMMIT;
