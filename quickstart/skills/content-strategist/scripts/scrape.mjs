// Pulls recent Instagram posts for each creator in config/creators.json
// and upserts them into Supabase. Run with: node scripts/scrape.mjs

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ApifyClient } from 'apify-client';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillRoot = join(__dirname, '..');

const { APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY, POSTS_PER_CREATOR = '25' } = process.env;
if (!APIFY_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars. Copy .env.example to .env and fill in keys.');
  process.exit(1);
}

const apify = new ApifyClient({ token: APIFY_TOKEN });
const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
const limit = parseInt(POSTS_PER_CREATOR, 10);

const config = JSON.parse(readFileSync(join(skillRoot, 'config/creators.json'), 'utf8'));

const INSTAGRAM_ACTOR = 'apify/instagram-scraper';

async function ensureCreator(handle, platform, notes) {
  const { data, error } = await supa
    .from('creators')
    .upsert({ handle, platform, notes }, { onConflict: 'handle,platform' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function scrapeInstagram(handle) {
  const run = await apify.actor(INSTAGRAM_ACTOR).call({
    directUrls: [`https://www.instagram.com/${handle}/`],
    resultsLimit: limit,
    resultsType: 'posts',
    searchType: 'user',
  });
  const { items } = await apify.dataset(run.defaultDatasetId).listItems();
  return items.map((item) => ({
    post_url: item.url,
    posted_at: item.timestamp ? new Date(item.timestamp).toISOString() : null,
    caption: item.caption || '',
    transcript: null,
    views: item.videoViewCount || item.videoPlayCount || 0,
    likes: item.likesCount || 0,
    comments: item.commentsCount || 0,
    shares: 0,
  })).filter((p) => p.post_url);
}

async function upsertPosts(creatorId, platform, posts) {
  if (!posts.length) return 0;
  const rows = posts.map((p) => ({ ...p, creator_id: creatorId, platform }));
  const { error, data } = await supa
    .from('posts')
    .upsert(rows, { onConflict: 'post_url', ignoreDuplicates: false })
    .select('id');
  if (error) throw error;
  return data.length;
}

async function main() {
  console.log(`Scraping ${config.creators.length} creators on Instagram, up to ${limit} posts each.\n`);
  for (const c of config.creators) {
    for (const platform of c.platforms) {
      if (platform !== 'instagram') {
        console.log(`  ${platform.padEnd(9)} @${c.handle}: skipped (only instagram is supported)`);
        continue;
      }
      try {
        const creator = await ensureCreator(c.handle, platform, c.notes || null);
        const posts = await scrapeInstagram(c.handle);
        const count = await upsertPosts(creator.id, platform, posts);
        console.log(`  instagram @${c.handle}: ${count} posts`);
      } catch (err) {
        console.error(`  instagram @${c.handle}: FAILED, ${err.message}`);
      }
    }
  }
  console.log('\nDone. Run `node scripts/analyze.mjs` next.');
}

main().catch((err) => { console.error(err); process.exit(1); });
