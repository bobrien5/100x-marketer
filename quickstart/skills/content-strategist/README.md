# content-strategist

A Claude Code skill that scrapes competitor Instagram posts, classifies the hooks and CTAs, and shows you what is actually working on a localhost dashboard.

No web search. No vibes. Real posts, real numbers.

## What it does

1. Pulls Instagram posts from creators you list in `config/creators.json`.
2. Stores them in your Supabase project.
3. Has Claude read each caption and pull out the hook, content format, and CTA as short labels.
4. Serves a dashboard at `localhost:3000` ranking labels by engagement rate.

## Stack

- **Apify** for scraping (`apify/instagram-scraper`)
- **Supabase** for storage
- **Claude API** for classification
- **Express + vanilla HTML/JS + Chart.js** for the dashboard

All on-demand. Nothing is scheduled. You run it when you want fresh data.

## Setup, 10 minutes

1. Clone the parent repo and `cd 100x-marketer/quickstart/skills/content-strategist`.
2. `npm install`
3. Copy `.env.example` to `.env` and fill in:
   - `APIFY_TOKEN` from apify.com (free tier works)
   - `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` from your Supabase project settings
   - `ANTHROPIC_API_KEY` from console.anthropic.com
4. In Supabase, open the SQL editor and run the contents of `sql/schema.sql`.
5. Edit `config/creators.json` to swap in the handles you want to track.

## Run it

```bash
node scripts/scrape.mjs    # pull posts into Supabase
node scripts/analyze.mjs   # classify hooks and CTAs with Claude
node scripts/serve.mjs     # open http://localhost:3000
```

A full refresh is the three commands in that order.

## Cost

- Apify: roughly $0.15 per full scrape of 4 creators on Instagram (free tier covers about 10 runs/month).
- Claude (Haiku 4.5): about $0.05 per 100 posts classified.
- Supabase: free tier is plenty.

## Where to extend

- Add more creators in `config/creators.json`.
- Add TikTok or YouTube Shorts by writing a new scraper in `scripts/` that writes into the same `posts` table (you'd also need to widen the `platform` check in `sql/schema.sql`).
- Tighten the engagement rate floor in `scripts/serve.mjs` if your niche is small.
- Swap in your own classification prompt in `scripts/analyze.mjs` if you want different labels.

This is a public skill. Fork it, break it, ship better content.
