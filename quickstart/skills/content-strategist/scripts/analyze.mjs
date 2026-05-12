// Pulls posts where analyzed_at is null, asks Claude to extract hook,
// content format, and CTA labels, writes results to the analyses table.
// Run with: node scripts/analyze.mjs

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY, CLAUDE_MODEL = 'claude-haiku-4-5' } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ANTHROPIC_API_KEY) {
  console.error('Missing env vars. Copy .env.example to .env and fill in keys.');
  process.exit(1);
}

const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
const claude = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const SYSTEM = `You classify short-form social posts. For each post, return strict JSON with four fields:
- hook_label: 2-5 word phrase describing the opening hook pattern (e.g. "contrarian claim", "stat reveal", "POV setup", "question to viewer").
- content_format_label: 2-5 word phrase describing the format (e.g. "talking head tutorial", "screen recording walkthrough", "list of tools", "before-after demo").
- cta_label: 2-5 word phrase describing the call to action, or "none" if absent (e.g. "comment for link", "follow for more", "save this post", "link in bio").
- summary: one sentence describing what the post is about.

Use lowercase. Be consistent across posts so similar things get the same label. Output JSON only, no prose.`;

async function classify(caption, transcript) {
  const text = [caption, transcript].filter(Boolean).join('\n\n--- transcript ---\n').slice(0, 4000);
  const res = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 300,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Post text:\n\n${text}` }],
  });
  const raw = res.content[0]?.text || '{}';
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON in response: ${raw.slice(0, 200)}`);
  return JSON.parse(match[0]);
}

async function main() {
  const { data: posts, error } = await supa
    .from('posts')
    .select('id, caption, transcript')
    .is('analyzed_at', null);
  if (error) throw error;

  if (!posts.length) {
    console.log('No unanalyzed posts. Nothing to do.');
    return;
  }

  console.log(`Analyzing ${posts.length} posts with ${CLAUDE_MODEL}.\n`);
  let ok = 0, skipped = 0, failed = 0;

  for (const post of posts) {
    const text = (post.caption || '') + (post.transcript || '');
    if (text.trim().length < 10) {
      console.log(`  post ${post.id}: skipped (no caption or transcript)`);
      await supa.from('posts').update({ analyzed_at: new Date().toISOString() }).eq('id', post.id);
      skipped++;
      continue;
    }
    try {
      const labels = await classify(post.caption, post.transcript);
      const { error: insErr } = await supa.from('analyses').upsert({
        post_id: post.id,
        hook_label: labels.hook_label || null,
        content_format_label: labels.content_format_label || null,
        cta_label: labels.cta_label || null,
        summary: labels.summary || null,
        model: CLAUDE_MODEL,
      }, { onConflict: 'post_id' });
      if (insErr) throw insErr;
      await supa.from('posts').update({ analyzed_at: new Date().toISOString() }).eq('id', post.id);
      ok++;
      console.log(`  post ${post.id}: ${labels.hook_label} / ${labels.content_format_label} / ${labels.cta_label}`);
    } catch (err) {
      console.error(`  post ${post.id}: FAILED, ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${ok} analyzed, ${skipped} skipped, ${failed} failed.`);
  console.log('Run `node scripts/serve.mjs` to view the dashboard.');
}

main().catch((err) => { console.error(err); process.exit(1); });
