const BLOGS = [
  {
    id: 1,
    title: "Technoeconomic Analysis: The 2026 Shift to Smart HVAC Standards in Greater Boston",
    publication: "ComfiTrust",
    date: "January 5, 2026",
    dateISO: "2026-01-05",
    wordCount: 1320,
    readTime: 7,
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
    wordCount: 973,
    readTime: 5,
    url: "https://comfitrust.com/the-emergency-no-heat-playbook-what-to-do-during-a-polar-vortex/",
    excerpt: "When a Polar Vortex hits Greater Boston, it's a brutal test of your home's high-efficiency heating system. This step-by-step emergency playbook covers safety triage, PVC vent checks, error code decoding for Gree, Mitsubishi, and Bosch systems, and how to protect your pipes — so you're never left in the cold at 2 AM.",
    tags: ["HVAC", "Emergency", "Heat Pump", "Boston", "Winter", "Troubleshooting"],
    accentGradient: "linear-gradient(180deg, var(--peach), var(--mint))"
  },
  {
    id: 3,
    title: "Massachusetts Heat Pump Reality Check: Do They Really Work at -15°F?",
    publication: "ComfiTrust",
    date: "January 12, 2026",
    dateISO: "2026-01-12",
    wordCount: 1034,
    readTime: 5,
    url: "https://comfitrust.com/massachusetts-heat-pump-reality-check-do-they-really-work-at-15f/",
    excerpt: "A technical reality check on air-source heat pumps in New England winters — examining COP ratings across temperature ranges, EVI and Flash Injection technology, brand comparisons across Mitsubishi, Bosch, and Daikin, and Massachusetts-specific rebates and the No-Cost Heat Pump Program.",
    tags: ["HVAC", "Heat Pump", "Massachusetts", "Winter", "Rebates", "Energy Efficiency"],
    accentGradient: "linear-gradient(180deg, var(--pink), var(--peach))"
  },
  {
    id: 4,
    title: "Nova Scotia Rebate Update: The 2026 Guide",
    publication: "Auxaire",
    date: "January 13, 2026",
    dateISO: "2026-01-13",
    wordCount: 1573,
    readTime: 8,
    url: "https://auxaire.com/2026/01/13/nova-scotia-rebate-update-the-2026-guide/",
    excerpt: "Nova Scotia homeowners can stack up to $30,000 in 2026 rebates for switching from oil to heat pumps — but major programs are expected to deplete early. This guide covers OHPA grants, income-based top-ups, Efficiency NS home assessments, supplemental insulation rebates, and 0% PACE financing options.",
    tags: ["Rebates", "Nova Scotia", "Heat Pump", "Energy Efficiency", "HVAC", "Home Improvement"],
    accentGradient: "linear-gradient(180deg, var(--peach), var(--lavender))"
  },
  {
    id: 5,
    title: "The \"Burning Plastic\" Smell: Is Your Furnace Safe?",
    publication: "WiserAire",
    date: "January 14, 2026",
    dateISO: "2026-01-14",
    wordCount: 1566,
    readTime: 8,
    url: "https://wiseraire.com/the-burning-plastic-smell-is-your-furnace-safe/",
    excerpt: "That burning plastic smell from your furnace could be dust — or a failing blower motor, electrical arcing, or a cracked heat exchanger leaking carbon monoxide. This Winnipeg-focused guide walks through the three main causes, emergency shutdown steps, and when to call for 24/7 repair.",
    tags: ["HVAC", "Furnace", "Safety", "Winnipeg", "Carbon Monoxide", "Troubleshooting"],
    accentGradient: "linear-gradient(180deg, var(--mint), var(--peach))"
  },
  {
    id: 6,
    title: "Is Your Heat Pump Ready for -30°C? A Maritime Survival Guide",
    publication: "Auxaire",
    date: "January 9, 2026",
    dateISO: "2026-01-09",
    wordCount: 1346,
    readTime: 7,
    url: "https://auxaire.com/2026/01/09/is-your-heat-pump-ready-for-30c-a-maritime-survival-guide/",
    excerpt: "Modern cold-climate heat pumps can hold the line at -30°C — but only if they're properly sized, coated for coastal salt air, and backed by the right dual-fuel strategy. This Maritime survival guide covers Enhanced Vapor Injection technology, anti-corrosion coatings, frost management, and 2026 rebate programs offering up to $30,000 in Nova Scotia.",
    tags: ["HVAC", "Heat Pump", "Nova Scotia", "Winter", "Rebates", "Energy Efficiency"],
    accentGradient: "linear-gradient(180deg, var(--mint), var(--lavender))"
  },
  {
    id: 7,
    title: "Navigating the 2026 Mass Save Rebate Reductions: What You Need to Know NOW",
    publication: "ComfiTrust",
    date: "January 15, 2026",
    dateISO: "2026-01-15",
    wordCount: 1515,
    readTime: 8,
    url: "https://comfitrust.com/navigating-the-2026-mass-save-rebate-reductions-what-you-need-to-know-now/",
    excerpt: "Massachusetts homeowners face a \"triple hit\" to heat pump budgets in 2026 as Mass Save slashes maximum rebates from $10,000 to $8,500, new tonnage-based calculations and refrigerant compliance rules tighten eligibility, and federal Section 25C tax credits expire — with a breakdown of what to do before the cuts take full effect.",
    tags: ["HVAC", "Heat Pump", "Massachusetts", "Rebates", "Energy Efficiency", "Mass Save"],
    accentGradient: "linear-gradient(180deg, var(--lavender), var(--mint))"
  },
  {
    id: 8,
    title: "Manitoba Hydro Bills Too High? 5 Ways to Optimize Your Furnace Today",
    publication: "WiserAire",
    date: "January 16, 2026",
    dateISO: "2026-01-16",
    wordCount: 1761,
    readTime: 9,
    url: "https://wiseraire.com/manitoba-hydro-bills-too-high-5-ways-to-optimize-your-furnace-today/",
    excerpt: "Five practical strategies for cutting Manitoba Hydro bills through furnace optimization — from filter swaps and duct sealing to smart thermostats and intelligent monitoring — with cost estimates and expected savings for each upgrade.",
    tags: ["HVAC", "Furnace", "Energy Efficiency", "Winnipeg", "Manitoba", "Smart Home"],
    accentGradient: "linear-gradient(180deg, var(--peach), var(--pink))"
  },
  {
    id: 9,
    title: "Why Your Boston Home Has Hot and Cold Spots (and How to Fix Them)",
    publication: "ComfiTrust",
    date: "January 20, 2026",
    dateISO: "2026-01-20",
    wordCount: 1436,
    readTime: 7,
    url: "https://comfitrust.com/why-your-boston-home-has-hot-and-cold-spots-and-how-to-fix-them/",
    excerpt: "Boston homes battle temperature imbalances caused by the stack effect, aging ductwork, and urban heat islands — this guide covers professional air balancing, zoning systems, and ductless mini-splits as targeted fixes, with Mass Save rebates that can offset upgrade costs.",
    tags: ["HVAC", "Boston", "Heat Pump", "Energy Efficiency", "Mass Save", "Home Improvement"],
    accentGradient: "linear-gradient(180deg, var(--mint), var(--pink))"
  },
  {
    id: 10,
    title: "Where Should You Actually Put CO Detectors in a Split-Level Home?",
    publication: "WiserAire",
    date: "January 22, 2026",
    dateISO: "2026-01-22",
    wordCount: 1036,
    readTime: 5,
    url: "https://wiseraire.com/where-should-you-actually-put-co-detectors-in-a-split-level-home/",
    excerpt: "CO doesn't sink or rise — it follows airflow, which makes split-level homes especially tricky. This guide covers the exact placement rules for bedroom doors, garage entries, and mechanical spaces, plus the common installation mistakes that leave dangerous blind spots.",
    tags: ["Safety", "Carbon Monoxide", "HVAC", "Furnace", "Winnipeg", "Home Improvement"],
    accentGradient: "linear-gradient(180deg, var(--lavender), var(--peach))"
  },
  {
    id: 11,
    title: "Why Is My Furnace Blowing Cold Air?",
    publication: "AuraClimatpro",
    date: "January 23, 2026",
    dateISO: "2026-01-23",
    wordCount: 1197,
    readTime: 6,
    url: "https://auraclimatpro.com/why-is-my-furnace-blowing-cold-air/",
    excerpt: "A furnace blowing cold air isn't always a crisis — seven common culprits from thermostat mode to dirty filters can be ruled out before calling a tech. This Montreal-focused guide walks through each cause and the DIY fix or escalation threshold for each.",
    tags: ["HVAC", "Furnace", "Troubleshooting", "Montreal", "Home Improvement"],
    accentGradient: "linear-gradient(180deg, var(--pink), var(--lavender))"
  },
  {
    id: 12,
    title: "Pourquoi mon fournaise souffle-t-elle de l'air froid?",
    publication: "AuraClimatpro",
    date: "January 23, 2026",
    dateISO: "2026-01-23",
    wordCount: 1415,
    readTime: 7,
    url: "https://auraclimatpro.com/pourquoi-mon-fournaise-souffle-t-elle-de-lair-froid/",
    excerpt: "Une fournaise qui souffle de l'air froid n'est pas toujours en panne — sept causes courantes, du réglage du thermostat au filtre encrassé, peuvent être éliminées avant d'appeler un technicien. Guide de dépannage pour propriétaires montréalais.",
    tags: ["HVAC", "Furnace", "Troubleshooting", "Montreal", "French", "Home Improvement"],
    accentGradient: "linear-gradient(180deg, var(--peach), var(--lavender))"
  },
  {
    id: 13,
    title: "Stop Cringing at Your Energy Bill: 10 Ways to Stay Warm for Less",
    publication: "AuraClimatpro",
    date: "January 23, 2026",
    dateISO: "2026-01-23",
    wordCount: 1022,
    readTime: 5,
    url: "https://auraclimatpro.com/stop-cringing-at-your-energy-bill-10-ways-to-stay-warm-for-less/",
    excerpt: "Ten budget-friendly strategies to cut winter heating costs without sacrificing comfort — from weatherstripping and programmable thermostats to HVAC maintenance and smart home upgrades, with practical thresholds for when a professional tune-up pays for itself.",
    tags: ["Energy Efficiency", "HVAC", "Home Improvement", "Montreal", "Smart Home", "Winter"],
    accentGradient: "linear-gradient(180deg, var(--mint), var(--peach))"
  },
  {
    id: 14,
    title: "Arrêtez de grimacer devant votre facture d'énergie: 10 façons de rester au chaud à moindre coût",
    publication: "AuraClimatpro",
    date: "January 23, 2026",
    dateISO: "2026-01-23",
    wordCount: 1158,
    readTime: 6,
    url: "https://auraclimatpro.com/arretez-de-grimacer-devant-votre-facture-denergie-10-facons-de-rester-au-chaud-a-moindre-cout/",
    excerpt: "Dix stratégies pratiques pour réduire les factures de chauffage hivernal — calfeutrage des fuites, thermostats intelligents et optimisation de la ventilation — pour rester au chaud à Montréal sans sacrifier le budget.",
    tags: ["Energy Efficiency", "HVAC", "Home Improvement", "Montreal", "French", "Winter"],
    accentGradient: "linear-gradient(180deg, var(--lavender), var(--pink))"
  },
  {
    id: 15,
    title: "Boiler vs. Furnace: The Best Heating Options for Historic Beacon Hill Brownstones",
    publication: "ComfiTrust",
    date: "January 23, 2026",
    dateISO: "2026-01-23",
    wordCount: 1039,
    readTime: 5,
    url: "https://comfitrust.com/boiler-vs-furnace-the-best-heating-options-for-historic-beacon-hill-brownstones/",
    excerpt: "Beacon Hill's solid masonry brownstones make ductwork nearly impossible — this breakdown explains why boilers outperform furnaces in historic homes, how hybrid heat pump systems fit the preservation constraints, and which Mass Save rebates apply in 2026.",
    tags: ["HVAC", "Boston", "Heat Pump", "Rebates", "Mass Save", "Home Improvement"],
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

  grid.querySelectorAll('.blog-card').forEach(el => observer.observe(el));
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
