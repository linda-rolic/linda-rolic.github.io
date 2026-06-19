#!/usr/bin/env node
/**
 * Validates writing/data.js and auto-fixes failing entries via Claude.
 * Rules enforced:
 *   - Exactly 8 tags per entry
 *   - Excerpt between 700 and 900 characters (inclusive)
 *
 * Run locally:  ANTHROPIC_API_KEY=sk-... node tests/validate-and-fix.js
 * In CI:        set ANTHROPIC_API_KEY secret in GitHub repo settings
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const REQUIRED_TAGS = 8;
const MIN_EXCERPT   = 700;
const MAX_EXCERPT   = 900;
const MODEL         = 'claude-sonnet-4-6';

// ── Parse data.js ────────────────────────────────────────────────────────────
const dataPath = path.join(__dirname, '..', 'writing', 'data.js');
let raw = fs.readFileSync(dataPath, 'utf8');

let BLOGS;
try {
  BLOGS = new Function(raw + '\nreturn BLOGS;')();
} catch (err) {
  console.error('Could not parse writing/data.js:', err.message);
  process.exit(1);
}

// ── Find failing entries ──────────────────────────────────────────────────────
const failing = BLOGS.filter(b => {
  const tc = Array.isArray(b.tags) ? b.tags.length : 0;
  const el = typeof b.excerpt === 'string' ? b.excerpt.length : 0;
  return tc !== REQUIRED_TAGS || el < MIN_EXCERPT || el > MAX_EXCERPT;
});

if (failing.length === 0) {
  console.log(`PASS  All ${BLOGS.length} blogs valid — ${REQUIRED_TAGS} tags, ${MIN_EXCERPT}-${MAX_EXCERPT} char excerpts.`);
  process.exit(0);
}

// ── Need API key to fix ───────────────────────────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error(`FAIL  ${failing.length} blog(s) need fixing but ANTHROPIC_API_KEY is not set.`);
  failing.forEach(b => {
    const tc = Array.isArray(b.tags) ? b.tags.length : 0;
    const el = typeof b.excerpt === 'string' ? b.excerpt.length : 0;
    const issues = [];
    if (tc !== REQUIRED_TAGS) issues.push(`tags=${tc}`);
    if (el < MIN_EXCERPT || el > MAX_EXCERPT) issues.push(`excerpt=${el} chars`);
    console.error(`  id=${b.id} "${b.title}" — ${issues.join(', ')}`);
  });
  process.exit(1);
}

console.log(`Found ${failing.length} failing blog(s). Auto-fixing via Claude...\n`);

// ── Claude API (raw https — no npm install needed) ────────────────────────────
function callClaude(userMessage) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: userMessage }]
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Claude API ${res.statusCode}: ${data}`));
        } else {
          resolve(JSON.parse(data).content[0].text.trim());
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Surgical string replacements in raw JS source ────────────────────────────
function replaceExcerpt(text, id, newExcerpt) {
  const escaped = newExcerpt.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return text.replace(
    new RegExp(`(id:\\s*${id},[\\s\\S]{0,600}?excerpt:\\s*)"[\\s\\S]*?"(\\s*,\\s*\\n\\s*tags:)`),
    (_, pre, post) => `${pre}"${escaped}"${post}`
  );
}

function replaceTags(text, id, newTags) {
  const tagsStr = newTags.map(t => `"${t}"`).join(', ');
  return text.replace(
    new RegExp(`(id:\\s*${id},[\\s\\S]{0,2000}?tags:\\s*\\[)[^\\]]*(\\])`),
    (_, pre, post) => `${pre}${tagsStr}${post}`
  );
}

// ── Fix each failing entry ────────────────────────────────────────────────────
(async () => {
  let anyFixed = false;

  for (const blog of failing) {
    const tc = Array.isArray(blog.tags) ? blog.tags.length : 0;
    const el = typeof blog.excerpt === 'string' ? blog.excerpt.length : 0;

    const issues = [];
    if (tc !== REQUIRED_TAGS)          issues.push(`${tc} tags (need ${REQUIRED_TAGS})`);
    if (el < MIN_EXCERPT)              issues.push(`excerpt ${el} chars (too short, need ≥${MIN_EXCERPT})`);
    else if (el > MAX_EXCERPT)         issues.push(`excerpt ${el} chars (too long, need ≤${MAX_EXCERPT})`);

    console.log(`Fixing id=${blog.id}: ${issues.join(' · ')}`);

    const prompt = `You are fixing a blog entry for a writing portfolio. Fix it to meet both rules exactly.

RULES:
- tags: exactly ${REQUIRED_TAGS} items
- excerpt: between ${MIN_EXCERPT} and ${MAX_EXCERPT} characters (count every character)

CURRENT ENTRY:
Title: "${blog.title}"
Publication: "${blog.publication}"
Excerpt (${el} chars): "${blog.excerpt}"
Tags (${tc}): ${JSON.stringify(blog.tags)}

ISSUES: ${issues.join('; ')}

TAG GUIDANCE (if tags need changing):
- Keep: location names, main topic, program names (Mass Save, LogisVert, CleanBC etc), technology type
- Drop: brand names, redundant synonyms, overly specific sub-terms

EXCERPT GUIDANCE (if excerpt needs changing):
- Expand: add specific technical details, rebate amounts, or regional context already implied by the title
- Trim: cut least-essential clauses while keeping the core value proposition

Respond with ONLY a raw JSON object — no markdown fences, no explanation, nothing else:
{"excerpt":"the fixed text","tags":["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8"]}`;

    let fixed;
    try {
      const responseText = await callClaude(prompt);
      // Strip any accidental markdown fences
      const cleaned = responseText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
      fixed = JSON.parse(cleaned);
    } catch (err) {
      console.error(`  ERROR calling Claude for id=${blog.id}: ${err.message}`);
      process.exit(1);
    }

    // Validate Claude's output before applying
    const newTc = Array.isArray(fixed.tags) ? fixed.tags.length : 0;
    const newEl = typeof fixed.excerpt === 'string' ? fixed.excerpt.length : 0;

    if (newTc !== REQUIRED_TAGS) {
      console.error(`  Claude returned ${newTc} tags for id=${blog.id} — aborting`);
      process.exit(1);
    }
    if (newEl < MIN_EXCERPT || newEl > MAX_EXCERPT) {
      console.error(`  Claude returned ${newEl}-char excerpt for id=${blog.id} — aborting`);
      process.exit(1);
    }

    raw = replaceExcerpt(raw, blog.id, fixed.excerpt);
    raw = replaceTags(raw, blog.id, fixed.tags);
    anyFixed = true;
    console.log(`  Done: ${newEl} chars, ${newTc} tags\n`);
  }

  if (anyFixed) {
    fs.writeFileSync(dataPath, raw, 'utf8');
    console.log(`data.js saved with ${failing.length} fix(es).`);
    // Tell the GitHub Actions workflow a commit is needed
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'fixed=true\n');
    }
  }
})();