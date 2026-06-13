# Deployment Guide

## 1. Upload to GitHub
Create a new repo, for example:

`unimates-nextjs-academy`

Upload all files from this folder.

## 2. Supabase
Run:

`supabase/schema.sql`

Then run:

`supabase/seed.sql`

## 3. Vercel
Import the new GitHub repo into Vercel.

Framework Preset:
`Next.js`

Build command:
`next build`

Install command:
`npm install`

## 4. Environment Variables
Add:

`NEXT_PUBLIC_SUPABASE_URL`

`NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 5. Deploy
Click Deploy.

## 6. Test
Open:
- `/login`
- `/dashboard`
- `/courses`
- `/puzzles`
- `/videos`
- `/pgn`
- `/tournaments`
