-- Supabase database schema — run this once in your Supabase SQL editor

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists video_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  video_id text not null,
  watched_seconds integer default 0,
  last_position numeric default 0,
  updated_at timestamptz default now(),
  unique(user_id, video_id)
);

create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  duration_minutes integer,
  session_date date,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table video_progress enable row level security;
alter table sessions enable row level security;

-- Profiles: users can only read and update their own row
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Video progress: users can only access their own progress
create policy "Users can view own progress"
  on video_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on video_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on video_progress for update using (auth.uid() = user_id);

-- Sessions: all authenticated users can read sessions
create policy "Authenticated users can view sessions"
  on sessions for select using (auth.role() = 'authenticated');

-- Seed sample sessions
insert into sessions (title, description, thumbnail_url, duration_minutes, session_date) values
  ('Introduction to React', 'Learn the fundamentals of React including components, props and state.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 60, '2024-11-01'),
  ('Node.js & Express Basics', 'Build REST APIs using Node.js and Express framework from scratch.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', 75, '2024-11-05'),
  ('Supabase Deep Dive', 'Explore Supabase Auth, database, and Row Level Security in detail.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', 90, '2024-11-10'),
  ('CSS Animations & Transitions', 'Master modern CSS techniques including animations, transforms and more.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 45, '2024-11-15'),
  ('JavaScript ES6+ Features', 'Deep dive into modern JavaScript — async/await, destructuring, modules.', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400', 80, '2024-11-20');

-- Function to auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
