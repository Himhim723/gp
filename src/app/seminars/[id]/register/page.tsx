'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Seminar, Registration } from '@/lib/types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}

function formatTimeRange(dateStr: string) {
  const d = new Date(dateStr);
  const start = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const end = new Date(d.getTime() + 7 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `${start} — ${end}`;
}

// ── Confirmation screen (matches the user's HTML design) ──────────────────────
function ConfirmationView({
  seminar,
  registration,
}: {
  seminar: Seminar;
  registration: Registration;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">

        {/* Hero Confirmation */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
            <div className="flex-1">
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-tertiary-fixed text-tertiary text-[10px] font-bold tracking-widest uppercase mb-4">
                {registration.status === 'SUCCESS' ? 'Status: SUCCESS' : 'Status: WAITLIST'}
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-4 leading-none">
                {registration.status === 'SUCCESS' ? (
                  <>REGISTRATION<br />CONFIRMED.</>
                ) : (
                  <>ADDED TO<br />WAITLIST.</>
                )}
              </h1>
              <p className="text-on-surface-variant max-w-md text-lg leading-relaxed font-body">
                {registration.status === 'SUCCESS'
                  ? `Your seat${registration.numSeats > 1 ? 's are' : ' is'} secured for the ${seminar.vehicleName} seminar. Prepare to experience the next evolution of electric precision.`
                  : `The seminar is currently full. You are on the waitlist and will be notified if a seat becomes available.`}
              </p>
            </div>
            {/* QR Placeholder (desktop) */}
            <div className="hidden md:flex w-32 h-32 bg-surface-container-high rounded-xl p-4 shadow-sm items-center justify-center">
              <div className="w-full h-full border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center opacity-40">
                <span className="material-symbols-outlined text-4xl mb-1">qr_code_2</span>
                <span className="text-[8px] font-bold uppercase tracking-tighter">E-Ticket</span>
              </div>
            </div>
          </div>

          {/* Vehicle Visual */}
          <div className="relative w-full h-[400px] bg-surface-container-low rounded-xl overflow-hidden mt-16">
            <div className="absolute -top-12 -right-8 w-4/5 h-full z-10 pointer-events-none">
              <img
                alt={seminar.vehicleName}
                className="w-full h-full object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.15)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASCViu2Ervt44h4LfoPHHlsaqBMAyp3wOXtupyhKkdRID4MtWVbZ8iHOO75HtSwzC9svntt2ibxFjSdjZCC5o4OBTO80nwnEZCVACNX8U7aIwzieCfyAruKYQ1BKTmdQUWAsCg2A15w3JC1B_py4OMJ6LG7YaZzYXGvwanDzOY-FjmfBUgUQ6HmY3w88LsGE8g4_WVzBCobzDNV-O6C_ysnfLaYKUozzqVoVhAbpsPInMP0XgMxMBF_DqsqsMXOs9awghlbPNG8QRT"
              />
            </div>
            <div className="p-8 md:p-12 h-full flex flex-col justify-end relative z-0">
              <div className="max-w-xs">
                <span className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
                  Featured Vehicle
                </span>
                <h2 className="font-headline text-3xl font-bold tracking-tight mb-2">
                  {seminar.vehicleName}
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {seminar.vehicleModelNumber} — Experience the engineering marvel firsthand during the live demonstration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Date & Time */}
          <div className="md:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start">
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
                Schedule
              </span>
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <div>
              <h3 className="font-headline text-4xl font-bold tracking-tight">
                {formatDate(seminar.seminarDate)}
              </h3>
              <div className="flex items-baseline gap-4 mt-2">
                <p className="text-2xl font-light text-on-surface-variant">
                  {formatTimeRange(seminar.seminarDate)}
                </p>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">HKT</span>
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="bg-surface-container-highest p-8 rounded-xl flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start">
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                Venue
              </span>
              <span className="material-symbols-outlined text-primary">location_on</span>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">{seminar.venue}</h4>
              <p className="text-sm text-on-surface-variant leading-snug">
                Seats Booked: {registration.numSeats}
              </p>
              <p className="text-sm text-on-surface-variant mt-1">
                Ref: #KP-{String(registration.registrationId).padStart(4, '0')}
              </p>
            </div>
          </div>

          {/* QR — mobile only */}
          <div className="md:hidden bg-surface-container-lowest p-8 rounded-xl flex flex-col items-center text-center shadow-sm">
            <div className="w-48 h-48 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center mb-4 opacity-60">
              <span className="material-symbols-outlined text-6xl mb-2">qr_code_2</span>
              <span className="text-xs font-bold uppercase tracking-tighter">Your Entry Pass</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Present this code at the registration desk for seamless entry.
            </p>
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-col md:flex-row gap-4 justify-center items-center py-8">
          <Link
            href="/my-registrations"
            className="w-full md:w-auto px-10 py-4 gradient-button text-on-primary font-bold rounded-md flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-[0_20px_40px_rgba(0,82,209,0.2)]"
          >
            <span className="material-symbols-outlined">event_available</span>
            VIEW MY REGISTRATIONS
          </Link>
          <Link
            href="/seminars"
            className="w-full md:w-auto px-10 py-4 bg-surface-container-highest text-on-surface font-bold rounded-md flex items-center justify-center gap-3 transition-colors hover:bg-surface-dim"
          >
            <span className="material-symbols-outlined">explore</span>
            BROWSE MORE SEMINARS
          </Link>
        </section>

        {/* Legal Note */}
        <footer className="mt-16 pt-12 border-t border-outline-variant/15 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-outline mb-6">
            Security Clearance Required
          </p>
          <div className="max-w-md mx-auto text-xs text-on-surface-variant leading-relaxed opacity-60">
            This invitation is non-transferable. Identification matching the registration name will be
            required upon entry. For fleet inquiries or special assistance, please contact our support team.
          </div>
        </footer>
      </main>
      <Footer />
    </>
  );
}

// ── Registration form ─────────────────────────────────────────────────────────
export default function SeminarRegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const [numSeats, setNumSeats] = useState<1 | 2>(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<Registration | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    api.get(`/seminars/${id}`)
      .then((res) => setSeminar(res.data))
      .catch(() => router.push('/seminars'))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/registrations', {
        seminarId: Number(id),
        numSeats,
        specialRequests: specialRequests.trim() || null,
      });
      setConfirmed(res.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show confirmation screen after successful registration
  if (confirmed && seminar) {
    return <ConfirmationView seminar={seminar} registration={confirmed} />;
  }

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 flex items-center justify-center min-h-[60vh]">
          <span className="material-symbols-outlined text-5xl text-outline animate-spin" style={{ animationDuration: '1.5s' }}>
            progress_activity
          </span>
        </main>
        <Footer />
      </>
    );
  }

  if (!seminar) return null;

  const isFull = seminar.availableSeats === 0;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-2xl mx-auto">

        {/* Back link */}
        <Link
          href="/seminars"
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-10"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Seminars
        </Link>

        <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-sm">
          {/* Header */}
          <div className="mb-8">
            <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">
              Seminar Registration
            </span>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">
              {seminar.vehicleName}
            </h1>
            <p className="text-sm text-on-surface-variant">{seminar.vehicleModelNumber}</p>
          </div>

          {/* Seminar Info */}
          <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-surface-container-low rounded-xl">
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Date</p>
              <p className="font-bold text-on-surface">{formatDate(seminar.seminarDate)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Time</p>
              <p className="font-bold text-on-surface">{formatTimeRange(seminar.seminarDate)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Venue</p>
              <p className="font-bold text-on-surface">{seminar.venue}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Availability</p>
              <p className={`font-bold ${isFull ? 'text-secondary' : 'text-tertiary'}`}>
                {isFull ? 'Waitlist Only' : `${seminar.availableSeats} seats left`}
              </p>
            </div>
          </div>

          {isFull && (
            <div className="mb-6 bg-surface-container p-4 rounded-lg text-sm text-on-surface-variant border border-outline-variant/30">
              <span className="font-bold text-on-surface">Seminar is full.</span> You will be placed on the waitlist and automatically confirmed if a seat becomes available.
            </div>
          )}

          {error && (
            <div className="mb-6 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seat selection */}
            <div className="space-y-3">
              <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant block">
                Number of Seats
              </label>
              <div className="grid grid-cols-2 gap-4">
                {([1, 2] as const).map((n) => (
                  <label
                    key={n}
                    className={`flex items-center justify-center gap-2 p-4 rounded-md bg-surface-container-low border-b-2 cursor-pointer transition-colors ${
                      numSeats === n ? 'border-primary' : 'border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    <input
                      className="hidden"
                      type="radio"
                      name="numSeats"
                      value={n}
                      checked={numSeats === n}
                      onChange={() => setNumSeats(n)}
                    />
                    <span className={`material-symbols-outlined ${numSeats === n ? 'text-primary' : 'text-secondary'}`}>
                      {n === 1 ? 'person' : 'group'}
                    </span>
                    <span className={`font-headline font-semibold ${numSeats === n ? 'text-on-surface' : 'text-secondary'}`}>
                      {n === 1 ? '1 Seat' : '2 Seats'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant block">
                Special Requests <span className="font-normal normal-case tracking-normal">(Optional)</span>
              </label>
              <textarea
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg font-medium text-on-surface resize-none text-sm"
                rows={3}
                placeholder="Wheelchair access, dietary requirements, etc."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-on-surface-variant text-right">{specialRequests.length}/500</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full gradient-button text-on-primary py-4 px-8 rounded-lg font-headline font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span className="material-symbols-outlined animate-spin" style={{ animationDuration: '1s' }}>
                  progress_activity
                </span>
              ) : (
                <>
                  <span>{isFull ? 'Join Waitlist' : 'Confirm Registration'}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
