-- Uni-Mates Chess Academy Supabase schema
-- Run this in Supabase SQL Editor before deploying the Next.js app.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('coach','student','parent')),
  rating int default 0,
  goal text,
  created_at timestamp with time zone default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null,
  description text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  lesson_type text check (lesson_type in ('video','pgn','worksheet','text')),
  content_url text,
  lesson_text text,
  order_number int default 1,
  created_at timestamp with time zone default now()
);

create table if not exists puzzles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  fen text,
  pgn text,
  question text,
  answer text not null,
  theme text,
  difficulty int default 1,
  created_at timestamp with time zone default now()
);

create table if not exists homework (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id),
  lesson_id uuid references lessons(id),
  title text not null,
  instructions text,
  due_date date,
  status text default 'assigned' check (status in ('assigned','submitted','reviewed')),
  created_at timestamp with time zone default now()
);

create table if not exists pgn_games (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  event text,
  white_player text,
  black_player text,
  result text,
  pgn text not null,
  coach_notes text,
  created_at timestamp with time zone default now()
);

create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  venue text,
  start_date date,
  end_date date,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table puzzles enable row level security;
alter table homework enable row level security;
alter table pgn_games enable row level security;
alter table tournaments enable row level security;

-- Development policies: allow logged-in users to read/write.
-- For production, tighten these by role.
drop policy if exists "authenticated read profiles" on profiles;
create policy "authenticated read profiles" on profiles for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated read courses" on courses;
create policy "authenticated read courses" on courses for select using (auth.role() = 'authenticated');
drop policy if exists "authenticated insert courses" on courses;
create policy "authenticated insert courses" on courses for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated read lessons" on lessons;
create policy "authenticated read lessons" on lessons for select using (auth.role() = 'authenticated');
drop policy if exists "authenticated insert lessons" on lessons;
create policy "authenticated insert lessons" on lessons for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated read puzzles" on puzzles;
create policy "authenticated read puzzles" on puzzles for select using (auth.role() = 'authenticated');
drop policy if exists "authenticated insert puzzles" on puzzles;
create policy "authenticated insert puzzles" on puzzles for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated read pgn" on pgn_games;
create policy "authenticated read pgn" on pgn_games for select using (auth.role() = 'authenticated');
drop policy if exists "authenticated insert pgn" on pgn_games;
create policy "authenticated insert pgn" on pgn_games for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated read tournaments" on tournaments;
create policy "authenticated read tournaments" on tournaments for select using (auth.role() = 'authenticated');
drop policy if exists "authenticated insert tournaments" on tournaments;
create policy "authenticated insert tournaments" on tournaments for insert with check (auth.role() = 'authenticated');
