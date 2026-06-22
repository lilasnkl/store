import { getAuthSnapshot, loginUser, logoutUser, maskToken, refreshSession, registerUser } from '../services/auth-store.js';
import { toast } from '../services/toast.js';

let activeMode = 'login';
let modalReady = false;

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function byId(id) {
  return document.getElementById(id);
}

function setText(selector, value, root = document) {
  qsa(selector, root).forEach(element => {
    element.textContent = value;
  });
}

function formatTime(value) {
  if (!value) return 'none';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ensureModal() {
  if (modalReady) return;

  const modal = document.createElement('div');
  modal.className = 'auth-modal-backdrop';
  modal.id = 'authModal';
  modal.hidden = true;
  modal.innerHTML = `
    <section class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
      <div class="auth-dialog-head">
        <div>
          <span class="auth-kicker">Auth endpoint simulation</span>
          <h2 id="authModalTitle">Log in</h2>
        </div>
        <button class="auth-close" type="button" id="authCloseBtn" aria-label="Close auth dialog">&times;</button>
      </div>

      <div class="auth-segment" role="tablist" aria-label="Auth mode">
        <button type="button" data-auth-mode="login" class="active">Log in</button>
        <button type="button" data-auth-mode="register">Join now</button>
      </div>

      <form class="auth-form" id="authForm" novalidate>
        <label class="auth-field" data-register-only>
          <span>Name</span>
          <input id="authName" name="name" type="text" autocomplete="name" placeholder="Sara Buyer" />
        </label>
        <label class="auth-field">
          <span>Email</span>
          <input id="authEmail" name="email" type="email" autocomplete="email" placeholder="buyer@example.com" />
        </label>
        <label class="auth-field">
          <span>Password</span>
          <input id="authPassword" name="password" type="password" autocomplete="current-password" placeholder="At least 6 characters" />
        </label>
        <p class="auth-error" id="authError" aria-live="polite"></p>
        <button class="auth-submit" id="authSubmit" type="submit">Log in</button>
      </form>

      <div class="auth-token-preview" aria-live="polite">
        <div><span>User</span><strong data-auth-user>Guest</strong></div>
        <div><span>Access token</span><code data-auth-access>not issued</code></div>
        <div><span>Refresh token</span><code data-auth-refresh>not issued</code></div>
        <div><span>Access expires</span><strong data-auth-expiry>none</strong></div>
        <button class="auth-refresh-btn" type="button" data-auth-refresh-btn>Refresh token</button>
      </div>
    </section>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', event => {
    if (event.target === modal) closeAuthModal();
  });
  byId('authCloseBtn')?.addEventListener('click', closeAuthModal);
  qsa('[data-auth-mode]', modal).forEach(button => {
    button.addEventListener('click', () => setMode(button.dataset.authMode));
  });
  byId('authForm')?.addEventListener('submit', handleSubmit);
  qsa('[data-auth-refresh-btn]', modal).forEach(button => {
    button.addEventListener('click', handleRefresh);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) closeAuthModal();
  });

  modalReady = true;
}

function setMode(mode) {
  activeMode = mode === 'register' ? 'register' : 'login';
  const modal = byId('authModal');
  const title = byId('authModalTitle');
  const submit = byId('authSubmit');
  const error = byId('authError');

  qsa('.auth-segment, .auth-form', modal).forEach(element => {
    element.hidden = false;
  });
  if (title) title.textContent = activeMode === 'register' ? 'Join now' : 'Log in';
  if (submit) submit.textContent = activeMode === 'register' ? 'Create account' : 'Log in';
  if (error) error.textContent = '';

  qsa('[data-auth-mode]', modal).forEach(button => {
    button.classList.toggle('active', button.dataset.authMode === activeMode);
  });
  qsa('[data-register-only]', modal).forEach(field => {
    field.hidden = activeMode !== 'register';
  });
}

export function openAuthModal(mode = 'login') {
  ensureModal();
  if (mode === 'status') {
    const modal = byId('authModal');
    const title = byId('authModalTitle');
    if (title) title.textContent = 'Auth status';
    qsa('.auth-segment, .auth-form', modal).forEach(element => {
      element.hidden = true;
    });
  } else {
    setMode(mode);
  }
  renderAuthState();
  const modal = byId('authModal');
  if (!modal) return;
  modal.hidden = false;
  setTimeout(() => {
    if (mode === 'status') return;
    const firstInput = activeMode === 'register' ? byId('authName') : byId('authEmail');
    firstInput?.focus();
  }, 20);
}

function closeAuthModal() {
  const modal = byId('authModal');
  if (modal) modal.hidden = true;
}

async function handleSubmit(event) {
  event.preventDefault();
  const error = byId('authError');
  const submit = byId('authSubmit');
  const credentials = {
    name: byId('authName')?.value,
    email: byId('authEmail')?.value,
    password: byId('authPassword')?.value,
  };

  if (error) error.textContent = '';
  if (submit) submit.disabled = true;

  try {
    if (activeMode === 'register') {
      await registerUser(credentials);
      toast('Account created. Tokens issued locally.', 'success');
    } else {
      await loginUser(credentials);
      toast('Logged in. Access token issued locally.', 'success');
    }
    renderAuthState();
    closeAuthModal();
  } catch (authError) {
    if (error) error.textContent = authError.message;
  } finally {
    if (submit) submit.disabled = false;
  }
}

function handleRefresh() {
  try {
    refreshSession();
    renderAuthState();
    toast('Refresh token exchanged for a new access token.', 'success');
  } catch (error) {
    renderAuthState();
    openAuthModal('login');
    toast(error.message, 'error');
  }
}

function handleLogout(event) {
  event?.preventDefault();
  logoutUser();
  renderAuthState();
  toast('Logged out. Local tokens cleared.', 'info');
}

function authorizeAction(label) {
  const snapshot = getAuthSnapshot();
  if (!snapshot.isAuthenticated) {
    toast(`${label} needs login first.`, 'error');
    openAuthModal('login');
    return false;
  }

  if (!snapshot.accessValid) {
    refreshSession();
    renderAuthState();
    toast('Access token refreshed before authorization.', 'success');
  } else {
    toast(`${label} authorized for ${snapshot.user.name}.`, 'success');
  }
  return true;
}

function renderInlinePanel() {
  const userCard = document.querySelector('.user-card');
  if (!userCard) return;

  let panel = byId('authInlinePanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'auth-inline-panel';
    panel.id = 'authInlinePanel';
    panel.innerHTML = `
      <div><span>State</span><strong data-auth-user>Guest</strong></div>
      <div><span>Access</span><code data-auth-access>not issued</code></div>
      <div><span>Refresh</span><code data-auth-refresh>not issued</code></div>
      <button class="auth-refresh-btn" type="button" data-auth-refresh-btn>Refresh token</button>
    `;
    userCard.appendChild(panel);
    panel.querySelector('[data-auth-refresh-btn]')?.addEventListener('click', handleRefresh);
  }
}

export function renderAuthState() {
  const snapshot = getAuthSnapshot();
  const name = snapshot.user?.name || 'user';
  const stateLabel = snapshot.user ? `${snapshot.user.name} (${snapshot.user.role})` : 'Guest';

  setText('.user-greeting strong, .user-card-greeting strong', name);
  setText('.user-sub, .user-card-sub', snapshot.user ? 'authenticated locally' : "let's get started");

  qsa('.cat-nav-right .btn-join, .user-card .btn-blue-full').forEach(button => {
    button.textContent = snapshot.user ? 'Auth status' : 'Join now';
  });
  qsa('.cat-nav-right .btn-login, .user-card .btn-outline-blue').forEach(button => {
    button.textContent = snapshot.user ? 'Log out' : 'Log in';
  });
  qsa('.user-or').forEach(element => {
    element.hidden = Boolean(snapshot.user);
  });

  renderInlinePanel();
  qsa('[data-auth-user]').forEach(element => {
    element.textContent = stateLabel;
  });
  qsa('[data-auth-access]').forEach(element => {
    element.textContent = maskToken(snapshot.session?.accessToken);
  });
  qsa('[data-auth-refresh]').forEach(element => {
    element.textContent = maskToken(snapshot.session?.refreshToken);
  });
  qsa('[data-auth-expiry]').forEach(element => {
    element.textContent = formatTime(snapshot.session?.accessExpiresAt);
  });
  qsa('[data-auth-refresh-btn]').forEach(button => {
    button.disabled = !snapshot.isAuthenticated;
  });
}

function wireAuthButtons() {
  qsa('.cat-nav-right .btn-join, .user-card .btn-blue-full').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      if (getAuthSnapshot().isAuthenticated) {
        openAuthModal('status');
      } else {
        openAuthModal('register');
      }
    });
  });

  qsa('.cat-nav-right .btn-login, .user-card .btn-outline-blue').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      if (getAuthSnapshot().isAuthenticated) handleLogout(event);
      else openAuthModal('login');
    });
  });

  qsa('.icon-btn[aria-label="Messages"], .icon-btn[aria-label="Orders"]').forEach(button => {
    button.addEventListener('click', event => {
      if (!authorizeAction(button.getAttribute('aria-label'))) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  });

  byId('checkoutBtn')?.addEventListener('click', event => {
    if (!authorizeAction('Checkout')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

export function initAuthSimulation() {
  ensureModal();
  wireAuthButtons();
  renderAuthState();
}
