// APPLICATIONS is defined in data.js, loaded before this script

// Nav scroll effect
const jtNav = document.getElementById('jt-nav');
window.addEventListener('scroll', () => {
  jtNav.classList.toggle('scrolled', window.scrollY > 20);
});

// An "applied" entry with no update for this many days is presumed ghosted.
const GHOST_AFTER_DAYS = 21;

const STATUS_LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  ghosted: 'Ghosted',
};

const STATUS_ACCENTS = {
  applied: 'var(--lavender)',
  interview: 'var(--peach)',
  offer: 'var(--mint)',
  rejected: 'var(--pink)',
  ghosted: 'var(--muted)',
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysSince(dateStr) {
  const applied = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return Math.floor((now - applied) / 86400000);
}

// Ghosted status is derived at render time from today's date, not stored —
// an entry silently becomes "Ghosted" once GHOST_AFTER_DAYS pass with no update.
function getEffectiveStatus(app) {
  if (app.status === 'applied' && daysSince(app.dateApplied) >= GHOST_AFTER_DAYS) {
    return 'ghosted';
  }
  return app.status;
}

function renderCard(app) {
  const effectiveStatus = getEffectiveStatus(app);
  const statusLabel = STATUS_LABELS[effectiveStatus] || effectiveStatus;
  const accent = STATUS_ACCENTS[effectiveStatus] || 'var(--lavender)';
  const linkHtml = app.link
    ? `<a href="${app.link}" target="_blank" rel="noopener" class="jt-link-btn">View Posting &rarr;</a>`
    : '';
  const ghostNote = effectiveStatus === 'ghosted'
    ? `<span>&#128123; ${daysSince(app.dateApplied)} days, no response</span>`
    : '';

  return `
    <div class="jt-card fade-in">
      <div class="jt-card-accent" style="background: ${accent}"></div>
      <div class="jt-card-body">
        <div class="jt-card-top">
          <div class="jt-card-titles">
            <h3>${app.role}</h3>
            <p>${app.company}</p>
          </div>
          <span class="jt-status ${effectiveStatus}">${statusLabel}</span>
        </div>
        <div class="jt-meta-row">
          <span>&#128197; Applied ${formatDate(app.dateApplied)}</span>
          ${ghostNote}
        </div>
        ${app.notes ? `<p class="jt-notes">${app.notes}</p>` : ''}
        ${linkHtml ? `<div class="jt-card-footer">${linkHtml}</div>` : ''}
      </div>
    </div>`;
}

function updateStats(visible) {
  const statuses = visible.map(getEffectiveStatus);
  const total = visible.length;
  const active = statuses.filter((s) => s === 'applied' || s === 'interview').length;
  const interviews = statuses.filter((s) => s === 'interview').length;
  const offers = statuses.filter((s) => s === 'offer').length;
  const ghosted = statuses.filter((s) => s === 'ghosted').length;
  document.getElementById('jt-stat-total').textContent = total;
  document.getElementById('jt-stat-active').textContent = active;
  document.getElementById('jt-stat-interviews').textContent = interviews;
  document.getElementById('jt-stat-offers').textContent = offers;
  document.getElementById('jt-stat-ghosted').textContent = ghosted;
}

function renderApplications() {
  const query = document.getElementById('jt-search').value.toLowerCase().trim();
  const activeStatus = document.querySelector('#jt-filter-chips .filter-chip.active')?.dataset.status || 'all';
  const sort = document.getElementById('jt-sort').value;

  let filtered = APPLICATIONS.filter((a) => {
    const matchStatus = activeStatus === 'all' || getEffectiveStatus(a) === activeStatus;
    const matchText = !query ||
      a.company.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query);
    return matchStatus && matchText;
  });

  filtered.sort((a, b) => {
    if (sort === 'company') return a.company.localeCompare(b.company);
    const dateA = new Date(a.dateApplied);
    const dateB = new Date(b.dateApplied);
    return sort === 'oldest' ? dateA - dateB : dateB - dateA;
  });

  const grid = document.getElementById('jt-grid');
  const empty = document.getElementById('jt-empty');

  grid.innerHTML = filtered.map(renderCard).join('');
  empty.style.display = filtered.length ? 'none' : 'block';
  updateStats(filtered);
}

document.getElementById('jt-search').addEventListener('input', renderApplications);
document.getElementById('jt-sort').addEventListener('change', renderApplications);
document.getElementById('jt-filter-chips').addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  document.querySelectorAll('#jt-filter-chips .filter-chip').forEach((c) => c.classList.remove('active'));
  chip.classList.add('active');
  renderApplications();
});

renderApplications();
