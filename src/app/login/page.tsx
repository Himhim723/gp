'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background font-body text-on-background min-h-screen flex flex-col overflow-x-hidden">
      {/* Hero Background Layer */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        <img
          className="w-full h-full object-cover opacity-10"
          alt="Abstract background"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBei7FsggVIDnfsqprPTFiK4qy2ZatXPYQI_O1ke8mBpJdX8PoQATciCC0mjaBPtMLk5zEtM9Mi5wOjLaPXkgizZaRN_9akqpNE1PVE93lE7O41i3l70EI6UTG5u4jyxPFk3vnpMUEDNCBtdu7FiWgn5V-1c4hZfoO6lWKSmisMvu4JWvjb0diXHLIlhojGm14d5DRDIVEDtvtssHVVODr8RfWeR1O4rvDn8eMqPppULx-Dt9owPy5JZ2olykHseBZqS7-qoXYR0z9B"
        />
      </div>

      {/* Top Branding */}
      <motion.header variants={fadeDown} initial="hidden" animate="visible"
        className="relative z-10 w-full py-8 px-8 flex justify-center">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span className="font-headline font-extrabold text-3xl tracking-tighter text-on-background">
            VoltSeminar
          </span>
        </Link>
      </motion.header>

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px]">
          {/* Login Card */}
          <motion.div variants={slideUp} initial="hidden" animate="visible"
            className="bg-surface-container-lowest rounded-xl shadow-[0_40px_40px_-15px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300">
            <div className="p-8 md:p-12">
              <motion.div variants={stagger(0.1)} initial="hidden" animate="visible" className="mb-10">
                <span className="font-label text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                  Welcome Back
                </span>
                <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-background">
                  Portal Access
                </h1>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mb-6 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm font-medium overflow-hidden"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email */}
                <motion.div variants={stagger(0.2)} initial="hidden" animate="visible" className="space-y-2">
                  <label
                    className="font-label text-sm font-semibold text-on-surface-variant"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                      mail
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-b-2 border-outline focus:border-primary focus:ring-0 transition-all font-body text-on-surface placeholder:text-outline-variant"
                      id="email"
                      placeholder="name@company.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={stagger(0.3)} initial="hidden" animate="visible" className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      className="font-label text-sm font-semibold text-on-surface-variant"
                      htmlFor="password"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                      lock
                    </span>
                    <input
                      className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-b-2 border-outline focus:border-primary focus:ring-0 transition-all font-body text-on-surface placeholder:text-outline-variant"
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </motion.div>

                {/* Action */}
                <motion.div variants={stagger(0.4)} initial="hidden" animate="visible" className="pt-4">
                  <button
                    className="gradient-button w-full py-4 px-8 rounded-lg font-headline font-bold text-on-primary text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                  >
                    <span>{loading ? 'Logging in...' : 'Login'}</span>
                    {!loading && (
                      <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    )}
                  </button>
                </motion.div>
              </form>
            </div>

            {/* Footer of Card */}
            <motion.div variants={stagger(0.5)} initial="hidden" animate="visible"
              className="bg-surface-container-high p-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="font-body text-sm text-on-surface-variant">
                Don&apos;t have an account yet?
              </p>
              <Link
                href="/register"
                className="bg-surface-container-lowest text-primary font-headline font-bold text-sm px-6 py-3 rounded-lg border border-outline-variant/15 hover:bg-white hover:shadow-sm transition-all active:scale-95"
              >
                Create an Account
              </Link>
            </motion.div>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={stagger(0.6)} initial="hidden" animate="visible"
            className="mt-8 flex justify-center gap-6">
            <a className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-on-background transition-colors" href="#">
              System Status
            </a>
            <span className="text-outline-variant/30">&bull;</span>
            <a className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-on-background transition-colors" href="#">
              Privacy Policy
            </a>
            <span className="text-outline-variant/30">&bull;</span>
            <a className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-on-background transition-colors" href="#">
              Terms of Use
            </a>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-12 w-full bg-stone-100 font-body text-sm uppercase tracking-widest">
          <div className="text-stone-500 mb-4 md:mb-0">
            &copy; 2026 KINETIC PRECISION FRAMEWORK. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8">
            <a className="text-stone-500 hover:text-stone-900 transition-colors opacity-80 hover:opacity-100" href="#">
              PRIVACY POLICY
            </a>
            <a className="text-stone-500 hover:text-stone-900 transition-colors opacity-80 hover:opacity-100" href="#">
              TERMS OF SERVICE
            </a>
            <a className="text-stone-500 hover:text-stone-900 transition-colors opacity-80 hover:opacity-100" href="#">
              CONTACT SUPPORT
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
