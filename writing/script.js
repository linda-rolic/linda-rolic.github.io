const BLOGS = [
  {
    id: 1,
    title: "Technoeconomic Analysis: The 2026 Shift to Smart HVAC Standards in Greater Boston",
    publication: "ComfiTrust",
    date: "January 5, 2026",
    dateISO: "2026-01-05",
    wordCount: 1312,
    readTime: 6,
    url: "https://comfitrust.com/technoeconomic-analysis-the-2026-shift-to-smart-hvac-standards-in-greater-boston/",
    excerpt: "As of 2026, Boston's HVAC sector has crossed the tipping point where system intelligence replaces mechanical reliability as the primary quality metric — driven by BERDO emissions mandates, R-410A refrigerant phase-outs, and AI-powered predictive comfort systems reshaping how Greater Boston homes manage climate and energy.",
    tags: ["HVAC", "Smart Home", "Energy Efficiency", "Boston", "AI", "Real Estate"],
    accentGradient: "linear-gradient(180deg, var(--lavender), var(--pink))"
  },
  {
    id: 2,
    title: "The Emergency 'No-Heat' Playbook: What to Do During a Polar Vortex",
    publication: "ComfiTrust",
    date: "January 8, 2026",
    dateISO: "2026-01-08",
    wordCount: 800,
    readTime: 4,
    url: "https://comfitrust.com/the-emergency-no-heat-playbook-what-to-do-during-a-polar-vortex/",
    excerpt: "When a Polar Vortex hits Greater Boston, it's a brutal test of your home's high-efficiency heating system. This step-by-step emergency playbook covers safety triage, PVC vent checks, error code decoding for Gree, Mitsubishi, and Bosch systems, and how to protect your pipes — so you're never left in the cold at 2 AM.",
    tags: ["HVAC", "Emergency", "Heat Pump", "Boston", "Winter", "Troubleshooting"],
    accentGradient: "linear-gradient(180deg, var(--peach), var(--mint))"
  }
];

// Nav scroll effect
const writingNav = document.getElementById('writing-nav');
window.addEventListener('scroll', () => {
  writingNav.classList.toggle('scrolled', window.scrollY > 20);
});

// Fade-in observer
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);

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

  let filtered = BLOGS.filter(b => {
    const matchCompany = active === 'all' || b.publication === active;
    const matchText = !query ||
      b.title.toLowerCase().includes(query) ||
      b.excerpt.toLowerCase().includes(query) ||
      b.tags.some(t => t.toLowerCase().includes(query)) ||
      b.publication.toLowerCase().includes(query);
    return matchCompany && matchText;
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

  grid.querySelectorAll('.blog-card').forEach(el => observer.observe(el));
}

// Wire up controls
buildChips();
document.getElementById('blog-search').addEventListener('input', renderBlogs);
document.getElementById('blog-sort').addEventListener('change', renderBlogs);
document.getElementById('blog-filter-chips').addEventListener('click', e => {
  if (!e.target.classList.contains('filter-chip')) return;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  renderBlogs();
});

renderBlogs();
