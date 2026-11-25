# Supabase setup

FORM Fitness keeps `form-fitness-v2` in the browser and offers optional cross-device sync for the same authenticated user. Cloud sync contains workout dates, exercise IDs, and set completion marks only. Profile details, set weights/reps, body measurements, and nutrition stay on the device. The user must accept the in-app sync notice before signing in or creating an account.

## Create the database table

1. Create a Supabase project and open **SQL Editor**.
2. For a new project, run [`migrations/202611250001_fitness_states.sql`](migrations/202611250001_fitness_states.sql). For the already-created project, also run [`migrations/202611250002_fitness_states_authenticated_grants.sql`](migrations/202611250002_fitness_states_authenticated_grants.sql) in SQL Editor. It grants only `SELECT`, `INSERT`, and `UPDATE` to signed-in users; RLS still limits each account to its own row.
3. In **Project Settings → API**, copy the Project URL and the browser-safe publishable key (or legacy anon key) into `src/supabase-config.js`.
4. Deploy the app. Accept the sync notice, create an account from **Profil & Ayarlar → Telefon ve bilgisayar eşitlemesi**, then sign in with that same account on each device.

Do not use or publish the `service_role` key in this static website. The public key is protected by the table's RLS policies. Supabase Realtime must be enabled for `fitness_states`; the SQL migration adds the table to the `supabase_realtime` publication where supported.

Supabase Auth email confirmation is enabled for this project. Users must open the signup link before their first sign-in; the app offers a resend control if the message is missing. The app continues to save locally while cloud credentials are not configured or the device is offline. Initial sync merges workout completion marks and preserves the device's other local data.
