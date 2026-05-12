// Boots an Express server that serves the dashboard and exposes /api/stats.
// Run with: node scripts/serve.mjs, then open http://localhost:3000

import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillRoot = join(__dirname, '..');

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, PORT = '3000' } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars. Copy .env.example to .env and fill in keys.');
  process.exit(1);
}

const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
const app = express();

const MIN_VIEWS_FOR_RATE = 1000;

function aggregate(rows, key) {
  const buckets = new Map();
  for (const r of rows) {
    const label = r[key];
    if (!label) continue;
    const b = buckets.get(label) || { label, count: 0, totalViews: 0, totalEng: 0, ratePosts: 0 };
    b.count += 1;
    b.totalViews += Number(r.views || 0);
    if (r.views >= MIN_VIEWS_FOR_RATE) {
      b.totalEng += Number(r.engagement_rate || 0);
      b.ratePosts += 1;
    }
    buckets.set(label, b);
  }
  return [...buckets.values()]
    .map((b) => ({
      label: b.label,
      count: b.count,
      avg_views: Math.round(b.totalViews / b.count),
      avg_engagement_rate: b.ratePosts ? +(b.totalEng / b.ratePosts).toFixed(4) : 0,
    }))
    .sort((a, b) => b.avg_engagement_rate - a.avg_engagement_rate);
}

app.get('/api/stats', async (_req, res) => {
  const { data, error } = await supa.from('post_performance').select('*');
  if (error) return res.status(500).json({ error: error.message });
  const analyzed = data.filter((r) => r.hook_label);
  res.json({
    total_posts: data.length,
    analyzed_posts: analyzed.length,
    hooks: aggregate(analyzed, 'hook_label'),
    formats: aggregate(analyzed, 'content_format_label'),
    ctas: aggregate(analyzed, 'cta_label'),
    top_posts: [...analyzed]
      .filter((r) => r.views >= MIN_VIEWS_FOR_RATE)
      .sort((a, b) => Number(b.engagement_rate) - Number(a.engagement_rate))
      .slice(0, 20),
  });
});

app.use(express.static(join(skillRoot, 'dashboard')));

app.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
});
