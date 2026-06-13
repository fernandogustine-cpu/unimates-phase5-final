# Uni-Mates Chess Academy — Phase 5 Next.js + Supabase

This is a ready-to-deploy professional codebase starter for Uni-Mates Chess Academy.

## What it includes
- Next.js application
- Supabase connection
- Login / sign up page
- Dashboard
- Students/profiles view
- Course management
- Video lessons
- Puzzle trainer data
- PGN upload/storage
- Tournament manager
- Supabase schema and seed data

## Deploy steps
1. Upload this full folder to a new GitHub repository or replace the current static site.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. Optional: run `supabase/seed.sql`.
4. In Vercel, import the GitHub repository.
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Deploy.

## Important
This is a Phase 5 starter codebase. It is database-powered, but advanced production items still need tightening:
- role-based admin permissions
- polished chessboard viewer
- PGN engine analysis
- payments
- certificates
- parent reporting

## Coach profile
Create your Supabase Auth user, then add a row to `profiles`:
- id = Supabase Auth UID
- full_name = Fernando Nyirenda
- role = coach
- rating = 1827
- goal = Build one of the best leading chess academies in South Africa
