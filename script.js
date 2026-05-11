// Nav scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Blog Dashboard ──────────────────────────────────────────────────────────

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
  }
];

// Build company filter chips
function buildChips() {
  const companies = [...new Set(BLOGS.map(b => b.publication))].sort();
  const chipsEl = document.getElementById('blog-filter-chips');
  companies.forEach(company => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.dataset.tag = company;
    btn.textContent = company;
    chipsEl.appendChild(btn);
  });
}

// Render a single blog card
function renderCard(blog) {
  const tagsHTML = blog.tags.map(t =>
    `<span class="tag">${t}</span>`
  ).join('');

  return `
    <div class="blog-card fade-in" data-id="${blog.id}">
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

// Compute live stats for visible blogs
function updateStats(visible) {
  const totalWords = visible.reduce((s, b) => s + b.wordCount, 0);
  const avgRead = visible.length
    ? Math.round(visible.reduce((s, b) => s + b.readTime, 0) / visible.length)
    : 0;
  document.getElementById('stat-count').textContent = visible.length;
  document.getElementById('stat-words').textContent = totalWords.toLocaleString();
  document.getElementById('stat-read').textContent = visible.length ? `${avgRead} min` : '—';
}

// Main render / filter function
function renderBlogs() {
  const query  = document.getElementById('blog-search').value.toLowerCase().trim();
  const active = document.querySelector('.filter-chip.active')?.dataset.tag || 'all';
  const sort   = document.getElementById('blog-sort').value;

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

  // Observe new cards for fade-in
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

// Fade-in on scroll
const fadeEls = document.querySelectorAll(
  '.timeline-card, .stat-card, .skill-group, .cert-card, .edu-card, .hero-content, .about-text, .about-cards'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);

fadeEls.forEach(el => observer.observe(el));

// Initial blog render (must be after observer is defined)
renderBlogs();
