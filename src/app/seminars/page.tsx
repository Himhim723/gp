'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Seminar } from '@/lib/types';
import { motion } from 'framer-motion';

const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const cardItem = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function SeminarsPage() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/seminars')
      .then((res) => setSeminars(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">

        {/* Header */}
        <motion.div variants={fadeDown} initial="hidden" animate="visible" className="mb-16">
          <p className="text-primary font-bold tracking-widest text-xs uppercase mb-3 font-label">
            Upcoming Events
          </p>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">
            EV Seminars
          </h1>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Join our expert sessions for in-depth insights on EV technology, performance engineering, and sustainable mobility.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center justify-center py-32 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl animate-spin mr-4" style={{ animationDuration: '1.5s' }}>
              progress_activity
            </span>
            <span className="font-body text-sm">Loading seminars...</span>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && seminars.length === 0 && (
          <motion.div variants={cardItem} initial="hidden" animate="visible"
            className="text-center py-32 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 block">event_busy</span>
            <p className="font-headline font-bold text-xl mb-2">No upcoming seminars</p>
            <p className="text-sm">Check back soon for new events.</p>
          </motion.div>
        )}

        {/* Seminars List */}
        {!loading && seminars.length > 0 && (
          <motion.div variants={listContainer} initial="hidden" animate="visible" className="space-y-6">
            {seminars.map((seminar) => {
              const isFull = seminar.availableSeats === 0;
              const pct = Math.round((seminar.bookedSeats / seminar.maxSeats) * 100);

              return (
                <motion.div
                  key={seminar.seminarId}
                  variants={cardItem}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    {/* Main Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isFull ? 'bg-secondary-fixed text-secondary' : 'bg-tertiary-fixed text-tertiary'
                        }`}>
                          {isFull ? 'Waitlist Only' : 'Seats Available'}
                        </span>
                        <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                          {seminar.vehicleModelNumber}
                        </span>
                      </div>

                      <h2 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">
                        {seminar.vehicleName}
                      </h2>

                      <div className="flex flex-wrap gap-6 text-sm text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">calendar_today</span>
                          {formatDate(seminar.seminarDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {formatTime(seminar.seminarDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {seminar.venue}
                        </span>
                        {seminar.speakerName && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">person</span>
                            {seminar.speakerName}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant">
                          {seminar.language}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant">
                          {seminar.seminarType === 'ONLINE' ? 'Online' : seminar.seminarType === 'HYBRID' ? 'Hybrid' : 'In-Person'}
                        </span>
                        {seminar.registrationDeadline && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container">
                            Deadline: {formatDate(seminar.registrationDeadline)}
                          </span>
                        )}
                      </div>

                      {seminar.description && (
                        <p className="text-sm text-on-surface-variant line-clamp-2">{seminar.description}</p>
                      )}
                    </div>

                    {/* Seats + CTA */}
                    <div className="flex flex-col lg:items-end gap-4 lg:w-56">
                      <div className="w-full">
                        <div className="flex justify-between text-xs font-bold text-outline uppercase tracking-widest mb-2">
                          <span>Seats</span>
                          <span>{seminar.bookedSeats}/{seminar.maxSeats}</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${isFull ? 'bg-secondary' : 'bg-primary'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {isFull ? 'Join waitlist — seats may open up' : `${seminar.availableSeats} seat${seminar.availableSeats !== 1 ? 's' : ''} remaining`}
                        </p>
                      </div>

                      <Link
                        href={`/seminars/${seminar.seminarId}/register`}
                        className="w-full text-center gradient-button text-on-primary px-6 py-3 rounded-lg font-headline font-bold text-sm hover:opacity-90 transition-all active:scale-95"
                      >
                        {isFull ? 'Join Waitlist' : 'Register Now'}
                        <span className="material-symbols-outlined text-sm ml-1 align-middle">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      <Footer />
    </>
  );
}
