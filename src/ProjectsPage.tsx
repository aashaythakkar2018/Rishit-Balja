import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import ImageComparisonSlider from './ImageComparisonSlider';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: '01',
    title: 'Driving Behaviour',
    subtitle: '& Gamified Coaching',
    type: 'UX Designer',
    year: '2025–Present',
    tagline: 'Reimagined a stagnant driver performance product into a scalable, multi-brand coaching platform driving adoption, retention, and long-term engagement.',
    challenge: 'High churn and low trust in an outdated evaluation model, limiting adoption and product growth.',
    whatIDid: [
      'Transformed evaluation into a coaching-led experience',
      'Simplified scoring logic to improve trust and usability',
      'Enabled multi-brand scalability and flexible system design',
      'Introduced gamification and reporting to drive engagement at scale',
    ],
    impact: [
      'Highest Daily Active Users recorded (2025)',
      'Increased adoption and retention',
      'Reduced support dependency through clearer UX',
      'Established foundation for subscription growth and future roadmap',
    ],
    cover: '/projects/driving-behaviour.jpg',
    images: [
      '/projects/driving-behaviour/img1.png',
      '/projects/driving-behaviour/img2.png',
      '/projects/driving-behaviour/img3.png',
    ],
    labeledImages: [
      { src: '/projects/driving-behaviour/cover.png', label: 'Overview' },
      { src: '/projects/driving-behaviour/coaching.svg', label: 'Coaching & Gamification' },
      { src: '/projects/driving-behaviour/img1.png', label: 'Old UI' },
      { src: '/projects/driving-behaviour/img2.png', label: 'New Driver Page' },
      { src: '/projects/driving-behaviour/img3.png', label: 'Customisation Feature' },
      { src: '/projects/driving-behaviour/hero.svg', label: 'Final Deliverable' },
    ],
  },
  {
    id: '02',
    title: 'Charging Service',
    subtitle: 'EV Fleet Experience',
    type: 'CX Designer',
    year: '2022',
    tagline: 'Defined a marketplace-driven charging experience for logistics—connecting fragmented infrastructure into a unified, scalable discovery and planning platform.',
    challenge: 'Charging infrastructure was fragmented across providers, creating inconsistent access, poor visibility, and friction in operational planning—limiting adoption of electric fleets.',
    whatIDid: [
      'Mapped the charging ecosystem as a multi-sided platform across fleets, drivers, and infrastructure providers',
      'Designed a unified discovery layer enabling cross-network access and comparability',
      'Integrated charging into route planning to support decision-making in real-world operations',
      'Established principles for a premium, reliable experience in an inconsistent supply environment',
    ],
    impact: [
      'Shaped a scalable foundation for charging as a platform service',
      'Strengthened competitive positioning through a differentiated, premium experience',
      'Supported early adoption of electric trucks by reducing friction in infrastructure access',
    ],
    cover: '/projects/charging-service.jpg',
    images: [
      '/projects/charging-service/img1.png',
      '/projects/charging-service/img2.png',
      '/projects/charging-service/img3.png',
    ],
    labeledImages: [
      { src: '/projects/charging-service/cover.png', label: 'EV Dashboard' },
      { src: '/projects/charging-service/img1.png', label: 'USP Feature' },
      { src: '/projects/charging-service/img2.png', label: 'Brand Design' },
      { src: '/projects/charging-service/img3.png', label: 'Research of premium experience' },
      { src: '/projects/charging-service/img4.png', label: 'Research' },
    ],
  },
  {
    id: '03',
    title: 'Tachograph Service',
    subtitle: 'Compliance Platform',
    type: 'UX Researcher',
    year: '2023',
    tagline: 'Led a strategic UX research initiative to redefine tachograph services as a scalable, premium compliance platform within a highly regulated ecosystem.',
    challenge: 'Compliance workflows were complex, fragmented, and difficult to trust—creating operational risk for fleet operators and limiting the product\'s potential as a premium service.',
    whatIDid: [
      'Mapped end-to-end compliance workflows across fleets, drivers, and regulatory bodies',
      'Identified critical gaps in usability, clarity, and risk exposure through multi-market research (UK, Sweden, Benelux)',
      'Translated regulatory complexity into structured service blueprints and system-level insights',
      'Defined the UX and product principles for a premium, reliable compliance solution',
    ],
    impact: [
      'Informed executive decision-making on build vs white-label strategy',
      'Shaped product direction for a scalable, compliance-driven service',
      'Established a foundation for reducing user error and improving trust in regulated workflows',
    ],
    cover: '/projects/tachograph.png',
    images: [
      '/projects/tachograph-service/img1.png',
      '/projects/tachograph-service/img2.png',
      '/projects/tachograph-service/img3.png',
    ],
    labeledImages: [
      { src: '/projects/tachograph-service/cover.png', label: 'New UI' },
      { src: '/projects/tachograph-service/hero.svg', label: 'Final Deliverable' },
      { src: '/projects/tachograph-service/img1.png', label: 'CX Journey' },
      { src: '/projects/tachograph-service/img2.png', label: 'Old UI' },
      { src: '/projects/tachograph-service/img3.png', label: 'Optimisation of Data' },
    ],
  },
  {
    id: '04',
    title: 'Flygkraft',
    subtitle: 'Brand & Experience Design',
    type: 'Brand Designer',
    year: '2021',
    tagline: 'Defined the brand and communication system for an early-stage energy startup, translating complex battery technology into a clear, investable narrative.',
    challenge: 'An early-stage deep-tech startup lacked a clear identity and struggled to communicate its value to investors.',
    whatIDid: [
      'Defined brand strategy, positioning, and visual identity from the ground up',
      'Translated complex energy technology into a clear, structured narrative',
      'Designed a cohesive system across logo, typography, color, and communication',
      'Created investor-facing materials to support funding and credibility',
    ],
    impact: [
      'Enabled clearer communication of product value and vision',
      'Supported investor conversations and funding efforts',
      'Established a confident, scalable brand foundation',
    ],
    cover: '/projects/flygkraft/cover.png',
    images: [
      '/projects/flygkraft/img1.png',
      '/projects/flygkraft/img2.png',
      '/projects/flygkraft/img3.png',
    ],
    labeledImages: [
      { src: '/projects/flygkraft/cover.png', label: 'Brand Guide Cover' },
      { src: '/projects/flygkraft/img1.png', label: 'Logo Inspiration' },
      { src: '/projects/flygkraft/img2.png', label: 'Design Draft' },
      { src: '/projects/flygkraft/img3.png', label: 'Font Pairing' },
    ],
    downloadLink: {
      url: '/projects/flygkraft/Flying-Card-Style-Guide-Compress.pdf',
      label: 'Link to Download Brand Guide',
    },
  },
];

