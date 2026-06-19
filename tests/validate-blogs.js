#!/usr/bin/env node
// Validates every entry in writing/data.js against two rules:
//   1. Exactly 8 tags
//   2. Excerpt between 700 and 900 characters (inclusive)

const fs   = require('fs');
const path = require('path');

const REQUIRED_TAGS = 8;
const MIN_EXCERPT   = 700;
const MAX_EXCERPT   = 900;

const dataPath = path.join(__dirname, '..', 'writing', 'data.js');
const raw = fs.readFileSync(dataPath, 'utf8');

let BLOGS;
try {
  // data.js declares `const BLOGS = [...]` — execute it and grab the binding
  BLOGS = new Function(raw + '\nreturn BLOGS;')();
} catch (err) {
  console.error('Could not parse writing/data.js:', err.message);
  process.exit(1);
}

if (!Array.isArray(BLOGS)) {
  console.error('BLOGS is not an array after parsing data.js');
  process.exit(1);
}

let failures = 0;

for (const blog of BLOGS) {
  const tagCount   = Array.isArray(blog.tags) ? blog.tags.length : 0;
  const excerptLen = typeof blog.excerpt === 'string' ? blog.excerpt.length : 0;

  const tagOk     = tagCount   === REQUIRED_TAGS;
  const excerptOk = excerptLen >= MIN_EXCERPT && excerptLen <= MAX_EXCERPT;

  if (!tagOk || !excerptOk) {
    failures++;
    const issues = [];
    if (!tagOk)     issues.push(`tags=${tagCount} (need ${REQUIRED_TAGS})`);
    if (!excerptOk) issues.push(`excerpt=${excerptLen} chars (need ${MIN_EXCERPT}-${MAX_EXCERPT})`);
    console.error(`FAIL  id=${String(blog.id).padEnd(4)} "${blog.title}" — ${issues.join(', ')}`);
  }
}

if (failures === 0) {
  console.log(`PASS  All ${BLOGS.length} blogs: ${REQUIRED_TAGS} tags, ${MIN_EXCERPT}-${MAX_EXCERPT} char excerpts.`);
  process.exit(0);
} else {
  console.error(`\n${failures} of ${BLOGS.length} blog(s) failed validation.`);
  process.exit(1);
}