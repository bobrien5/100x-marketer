-- Run this in the Supabase SQL editor once, before the first scrape.

create table if not exists creators (
  id          bigserial primary key,
  handle      text not null,
  platform    text not null check (platform in ('instagram')),
  display_name text,
  notes       text,
  added_at    timestamptz not null default now(),
  unique (handle, platform)
);

create table if not exists posts (
  id          bigserial primary key,
  creator_id  bigint not null references creators(id) on delete cascade,
  platform    text not null check (platform in ('instagram')),
  post_url    text not null unique,
  posted_at   timestamptz,
  caption     text,
  transcript  text,
  views       bigint default 0,
  likes       bigint default 0,
  comments    bigint default 0,
  shares      bigint default 0,
  scraped_at  timestamptz not null default now(),
  analyzed_at timestamptz
);

create index if not exists posts_creator_idx on posts (creator_id);
create index if not exists posts_unanalyzed_idx on posts (analyzed_at) where analyzed_at is null;

create table if not exists analyses (
  id                   bigserial primary key,
  post_id              bigint not null references posts(id) on delete cascade unique,
  hook_label           text,
  content_format_label text,
  cta_label            text,
  summary              text,
  model                text,
  analyzed_at          timestamptz not null default now()
);

create index if not exists analyses_hook_idx on analyses (hook_label);
create index if not exists analyses_format_idx on analyses (content_format_label);
create index if not exists analyses_cta_idx on analyses (cta_label);

-- Convenience view: post performance with engagement rate.
create or replace view post_performance as
select
  p.id,
  p.platform,
  c.handle,
  p.post_url,
  p.posted_at,
  p.views,
  p.likes,
  p.comments,
  p.shares,
  case when p.views > 0
       then (p.likes + p.comments + coalesce(p.shares, 0))::numeric / p.views
       else 0
  end as engagement_rate,
  a.hook_label,
  a.content_format_label,
  a.cta_label,
  a.summary
from posts p
join creators c on c.id = p.creator_id
left join analyses a on a.post_id = p.id;
