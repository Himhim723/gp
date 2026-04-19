'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const slideUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 } },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProfilePage() {
  const router = useRouter();
  const { customer, isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !customer) {
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

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.header variants={fadeDown} initial="hidden" animate="visible" className="mb-12">
          <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2 font-label">
            Account
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-on-surface mb-2">
            My Profile
          </h1>
          <p className="text-on-surface-variant font-body">
            Your membership details and account information.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Card */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="gradient-button px-8 py-6 flex items-center gap-5">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.25, type: 'spring', stiffness: 180, damping: 14 }}
                  className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                    account_circle
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="font-headline text-2xl font-extrabold text-white tracking-tight">
                    {customer.name}
                  </h2>
                  <p className="text-white/70 text-sm">{customer.email}</p>
                </motion.div>
              </div>

              {/* Details Grid */}
              <motion.div variants={gridStagger} initial="hidden" animate="visible"
                className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={gridItem}>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Full Name</p>
                  <p className="font-bold text-on-surface text-lg">{customer.name}</p>
                </motion.div>
                <motion.div variants={gridItem}>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Email Address</p>
                  <p className="font-bold text-on-surface text-lg">{customer.email}</p>
                </motion.div>
                <motion.div variants={gridItem}>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Telephone</p>
                  <p className="font-bold text-on-surface text-lg">{customer.telephone}</p>
                </motion.div>
                <motion.div variants={gridItem}>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Account Type</p>
                  <p className="font-bold text-on-surface text-lg capitalize">{customer.customerType.toLowerCase()}</p>
                </motion.div>
                {customer.companyName && (
                  <motion.div variants={gridItem} className="md:col-span-2">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Company</p>
                    <p className="font-bold text-on-surface text-lg">{customer.companyName}</p>
                  </motion.div>
                )}
                <motion.div variants={gridItem}>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Email Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    customer.emailVerified
                      ? 'bg-tertiary-fixed text-tertiary'
                      : 'bg-error/10 text-error'
                  }`}>
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {customer.emailVerified ? 'verified' : 'cancel'}
                    </span>
                    {customer.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div variants={fadeRight} initial="hidden" animate="visible" className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-3">
              <h3 className="font-headline font-bold text-on-surface text-sm uppercase tracking-widest text-outline">
                Quick Actions
              </h3>
              {[
                { href: '/my-registrations', icon: 'event_note', label: 'My Registrations', sub: 'View seminar history' },
                { href: '/seminars', icon: 'explore', label: 'Browse Seminars', sub: 'Find upcoming events' },
                { href: '/vehicles', icon: 'electric_car', label: 'EV Models', sub: 'Explore vehicle lineup' },
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 p-4 rounded-lg hover:bg-surface-container-low transition-colors group"
                  >
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    <div>
                      <p className="font-bold text-on-surface text-sm">{item.label}</p>
                      <p className="text-xs text-on-surface-variant">{item.sub}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline ml-auto group-hover:text-primary transition-colors">chevron_right</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Logout */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-error/20 text-error font-headline font-bold rounded-xl hover:bg-error/5 transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </motion.button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
