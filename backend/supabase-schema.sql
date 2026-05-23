-- CampusCare Supabase schema/update script
-- Run this in Supabase SQL Editor before testing the app.

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'community_member',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table users add column if not exists full_name text;
alter table users add column if not exists email text;
alter table users add column if not exists password_hash text;
alter table users add column if not exists role text default 'community_member';
alter table users add column if not exists is_active boolean default true;
alter table users add column if not exists created_at timestamptz default now();

create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text,
  location text not null,
  image_url text,
  completion_photo_url text,
  status text not null default 'Pending',
  user_id uuid references users(id) on delete set null,
  assigned_worker_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table issues add column if not exists title text;
alter table issues add column if not exists description text;
alter table issues add column if not exists category text;
alter table issues add column if not exists location text;
alter table issues add column if not exists image_url text;
alter table issues add column if not exists completion_photo_url text;
alter table issues add column if not exists status text default 'Pending';
alter table issues add column if not exists user_id uuid references users(id) on delete set null;
alter table issues add column if not exists assigned_worker_id uuid references users(id) on delete set null;
alter table issues add column if not exists created_at timestamptz default now();
alter table issues add column if not exists updated_at timestamptz default now();

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  issue_id uuid references issues(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table comments add column if not exists content text;
alter table comments add column if not exists issue_id uuid references issues(id) on delete cascade;
alter table comments add column if not exists user_id uuid references users(id) on delete set null;
alter table comments add column if not exists created_at timestamptz default now();