export default function ProjectsPage({ activeProjectId, onBack }: { activeProjectId?: string | null; onBack: (targetId?: string) => void }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isCVDropdownOpen, setIsCVDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; label?: string } | null>(null);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-cv')) {
        setIsCVDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    if (activeProjectId) {
      setTimeout(() => {
        const el = document.getElementById(`project-${activeProjectId}`);
        if (el) {
          const targetPosition = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: targetPosition, behavior: 'instant' });
        }
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }

    const revObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.pfu').forEach((el) => revObs.observe(el));

    return () => {
      revObs.disconnect();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      ref={pageRef}
      className="min-h-screen bg-[var(--bg)]"
    >
      {/* NAV */}
      <motion.nav
        initial={{ y: -68 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[500] h-[68px] flex items-center justify-between px-6 md:px-12 border-b border-[var(--bdr)] bg-[rgba(246,247,249,0.82)] backdrop-blur-[22px]"
      >
        <button
          onClick={() => onBack('home')}
          className="nav-logo font-[var(--font-syne)] font-extrabold text-[17px] tracking-[0.05em] lowercase text-[var(--txt)] cursor-pointer border-none bg-transparent"
        >
          rishit<em className="text-[var(--acc)] not-italic">.</em>
        </button>
        
        {/* Desktop Links */}
        <ul className="nav-links hidden md:flex items-center gap-10 list-none">
          <li>
            <button
              onClick={() => onBack('home')}
              className="flex items-center gap-1.5 font-[var(--font-syne)] text-[11px] font-medium tracking-[0.14em] text-[var(--txt2)] hover:text-[var(--txt)] transition-colors duration-250 cursor-pointer bg-transparent border-none p-0 pr-6 border-r border-[var(--bdr)]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              Back
            </button>
          </li>
          <li><button onClick={() => onBack('contact')} className="font-[var(--font-syne)] text-[11px] font-medium tracking-[0.14em] text-[var(--txt2)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-[width] after:duration-400 hover:after:w-full cursor-pointer bg-transparent border-none p-0">Contact</button></li>
          <li><button onClick={() => onBack('projects')} className="font-[var(--font-syne)] text-[11px] font-medium tracking-[0.14em] text-[var(--txt2)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-[width] after:duration-400 hover:after:w-full cursor-pointer bg-transparent border-none p-0">Projects</button></li>
          <li className="relative nav-cv z-[5000]">
            <button
              onClick={() => setIsCVDropdownOpen(!isCVDropdownOpen)}
              className="font-[var(--font-syne)] text-[11px] font-medium tracking-[0.14em] text-[var(--txt2)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-[width] after:duration-400 hover:after:w-full cursor-pointer bg-transparent border-none p-0"
            >
              CV
            </button>
            <AnimatePresence>
              {isCVDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, ease: [0.77, 0, 0.175, 1] }}
                  className="absolute top-[calc(100%+8px)] right-0 w-[150px] bg-[var(--bg)] border border-[var(--bdr)] rounded-[2px] shadow-[0_8px_30px_rgba(8,8,8,0.08)] flex flex-col py-[6px] origin-top-right overflow-hidden"
                >
                  <a
                    href="https://cdn.prod.website-files.com/625569d4ab664a2be0140994/62a7873d1f8a98ba088a241e_RishitBhaljaCV.pdf"
                    target="_blank"
                    onClick={() => setIsCVDropdownOpen(false)}
                    className="font-[var(--font-syne)] text-[10px] font-medium tracking-[0.14em] text-[var(--txt2)] px-5 py-[10px] hover:bg-[var(--bg2)] hover:text-[var(--acc)] transition-colors flex justify-between items-center group/btn"
                  >
                    English
                  </a>
                  <div className="h-[1px] bg-[var(--bdr)] mx-4 my-[2px]"></div>
                  <a
                    href="/Rishit-CV-Swedish.pdf"
                    target="_blank"
                    onClick={() => setIsCVDropdownOpen(false)}
                    className="font-[var(--font-syne)] text-[10px] font-medium tracking-[0.14em] text-[var(--txt2)] px-5 py-[10px] hover:bg-[var(--bg2)] hover:text-[var(--acc)] transition-colors flex justify-between items-center group/btn"
                  >
                    Swedish
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col gap-[5px] cursor-pointer border-none bg-transparent p-2 z-[600]"
        >
          <span className={`w-6 h-[1.5px] bg-[var(--txt)] transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}></span>
          <span className={`w-6 h-[1.5px] bg-[var(--txt)] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`w-6 h-[1.5px] bg-[var(--txt)] transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}></span>
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay — moved outside fixed-height nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-[rgba(246,247,249,0.92)] backdrop-blur-xl z-[550] flex flex-col items-center justify-center p-12 md:hidden"
          >
            <ul className="flex flex-col items-center gap-8 list-none p-0 text-center">
              <li>
                <button
                  onClick={() => { onBack('home'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 font-[var(--font-swifter)] text-[22px] font-light tracking-tight text-[var(--txt3)] bg-transparent border-none"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                  Back
                </button>
              </li>
              <li><button onClick={() => { onBack('contact'); setIsMobileMenuOpen(false); }} className="font-[var(--font-swifter)] text-[32px] font-light tracking-tight text-[var(--txt)] bg-transparent border-none">Contact</button></li>
              <li><button onClick={() => { onBack('projects'); setIsMobileMenuOpen(false); }} className="font-[var(--font-swifter)] text-[32px] font-light tracking-tight text-[var(--txt)] bg-transparent border-none">Projects</button></li>
              <li>
                 <button 
                  onClick={() => setIsCVDropdownOpen(!isCVDropdownOpen)}
                  className="font-[var(--font-swifter)] text-[32px] font-light tracking-tight text-[var(--txt)] bg-transparent border-none"
                >
                  CV
                </button>
                {isCVDropdownOpen && (
                  <div className="flex flex-col gap-4 mt-4">
                    <a href="https://cdn.prod.website-files.com/625569d4ab664a2be0140994/62a7873d1f8a98ba088a241e_RishitBhaljaCV.pdf" target="_blank" className="font-[var(--font-syne)] text-[12px] tracking-[0.1em] text-[var(--acc)]">English</a>
                    <a href="/Rishit-CV-Swedish.pdf" target="_blank" className="font-[var(--font-syne)] text-[12px] tracking-[0.1em] text-[var(--acc)]">Swedish</a>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="pt-[68px] px-6 md:px-12 py-24 border-b border-[var(--bdr)] text-center">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-[var(--font-swifter)] font-light text-[clamp(44px,8vw,110px)] leading-[0.88] tracking-[-0.02em] text-[var(--txt)]"
          >
            Projects<span className="text-[var(--acc)]">.</span>
          </motion.h1>

      </section>

      {/* PROJECT LIST */}
      <section className="px-6 md:px-12">
        {projects.map((proj, pi) => (
          <article id={`project-${proj.id}`} key={proj.id} className={`py-24 border-b border-[var(--bdr)] ${pi % 2 === 1 ? 'bg-[var(--bg2)]' : ''}`}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
              className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16 max-w-[1100px] mx-auto"
            >
              <div>
                <div className="font-[var(--font-syne)] text-[15px] font-medium tracking-[0.16em] text-[var(--acc)] mb-4">
                  {proj.id} · {proj.type} · {proj.year}
                </div>
                <h2 className="font-[var(--font-swifter)] font-light text-[clamp(42px,6vw,80px)] leading-[1] tracking-[-0.02em] text-[var(--txt)]">
                  {proj.title}<br />
                  <em className="not-italic text-[var(--txt3)] [-webkit-text-stroke:1px_rgba(8,8,8,0.15)]">{proj.subtitle}</em>
                </h2>
              </div>
              <div>
                <p className="max-w-[400px] text-[13px] font-light text-[var(--txt2)] leading-[1.85]">{proj.tagline}</p>
                {proj.downloadLink && (
                  <a 
                    href={proj.downloadLink.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 font-[var(--font-syne)] text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--acc)] hover:opacity-80 transition-opacity"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {proj.downloadLink.label}
                  </a>
                )}
              </div>
            </motion.div>

            {/* Challenge + What I Did + Impact */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.77, 0, 0.175, 1] }}
              className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[var(--bdr)] mb-16"
            >
              {/* Challenge */}
              <div className="bg-[var(--bg)] p-8">
                <div className="font-[var(--font-syne)] text-[15px] font-medium tracking-[0.16em] text-[var(--acc)] mb-4">Challenge</div>
                <p className="text-[13px] font-light text-[var(--txt2)] leading-[1.85]">{proj.challenge}</p>
              </div>
              {/* What I Did */}
              <div className="bg-[var(--bg)] p-8">
                <div className="font-[var(--font-syne)] text-[15px] font-medium tracking-[0.16em] text-[var(--acc)] mb-4">What I Did</div>
                <ul className="space-y-2">
                  {proj.whatIDid.map((item, i) => (
                    <li key={i} className="text-[13px] font-light text-[var(--txt2)] leading-[1.7] flex gap-2 before:content-['—'] before:text-[var(--acc)] before:shrink-0">{item}</li>
                  ))}
                </ul>
              </div>
              {/* Impact */}
              <div className="bg-[var(--bg)] p-8">
                <div className="font-[var(--font-syne)] text-[15px] font-medium tracking-[0.16em] text-[var(--acc)] mb-4">Impact</div>
                <ul className="space-y-2">
                  {proj.impact.map((item, i) => (
                    <li key={i} className="text-[13px] font-light text-[var(--txt2)] leading-[1.7] flex gap-2 before:content-['—'] before:text-[var(--acc)] before:shrink-0">{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Gallery — labeled (hover-reveal name) or default */}
            {'labeledImages' in proj && proj.labeledImages ? (
              <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(proj.labeledImages as Array<{ src: string; label: string }>).map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.77, 0, 0.175, 1] }}
                    className="relative rounded-[4px] overflow-hidden border border-[var(--bdr)] aspect-[4/3] group cursor-zoom-in"
                    onClick={() => setSelectedImage({ src: img.src, label: img.label })}
                  >
                    {/* Image */}
                    <img
                      src={img.src}
                      alt={img.label}
                      className="w-full h-full object-cover object-top transition-transform duration-[0.7s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-[1.04]"
                    />
                    {/* Subtle dark overlay on hover */}
                    <div className="absolute inset-0 bg-[rgba(8,8,8,0)] group-hover:bg-[rgba(8,8,8,0.18)] transition-all duration-500 pointer-events-none" />
                    {/* Label — hidden below, slides up on hover. Clean dark bar, no fill */}
                    <div className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none">
                      <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)] bg-[rgba(8,8,8,0.68)] backdrop-blur-sm border-t border-[rgba(255,255,255,0.06)] px-5 py-3 flex items-center justify-between">
                        <span className="font-[var(--font-syne)] text-[10px] font-medium tracking-[0.2em] uppercase text-white/90">
                          {img.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                {[proj.cover, ...proj.images].map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.77, 0, 0.175, 1] }}
                    className="rounded-[4px] overflow-hidden border border-[var(--bdr)] aspect-[4/3] group"
                  >
                    <motion.div
                      initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
                      whileInView={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                      viewport={{ once: true, margin: '-10% 0px' }}
                      transition={{ duration: 0.8, delay: 0.2 + (i * 0.1), ease: [0.77, 0, 0.175, 1] }}
                      className="w-full h-full"
                    >
                      <img
                        src={img}
                        alt={`${proj.title} ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-[0.8s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-[1.05] cursor-zoom-in relative z-10"
                        onClick={() => setSelectedImage({ src: img })}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* UI Comparison Slider — only shown for projects with compareImages */}
            {'compareImages' in proj && proj.compareImages && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.77, 0, 0.175, 1] }}
                className="max-w-[1100px] mx-auto mt-12"
              >
                {/* Section header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-[var(--bdr)]">
                  <div>
                    <div className="font-[var(--font-syne)] text-[11px] font-bold tracking-[0.2em] text-[var(--acc)] uppercase mb-2">UI Evolution</div>
                    <h3 className="font-[var(--font-swifter)] font-light text-[clamp(28px,3.5vw,42px)] leading-[1] tracking-[-0.01em] text-[var(--txt)]">
                      Before &amp; After
                    </h3>
                  </div>
                  <p className="text-[12px] font-light text-[var(--txt3)] leading-[1.85] max-w-[360px] md:text-right">
                    Drag the handle left or right to reveal the transformation from the old interface to the redesigned experience.
                  </p>
                </div>

                <ImageComparisonSlider
                  beforeImage={(proj.compareImages as { before: string; after: string; beforeLabel: string; afterLabel: string }).before}
                  afterImage={(proj.compareImages as { before: string; after: string; beforeLabel: string; afterLabel: string }).after}
                  beforeLabel={(proj.compareImages as { before: string; after: string; beforeLabel: string; afterLabel: string }).beforeLabel}
                  afterLabel={(proj.compareImages as { before: string; after: string; beforeLabel: string; afterLabel: string }).afterLabel}
                />
              </motion.div>
            )}
          </article>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 md:px-12 flex flex-col items-center gap-4 text-center border-t border-[var(--bdr)]">
        <div className="font-[var(--font-syne)] font-extrabold text-[14px] tracking-[0.07em] lowercase">rishitbhalja</div>
        <div className="text-[12px] text-[var(--txt3)] tracking-[0.05em]">© 2026 — Experience Designer</div>
        <button
          onClick={() => onBack('projects')}
          className="mt-2 font-[var(--font-syne)] text-[11px] font-bold tracking-[0.2em] uppercase text-[#080808] border border-[#080808] bg-transparent px-8 py-[12px] rounded-[2px] transition-all duration-300 hover:bg-[var(--acc)] hover:border-[var(--acc)] hover:text-[#080808] hover:-translate-y-[2px] shadow-[0_4px_15px_rgba(8,8,8,0.03)] hover:shadow-[0_8px_20px_rgba(255,99,33,0.15)]"
        >
          Back to Projects
        </button>
      </footer>
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[99999] bg-[rgba(10,10,10,0.96)] flex flex-col items-center justify-center gap-5 p-4 md:p-12 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ ease: [0.77, 0, 0.175, 1], duration: 0.4 }}
              src={selectedImage.src}
              alt={selectedImage.label ?? 'Enlarged view'}
              className="max-w-full max-h-[82vh] object-contain shadow-2xl rounded-[4px] cursor-zoom-out"
            />
            {selectedImage.label && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-[var(--font-syne)] text-[10px] font-medium tracking-[0.25em] uppercase text-white/50 text-center"
              >
                {selectedImage.label}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { projects };
