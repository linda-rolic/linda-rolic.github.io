/* ── Job Application Tracker ── */
(function () {
  const STORAGE_KEY = 'jobTrackerApplications';

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

  const SEED_DATA = [
    {
      id: 'seed-1',
      company: 'Northwind Analytics',
      role: 'Data Analyst',
      dateApplied: '2026-06-02',
      status: 'interview',
      link: '',
      notes: 'Referred by a former coworker. First-round call went well; take-home due next week.',
    },
    {
      id: 'seed-2',
      company: 'Cascade Robotics',
      role: 'Junior Software Engineer',
      dateApplied: '2026-06-10',
      status: 'applied',
      link: '',
      notes: 'Applied through company site. No response yet.',
    },
    {
      id: 'seed-3',
      company: 'Harbor & Vine',
      role: 'Marketing Coordinator',
      dateApplied: '2026-05-20',
      status: 'rejected',
      link: '',
      notes: 'Rejected after phone screen — they wanted more agency experience.',
    },
    {
      id: 'seed-4',
      company: 'Bright Path Health',
      role: 'Business Intelligence Analyst',
      dateApplied: '2026-05-28',
      status: 'offer',
      link: '',
      notes: 'Offer received! Reviewing terms, deciding by end of month.',
    },
  ];

  const state = {
    search: '',
    status: 'all',
    sort: 'newest',
    editingId: null,
  };

  const grid = document.getElementById('jt-grid');
  const emptyEl = document.getElementById('jt-empty');
  const searchInput = document.getElementById('jt-search');
  const sortSelect = document.getElementById('jt-sort');
  const filterChips = document.getElementById('jt-filter-chips');
  const addBtn = document.getElementById('jt-add-btn');
  const modalOverlay = document.getElementById('jt-modal-overlay');
  const modalTitle = document.getElementById('jt-modal-title');
  const form = document.getElementById('jt-form');
  const deleteBtn = document.getElementById('jt-delete-btn');
  const cancelBtn = document.getElementById('jt-cancel-btn');

  function loadApplications() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA.slice();
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : SEED_DATA.slice();
    } catch (e) {
      return SEED_DATA.slice();
    }
  }

  function saveApplications(apps) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function computeStats(apps) {
    const total = apps.length;
    const active = apps.filter((a) => a.status === 'applied' || a.status === 'interview').length;
    const interviews = apps.filter((a) => a.status === 'interview').length;
    const offers = apps.filter((a) => a.status === 'offer').length;
    return { total, active, interviews, offers };
  }

  function renderStats(apps) {
    const { total, active, interviews, offers } = computeStats(apps);
    document.getElementById('jt-stat-total').textContent = total;
    document.getElementById('jt-stat-active').textContent = active;
    document.getElementById('jt-stat-interviews').textContent = interviews;
    document.getElementById('jt-stat-offers').textContent = offers;
  }

  function getFilteredSorted(apps) {
    const q = state.search.trim().toLowerCase();
    let filtered = apps.filter((a) => {
      const matchesStatus = state.status === 'all' || a.status === state.status;
      const matchesSearch =
        !q ||
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });

    filtered.sort((a, b) => {
      if (state.sort === 'company') {
        return a.company.localeCompare(b.company);
      }
      const dateA = new Date(a.dateApplied);
      const dateB = new Date(b.dateApplied);
      return state.sort === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }

  function cardTemplate(app) {
    const statusLabel = STATUS_LABELS[app.status] || app.status;
    const accent = STATUS_ACCENTS[app.status] || 'var(--lavender)';
    const linkHtml = app.link
      ? `<a href="${escapeAttr(app.link)}" target="_blank" rel="noopener" class="jt-link-btn">View Posting ↗</a>`
      : '<span></span>';

    return `
      <div class="jt-card" data-id="${escapeAttr(app.id)}">
        <div class="jt-card-accent" style="background: ${accent}"></div>
        <div class="jt-card-body">
          <div class="jt-card-top">
            <div class="jt-card-titles">
              <h3>${escapeHtml(app.role)}</h3>
              <p>${escapeHtml(app.company)}</p>
            </div>
            <span class="jt-status ${app.status}">${statusLabel}</span>
          </div>
          <div class="jt-meta-row">
            <span>&#128197; Applied ${formatDate(app.dateApplied)}</span>
          </div>
          ${app.notes ? `<p class="jt-notes">${escapeHtml(app.notes)}</p>` : ''}
          <div class="jt-card-footer">
            ${linkHtml}
            <div class="jt-card-actions">
              <button class="jt-icon-btn jt-edit-btn" data-id="${escapeAttr(app.id)}">Edit</button>
              <button class="jt-icon-btn danger jt-delete-card-btn" data-id="${escapeAttr(app.id)}">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, '&quot;');
  }

  function render() {
    const apps = loadApplications();
    renderStats(apps);

    const visible = getFilteredSorted(apps);
    if (visible.length === 0) {
      grid.innerHTML = '';
      emptyEl.style.display = 'block';
    } else {
      emptyEl.style.display = 'none';
      grid.innerHTML = visible.map(cardTemplate).join('');
    }

    grid.querySelectorAll('.jt-edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => openModal(btn.dataset.id));
    });
    grid.querySelectorAll('.jt-delete-card-btn').forEach((btn) => {
      btn.addEventListener('click', () => deleteApplication(btn.dataset.id));
    });
  }

  function openModal(id) {
    const apps = loadApplications();
    state.editingId = id || null;

    if (id) {
      const app = apps.find((a) => a.id === id);
      if (!app) return;
      modalTitle.textContent = 'Edit Application';
      document.getElementById('jt-form-id').value = app.id;
      document.getElementById('jt-company').value = app.company;
      document.getElementById('jt-role').value = app.role;
      document.getElementById('jt-date').value = app.dateApplied;
      document.getElementById('jt-status').value = app.status;
      document.getElementById('jt-link').value = app.link || '';
      document.getElementById('jt-notes').value = app.notes || '';
      deleteBtn.style.display = 'inline-block';
    } else {
      modalTitle.textContent = 'Add Application';
      form.reset();
      document.getElementById('jt-form-id').value = '';
      document.getElementById('jt-date').value = new Date().toISOString().slice(0, 10);
      document.getElementById('jt-status').value = 'applied';
      deleteBtn.style.display = 'none';
    }

    modalOverlay.classList.add('open');
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    state.editingId = null;
    form.reset();
  }

  function deleteApplication(id) {
    if (!confirm('Delete this application? This cannot be undone.')) return;
    const apps = loadApplications().filter((a) => a.id !== id);
    saveApplications(apps);
    render();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('jt-form-id').value;
    const entry = {
      id: id || 'app-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      company: document.getElementById('jt-company').value.trim(),
      role: document.getElementById('jt-role').value.trim(),
      dateApplied: document.getElementById('jt-date').value,
      status: document.getElementById('jt-status').value,
      link: document.getElementById('jt-link').value.trim(),
      notes: document.getElementById('jt-notes').value.trim(),
    };

    const apps = loadApplications();
    if (id) {
      const idx = apps.findIndex((a) => a.id === id);
      if (idx !== -1) apps[idx] = entry;
    } else {
      apps.push(entry);
    }
    saveApplications(apps);
    closeModal();
    render();
  }

  // Nav scroll shadow
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('jt-nav');
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    render();
  });

  sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });

  filterChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    filterChips.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    state.status = chip.dataset.status;
    render();
  });

  addBtn.addEventListener('click', () => openModal(null));
  cancelBtn.addEventListener('click', closeModal);
  deleteBtn.addEventListener('click', () => {
    const id = document.getElementById('jt-form-id').value;
    if (id) deleteApplication(id);
    closeModal();
  });
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  form.addEventListener('submit', handleSubmit);

  render();
})();
