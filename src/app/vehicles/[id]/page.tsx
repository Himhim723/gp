'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Vehicle, Seminar } from '@/lib/types';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay } },
});

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const viewport = { once: true, margin: '-50px' };

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then((res) => setVehicle(res.data))
      .catch(() => router.push('/vehicles'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="material-symbols-outlined text-5xl text-outline animate-spin" style={{ animationDuration: '1.5s' }}>
              progress_activity
            </span>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  if (!vehicle) return null;

  const features = vehicle.features ?? [];

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">

        {/* Back */}
        <motion.div variants={stagger(0)} initial="hidden" animate="visible"
          className="px-8 max-w-screen-2xl mx-auto mb-8">
          <Link href="/vehicles" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Models
          </Link>
        </motion.div>

        {/* Hero */}
        <section className="px-8 max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">

            {/* Left: text */}
            <div className="space-y-8">
              <motion.div variants={stagger(0.05)} initial="hidden" animate="visible" className="space-y-3">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase">
                  {vehicle.vehicleType}
                </span>
                <p className="text-outline font-bold tracking-widest text-xs uppercase">{vehicle.modelNumber}</p>
                <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface">
                  {vehicle.name}
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
                  {vehicle.description}
                </p>
              </motion.div>

              <motion.div variants={stagger(0.2)} initial="hidden" animate="visible"
                className="text-3xl font-black font-headline text-on-surface">
                HK${Number(vehicle.unitPrice).toLocaleString()}
              </motion.div>

              {features.length > 0 && (
                <motion.div variants={stagger(0.3)} initial="hidden" animate="visible"
                  className="flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.35 }}
                      className="text-xs font-bold py-1.5 px-3 bg-surface-container rounded-md text-on-surface-variant">
                      {f}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* Key Specs */}
              <motion.div variants={gridStagger} initial="hidden" animate="visible"
                className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { show: vehicle.rangeKm, icon: 'electric_bolt', val: `${vehicle.rangeKm} km`, label: 'Range' },
                  { show: vehicle.horsepower, icon: 'speed', val: `${vehicle.horsepower} hp`, label: 'Horsepower' },
                  { show: vehicle.chargingTimeMin, icon: 'battery_charging_full', val: `${vehicle.chargingTimeMin} min`, label: 'Fast Charge' },
                  { show: vehicle.topSpeedKmh, icon: 'timer', val: `${vehicle.topSpeedKmh} km/h`, label: 'Top Speed' },
                ].filter(s => s.show).map((spec) => (
                  <motion.div key={spec.label} variants={gridItem}
                    className="bg-surface-container rounded-xl p-3 text-center">
                    <span className="material-symbols-outlined text-primary text-xl block mb-1">{spec.icon}</span>
                    <p className="font-black text-lg font-headline">{spec.val}</p>
                    <p className="text-xs text-on-surface-variant">{spec.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={stagger(0.5)} initial="hidden" animate="visible">
                <Link href="/seminars"
                  className="inline-flex items-center gap-2 gradient-button text-on-primary px-8 py-4 rounded-lg font-headline font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95">
                  <span className="material-symbols-outlined">event</span>
                  Book a Seminar
                </Link>
              </motion.div>
            </div>

            {/* Right: image */}
            <motion.div variants={fadeLeft} initial="hidden" animate="visible" className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
              {vehicle.pictureUrl ? (
                <img
                  alt={vehicle.name}
                  className="relative z-10 w-full h-[500px] object-cover rounded-xl shadow-2xl car-overhang"
                  src={vehicle.pictureUrl}
                />
              ) : (
                <div className="relative z-10 w-full h-[500px] bg-surface-container-low rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-8xl text-outline">electric_car</span>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Full Specifications */}
        <section className="px-8 max-w-screen-2xl mx-auto mb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mb-8">
            <p className="text-primary font-bold tracking-widest text-xs uppercase mb-3 font-label">Technical Details</p>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight">Full Specifications</h2>
          </motion.div>

          <motion.div variants={gridStagger} initial="hidden" whileInView="visible" viewport={viewport}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Driving Range', value: vehicle.rangeKm ? `${vehicle.rangeKm} km` : null, icon: 'electric_bolt' },
              { label: 'Battery Capacity', value: vehicle.batteryCapacityKwh ? `${vehicle.batteryCapacityKwh} kWh` : null, icon: 'battery_full' },
              { label: 'Fast Charge (10–80%)', value: vehicle.chargingTimeMin ? `${vehicle.chargingTimeMin} min` : null, icon: 'battery_charging_full' },
              { label: 'Horsepower', value: vehicle.horsepower ? `${vehicle.horsepower} hp` : null, icon: 'speed' },
              { label: 'Top Speed', value: vehicle.topSpeedKmh ? `${vehicle.topSpeedKmh} km/h` : null, icon: 'timer' },
              { label: 'Seating Capacity', value: vehicle.seatingCapacity ? `${vehicle.seatingCapacity} seats` : null, icon: 'airline_seat_recline_normal' },
              { label: 'Warranty', value: vehicle.warrantyYears ? `${vehicle.warrantyYears} years` : null, icon: 'verified_user' },
              { label: 'Starting Price', value: `HK$${Number(vehicle.unitPrice).toLocaleString()}`, icon: 'payments' },
            ].filter(s => s.value).map((spec) => (
              <motion.div key={spec.label} variants={gridItem}
                className="flex items-center gap-4 bg-surface-container-low rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">{spec.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">{spec.label}</p>
                  <p className="font-headline font-bold text-on-surface">{spec.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {vehicle.colors && vehicle.colors.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}
              className="mt-6 bg-surface-container-low rounded-xl p-5">
              <p className="text-xs text-on-surface-variant font-medium mb-3">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {vehicle.colors.map((c, i) => (
                  <motion.span key={c}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={viewport}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm font-medium text-on-surface">
                    {c}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </section>

        {/* Seminars */}
        {vehicle.seminars && vehicle.seminars.length > 0 && (
          <section className="bg-surface-container-low py-20 px-8">
            <div className="max-w-screen-2xl mx-auto">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}
                className="mb-12">
                <p className="text-primary font-bold tracking-widest text-xs uppercase mb-3 font-label">Upcoming Events</p>
                <h2 className="font-headline text-4xl font-extrabold tracking-tight">
                  Seminars for {vehicle.name}
                </h2>
              </motion.div>

              <motion.div variants={gridStagger} initial="hidden" whileInView="visible" viewport={viewport}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicle.seminars.map((seminar: Seminar) => (
                  <motion.div key={seminar.seminarId} variants={gridItem}>
                    <SeminarCard seminar={seminar} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

function SeminarCard({ seminar }: { seminar: Seminar }) {
  const isFull = seminar.availableSeats === 0;
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isFull ? 'bg-secondary-fixed text-secondary' : 'bg-tertiary-fixed text-tertiary'
          }`}>
            {isFull ? 'Waitlist' : `${seminar.availableSeats} seats left`}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          {formatDateTime(seminar.seminarDate)}
        </p>
        <p className="text-sm text-on-surface-variant flex items-center gap-1 mb-6">
          <span className="material-symbols-outlined text-sm">location_on</span>
          {seminar.venue}
        </p>
      </div>
      <Link
        href={`/seminars/${seminar.seminarId}/register`}
        className="w-full block text-center gradient-button text-on-primary py-3 rounded-lg font-headline font-bold text-sm hover:opacity-90 transition-opacity"
      >
        {isFull ? 'Join Waitlist' : 'Register Now'}
      </Link>
    </div>
  );
}
