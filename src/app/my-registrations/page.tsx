'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Registration } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const rowItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const detailPanel = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.25 } },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function StatusBadge({ status }: { status: Registration['status'] }) {
  if (status === 'SUCCESS') return (
    <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary text-[10px] font-black uppercase tracking-wider">Success</span>
  );
  if (status === 'WAIT') return (
    <span className="px-3 py-1 rounded-full bg-secondary-fixed text-secondary text-[10px] font-black uppercase tracking-wider">Wait</span>
  );
  return (
    <span className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-black uppercase tracking-wider">Cancel</span>
  );
}

export default function MyRegistrationsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, customer } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filtered, setFiltered] = useState<Registration[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await api.get('/registrations');
      setRegistrations(res.data);
      setFiltered(res.data);
    } catch {
      // 401 handled by axios interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchRegistrations();
  }, [authLoading, isAuthenticated, router, fetchRegistrations]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(registrations.filter(r =>
      r.vehicleName.toLowerCase().includes(q) ||
      r.venue.toLowerCase().includes(q) ||
      r.vehicleModelNumber.toLowerCase().includes(q)
    ));
  }, [search, registrations]);

  const handleCancel = async () => {
    if (!selected) return;
    setCancelError(''); setCancelSuccess(''); setCancelling(true);
    try {
      await api.put(`/registrations/${selected.registrationId}/cancel`);
      setCancelSuccess('Registration cancelled successfully.');
      await fetchRegistrations();
      setSelected(prev => prev ? { ...prev, status: 'CANCEL' } : null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setCancelError(e.response?.data?.message || 'Failed to cancel. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 px-6 max-w-screen-xl mx-auto flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl animate-spin" style={{ animationDuration: '1.5s' }}>
              progress_activity
            </span>
            <p className="font-body text-sm">Loading your registrations...</p>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-screen-xl mx-auto">

        {/* Header */}
        <motion.header variants={fadeDown} initial="hidden" animate="visible" className="mb-12">
          <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2">Account Management</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface font-headline mb-4">
            Registration History
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-body">
            Access your history of seminars, technical briefings, and EV showcases from the past 12 months.
            Manage upcoming sessions and seat allocations.
          </p>
        </motion.header>

        {/* Filters + Stats */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="lg:col-span-3 bg-surface-container-low p-8 rounded-xl">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-2">
                  Search by Vehicle or Venue
                </label>
                <input
                  className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline focus:border-primary focus:ring-0 px-0 py-3 text-lg font-medium transition-all"
                  placeholder="e.g. Model S, Innovation Hub"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                className="bg-primary hover:bg-primary-container text-on-primary px-8 py-3 rounded-md font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 h-[52px]"
                onClick={() => setSearch('')}
              >
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Clear Filter
              </button>
            </div>
          </div>

          <div className="bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-between">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              electric_bolt
            </span>
            <div>
              <h3 className="text-2xl font-bold tracking-tighter mb-1 font-headline">{registrations.length} Total</h3>
              <p className="text-xs text-primary-fixed-dim font-medium">Registrations on record</p>
            </div>
          </div>
        </motion.section>

        {/* Registration List */}
        <section className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex justify-between items-end mb-6"
          >
            <h2 className="text-xl font-bold tracking-tight font-headline">Recent Activity</h2>
            <div className="flex gap-4">
              {[
                { color: 'bg-tertiary', label: 'Success' },
                { color: 'bg-secondary', label: 'Wait' },
                { color: 'bg-error', label: 'Cancel' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div variants={rowItem} initial="hidden" animate="visible"
              className="bg-surface-container-low rounded-xl p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block">inbox</span>
              <p className="font-headline font-bold text-lg mb-1">No registrations found</p>
              <p className="text-sm">{search ? 'Try a different search term.' : 'You have not registered for any seminars yet.'}</p>
            </motion.div>
          )}

          <motion.div variants={listContainer} initial="hidden" animate="visible">
            {filtered.map((reg) => (
              <motion.div
                key={reg.registrationId}
                variants={rowItem}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                onClick={() => { setSelected(reg); setCancelError(''); setCancelSuccess(''); }}
                className={`group bg-surface-container-lowest hover:bg-surface-container-low p-6 rounded-xl transition-colors cursor-pointer shadow-sm mb-4 ${
                  selected?.registrationId === reg.registrationId ? 'ring-2 ring-primary bg-surface-container-low' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-auto flex-1">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.1em] mb-1">
                      {reg.vehicleModelNumber} — EV Seminar
                    </p>
                    <h3 className="text-xl font-bold tracking-tight text-on-surface font-headline">{reg.vehicleName}</h3>
                    <p className="text-sm text-on-surface-variant flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {reg.venue}
                    </p>
                  </div>

                  <div className="flex gap-12 w-full md:w-auto text-center md:text-left border-t md:border-t-0 md:border-l border-outline-variant/30 pt-4 md:pt-0 md:pl-8">
                    <div>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Date</p>
                      <p className="font-bold text-on-surface">{formatDate(reg.seminarDate)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Seats</p>
                      <p className="font-bold text-on-surface">{String(reg.numSeats).padStart(2, '0')}</p>
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={reg.status} />
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && (
            <motion.section
              variants={detailPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-16 bg-surface-container-high rounded-xl p-8 border border-outline-variant/10"
            >
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <StatusBadge status={selected.status} />
                    <span className="text-outline text-xs font-mono">
                      Ref: #KP-{String(selected.registrationId).padStart(4, '0')}
                    </span>
                    <button className="ml-auto text-outline hover:text-on-surface transition-colors"
                      onClick={() => setSelected(null)}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <h2 className="text-3xl font-black tracking-tighter mb-2 font-headline">
                    {selected.vehicleName} — EV Seminar
                  </h2>
                  <p className="text-on-surface-variant mb-8 leading-relaxed font-body text-sm">
                    Exclusive seminar event for the {selected.vehicleName} ({selected.vehicleModelNumber}).
                    Join our technical team for in-depth insights on performance, range, and the latest EV engineering.
                  </p>

                  <div className="grid grid-cols-2 gap-y-8 mb-8">
                    {[
                      { label: 'Vehicle Model', value: selected.vehicleModelNumber },
                      { label: 'Venue', value: selected.venue },
                      { label: 'Date & Time', value: formatDateTime(selected.seminarDate) },
                      { label: 'Allocated Seats', value: `${String(selected.numSeats).padStart(2, '0')} Seats` },
                      { label: 'Registered At', value: formatDate(selected.registeredAt) },
                      { label: 'Member', value: customer?.name ?? '—' },
                    ].map((field, i) => (
                      <motion.div key={field.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.35 }}>
                        <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">{field.label}</p>
                        <p className="font-bold text-on-surface">{field.value}</p>
                      </motion.div>
                    ))}
                    <div>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Attendance</p>
                      <p className="font-bold text-on-surface flex items-center gap-1">
                        {selected.attended ? (
                          <><span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Attended</>
                        ) : (
                          <><span className="material-symbols-outlined text-sm text-outline">radio_button_unchecked</span> Not yet</>
                        )}
                      </p>
                    </div>
                    {selected.checkInTime && (
                      <div>
                        <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Check-in Time</p>
                        <p className="font-bold text-on-surface">{formatDateTime(selected.checkInTime)}</p>
                      </div>
                    )}
                  </div>

                  {selected.specialRequests && (
                    <div className="mb-8 p-4 bg-surface-container rounded-lg border border-outline-variant/20">
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Special Requests</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{selected.specialRequests}</p>
                    </div>
                  )}

                  {cancelError && (
                    <div className="mb-4 bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm font-medium">{cancelError}</div>
                  )}
                  {cancelSuccess && (
                    <div className="mb-4 bg-tertiary-fixed text-tertiary px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {cancelSuccess}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 pt-8 border-t border-outline-variant/20">
                    {selected.status === 'SUCCESS' && (
                      <button className="bg-primary text-on-primary px-6 py-2.5 rounded-md font-bold text-sm tracking-tight transition-all hover:bg-primary-container flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Download E-Ticket
                      </button>
                    )}
                    {selected.status !== 'CANCEL' && (
                      <button
                        className="text-error font-bold text-sm px-4 py-2 hover:bg-error/5 rounded-md transition-all flex items-center gap-2 disabled:opacity-50"
                        onClick={handleCancel}
                        disabled={cancelling}
                      >
                        {cancelling ? (
                          <><span className="material-symbols-outlined text-sm animate-spin" style={{ animationDuration: '1s' }}>progress_activity</span>Cancelling...</>
                        ) : (
                          <><span className="material-symbols-outlined text-sm">cancel</span>Cancel Registration</>
                        )}
                      </button>
                    )}
                    {selected.status === 'CANCEL' && (
                      <p className="text-sm text-on-surface-variant italic">This registration has been cancelled.</p>
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-1/3">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-lowest relative group">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={`${selected.vehicleName} seminar`}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZNW4iWX8OE7fLUQ8XWuiJ58pANRYHsKdzG1Xfi0VmPNQ7TnzZUuqLKix4mHPEVBAwjhn1rjHKwNXsVbZBgQRMqGUySyKCupo3N8fLho5HeC0yEYswc_oweUkHvsDPL9cOJC1Qljpbxxu6jKtOBxBn_DixYq5nTvLmIH_QgxmhT4jKzdDgazEYlh2CmNK5U8hp3_pnibpfyQDTz1ooBZBVnaxyJRRVrs0ZKx4BoLxPtvWTF2Hw706tE9qujdJBWT8eQoZp2FrGcNP"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">Session Location</p>
                      <p className="text-white font-bold">{selected.venue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </>
  );
}
