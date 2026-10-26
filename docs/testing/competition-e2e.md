# Alpha Research Competition: end-to-end test script

Manual tests for the competition's sign-up, team, submission and admin flows. Each section matches one change and must pass before that change is committed.

- [Setup](#setup)
- [Step 1: Access control](#step-1-access-control)
- Step 2: Deadline enforcement (added with step 2)
- Step 3: Lint fixes (added with step 3)

## Setup

Run these tests on a **staging Supabase project**, not production. Several tests create accounts, teams and submissions, and some deliberately try to break the rules.

1. In the staging project's SQL editor, run in order: `supabase_setup.sql`, `supabase_submissions_setup.sql`, `supabase_security_setup.sql`.
2. In **Authentication → Providers → Email**, turn on **Confirm email**. Turn on Google if you're testing it.
3. Add one organizer:
   ```sql
   INSERT INTO public.competition_admins (email) VALUES ('<admin email, lowercase>');
   ```
4. Point `.env.local` at the staging project (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) and run `npm run dev`.
5. Use plus addresses on one inbox so every confirmation email arrives in one place, e.g. `you+alice@gmail.com`.

### Personas

| Persona | Account | Role in the tests |
|---|---|---|
| Alice | `you+alice@…` | Creates team "Quant Bruins" and submits |
| Bob | `you+bob@…` | Joins Alice's team |
| Carol | `you+carol@…` | Creates a different team, "Delta Desk" |
| Dave | `you+dave@…` | Signs in but never joins a team |
| Frank | `you+frank@…` | Fourth person trying to join "Quant Bruins" |
| Eve | `you+eve@…` | Attacker: uses curl and the browser console |
| Admin | the email added in setup | Organizer |

Use a separate browser profile (or a private window) per persona so their sessions don't overwrite each other.

### Tools used in the tests

**Get a user's access token.** Signed in as that user, open DevTools → Application → Local Storage → the site's origin → key `sb-<project-ref>-auth-token` → copy `access_token`.

**Call the database the way an attacker would.** Set these in a terminal:
```bash
URL="https://<project-ref>.supabase.co"
KEY="<publishable/anon key>"     # public; it ships in the site's JavaScript
TOKEN="<Eve's access_token>"
```

**Impersonate a user in the SQL editor.** Wrap queries like this to run them with that user's permissions, and roll back afterwards:
```sql
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims',
  json_build_object('sub', '<user uuid>', 'email', '<user email>', 'role', 'authenticated')::text, true);
-- queries here
ROLLBACK;
```
Find a user's uuid with `SELECT id, email FROM auth.users;` (the SQL editor runs as an owner, so this works there).

---

## Step 1: Access control

### 1A. Happy path: the whole journey

| # | Persona | Steps | Expected |
|---|---|---|---|
| 1A.1 | Alice | Go to `/competition/alpha-research/register`. Sign up with name "Alice Test", graduation year 2027 and a password. | The page says a confirmation link was sent. No error. |
| 1A.2 | (SQL editor) | `SELECT * FROM competition_registrations WHERE email = '<alice>';` | One row exists with `full_name` "Alice Test", `class_year` 2027 and `team_name` null, **before** Alice confirms. (The signup trigger created it.) |
| 1A.3 | Alice | Click the confirmation link, then sign in. | Signed in. The team step appears (create or join). |
| 1A.4 | Alice | Create team "Quant Bruins". | Success message names "Quant Bruins". The roster shows 1/3 with Alice. |
| 1A.5 | Bob | Sign up, confirm, sign in. Join "Quant Bruins" (pick it from the list). | "Successfully joined Team 'Quant Bruins'". The roster shows Alice and Bob (2/3). |
| 1A.6 | Alice | Reload. | Roster shows Alice and Bob. |
| 1A.7 | Alice | Go to `/competition/alpha-research/submit`. Fill in the memo and code, tick the terms box, submit. | "Submission Version 1 saved successfully" with a hash prefix. The page shows "Active Version 1 Submitted". No "updated terms" banner. |
| 1A.8 | Bob | Open the submit page. | The form is pre-filled with Alice's v1. Header shows version 1. |
| 1A.9 | Bob | Change the memo title, tick the terms box, submit. | Version 2 saved. |
| 1A.10 | (SQL editor) | `SELECT version, is_latest, submitted_by_email, terms_accepted_at FROM competition_submissions WHERE lower(team_name) = 'quant bruins' ORDER BY version;` | Exactly two rows: v1 `is_latest=false`, v2 `is_latest=true`. v2 is by Bob. Both have `terms_accepted_at` set. |
| 1A.11 | Admin | Sign in on the register page with the admin account, then open `/admin/submissions`. | The dashboard loads. Both versions are visible (untick "latest only" to see v1). No sample teams ("Apex_High_Frequency_v2", "Bruin_Alpha_Research_v1") appear. |
| 1A.12 | Admin | Open v2 and run hash verification. | The hash matches. |
| 1A.13 | Admin | Download v2's ZIP. | The ZIP contains the memo, code and provenance. |
| 1A.14 | Admin | Click the dashboard's sign-out button. | Back to the "BFB Admin Portal Locked" screen with a Sign In button. |

**Google sign-in (if enabled):**

| # | Persona | Steps | Expected |
|---|---|---|---|
| 1A.15 | New Google user | Click "Sign in with Google" on the register page. | After the redirect, the profile setup form appears, pre-filled with the Google name. |
| 1A.16 | Same | Pick graduation year 2028 and save. | "Profile saved successfully". The team step appears and the Join list includes "Quant Bruins". |

### 1B. Data is private

| # | Persona | Steps | Expected |
|---|---|---|---|
| 1B.1 | Eve (no account) | `curl "$URL/rest/v1/competition_submissions?select=*" -H "apikey: $KEY"` | An error (`permission denied for table competition_submissions`, HTTP 401/403). **No rows.** |
| 1B.2 | Eve (no account) | `curl "$URL/rest/v1/competition_registrations?select=*" -H "apikey: $KEY"` | Permission denied. No names or emails. |
| 1B.3 | Eve (signed in, no team) | `curl "$URL/rest/v1/competition_submissions?select=team_name,version" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN"` | `[]`. |
| 1B.4 | Eve (signed in) | `curl "$URL/rest/v1/competition_registrations?select=*" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN"` | Only Eve's own row. |
| 1B.5 | Carol | Create team "Delta Desk". Run 1B.3 with Carol's token. | Returns nothing from Quant Bruins. |
| 1B.6 | Carol | `curl -X POST "$URL/rest/v1/rpc/get_my_team_members" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN"` | Only Carol. |
| 1B.7 | Eve (no account) | `curl -X POST "$URL/rest/v1/rpc/list_team_names" -H "apikey: $KEY"` | Permission denied. (Signed-in users may see team names, which the Join list needs; anonymous visitors may not.) |
| 1B.8 | Dave (no team) | Open the submit page. | The "join a team" state shows. No submission data is shown. |

### 1C. Writes are blocked outside the functions

Run these with Eve's token. Each one must fail **and** the SQL editor must show nothing changed.

| # | Attack | Command | Expected |
|---|---|---|---|
| 1C.1 | Insert a fake submission for Quant Bruins | `curl -X POST "$URL/rest/v1/competition_submissions" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"team_name":"Quant Bruins","submitted_by_email":"x@x.com","crypto_hash":"00","version":99}'` | Permission denied. |
| 1C.2 | Mark Quant Bruins' latest as not-latest | `curl -X PATCH "$URL/rest/v1/competition_submissions?team_name=eq.Quant%20Bruins" -H "apikey: $KEY" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"is_latest":false}'` | Permission denied. v2 is still latest. |
| 1C.3 | Delete submissions | Same URL with `-X DELETE`. | Permission denied. |
| 1C.4 | Move herself into Quant Bruins directly | `curl -X PATCH "$URL/rest/v1/competition_registrations?id=eq.<eve uuid>" … -d '{"team_name":"Quant Bruins"}'` | Permission denied. |
| 1C.5 | Edit Alice's registration | `curl -X PATCH "$URL/rest/v1/competition_registrations?id=eq.<alice uuid>" … -d '{"team_name":null}'` | Permission denied. Alice is still on her team. |
| 1C.6 | Submit for another team | `curl -X POST "$URL/rest/v1/rpc/submit_version" … -d '{"p":{"team_name":"Quant Bruins","submitted_by_email":"<eve>","expected_version":3,"submitted_at":"<now ISO>","crypto_hash":"<64 hex>","signed_confirmation":true,"language":"python","strategy_code_content":"x"}}'` (Eve on no team, or on her own team) | "Join or create a team before submitting." or "Your team changed since this page loaded." No row is inserted for Quant Bruins. |
| 1C.7 | Grant herself admin | `curl -X POST "$URL/rest/v1/competition_admins" … -d '{"email":"<eve>"}'` | Permission denied. |
| 1C.8 | Call the internal helper | `curl -X POST "$URL/rest/v1/rpc/lock_my_competition_registration" …` | Permission denied (function not executable). |

### 1D. Team rules and tricky names

| # | Persona | Steps | Expected |
|---|---|---|---|
| 1D.1 | Frank | Fill Quant Bruins to 3 members (add a third test user), then Frank tries to join. | "Team 'Quant Bruins' is full (maximum 3 members per team reached)." Frank stays teamless. |
| 1D.2 | Frank | Create team "quant bruins" (lowercase). | "Team name 'quant bruins' is already taken." |
| 1D.3 | Frank | Create team "  Quant Bruins  " (spaces around). | Already taken. |
| 1D.4 | Frank | Join "QUANT BRUINS" after a member has left so there's room. | Joins. `team_name` on Frank's row is stored as "Quant Bruins" (the existing spelling), not "QUANT BRUINS". |
| 1D.5 | Frank | Create team "%". Then Dave joins "%". Then Dave tries to join "_" (no such team). | "%" is created and Dave can join it. "_" is not found. Neither matches "Quant Bruins" or other teams (before, `%` matched every team). |
| 1D.6 | Frank | Create team "Q_ant Bruins". | Created as a separate team. It does not collide with "Quant Bruins". |
| 1D.7 | Frank | Create a team with an empty name, a 51-character name, and a name containing a tab or newline (paste one). | All rejected: "Team names must be 1-50 printable characters." (The empty case may be caught by the form first.) |
| 1D.8 | Alice | While on Quant Bruins, call `create_team` directly: `curl -X POST "$URL/rest/v1/rpc/create_team" -H "apikey: $KEY" -H "Authorization: Bearer <alice token>" -H "Content-Type: application/json" -d '{"p_team_name":"Second"}'` | "You are already on team 'Quant Bruins'. Leave it first." |
| 1D.9 | Carol | Leave "Delta Desk" when she is its only member, then create "Delta Desk" again (or have Dave try). | If Delta Desk has **no** submissions, the name can be created again. If it **has** submissions, the name stays taken: a new team must never inherit the old team's submissions. |
| 1D.10 | Bob | Leave Quant Bruins, rejoin it. | Bob sees the team's latest submission again after rejoining. While he was out, the submit page showed the no-team state and he couldn't read the team's submissions (check with 1B.3 using Bob's token). |
| 1D.11 | Two browsers | Frank and another teamless user both click Join on a team with 2 members at the same moment. | Exactly one joins. The other gets "is full". The team never has 4 members. |
| 1D.12 | Two browsers | Two teamless users create "Race Team" at the same moment. | One succeeds, the other gets "already taken". |

### 1E. Submissions: races and bad input

| # | Persona | Steps | Expected |
|---|---|---|---|
| 1E.1 | Alice + Bob | Both open the submit page showing the same latest version (say v2). Both edit and click Submit within a second of each other. | One gets "Version 3 saved". The other gets "A teammate just submitted version 3. Reload to see it before submitting again." The SQL in 1A.10 shows one v3 and exactly one `is_latest=true` row. |
| 1E.2 | Alice | Submit without ticking the terms box. | Blocked in the form: "Please accept the submission terms…". |
| 1E.3 | Alice | Bypass the form: curl `submit_version` with `"signed_confirmation": false` and otherwise valid fields. | "Please accept the submission terms to submit." No row. |
| 1E.4 | Alice | Set the computer clock 10 minutes fast, reload, submit. Then 10 minutes slow. Then fix it. | Both rejected: "Your device clock is more than 5 minutes off…". With the clock correct, it works. |
| 1E.5 | Alice | curl `submit_version` with `"submitted_at":"2026-01-01T00:00:00Z"`. | Clock error. No row. (A forged timestamp can't backdate a submission.) |
| 1E.6 | Alice | curl with `"expected_version": 1` when the team is on v3. | `stale_version` error. No row. |
| 1E.7 | Alice | curl with `"language":"rust"`, then with empty `strategy_code_content`, then with `"crypto_hash":"abc"`. | Each rejected with its own message. No rows. |
| 1E.8 | Alice | Paste code over 1,000,000 characters and submit. | "Code and memo are limited to 1,000,000 characters each." (A browser or network error is also acceptable; no row may be created.) |
| 1E.9 | Alice | curl with `"submitted_by_email"` set to Bob's email. | "Your account changed since this page loaded." No row. The real email always comes from the account. |
| 1E.10 | Alice | Submit, then immediately leave the team in another tab before the request finishes (or: load the submit page, leave the team in another tab, then submit from the first tab). | "Join or create a team before submitting." No row. |
| 1E.11 | Alice | Double-click Submit quickly. | One new version only (the second click is disabled while loading, or gets `stale_version`). |
| 1E.12 | Alice (no network) | Turn off Wi-Fi, submit. | An error is shown. Turning Wi-Fi back on and submitting again works and creates one version. |

### 1F. Accounts and admin access

| # | Persona | Steps | Expected |
|---|---|---|---|
| 1F.1 | Anyone | Sign up again with Alice's email. | "An account with email '…' is already registered. Please sign in instead." No second registration row. |
| 1F.2 | New user | Sign up but don't click the confirmation link, then try to sign in. | Sign-in fails with Supabase's "Email not confirmed" message. |
| 1F.3 | Dave | Signed in as Dave, open `/admin/submissions`. | Locked screen: "Signed in as you+dave@… (not an organizer)" with a Sign Out button. No submissions load. In the Network tab, no request returns submission rows. |
| 1F.4 | Nobody | Signed out, open `/admin/submissions`. | Locked screen with a Sign In button that goes to the register page. |
| 1F.5 | Unconfirmed admin | Add a new email to `competition_admins`, sign up with it but **don't** confirm. (If confirmation blocks sign-in, also try marking it unconfirmed: `UPDATE auth.users SET email_confirmed_at = NULL WHERE email = '…'` on an existing session.) | Not treated as an organizer. `SELECT public.is_admin()` impersonating that user returns false. |
| 1F.6 | Admin | On the dashboard, sign out in another tab. | The dashboard switches to the locked screen without a reload. |
| 1F.7 | Admin | Remove the admin's email from `competition_admins`, then click Refresh on the dashboard. | The list becomes empty (no sample teams). Reload shows the not-an-organizer screen. Re-add the email afterwards. |
| 1F.8 | Old password | Visit `/admin/submissions` and look for a passcode field. Search the built JS for `bfb2026admin` (`grep -r bfb2026admin .next/static`). | No passcode field. No match. Remove `NEXT_PUBLIC_ADMIN_PASSWORD` from `.env.local` and the deploy settings. |
| 1F.9 | Admin, network error | Stop the network (DevTools → Offline) and click Refresh. | "Couldn't load submissions: …". No sample teams. |

### 1G. Export script

| # | Steps | Expected |
|---|---|---|
| 1G.1 | `NEXT_PUBLIC_SUPABASE_URL=$URL python scripts/export_submissions.py` (no service key). | Exits with "SUPABASE_SERVICE_ROLE_KEY is required…". Nothing exported. |
| 1G.2 | Same with `SUPABASE_SERVICE_ROLE_KEY=<service key>`. | Exports every team's latest submission to `submissions_archive/`. |
| 1G.3 | Same with a wrong service key. | Exits with "Supabase query failed: …". It does not fall back to sample data. |
| 1G.4 | No env vars at all. | Says it's using sample packages and exports the two samples. |

### 1H. Applying to production

| # | Steps | Expected |
|---|---|---|
| 1H.1 | Before running `supabase_security_setup.sql` on production, run its step 0 check alone. | No exception. If it lists teams, fix their duplicate rows first (keep one `is_latest` per team and unique versions). |
| 1H.2 | Run the whole file, then deploy the new site build right away. | Between the two, old pages can't write (sign-ups still work through the trigger). Existing registrations and submissions are unchanged: compare `SELECT count(*)` on both tables before and after. |
| 1H.3 | Existing team members open the submit page. | They see their team's latest submission. Old submissions with no `terms_accepted_at` show the "updated terms" banner. |
