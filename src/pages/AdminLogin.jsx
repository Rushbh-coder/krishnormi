import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoIcon from '../assets/header/logo-icon.png';
import logoWordmark from '../assets/header/logo-wordmark.png';
import iconShowPassword from '../assets/admin/icon-show-password.svg';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? 'Incorrect email or password.'
        : signInError.message);
      return;
    }
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-[#fcfdfc]">
      <aside className="mx-0 my-2 ml-2 flex flex-none basis-[562px] flex-col justify-center gap-12 rounded-2xl bg-[#f0f8f5] px-[72px] py-[62px] max-[960px]:mx-2 max-[960px]:my-2 max-[960px]:basis-auto max-[960px]:gap-8 max-[960px]:px-10 max-[960px]:py-10 max-[520px]:mx-0 max-[520px]:my-0 max-[520px]:rounded-none max-[520px]:px-6 max-[520px]:py-8">
        <Link to="/" className="flex items-center gap-[18px]" aria-label="Krishnormi home">
          <img className="h-auto w-[59px]" src={logoIcon} width={59} height={64} alt="" aria-hidden="true" />
          <img
            className="h-auto w-[248px] max-[520px]:w-[200px]"
            src={logoWordmark}
            width={248}
            height={34}
            alt="Krishnormi"
          />
        </Link>

        <p className="max-w-[420px] font-heading text-[40px] leading-[1.2] font-bold text-[#102a2a] max-[960px]:text-[32px] max-[520px]:text-[26px]">
          Thoughtful care starts with clear, well managed information.
        </p>
        <p className="max-w-[420px] font-body text-lg leading-[1.5] text-[#526562] max-[520px]:text-base">
          Securely manage website content, doctor profiles, treatment information, gallery and
          appointment enquiries.
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12 max-[960px]:px-6 max-[960px]:py-10 max-[960px]:pb-14">
        <form className="flex w-full max-w-[530px] flex-col items-start gap-6" onSubmit={handleSubmit} noValidate>
          <p className="font-heading text-[13px] font-semibold tracking-[0.04em] text-[#df2759]">ADMIN PORTAL</p>
          <h1 className="font-heading text-[38px] font-bold text-[#101828]">Welcome back</h1>
          <p className="-mt-3 font-body text-base text-[#667085]">Sign in to update the Krishnormi website.</p>

          <div className="flex w-full flex-col gap-2">
            <label className="font-heading text-sm font-semibold text-[#344054]" htmlFor="admin-email">
              Email address
            </label>
            <div className="flex h-[52px] w-full items-center rounded-xl border border-[#dde5e1] bg-white shadow-[0_2px_6px_0_rgba(15,41,36,0.04)]">
              <input
                id="admin-email"
                className="h-full w-full rounded-xl border-none bg-transparent px-4 font-body text-[15px] text-[#475467] placeholder:text-[#98a2b3] focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
                type="email"
                name="email"
                autoComplete="username"
                placeholder="admin@krishnormi.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <label className="font-heading text-sm font-semibold text-[#344054]" htmlFor="admin-password">
              Password
            </label>
            <div className="flex h-[52px] w-full items-center rounded-xl border border-[#dde5e1] bg-white shadow-[0_2px_6px_0_rgba(15,41,36,0.04)]">
              <input
                id="admin-password"
                className="h-full w-full rounded-xl border-none bg-transparent px-4 font-body text-[15px] text-[#475467] placeholder:text-[#98a2b3] focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="mr-4 flex h-[18px] w-[18px] flex-none items-center justify-center bg-transparent p-0 [&_img]:h-[18px] [&_img]:w-[18px]"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                <img src={iconShowPassword} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex w-full items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 font-body text-[13px] text-[#536660]">
              <span className="relative inline-flex h-4 w-4">
                <input
                  type="checkbox"
                  className="peer absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span
                  className="pointer-events-none block h-4 w-4 rounded-[4px] border-[1.35px] border-[#6e817b] bg-white peer-checked:border-[#14733e] peer-checked:bg-[#14733e] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
                  aria-hidden="true"
                />
                <svg
                  className="pointer-events-none absolute inset-0 hidden h-4 w-4 p-[3px] text-white peer-checked:block"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M4 8.2 6.8 11 12 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Remember me
            </label>
            <a href="#forgot-password" className="font-heading text-sm font-semibold text-[#14733e] hover:underline">
              Forgot password?
            </a>
          </div>

          {error && (
            <p className="-mt-2 w-full rounded-lg border border-[#f7c8d5] bg-[#fce8ee] px-4 py-3 font-body text-sm text-[#df2759]" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-[54px] w-full rounded-xl bg-[#df2759] font-heading text-base font-semibold text-white shadow-[0_8px_18px_-4px_rgba(224,38,89,0.18)] transition-[background,transform] duration-200 hover:-translate-y-px hover:bg-[#c81f4a] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="font-body text-[13px] text-[#98a2b3]">Only authorised clinic staff can access this portal.</p>
        </form>
      </main>
    </div>
  );
}
