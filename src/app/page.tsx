'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const scaleBounce = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 180, damping: 14 } },
};

const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay } },
});

const cardStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const viewport = { once: true, margin: '-60px' };

export default function Home() {
  const { isAuthenticated, customer, logout } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-black tracking-tight text-on-surface">KINETIC PRECISION</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <Link href="/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
            <Link href="/seminars" className="hover:text-primary transition-colors">Seminars</Link>
            {isAuthenticated && (
              <Link href="/my-registrations" className="hover:text-primary transition-colors">My Registrations</Link>
            )}
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="hover:text-primary transition-colors text-on-surface">
                  {customer?.name}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 rounded-lg border border-outline-variant hover:border-primary hover:text-primary transition-all text-xs font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-4 py-1.5 rounded-lg border border-outline-variant hover:border-primary hover:text-primary transition-all text-xs font-bold">
                Login
              </Link>
            )}
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined text-xl">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/[0.08] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/[0.05] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-screen-xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left text */}
          <div className="space-y-8">
            <motion.div variants={stagger(0)} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              The Future is Kinetic
            </motion.div>

            <motion.h1 variants={stagger(0.15)} initial="hidden" animate="visible"
              className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.88]">
              VOLT &amp;{' '}
              <span className="landing-title-gradient">
                VERIDIAN
              </span>
            </motion.h1>

            <motion.p variants={stagger(0.3)} initial="hidden" animate="visible"
              className="text-on-surface-variant text-lg leading-relaxed max-w-md">
              Engineering high-velocity electric mobility with an aerodynamic spirit.
              Where sustainable energy meets surgical precision.
            </motion.p>

            <motion.div variants={stagger(0.45)} initial="hidden" animate="visible"
              className="flex flex-wrap gap-4">
              <Link href="/vehicles"
                className="gradient-button flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-on-primary text-sm transition-all hover:opacity-90 active:scale-95">
                Explore Lineup
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/seminars"
                className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm border border-outline-variant hover:border-primary/50 hover:text-primary transition-all">
                Book a Seminar
              </Link>
            </motion.div>

            <motion.div variants={stagger(0.6)} initial="hidden" animate="visible"
              className="flex gap-8 pt-4 border-t border-outline-variant">
              {[
                { val: '1.2M', label: 'Fleet Miles' },
                { val: '0.19', label: 'Drag Coeff' },
                { val: '98%', label: 'Recyclability' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-primary">{s.val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right image */}
          <motion.div className="relative" variants={fadeLeft} initial="hidden" animate="visible">
            <div className="absolute inset-0 rounded-2xl"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0,194,255,0.12) 0%, transparent 70%)' }} />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgKeMA7nsxCAY2x-Zu_cJL2IOkw0lL-WYxSlKJQi_efRCGzencBGLOFPNRaBnbSgBybXbRczSdN0CcjX0f7lD2YmoZ9zJdRarrNbWP1WQs1CIbDSFa7_hGdf3dsxS2qiMJCYQwo4VBZm9hnPsFgWQ5BliYIhkxMbmnfJGwb2gOxtdIpv82pse3SxF8GuFhZKCyJs9dB8bdv8OCwF90IxvUrY25_XwACK3jju2_AUpKmyj3EqINhEtJchYHl_lJIkBUaRl7x8UVGYvQ"
              alt="Kinetic Precision EV"
              className="relative z-10 w-full h-[520px] object-cover rounded-2xl"
              style={{ boxShadow: '0 0 60px rgba(0,194,255,0.15)' }}
            />
            <motion.div variants={scaleBounce} initial="hidden" animate="visible"
              transition={{ delay: 0.8 }}
              className="absolute bottom-6 left-6 z-20 bg-surface-container-low/90 backdrop-blur-sm border border-outline-variant rounded-xl px-4 py-3 flex gap-5">
              {[
                { icon: '⚡', val: '620km', label: 'Range' },
                { icon: '🔋', val: '2.1s', label: '0–100' },
                { icon: '🛡', val: 'L4', label: 'Autonomy' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-sm font-black text-on-surface">{s.icon} {s.val}</div>
                  <div className="text-[10px] text-on-surface-variant font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Vehicle Showcase ── */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}
            className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">Precision Lineup</p>
              <h2 className="text-5xl font-black tracking-tight">The Showcase</h2>
            </div>
            <Link href="/vehicles" className="text-sm font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors">
              View All Vehicles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          <motion.div variants={cardStagger} initial="hidden" whileInView="visible" viewport={viewport}
            className="grid md:grid-cols-3 gap-6">
            {[
              {
                model: 'Model V-1', name: 'Apex Cruiser', badge: 'Available', badgeColor: '#39D353',
                desc: 'The ultimate long-range grand tourer for transcontinental velocity with zero emissions.',
                specs: ['620km Range', '2.1s 0-100', 'L4 Autopilot'], price: '$84,500',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLIwOHQ5zM-Rl5CvtteNLhw4UBzb4DHIag3NwxiMvo7pbYdIcuYMljz8VoiqzQzxJ9VtqVDyT_Rby7ptGdOlK0-z2HXBN6A8bMosrcduZyMY8fckNFW78X032lFnFQOFl8P9S3uA_juptHBggsTwHLoBKJuRplFCgqL_ZiasP6anbjJqlSrq6VS0wSMDl53xR2Vw7EPGbGFBas3ETFoDMlnm2FBKA-cOHDGJKcsPe7_KXsXoXf7Wfq1i-SsRgx0TtADEvkpeadU-OF',
              },
              {
                model: 'Model E-4', name: 'Terraform X', badge: 'Pre-Order', badgeColor: '#F59E0B',
                desc: 'An all-terrain electric utility vehicle that redefines adventure through silence and power.',
                specs: ['4x4 Tri-Motor', 'Adaptive Air', 'Bi-Directional'], price: '$62,000',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-7V_2ZAGK5Pfw4Pdo2SKAsvKYzmrrch5owtxWDxiNKf4kJ3tFbrdm4dqAwHaX8M7CPxMAqbOhK3F-4xcFoKZ0CFMzYd8UETI7ByxLff1FhFmbHVcIbua9xVjPF3X2EXYKM2r_uS0MLonY-yk0DvX5xTptmZ_aKVfHuqxFyCPGSQqA2KspF7RuuKOsbfsNnqkqo5PivkNiEu2hRdc-XYAMFsn7LVVt4FzfRGunolvrP16PY65LryKTWcReErG7grLOMEkTeVuswbSE',
              },
              {
                model: 'Model S-Alpha', name: 'Urban Kinetic', badge: 'Available', badgeColor: '#39D353',
                desc: 'The pinnacle of urban maneuverability — small footprint, massive technological impact.',
                specs: ['Hyper-Charging', 'App-Defined', 'Recycled Alloys'], price: '$45,900',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtwU0qUk58vreQpjiXmmm8Pqplnb1o8qm2ixGf7g_FkWR223-iCdzh45qNYi4axxfVIopMP2LqkfG8HxbwUSZxjt95dscyAcpZdIFbxDQFHiXWPftnvSydXDV1x8j2b1o8g_pc0NQKf27Do9GklCsJd0qzYdLgTAst_Z6jzkcbCJzu0c51C8p3zf_xNIffgojR6gu3YATrqtAMfGE894-DBojrTenmMv8wn4xJ0AWB-EXBGydwyfyUwdtOQAIPY8ealWYqK7BITIeY',
              },
            ].map((v) => (
              <motion.div key={v.model} variants={cardItem}
                className="group bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,194,255,0.08)]">
                <div className="h-48 overflow-hidden bg-background flex items-center justify-center px-4 pt-4">
                  <img src={v.img} alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{v.model}</p>
                      <h3 className="text-xl font-black">{v.name}</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full"
                      style={{ background: `${v.badgeColor}18`, color: v.badgeColor }}>{v.badge}</span>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{v.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {v.specs.map(s => (
                      <span key={s} className="text-[10px] font-bold px-2 py-1 bg-background rounded-md text-on-surface-variant border border-outline-variant">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
                    <span className="text-lg font-black text-on-surface">{v.price}</span>
                    <Link href="/vehicles" className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Configure
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Seminars Bento ── */}
      <section className="py-28 px-6 bg-surface-dim">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}
            className="text-center mb-16">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Upcoming Events</p>
            <h2 className="text-5xl font-black tracking-tight mb-4">Precision Insights</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Join our lead engineers for deep dives into solid-state batteries, autonomous architecture, and sustainable manufacturing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 md:grid-rows-2 gap-5 md:h-[560px]">
            <motion.div variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              initial="hidden" whileInView="visible" viewport={viewport}
              className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbT-o3jO3M699VS1C2gimyiE-b_WBfhqEJkXyc7ds_70zYp6PHr5YuxJ7b5FWkLRyWGi_IMWR0kyZNntoAOAJEq7fjWNB9BIRW9jsrRVW8Ms1bFfAQ4JxqPlnjIc1o0tKrcoSWZnhcM4kCAoU18qLaL78Syim_vGeRfZyYxPpRoMgrL_AqdWSYZNl2y3c7iGjf8NmYk_NDd9WD4Oj3SgMxuJYa9mrp39ioOLlCSih8wZJecsubWND_PCrw78q2wzI6YMyFCNQXvjuk"
                alt="Flagship Seminar"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-primary text-[10px] font-black tracking-[0.2em] uppercase mb-3">Flagship Event</span>
                <h3 className="text-3xl font-black leading-tight mb-3">The Solid-State Revolution</h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-sm">Our biannual symposium on the next 10 years of energy density and thermal management in EVs.</p>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-sm font-medium">Coming Soon</span>
                  <Link href="/seminars" className="gradient-button px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary transition-all hover:opacity-90">Register Now</Link>
                </div>
              </div>
            </motion.div>

            {[
              {
                content: (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary">Webinar</span>
                      <span className="text-on-surface-variant text-xs">Coming Soon</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">UX of the Autonomous Cabin</h3>
                    <p className="text-on-surface-variant text-sm">Designing interfaces for a world where drivers become passengers.</p>
                  </>
                ),
                footer: <Link href="/seminars" className="flex items-center gap-1.5 text-primary text-sm font-bold mt-4 hover:gap-3 transition-all">Claim Seat <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>,
                cls: 'md:col-span-2 bg-surface-container-low rounded-2xl border border-outline-variant p-7 flex flex-col justify-between hover:border-primary/30 transition-colors',
                delay: 0.15,
              },
              {
                content: (<><span className="text-3xl mb-3 block">♻️</span><h3 className="text-base font-bold leading-tight mb-2">Circular Supply Chains</h3><p className="text-on-surface-variant text-xs">Closing the loop on battery material recycling.</p></>),
                footer: <Link href="/seminars" className="block text-center py-2 rounded-lg text-xs font-bold text-primary border border-primary/30 hover:bg-primary/10 transition-colors mt-4">Details</Link>,
                cls: 'rounded-2xl p-7 flex flex-col justify-between',
                style: { background: 'linear-gradient(135deg, rgba(0,194,255,0.1), rgba(0,128,255,0.1))', border: '1px solid rgba(0,194,255,0.2)' },
                delay: 0.25,
              },
              {
                content: (<><span className="text-3xl mb-3 block">🔌</span><h3 className="text-base font-bold leading-tight mb-2">Home Infrastructure</h3><p className="text-on-surface-variant text-xs">V2H integration and smart grid optimization.</p></>),
                footer: <Link href="/seminars" className="block text-center py-2 rounded-lg text-xs font-bold border border-outline-variant hover:border-primary/30 hover:text-primary transition-all mt-4">Join</Link>,
                cls: 'bg-surface-container-low rounded-2xl border border-outline-variant p-7 flex flex-col justify-between hover:border-primary/30 transition-colors',
                delay: 0.35,
              },
            ].map((card, i) => (
              <motion.div key={i} className={card.cls} style={card.style}
                variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: card.delay } } }}
                initial="hidden" whileInView="visible" viewport={viewport}>
                <div>{card.content}</div>
                {card.footer}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Engineering Ethos</p>
              <h2 className="text-5xl font-black tracking-tight leading-tight">
                Technological<br /><span className="text-on-surface-variant">Leadership.</span>
              </h2>
            </motion.div>

            <motion.div variants={cardStagger} initial="hidden" whileInView="visible" viewport={viewport}
              className="space-y-8">
              {[
                { icon: '⚡', title: 'Hyper-Efficient Energy', desc: 'Our proprietary Veridian Cells achieve 30% higher energy density than industry standards, extending range without adding weight.' },
                { icon: '🛡', title: 'Structural Integrity', desc: 'Aerodynamic bodies forged from aerospace-grade composites, ensuring five-star safety and industry-leading drag coefficients.' },
                { icon: '🌐', title: 'Decentralized Intelligence', desc: 'Real-time OTA updates and edge-computing autonomous systems that learn from the global fleet to improve every kilometer.' },
              ].map(item => (
                <motion.div key={item.title} variants={cardItem} className="flex gap-5">
                  <div className="shrink-0 w-11 h-11 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface mb-1">{item.title}</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewport}
            className="relative h-[520px] rounded-2xl overflow-hidden">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZS0R5LY8VHM5i_mPBzfaBm6QwnY0gOVoNmNz__m28mG_U-QeIfz6PSRvlwhsI8QgqkzJPiRE9T1cFF7-y3iQl1t0BSUmCSLZOUfG5qu4YIt3OZLQi9DVvHDKRjtJ3wPkOgttkMH7vBXrF6_Mo7KlO-XzuR7kI8AvLZXuC3jt5tf2sWeyPosZL4WJfGJwmysncoezJ4tfn7qi8sqHjpJfpMqZyUAQaedoxZCWSXjEfgIaK9wOZb7MZNvTAJWNLXiILgWjaiZ3383RY"
              alt="EV Technology" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'rgba(0,194,255,0.08)', mixBlendMode: 'overlay' }} />
            <div className="absolute bottom-6 left-6 right-6 bg-background/85 backdrop-blur-md rounded-xl p-5 border border-outline-variant">
              <div className="flex gap-6 justify-around">
                {[
                  { val: '1.2M', label: 'Fleet Miles' },
                  { val: '0.19', label: 'Drag Coeff' },
                  { val: '98%', label: 'Recyclability' },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-4">
                    {i > 0 && <div className="w-px h-8 bg-outline-variant" />}
                    <div>
                      <div className="text-2xl font-black text-primary">{s.val}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <motion.footer variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}
        className="border-t border-outline-variant py-10 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-black text-sm tracking-tight">KINETIC PRECISION</span>
          </div>
          <p className="text-on-surface-variant text-xs">© 2026 Kinetic Precision EV. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <Link href="/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
            <Link href="/seminars" className="hover:text-primary transition-colors">Seminars</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
          </div>
        </div>
      </motion.footer>

    </div>
  );
}
