'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const slideUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay } },
});

type Step = 'form' | 'verify' | 'success';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [customerType, setCustomerType] = useState<'PERSONAL' | 'COMPANY'>('PERSONAL');
  const [formData, setFormData] = useState({
    name: '',
    telephone: '',
    email: '',
    password: '',
    companyName: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        customerType: customerType,
        companyName: customerType === 'COMPANY' ? formData.companyName : null,
      });
      setStep('verify');
      setCountdown(600); // 10 minutes
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/verify-email', {
        email: formData.email,
        code: otp,
      });
      setStep('success');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        customerType: customerType,
        companyName: customerType === 'COMPANY' ? formData.companyName : null,
      });
      setCountdown(600);
      setOtp('');
    } catch {
      setError('Failed to resend code. Please try again.');
    }
  };

  // Success state
  if (step === 'success') {
    return (
      <>
        <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[120px] -z-10"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-tertiary-fixed/10 rounded-full blur-[150px] -z-10"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="bg-surface-container-lowest p-12 rounded-xl shadow-2xl max-w-md text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 14 }}
              className="w-24 h-24 bg-tertiary-fixed rounded-full flex items-center justify-center mx-auto"
            >
              <span
                className="material-symbols-outlined text-tertiary text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </motion.div>
            <motion.h2 variants={stagger(0.3)} initial="hidden" animate="visible"
              className="font-headline text-3xl font-extrabold text-on-surface">Profile Created</motion.h2>
            <motion.p variants={stagger(0.4)} initial="hidden" animate="visible" className="text-secondary">
              Welcome to Kinetic. Your membership is now active. You can start booking seminars immediately.
            </motion.p>
            <motion.div variants={stagger(0.5)} initial="hidden" animate="visible">
              <Link
                href="/login"
                className="block w-full gradient-button text-on-primary py-4 rounded-md font-headline font-bold text-center"
              >
                Login Now
              </Link>
            </motion.div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-tertiary-fixed/10 rounded-full blur-[150px] -z-10"></div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Side Info / Branding Anchor */}
          <motion.div variants={fadeLeft} initial="hidden" animate="visible"
            className="md:col-span-5 flex flex-col space-y-8">
            <div className="space-y-4">
              <Link href="/" className="text-primary font-headline font-black text-3xl tracking-tighter">
                KINETIC
              </Link>
              <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface">
                Join the Evolution.
              </h1>
              <p className="text-secondary text-lg leading-relaxed max-w-sm">
                Access exclusive EV seminars, technical workshops, and the future of sustainable mobility precision.
              </p>
            </div>

            <div className="bg-surface-container-low rounded-xl p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-primary">account_circle</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-on-surface">Profile Identity</p>
                  <p className="text-sm text-secondary">
                    Your profile is the gateway to precision seminar booking.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-tertiary/10 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-tertiary">key</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-on-surface">Secure Access</p>
                  <p className="text-sm text-secondary">
                    Email is your primary login credential. We use encrypted one-time verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="hidden md:block rounded-xl overflow-hidden shadow-sm">
              <img
                className="w-full h-48 object-cover"
                alt="EV Charging Station"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_g7FYEYPPB-FFtg4NNT9gogwmw2cQADReBXKgsPfTDSnLTIDYAHSxCU9afdVXHKidiAwLfCdwImwIvhyQu00Z_IuFPzb5px1MVF3BmABvhmnqrrlifbL16BkDPqQUNK0LAJe_N6VWvLTC1Q9QiXk8MmafLDCZ_z27tyylPEtVar9S4K1tXn-borQ_Nzw6BWNy08LQD5YT1arSdjczAmS7Fr62dN4AbugPbS7WHHRFpZoWcAbR3BQer8XaUud6tdkHAovekh8e9uuK"
              />
            </div>
          </motion.div>

          {/* Registration Container */}
          <motion.div variants={slideUp} initial="hidden" animate="visible"
            className="md:col-span-7 bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-sm">
            <form className="space-y-10" onSubmit={handleRegister}>
              <div className="space-y-6">
                <h2 className="font-headline text-2xl font-bold tracking-tight">Create Account</h2>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      key="reg-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm font-medium overflow-hidden"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Customer Type Selection */}
                <div className="space-y-3">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-secondary block">
                    Customer Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`flex items-center justify-center gap-2 p-4 rounded-md bg-surface-container-low border-b-2 cursor-pointer transition-colors ${
                        customerType === 'PERSONAL' ? 'border-primary' : 'border-transparent hover:bg-surface-container-high'
                      }`}
                    >
                      <input
                        className="hidden"
                        type="radio"
                        name="customer_type"
                        value="PERSONAL"
                        checked={customerType === 'PERSONAL'}
                        onChange={() => setCustomerType('PERSONAL')}
                        disabled={step === 'verify'}
                      />
                      <span className={`material-symbols-outlined ${customerType === 'PERSONAL' ? 'text-primary' : 'text-secondary'}`}>
                        person
                      </span>
                      <span className={`font-headline font-semibold ${customerType === 'PERSONAL' ? 'text-on-surface' : 'text-secondary'}`}>
                        Personal
                      </span>
                    </label>
                    <label
                      className={`flex items-center justify-center gap-2 p-4 rounded-md bg-surface-container-low border-b-2 cursor-pointer transition-colors ${
                        customerType === 'COMPANY' ? 'border-primary' : 'border-transparent hover:bg-surface-container-high'
                      }`}
                    >
                      <input
                        className="hidden"
                        type="radio"
                        name="customer_type"
                        value="COMPANY"
                        checked={customerType === 'COMPANY'}
                        onChange={() => setCustomerType('COMPANY')}
                        disabled={step === 'verify'}
                      />
                      <span className={`material-symbols-outlined ${customerType === 'COMPANY' ? 'text-primary' : 'text-secondary'}`}>
                        domain
                      </span>
                      <span className={`font-headline font-semibold ${customerType === 'COMPANY' ? 'text-on-surface' : 'text-secondary'}`}>
                        Company
                      </span>
                    </label>
                  </div>
                </div>

                {/* Company Name Field (conditional) */}
                {customerType === 'COMPANY' && (
                  <div className="space-y-2">
                    <label className="font-label text-xs font-bold uppercase tracking-widest text-secondary" htmlFor="companyName">
                      Company Name
                    </label>
                    <input
                      className="w-full bg-surface-container-low border-0 border-b-2 border-outline focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg font-medium text-on-surface"
                      id="companyName"
                      name="companyName"
                      placeholder="Kinetic Precision Ltd."
                      type="text"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      disabled={step === 'verify'}
                    />
                  </div>
                )}

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-secondary" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 border-b-2 border-outline focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg font-medium text-on-surface"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={step === 'verify'}
                  />
                </div>

                {/* Telephone Field */}
                <div className="space-y-2">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-secondary" htmlFor="telephone">
                    Telephone Number
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 border-b-2 border-outline focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg font-medium text-on-surface"
                    id="telephone"
                    name="telephone"
                    placeholder="+852 9XXX XXXX"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                    disabled={step === 'verify'}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    className="font-label text-xs font-bold uppercase tracking-widest text-secondary flex justify-between"
                    htmlFor="email"
                  >
                    Email Address
                    <span className="text-primary normal-case font-medium tracking-normal">Primary Login Credential</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-low border-0 border-b-2 border-outline focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg font-medium text-on-surface"
                      id="email"
                      name="email"
                      placeholder="precision@kinetic.com"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={step === 'verify'}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                      mail
                    </span>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="font-label text-xs font-bold uppercase tracking-widest text-secondary" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 border-b-2 border-outline focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg font-medium text-on-surface"
                    id="password"
                    name="password"
                    placeholder="Minimum 6 characters"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    disabled={step === 'verify'}
                  />
                </div>
              </div>

              {/* Email Verification Section */}
              <AnimatePresence>
              {step === 'verify' && (
                <motion.div
                  key="otp-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-surface-container-low p-6 rounded-lg space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">verified_user</span>
                    <h3 className="font-headline font-bold text-on-surface">Email Verification</h3>
                  </div>
                  <p className="text-sm text-secondary">
                    We&apos;ve sent a 6-digit one-time code to <strong>{formData.email}</strong>. Please enter it below to confirm your account.
                  </p>
                  <div className="flex items-end gap-4">
                    <div className="flex-grow space-y-2">
                      <label className="font-label text-xs font-bold uppercase tracking-widest text-secondary" htmlFor="otp">
                        6-Digit Code
                      </label>
                      <input
                        ref={otpInputRef}
                        className="w-full tracking-[0.5em] text-center bg-surface-container-lowest border-0 border-b-2 border-outline focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg font-black text-xl text-on-surface"
                        id="otp"
                        maxLength={6}
                        placeholder="0 0 0 0 0 0"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      />
                    </div>
                    <button
                      className="gradient-button text-on-primary font-headline font-bold px-8 h-[52px] rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                      type="button"
                      onClick={handleVerify}
                      disabled={otp.length !== 6 || loading}
                    >
                      {loading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <button
                      className="text-primary hover:underline font-bold"
                      type="button"
                      onClick={handleResendCode}
                    >
                      Resend Code
                    </button>
                    {countdown > 0 && (
                      <span className="text-secondary">Expiring in {formatCountdown(countdown)}</span>
                    )}
                  </div>
                </motion.div>
              )}
              </AnimatePresence>

              {/* Action Footer */}
              {step === 'form' && (
                <div className="pt-4 flex flex-col space-y-4">
                  <button
                    className="w-full gradient-button text-on-primary py-4 px-8 rounded-md font-headline font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Profile'}
                    {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                  </button>
                  <p className="text-center text-xs text-secondary px-8">
                    By clicking &quot;Create Profile&quot;, you agree to our{' '}
                    <a className="text-on-surface font-semibold underline" href="#">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a className="text-on-surface font-semibold underline" href="#">
                      Privacy Policy
                    </a>
                    .
                  </p>
                  <p className="text-center text-sm text-secondary">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                      Login
                    </Link>
                  </p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
