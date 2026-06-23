import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../services/auth-context';
import { useToast } from '../services/toast-context';
import { maskToken } from '../services/auth-store';

export default function AuthSimulation() {
  const { snapshot, login, register, refreshTokens, modalMode, openAuth, closeAuth } = useAuth();
  const toast = useToast();

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const isRegister = modalMode === 'register';
  const isStatus = modalMode === 'status';
  const isActive = modalMode !== null;

  useEffect(() => {
    if (!isActive) {
      setError('');
      return;
    }
    const timer = setTimeout(() => {
      if (modalMode === 'register') nameInputRef.current?.focus();
      else if (modalMode === 'login') emailInputRef.current?.focus();
    }, 30);
    return () => clearTimeout(timer);
  }, [modalMode, isActive]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isActive) closeAuth();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isActive, closeAuth]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name, email, password);
        toast('Account created. Tokens issued locally.', 'success');
      } else {
        await login(email, password);
        toast('Logged in. Access token issued locally.', 'success');
      }
      setName('');
      setEmail('');
      setPassword('');
      closeAuth();
    } catch (authError) {
      setError((authError as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const onRefreshClick = () => {
    try {
      refreshTokens();
      toast('Refresh token exchanged for a new access token.', 'success');
    } catch (refreshError) {
      closeAuth();
      toast((refreshError as Error).message, 'error');
    }
  };

  const stateLabel = snapshot.user ? `${snapshot.user.name} (${snapshot.user.role})` : 'Guest';
  const userName = snapshot.user?.name || 'user';

  useEffect(() => {
    const userCards = document.querySelectorAll('.user-card');
    userCards.forEach((userCard) => {
      let panel = userCard.querySelector<HTMLElement>('#authInlinePanel');
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
      }
      panel.querySelector<HTMLElement>('[data-auth-user]')!.textContent = stateLabel;
      panel.querySelector<HTMLElement>('[data-auth-access]')!.textContent = maskToken(snapshot.session?.accessToken);
      panel.querySelector<HTMLElement>('[data-auth-refresh]')!.textContent = maskToken(snapshot.session?.refreshToken);
      const refreshBtn = panel.querySelector<HTMLButtonElement>('[data-auth-refresh-btn]');
      if (refreshBtn) refreshBtn.disabled = !snapshot.isAuthenticated;
    });
    document
      .querySelectorAll('.user-greeting strong, .user-card-greeting strong')
      .forEach((el) => {
        el.textContent = userName;
      });
    document.querySelectorAll('.user-sub, .user-card-sub').forEach((el) => {
      el.textContent = snapshot.user ? 'authenticated locally' : "let's get started";
    });
    document
      .querySelectorAll('.cat-nav-right .btn-join, .user-card .btn-blue-full')
      .forEach((btn) => {
        btn.textContent = snapshot.user ? 'Auth status' : 'Join now';
      });
    document
      .querySelectorAll('.cat-nav-right .btn-login, .user-card .btn-outline-blue')
      .forEach((btn) => {
        btn.textContent = snapshot.user ? 'Log out' : 'Log in';
      });
    document.querySelectorAll('.user-or').forEach((el) => {
      (el as HTMLElement).hidden = Boolean(snapshot.user);
    });
  }, [stateLabel, userName, snapshot]);

  if (!isActive) return null;

  return (
    <div
      className="auth-modal-backdrop"
      id="authModal"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeAuth();
      }}
    >
      <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
        <div className="auth-dialog-head">
          <div>
            <span className="auth-kicker">Auth endpoint simulation</span>
            <h2 id="authModalTitle">{isStatus ? 'Auth status' : isRegister ? 'Join now' : 'Log in'}</h2>
          </div>
          <button
            className="auth-close"
            type="button"
            id="authCloseBtn"
            aria-label="Close auth dialog"
            onClick={closeAuth}
          >
            &times;
          </button>
        </div>

        {!isStatus && (
          <>
            <div className="auth-segment" role="tablist" aria-label="Auth mode">
              <button
                type="button"
                data-auth-mode="login"
                className={!isRegister ? 'active' : ''}
                onClick={() => openAuth('login')}
              >
                Log in
              </button>
              <button
                type="button"
                data-auth-mode="register"
                className={isRegister ? 'active' : ''}
                onClick={() => openAuth('register')}
              >
                Join now
              </button>
            </div>

            <form className="auth-form" id="authForm" noValidate onSubmit={submit}>
              <label className="auth-field" hidden={!isRegister}>
                <span>Name</span>
                <input
                  ref={nameInputRef}
                  id="authName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Sara Buyer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="auth-field">
                <span>Email</span>
                <input
                  ref={emailInputRef}
                  id="authEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="buyer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input
                  id="authPassword"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <p className="auth-error" id="authError" aria-live="polite">
                {error}
              </p>
              <button className="auth-submit" id="authSubmit" type="submit" disabled={submitting}>
                {isRegister ? 'Create account' : 'Log in'}
              </button>
            </form>
          </>
        )}

        <div className="auth-token-preview" aria-live="polite">
          <div>
            <span>User</span>
            <strong data-auth-user>{stateLabel}</strong>
          </div>
          <div>
            <span>Access token</span>
            <code data-auth-access>{maskToken(snapshot.session?.accessToken)}</code>
          </div>
          <div>
            <span>Refresh token</span>
            <code data-auth-refresh>{maskToken(snapshot.session?.refreshToken)}</code>
          </div>
          <div>
            <span>Access expires</span>
            <strong data-auth-expiry>
              {snapshot.session?.accessExpiresAt
                ? new Date(snapshot.session.accessExpiresAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'none'}
            </strong>
          </div>
          <button
            className="auth-refresh-btn"
            type="button"
            data-auth-refresh-btn
            disabled={!snapshot.isAuthenticated}
            onClick={onRefreshClick}
          >
            Refresh token
          </button>
        </div>
      </section>
    </div>
  );
}

