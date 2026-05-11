// BLOGS is defined in data.js, loaded before this script

// Nav scroll effect
const writingNav = document.getElementById('writing-nav');
window.addEventListener('scroll', () => {
  writingNav.classList.toggle('scrolled', window.scrollY > 20);
});


// Build company filter chips
function buildChips() {
  const companies = [...new Set(BLOGS.map(b => b.publication))].sort();
  const chipsEl = document.getElementById('blog-filter-chips');
  companies.forEach(company => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.dataset.company = company;
    btn.textContent = company;
    chipsEl.appendChild(btn);
  });
}

// Build tag filter chips (top 8 by frequency)
function buildTagChips() {
  const freq = {};
  BLOGS.forEach(b => b.tags.forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
  const topTags = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);
  const chipsEl = document.getElementById('blog-tag-chips');
  const all = document.createElement('button');
  all.className = 'filter-chip tag-chip active';
  all.dataset.tag = 'all';
  all.textContent = 'All Topics';
  chipsEl.appendChild(all);
  topTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip tag-chip';
    btn.dataset.tag = tag;
    btn.textContent = tag;
    chipsEl.appendChild(btn);
  });
}

// Render a single blog card
function renderCard(blog) {
  const tagsHTML = blog.tags.map(t => `<span class="tag">${t}</span>`).join('');
  return `
    <div class="blog-card fade-in">
      <div class="blog-card-accent" style="background: ${blog.accentGradient}"></div>
      <div class="blog-card-body">
        <div class="blog-card-top">
          <span class="blog-card-pub">${blog.publication}</span>
          <span class="blog-card-date">${blog.date}</span>
        </div>
        <h3>${blog.title}</h3>
        <div class="blog-meta-row">
          <span class="blog-badge words">&#128218; ${blog.wordCount.toLocaleString()} words</span>
          <span class="blog-badge time">&#9201; ${blog.readTime} min read</span>
        </div>
        <p class="blog-excerpt">${blog.excerpt}</p>
        <div class="blog-card-footer">
          <div class="blog-card-tags">${tagsHTML}</div>
          <a href="${blog.url}" target="_blank" rel="noopener" class="blog-read-btn">Read Article &rarr;</a>
        </div>
      </div>
    </div>`;
}

// Update live stats
function updateStats(visible) {
  const totalWords = visible.reduce((s, b) => s + b.wordCount, 0);
  const avgRead = visible.length
    ? Math.round(visible.reduce((s, b) => s + b.readTime, 0) / visible.length)
    : 0;
  document.getElementById('stat-count').textContent = visible.length;
  document.getElementById('stat-words').textContent = totalWords.toLocaleString();
  document.getElementById('stat-read').textContent = visible.length ? `${avgRead} min` : '—';
}

// Main render / filter
function renderBlogs() {
  const query   = document.getElementById('blog-search').value.toLowerCase().trim();
  const active  = document.querySelector('.filter-chip.active')?.dataset.company || 'all';
  const sort    = document.getElementById('blog-sort').value;

  const activeTag = document.querySelector('#blog-tag-chips .tag-chip.active')?.dataset.tag || 'all';

  let filtered = BLOGS.filter(b => {
    const matchCompany = active === 'all' || b.publication === active;
    const matchTag = activeTag === 'all' || b.tags.includes(activeTag);
    const matchText = !query ||
      b.title.toLowerCase().includes(query) ||
      b.excerpt.toLowerCase().includes(query) ||
      b.tags.some(t => t.toLowerCase().includes(query)) ||
      b.publication.toLowerCase().includes(query);
    return matchCompany && matchTag && matchText;
  });

  filtered.sort((a, b) => {
    if (sort === 'newest')   return a.dateISO < b.dateISO ? 1 : -1;
    if (sort === 'oldest')   return a.dateISO > b.dateISO ? 1 : -1;
    if (sort === 'longest')  return b.wordCount - a.wordCount;
    if (sort === 'shortest') return a.wordCount - b.wordCount;
    return 0;
  });

  const grid  = document.getElementById('blog-grid');
  const empty = document.getElementById('blog-empty');

  grid.innerHTML = filtered.map(renderCard).join('');
  empty.style.display = filtered.length ? 'none' : 'block';
  updateStats(filtered);

}

// Wire up controls
buildChips();
buildTagChips();
document.getElementById('blog-search').addEventListener('input', renderBlogs);
document.getElementById('blog-sort').addEventListener('change', renderBlogs);
document.getElementById('blog-filter-chips').addEventListener('click', e => {
  if (!e.target.classList.contains('filter-chip')) return;
  document.querySelectorAll('#blog-filter-chips .filter-chip').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  renderBlogs();
});
document.getElementById('blog-tag-chips').addEventListener('click', e => {
  if (!e.target.classList.contains('tag-chip')) return;
  document.querySelectorAll('#blog-tag-chips .tag-chip').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  renderBlogs();
});

renderBlogs();
