const STORAGE_KEY = 'campus-admin-token';
const AREA_FILTERS = [
  { value: 'all', label: 'All areas', icon: '📋' },
  { value: 'girls-hostel', label: 'Girls Hostel', icon: '🏠' },
  { value: 'boys-hostel', label: 'Boys Hostel', icon: '🏢' },
  { value: 'campus', label: 'Campus', icon: '🏫' },
];
const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses', icon: '📊' },
  { value: 'pending', label: 'Pending', icon: '⏳' },
  { value: 'in-progress', label: 'In progress', icon: '🔧' },
  { value: 'resolved', label: 'Resolved', icon: '✅' },
];
const TYPE_FILTERS = [
  { value: 'all', label: 'All types', icon: '🔍' },
  { value: 'water-leakage', label: 'Water leakage', icon: '💧' },
  { value: 'fan-not-working', label: 'Fan not working', icon: '🌀' },
  { value: 'electricity-issues', label: 'Electricity issues', icon: '⚡' },
  { value: 'wifi-issues', label: 'WiFi issues', icon: '📶' },
  { value: 'cleanliness-concerns', label: 'Cleanliness concerns', icon: '🧹' },
  { value: 'furniture-damage', label: 'Furniture damage', icon: '🪑' },
  { value: 'room', label: 'Room', icon: '🚪' },
  { value: 'dining-hall', label: 'Dining Hall', icon: '🍽️' },
  { value: 'maintenance', label: 'Maintenance', icon: '🔨' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧼' },
  { value: 'electricity', label: 'Electricity', icon: '💡' },
  { value: 'other', label: 'Other', icon: '📝' },
];
const STATUS_OPTIONS = ['pending', 'in-progress', 'resolved'];

function getApiBase() {
  if (typeof window.CAMPUS_API_URL === 'string' && window.CAMPUS_API_URL.trim()) {
    return window.CAMPUS_API_URL.replace(/\/$/, '');
  }
  if (window.location.origin.includes(':5000')) {
    return window.location.origin;
  }
  return 'http://localhost:5000';
}

const API_BASE = getApiBase();

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const state = {
  token: '',
  admin: null,
  activeTab: 'complaints',
  area: 'all',
  status: 'all',
  type: 'all',
  overview: null,
  complaints: [],
  feedbacks: [],
  contacts: [],
  users: [],
  loading: false,
};

const elements = {
  loginScreen: document.getElementById('loginScreen'),
  dashboardShell: document.getElementById('dashboardShell'),
  sessionLabel: document.getElementById('sessionLabel'),
  loginPanel: document.getElementById('loginPanel'),
  loginForm: document.getElementById('loginForm'),
  usernameInput: document.getElementById('usernameInput'),
  passwordInput: document.getElementById('passwordInput'),
  loginMessage: document.getElementById('loginMessage'),
  refreshButton: document.getElementById('refreshButton'),
  logoutButton: document.getElementById('logoutButton'),
  statsGrid: document.getElementById('statsGrid'),
  sectionTabs: document.getElementById('sectionTabs'),
  tabComplaints: document.getElementById('tabComplaints'),
  tabFeedback: document.getElementById('tabFeedback'),
  tabContacts: document.getElementById('tabContacts'),
  tabUsers: document.getElementById('tabUsers'),
  tabBadgeComplaints: document.getElementById('tabBadgeComplaints'),
  tabBadgeFeedback: document.getElementById('tabBadgeFeedback'),
  tabBadgeContacts: document.getElementById('tabBadgeContacts'),
  tabBadgeUsers: document.getElementById('tabBadgeUsers'),
  areaFilters: document.getElementById('areaFilters'),
  statusFilters: document.getElementById('statusFilters'),
  typeFilters: document.getElementById('typeFilters'),
  activeFilterLabel: document.getElementById('activeFilterLabel'),
  complaintCount: document.getElementById('complaintCount'),
  overviewNote: document.getElementById('overviewNote'),
  complaintsBoard: document.getElementById('complaintsBoard'),
  feedbackCount: document.getElementById('feedbackCount'),
  feedbackBoard: document.getElementById('feedbackBoard'),
  contactCount: document.getElementById('contactCount'),
  contactBoard: document.getElementById('contactBoard'),
  userCount: document.getElementById('userCount'),
  usersBoard: document.getElementById('usersBoard'),
};

const TAB_MAP = {
  complaints: elements.tabComplaints,
  feedback: elements.tabFeedback,
  contacts: elements.tabContacts,
  users: elements.tabUsers,
};

/* ── Helpers ── */

function setMessage(message, tone = 'info') {
  elements.loginMessage.textContent = message || '';
  elements.loginMessage.classList.toggle('error', tone === 'error');
}

function setSessionLabel(text) {
  elements.sessionLabel.textContent = text;
}

function setToken(token) {
  state.token = token;
  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function authHeaders(extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }
  return headers;
}

async function request(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: auth ? authHeaders(headers) : { 'Content-Type': 'application/json', ...headers },
    body,
    cache: 'no-store'
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

/* ── View switching ── */

function showDashboard(adminUsername) {
  document.body.dataset.view = 'dashboard';
  elements.loginScreen.hidden = true;
  elements.dashboardShell.hidden = false;
  setSessionLabel(adminUsername);
}

function showLogin() {
  document.body.dataset.view = 'login';
  elements.loginScreen.hidden = false;
  elements.dashboardShell.hidden = true;
  setSessionLabel('Signed out');
}

function switchTab(tabName) {
  state.activeTab = tabName;

  // Update tab buttons
  elements.sectionTabs.querySelectorAll('.section-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Show/hide tab content
  Object.entries(TAB_MAP).forEach(([key, el]) => {
    el.hidden = key !== tabName;
  });
}

/* ── Formatters ── */

function formatArea(area) {
  const found = AREA_FILTERS.find((item) => item.value === area);
  return found ? `${found.icon} ${found.label}` : area;
}

function formatAreaShort(area) {
  const found = AREA_FILTERS.find((item) => item.value === area);
  return found ? found.label : area;
}

function formatStatus(status) {
  return status
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatType(type) {
  const found = TYPE_FILTERS.find((item) => item.value === type);
  return found ? `${found.icon} ${found.label}` : type;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${API_BASE}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
}

/* ── Render: Filters ── */

function renderFilters() {
  elements.areaFilters.innerHTML = AREA_FILTERS.map(
    (f) => `<button class="chip ${state.area === f.value ? 'active' : ''}" data-filter-group="area" data-value="${f.value}">${f.icon} ${f.label}</button>`
  ).join('');

  elements.statusFilters.innerHTML = STATUS_FILTERS.map(
    (f) => `<button class="chip ${state.status === f.value ? 'active' : ''}" data-filter-group="status" data-value="${f.value}">${f.icon} ${f.label}</button>`
  ).join('');

  elements.typeFilters.innerHTML = TYPE_FILTERS.map(
    (f) => `<button class="chip ${state.type === f.value ? 'active' : ''}" data-filter-group="type" data-value="${f.value}">${f.icon} ${f.label}</button>`
  ).join('');

  const areaLabel = state.area === 'all' ? 'All areas' : formatAreaShort(state.area);
  const statusLabel = state.status === 'all' ? 'All statuses' : formatStatus(state.status);
  const typeLabel = state.type === 'all' ? 'All types' : (TYPE_FILTERS.find((t) => t.value === state.type)?.label || state.type);
  elements.activeFilterLabel.textContent = `${areaLabel} · ${statusLabel} · ${typeLabel}`;
}

/* ── Render: Stats ── */

function renderStats() {
  const s = state.overview?.summary || {};
  const cards = [
    { label: 'Total', value: s.totalComplaints || 0, color: '#6366f1' },
    { label: 'Pending', value: s.pendingComplaints || 0, color: '#f59e0b' },
    { label: 'In Progress', value: s.inProgressComplaints || 0, color: '#3b82f6' },
    { label: 'Resolved', value: s.resolvedComplaints || 0, color: '#10b981' },
    { label: 'Girls Hostel', value: s.girlsHostelComplaints || 0, color: '#ec4899' },
    { label: 'Boys Hostel', value: s.boysHostelComplaints || 0, color: '#8b5cf6' },
    { label: 'Campus', value: s.campusComplaints || 0, color: '#06b6d4' },
    { label: 'Users', value: s.totalUsers || 0, color: '#64748b' },
    { label: 'Feedback', value: s.totalFeedback || 0, color: '#f97316' },
    { label: 'Contact Msgs', value: s.totalContactMessages || 0, color: '#14b8a6' },
  ];

  elements.statsGrid.innerHTML = cards.map(
    (c) => `
      <article class="stat-card" style="--accent-card: ${c.color}">
        <div class="stat-icon" style="background: ${c.color}15; color: ${c.color}">
          <span class="stat-value">${c.value}</span>
        </div>
        <div class="stat-label">${c.label}</div>
      </article>`
  ).join('');
}

/* ── Render: Complaint card ── */

function statusBadgeClass(status) { return `status-${status}`; }
function areaBadgeClass(area) { return `area-${area}`; }

function renderComplaintCard(complaint) {
  const area = complaint.area || 'campus';
  const status = complaint.status || 'pending';
  const type = complaint.type || 'other';
  const statusOptions = STATUS_OPTIONS.map(
    (o) => `<option value="${o}" ${status === o ? 'selected' : ''}>${formatStatus(o)}</option>`
  ).join('');

  return `
    <article class="complaint-card" data-complaint-id="${complaint._id}">
      <div class="complaint-top">
        <div>
          <h4 class="complaint-title">${escapeHtml(complaint.title)}</h4>
          <div class="badges">
            <span class="badge ${areaBadgeClass(area)}">${formatAreaShort(area)}</span>
            <span class="badge ${statusBadgeClass(status)}">${formatStatus(status)}</span>
            <span class="badge">${formatType(type)}</span>
          </div>
        </div>
        <span class="badge-label">${formatDate(complaint.createdAt)}</span>
      </div>

      <div class="complaint-meta">
        <div><strong>Name:</strong> ${escapeHtml(complaint.name)}</div>
        <div><strong>Email:</strong> ${escapeHtml(complaint.email)}</div>
        ${complaint.roomNumber ? `<div><strong>Room:</strong> ${escapeHtml(complaint.roomNumber)}</div>` : ''}
      </div>

      <p class="complaint-body">${escapeHtml(complaint.description)}</p>
      ${complaint.imageUrl ? `<img class="complaint-image" src="${resolveImageUrl(complaint.imageUrl)}" alt="Complaint photo" />` : ''}

      <div class="card-actions">
        <label>
          <span>Update Status</span>
          <select class="status-select" data-role="status-select">
            ${statusOptions}
          </select>
        </label>
        <div class="action-row">
          <button class="action-btn" data-action="save-status" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
            Save Status
          </button>
          <button class="resolve-btn" data-action="resolve" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Mark Resolved
          </button>
        </div>
      </div>
    </article>`;
}

/* ── Render: Complaint board ── */

function groupByArea(complaints) {
  return complaints.reduce((g, c) => {
    const k = c.area || 'campus';
    (g[k] = g[k] || []).push(c);
    return g;
  }, {});
}

function groupByType(complaints) {
  return complaints.reduce((g, c) => {
    const k = c.type || 'other';
    (g[k] = g[k] || []).push(c);
    return g;
  }, {});
}

function getVisibleAreas() {
  return state.area === 'all'
    ? ['girls-hostel', 'boys-hostel', 'campus']
    : [state.area];
}

function getVisibleTypes() {
  return state.type === 'all'
    ? TYPE_FILTERS.filter((i) => i.value !== 'all').map((i) => i.value)
    : [state.type];
}

function renderComplaints() {
  const complaints = state.complaints;
  elements.complaintCount.textContent = `${complaints.length} complaint${complaints.length === 1 ? '' : 's'}`;
  elements.tabBadgeComplaints.textContent = complaints.length;

  if (!complaints.length) {
    elements.complaintsBoard.innerHTML = '<div class="empty-state">No complaints match the selected filters.</div>';
    elements.overviewNote.textContent = 'Try another area or status filter.';
    return;
  }

  const grouped = groupByArea(complaints);
  const visibleAreas = getVisibleAreas();
  const visibleTypes = getVisibleTypes();

  elements.overviewNote.textContent = `${complaints.length} complaint${complaints.length === 1 ? '' : 's'} loaded.`;
  elements.complaintsBoard.innerHTML = visibleAreas
    .map((area) => {
      const areaComplaints = grouped[area] || [];
      if (!areaComplaints.length) return '';

      const AREA_COLORS = {
        'girls-hostel': '#ec4899',
        'boys-hostel': '#8b5cf6',
        'campus': '#06b6d4',
      };
      const accentColor = AREA_COLORS[area] || '#6366f1';
      const typeGroups = groupByType(areaComplaints);

      return `
        <section class="area-section" style="--area-accent: ${accentColor}">
          <div class="area-header">
            <h3>${formatArea(area)}</h3>
            <span class="area-count">${areaComplaints.length} complaint${areaComplaints.length === 1 ? '' : 's'}</span>
          </div>
          <div class="type-sections">
            ${visibleTypes
              .map((type) => {
                const tc = typeGroups[type] || [];
                if (!tc.length) return '';
                return `
                  <section class="type-section">
                    <div class="type-header">
                      <h4>${formatType(type)}</h4>
                      <span class="type-count">${tc.length}</span>
                    </div>
                    <div class="complaint-grid">
                      ${tc.map(renderComplaintCard).join('')}
                    </div>
                  </section>`;
              })
              .filter(Boolean)
              .join('')}
          </div>
        </section>`;
    })
    .filter(Boolean)
    .join('');
}

/* ── Render: Feedback ── */

function renderFeedbackCard(feedback) {
  const complaintTitle = feedback.complaint?.title || 'General feedback';
  const complaintArea = feedback.complaint?.area ? formatAreaShort(feedback.complaint.area) : 'N/A';

  return `
    <article class="feedback-card">
      <div class="feedback-top">
        <div>
          <h4 class="feedback-title">${escapeHtml(feedback.title)}</h4>
          <div class="badges">
            <span class="badge">${escapeHtml(complaintTitle)}</span>
            <span class="badge">${complaintArea}</span>
          </div>
        </div>
        <span class="badge-label">${formatDate(feedback.createdAt)}</span>
      </div>
      <div class="feedback-meta">
        <div><strong>Name:</strong> ${escapeHtml(feedback.name)}</div>
        <div><strong>Email:</strong> ${escapeHtml(feedback.email)}</div>
      </div>
      <p class="feedback-body">${escapeHtml(feedback.descriptionFeedback)}</p>
    </article>`;
}

function renderFeedback() {
  const feedbacks = state.feedbacks;
  elements.feedbackCount.textContent = `${feedbacks.length} record${feedbacks.length === 1 ? '' : 's'}`;
  elements.tabBadgeFeedback.textContent = feedbacks.length;

  if (!feedbacks.length) {
    elements.feedbackBoard.innerHTML = '<div class="empty-state">No feedback has been submitted yet.</div>';
    return;
  }
  elements.feedbackBoard.innerHTML = `<div class="feedback-grid">${feedbacks.map(renderFeedbackCard).join('')}</div>`;
}

/* ── Render: Contacts ── */

function renderContactCard(message) {
  const statusOptions = ['new', 'read', 'archived']
    .map((o) => `<option value="${o}" ${message.status === o ? 'selected' : ''}>${o.charAt(0).toUpperCase() + o.slice(1)}</option>`)
    .join('');

  return `
    <article class="feedback-card" data-contact-id="${message._id}">
      <div class="feedback-top">
        <div>
          <h4 class="feedback-title">${escapeHtml(message.name)}</h4>
          <div class="badges">
            <span class="badge">${escapeHtml(message.email)}</span>
            <span class="badge badge-status-${message.status}">${message.status}</span>
          </div>
        </div>
        <span class="badge-label">${formatDate(message.createdAt)}</span>
      </div>
      <p class="feedback-body">${escapeHtml(message.message)}</p>
      <div class="card-actions">
        <label>
          <span>Status</span>
          <select class="status-select" data-role="contact-status-select">${statusOptions}</select>
        </label>
        <button class="action-btn" data-action="save-contact-status" type="button">Update status</button>
      </div>
    </article>`;
}

function renderContacts() {
  const messages = state.contacts;
  elements.contactCount.textContent = `${messages.length} message${messages.length === 1 ? '' : 's'}`;
  elements.tabBadgeContacts.textContent = messages.length;

  if (!messages.length) {
    elements.contactBoard.innerHTML = '<div class="empty-state">No contact messages yet.</div>';
    return;
  }
  elements.contactBoard.innerHTML = `<div class="feedback-grid">${messages.map(renderContactCard).join('')}</div>`;
}

/* ── Render: Users ── */

function renderUserCard(user) {
  return `
    <article class="feedback-card" data-user-id="${user._id}">
      <div class="feedback-top">
        <div>
          <h4 class="feedback-title">${escapeHtml(user.name)}</h4>
          <div class="badges"><span class="badge">${escapeHtml(user.email)}</span></div>
        </div>
        <span class="badge-label">${formatDate(user.createdAt)}</span>
      </div>
      <div class="card-actions">
        <div class="action-row">
          <button class="resolve-btn" data-action="delete-user" style="background: linear-gradient(135deg, #ef4444, #b91c1c); box-shadow: 0 3px 10px rgba(239, 68, 68, 0.25);" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Delete User
          </button>
        </div>
      </div>
    </article>`;
}

function renderUsers() {
  const users = state.users;
  elements.userCount.textContent = `${users.length} user${users.length === 1 ? '' : 's'}`;
  elements.tabBadgeUsers.textContent = users.length;

  if (!users.length) {
    elements.usersBoard.innerHTML = '<div class="empty-state">No registered users yet.</div>';
    return;
  }
  elements.usersBoard.innerHTML = `<div class="feedback-grid">${users.map(renderUserCard).join('')}</div>`;
}

/* ── Loading helpers ── */

function setLoading(isLoading, target = 'complaints') {
  state.loading = isLoading;
  if (target === 'complaints' && isLoading) {
    elements.complaintsBoard.innerHTML = '<div class="loading-state">Loading complaints...</div>';
  }
  if (target === 'feedback' && isLoading) {
    elements.feedbackBoard.innerHTML = '<div class="loading-state">Loading feedback...</div>';
  }
  if (target === 'contact' && isLoading) {
    elements.contactBoard.innerHTML = '<div class="loading-state">Loading contact messages...</div>';
  }
}

/* ── Data loading ── */

async function loadOverview() {
  const data = await request('/api/admin/overview');
  state.overview = data;
  renderStats();
}

async function loadFeedback() {
  setLoading(true, 'feedback');
  try {
    const data = await request('/api/admin/feedback');
    state.feedbacks = data.feedbacks || [];
    renderFeedback();
  } finally {
    state.loading = false;
  }
}

async function loadContacts() {
  setLoading(true, 'contact');
  try {
    const data = await request('/api/admin/contact');
    state.contacts = data.messages || [];
    renderContacts();
  } finally {
    state.loading = false;
  }
}

async function loadUsers() {
  try {
    const data = await request('/api/admin/users');
    state.users = data.users || [];
    renderUsers();
  } catch (error) {
    elements.usersBoard.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

async function loadComplaints() {
  setLoading(true, 'complaints');
  const params = new URLSearchParams();
  if (state.area !== 'all') params.set('area', state.area);
  if (state.status !== 'all') params.set('status', state.status);
  if (state.type !== 'all') params.set('type', state.type);

  const query = params.toString();
  try {
    const data = await request(`/api/admin/complaints${query ? `?${query}` : ''}`);
    state.complaints = data.complaints || [];
    renderFilters();
    renderComplaints();
  } finally {
    state.loading = false;
  }
}

async function refreshDashboard() {
  try {
    await Promise.all([loadOverview(), loadComplaints(), loadFeedback(), loadContacts(), loadUsers()]);
  } catch (error) {
    if (error.message.toLowerCase().includes('token')) {
      logout();
      return;
    }
    elements.overviewNote.textContent = error.message;
  }
}

async function verifySession() {
  if (!state.token) { showLogin(); return; }
  try {
    const data = await request('/api/admin/me');
    state.admin = data.admin;
    showDashboard(state.admin.username);
    await refreshDashboard();
  } catch (error) {
    logout();
  }
}

async function updateComplaintStatus(complaintId, status) {
  await request(`/api/admin/complaints/${complaintId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  await refreshDashboard();
}

async function handleLogin(event) {
  event.preventDefault();
  setMessage('Signing in...');
  try {
    const payload = {
      username: elements.usernameInput.value.trim(),
      password: elements.passwordInput.value,
    };
    const data = await request('/api/admin/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(payload),
    });
    setToken(data.token);
    state.admin = data.admin;
    setMessage('');
    elements.loginForm.reset();
    showDashboard(data.admin.username);
    await refreshDashboard();
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

function logout() {
  setToken('');
  state.admin = null;
  state.overview = null;
  state.complaints = [];
  state.feedbacks = [];
  state.contacts = [];
  state.users = [];
  setMessage('');
  showLogin();
  renderStats();
  renderFilters();
  elements.complaintsBoard.innerHTML = '';
  elements.feedbackBoard.innerHTML = '';
  elements.contactBoard.innerHTML = '';
  elements.usersBoard.innerHTML = '';
  elements.overviewNote.textContent = '';
  elements.complaintCount.textContent = '0 complaints';
  elements.feedbackCount.textContent = '0 records';
  elements.contactCount.textContent = '0 messages';
  elements.userCount.textContent = '0 users';
  elements.tabBadgeComplaints.textContent = '0';
  elements.tabBadgeFeedback.textContent = '0';
  elements.tabBadgeContacts.textContent = '0';
  elements.tabBadgeUsers.textContent = '0';
}

/* ── Event binding ── */

function bindEvents() {
  elements.loginForm.addEventListener('submit', handleLogin);
  elements.refreshButton.addEventListener('click', refreshDashboard);
  elements.logoutButton.addEventListener('click', logout);

  // Tab switching
  elements.sectionTabs.addEventListener('click', (event) => {
    const tab = event.target.closest('.section-tab');
    if (!tab) return;
    switchTab(tab.dataset.tab);
  });

  // Complaint filters
  elements.areaFilters.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-filter-group="area"]');
    if (!button) return;
    state.area = button.dataset.value;
    renderFilters();
    await loadComplaints();
  });

  elements.statusFilters.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-filter-group="status"]');
    if (!button) return;
    state.status = button.dataset.value;
    renderFilters();
    await loadComplaints();
  });

  elements.typeFilters.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-filter-group="type"]');
    if (!button) return;
    state.type = button.dataset.value;
    renderFilters();
    await loadComplaints();
  });

  // Contact status update
  elements.contactBoard.addEventListener('click', async (event) => {
    const card = event.target.closest('[data-contact-id]');
    if (!card) return;
    const messageId = card.dataset.contactId;
    const select = card.querySelector('[data-role="contact-status-select"]');
    if (event.target.dataset.action === 'save-contact-status') {
      try {
        event.target.disabled = true;
        await request(`/api/admin/contact/${messageId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: select.value }),
        });
        await refreshDashboard();
      } catch (error) {
        elements.overviewNote.textContent = error.message;
      } finally {
        event.target.disabled = false;
      }
    }
  });

  // Complaint status update
  elements.complaintsBoard.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;
    
    const card = btn.closest('[data-complaint-id]');
    if (!card) return;
    
    const complaintId = card.dataset.complaintId;
    const select = card.querySelector('[data-role="status-select"]');
    const action = btn.dataset.action;

    if (action === 'save-status') {
      try {
        btn.disabled = true;
        await updateComplaintStatus(complaintId, select.value);
      } catch (error) {
        elements.overviewNote.textContent = 'Error: ' + error.message;
      } finally {
        btn.disabled = false;
      }
    }

    if (action === 'resolve') {
      try {
        btn.disabled = true;
        select.value = 'resolved';
        await updateComplaintStatus(complaintId, 'resolved');
      } catch (error) {
        elements.overviewNote.textContent = 'Error: ' + error.message;
      } finally {
        btn.disabled = false;
      }
    }
  });

  // User deletion
  elements.usersBoard.addEventListener('click', async (event) => {
    const card = event.target.closest('[data-user-id]');
    if (!card) return;
    const userId = card.dataset.userId;
    const btn = event.target.closest('[data-action="delete-user"]');
    
    if (btn) {
      if (!confirm('Are you sure you want to delete this user? This will also delete all their complaints and feedback.')) return;
      try {
        btn.disabled = true;
        await request(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });
        await refreshDashboard();
      } catch (error) {
        elements.overviewNote.textContent = error.message;
      } finally {
        btn.disabled = false;
      }
    }
  });
}

/* ── Bootstrap ── */

function bootstrap() {
  const savedToken = localStorage.getItem(STORAGE_KEY);
  if (savedToken) {
    state.token = savedToken;
  }

  elements.loginScreen.hidden = false;
  elements.dashboardShell.hidden = true;
  document.body.dataset.view = 'login';

  if (state.token) {
    verifySession();
    return;
  }
  showLogin();
}

bindEvents();
bootstrap();
