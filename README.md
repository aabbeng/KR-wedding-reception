# Wedding Reception Desk

A responsive wedding reception website built with Next.js, TypeScript, Tailwind CSS, and Supabase. The interface is optimized for quick use in Safari on an iPad, but it is a regular website with a server-side backend—not a native iPad application.

## Milestone 1

- Home, Guests, Tables, and QR navigation
- Partial guest and group-name search
- Guest details with prominent table and seat numbers
- One-tap check-in with automatic arrival time
- Undo after check-in
- Table overview and per-table guest lists
- Atomic PostgreSQL check-in functions and activity logs
- Row-level security with database access kept on the server

QR display, guest photo uploads, Google Drive, authentication, and editing are intentionally deferred.

## Run locally

1. Install Node.js 22 or newer.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase project URL and service-role key.
5. Run `supabase/schema.sql`, then `supabase/seed.sql`, in the Supabase SQL editor.
6. Start the website with `npm run dev`.
7. Open the local URL shown in the terminal.

Keep `SUPABASE_SERVICE_ROLE_KEY` secret. It is only read by server routes and is never exposed to the browser.

If the two Supabase environment variables are absent, the website automatically uses in-memory sample data for local UI development. Check-ins in mock mode reset when the server restarts.

## Verify a production build

```bash
npm run build
```

## Database files

- `supabase/schema.sql` creates `tables`, `guests`, and `activity_logs`, enables RLS and Realtime, and adds atomic check-in/undo functions.
- `supabase/seed.sql` inserts representative guest and table data.

## Import a revised guest workbook

Keep the columns `name`, `table_number`, `seat_number`, `group_name`, and `notes`, then run:

```bash
python scripts/import_guest_list.py path/to/wedding_guest_list.xlsx .
```

The importer validates required fields and regenerates both the local mock data and the Supabase seed. Run the regenerated `supabase/seed.sql` to replace the database guest list.
