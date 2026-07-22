// APPLICATIONS is defined in data.js, loaded before this script

// Nav scroll effect
const jtNav = document.getElementById('jt-nav');
window.addEventListener('scroll', () => {
  jtNav.classList.toggle('scrolled', window.scrollY > 20);
});

const STATUS_LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

const STATUS_ACCENTS = {
  applied: 'var(--lavender)',
  interview: 'var(--peach)',
  offer: 'var(--mint)',
  rejected: 'var(--pink)',
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderCard(app) {
  const statusLabel = STATUS_LABELS[app.status] || app.status;
  const accent = STATUS_ACCENTS[app.status] || 'var(--lavender)';
  const linkHtml = app.link
    ? `<a href="${app.link}" target="_blank" rel="noopener" class="jt-link-btn">View Posting &rarr;</a>`
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
          <span class="jt-status ${app.status}">${statusLabel}</span>
        </div>
        <div class="jt-meta-row">
          <span>&#128197; Applied ${formatDate(app.dateApplied)}</span>
        </div>
        ${app.notes ? `<p class="jt-notes">${app.notes}</p>` : ''}
        ${linkHtml ? `<div class="jt-card-footer">${linkHtml}</div>` : ''}
      </div>
    </div>`;
}

function updateStats(visible) {
  const total = visible.length;
  const active = visible.filter((a) => a.status === 'applied' || a.status === 'interview').length;
  const interviews = visible.filter((a) => a.status === 'interview').length;
  const offers = visible.filter((a) => a.status === 'offer').length;
  document.getElementById('jt-stat-total').textContent = total;
  document.getElementById('jt-stat-active').textContent = active;
  document.getElementById('jt-stat-interviews').textContent = interviews;
  document.getElementById('jt-stat-offers').textContent = offers;
}

function renderApplications() {
  const query = document.getElementById('jt-search').value.toLowerCase().trim();
  const activeStatus = document.querySelector('#jt-filter-chips .filter-chip.active')?.dataset.status || 'all';
  const sort = document.getElementById('jt-sort').value;

  let filtered = APPLICATIONS.filter((a) => {
    const matchStatus = activeStatus === 'all' || a.status === activeStatus;
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
