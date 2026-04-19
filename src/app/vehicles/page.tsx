'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Vehicle } from '@/lib/types';
import { motion } from 'framer-motion';

const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vehicles')
      .then((res) => setVehicles(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">

        {/* Header */}
        <motion.div variants={fadeDown} initial="hidden" animate="visible" className="mb-16">
          <p className="text-primary font-bold tracking-widest text-xs uppercase mb-3 font-label">
            Precision Lineup
          </p>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">
            EV Models
          </h1>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Explore our full lineup of electric vehicles — from performance sedans to all-terrain SUVs.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center justify-center py-32 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl animate-spin mr-4" style={{ animationDuration: '1.5s' }}>
              progress_activity
            </span>
            <span className="font-body text-sm">Loading vehicles...</span>
          </motion.div>
        )}

        {/* Vehicle Grid */}
        {!loading && vehicles.length === 0 && (
          <motion.div variants={cardItem} initial="hidden" animate="visible"
            className="col-span-3 text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-4 block">electric_car</span>
            <p className="font-headline font-bold text-lg">No vehicles available</p>
          </motion.div>
        )}

        {!loading && vehicles.length > 0 && (
          <motion.div
            variants={gridContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {vehicles.map((vehicle) => (
              <motion.div key={vehicle.vehicleId} variants={cardItem}>
                <Link
                  href={`/vehicles/${vehicle.vehicleId}`}
                  className="group bg-surface-container-lowest rounded-xl p-8 transition-all duration-300 shadow-sm hover:shadow-lg block"
                >
                  {/* Vehicle Image */}
                  <div className="mb-8 overflow-hidden h-48 flex items-center justify-center bg-surface-container-low rounded-lg">
                    {vehicle.pictureUrl ? (
                      <img
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={vehicle.pictureUrl}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-outline">electric_car</span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">
                          {vehicle.modelNumber}
                        </p>
                        <h3 className="text-2xl font-black font-headline">{vehicle.name}</h3>
                      </div>
                      <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        {vehicle.vehicleType}
                      </span>
                    </div>

                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">
                      {vehicle.description}
                    </p>

                    <div className="pt-4 flex justify-between items-center border-t border-outline-variant/10">
                      <span className="text-xl font-black font-headline">
                        HK${Number(vehicle.unitPrice).toLocaleString()}
                      </span>
                      <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                        View Details
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </>
  );
}
