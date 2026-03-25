import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, AnimatePresence } from 'motion/react';
import ProjectsPage, { projects as projData } from './ProjectsPage';
import PasswordProtection from './PasswordProtection';
import heroPortrait from './hero-portrait.jpg';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [time, setTime] = useState('--:--');
  const [timeZone, setTimeZone] = useState('GMT+1 · Jönköping, Sweden');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCVDropdownOpen, setIsCVDropdownOpen] = useState(false);
  
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const heroHlRef = useRef<HTMLHeadingElement>(null);
  const projScrollerRef = useRef<HTMLDivElement>(null);
  const featImgRef = useRef<HTMLDivElement>(null);
  const featImgInnerRef = useRef<HTMLDivElement>(null);

  // Loader
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.style.overflow = 'auto';
    }, 1000);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Clock
  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Stockholm',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setTime(t);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cursor
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-cv')) {
        setIsCVDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleGlobalClick);

    let mx = 0, my = 0, rx = 0, ry = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animateCursor = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${mx}px`;
        cursorDotRef.current.style.top = `${my}px`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${rx}px`;
        cursorRingRef.current.style.top = `${ry}px`;
      }
      requestAnimationFrame(animateCursor);
    };
    const rafId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement;
      const progress = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!isLoaded) return;

    // Split text utility
    const splitLetters = (el: HTMLElement, charClass: string) => {
      const text = el.textContent || '';
      el.textContent = '';
      const spans: HTMLSpanElement[] = [];
      for (let i = 0; i < text.length; i++) {
        const s = document.createElement('span');
        s.className = charClass;
        s.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        el.appendChild(s);
        spans.push(s);
      }
      return spans;
    };

    // Hero Name Reveal
    const heroWords = heroHlRef.current?.querySelectorAll('.li');
    let heroChars: HTMLSpanElement[] = [];
    heroWords?.forEach((word) => {
      const chars = splitLetters(word as HTMLElement, 'hl-char inline-block translate-y-[110%] will-change-transform');
      heroChars = heroChars.concat(chars);
    });

    gsap.to(heroChars, {
      y: '0%',
      duration: 1.7,
      ease: 'power4.inOut',
      stagger: {
        each: 0.03,
        from: 'center',
      },
      delay: 0.5,
      onStart: () => {
        gsap.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
        gsap.to('.hero-img-full', { opacity: 1, scale: 1, duration: 2.2, ease: 'power3.inOut', delay: 0.2 });
      },
      onComplete: () => {
        gsap.to('.hero-sub', { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out' });
        gsap.to('.hero-meta', { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out', delay: 0.15 });
        gsap.to('.clock-block', { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out', delay: 0.3 });
      },
    });


    // Intersection Observers for other elements
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fu, .clip-reveal, .quote-block').forEach((el) => revObs.observe(el));

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      revObs.disconnect();
    };
  }, [isLoaded]);

  // Horizontal Scroll and Tilt


  // Tilt Effect
  useEffect(() => {
    const featOuter = featImgRef.current;
    const featInner = featImgInnerRef.current;
    if (!featOuter || !featInner) return;

    const handleMouseMove = (e: MouseEvent) => {
      const r = featOuter.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      featInner.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.03)`;
    };

    const handleMouseLeave = () => {
      featInner.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)';
      featInner.style.transition = 'transform 0.6s var(--easeOut)';
      setTimeout(() => {
        featInner.style.transition = 'transform 0.12s linear';
      }, 650);
    };

    const handleMouseEnter = () => {
      featInner.style.transition = 'transform 0.12s linear';
    };

    featOuter.addEventListener('mousemove', handleMouseMove);
    featOuter.addEventListener('mouseleave', handleMouseLeave);
    featOuter.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      featOuter.removeEventListener('mousemove', handleMouseMove);
      featOuter.removeEventListener('mouseleave', handleMouseLeave);
      featOuter.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Smooth Scroll
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        const targetId = anchor.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          
          gsap.to(window, {
            duration: 0.8,
            scrollTo: { y: targetPosition, autoKill: false },
            ease: "power3.out" // This is equivalent to ease-out cubic
          });
        }
      }
    };

    window.addEventListener('click', handleAnchorClick);
    return () => window.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <>
      {/* CURSOR — always rendered regardless of view */}
      <div ref={cursorDotRef} className="cdot fixed w-[7px] h-[7px] bg-[var(--acc)] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-[left,top] mix-blend-difference"></div>
      <div ref={cursorRingRef} className="cring fixed w-[38px] h-[38px] border border-[rgba(255,99,33,0.35)] rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color] duration-[0.28s] ease-[var(--ease)] will-change-[left,top]"></div>

      {showProjects ? (
        isAuthenticated ? (
          <ProjectsPage onBack={() => { setShowProjects(false); setIsAuthenticated(false); setTimeout(() => window.scrollTo(0, 0), 50); }} />
        ) : (
          <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} onBack={() => { setShowProjects(false); setIsAuthenticated(false); setTimeout(() => window.scrollTo(0, 0), 50); }} />
        )
      ) : (
      <>
      {/* LOADER */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1, y: 0 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[9999] bg-[var(--bg)] flex flex-col items-center justify-center cursor-wait"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)', letterSpacing: '-0.02em' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.01em' }}
              transition={{ duration: 0.4, ease: [0.77, 0, 0.175, 1] }}
              className="font-[var(--font-syne)] text-[clamp(44px,8vw,100px)] font-extrabold text-[var(--txt)] text-center tracking-[0.02em] relative"
            >
              Rishit. <span className="text-[var(--acc)]">Bhalja.</span>
              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.77, 0, 0.175, 1] }}
                className="absolute -bottom-2 md:-bottom-4 left-0 right-0 h-[3px] bg-[var(--acc)] origin-left"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.2, delay: 0.9 }}
                className="absolute inset-0 bg-white mix-blend-overlay pointer-events-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOISE */}
      <div className="noise"></div>

      {/* PROGRESS */}
      <div id="pgbar" className="fixed top-0 left-0 h-[2px] bg-[var(--acc)] z-[9000] shadow-[0_0_12px_rgba(255,99,33,0.5)] transition-[width] duration-75 linear" style={{ width: `${scrollProgress}%` }}></div>



      {/* NAV */}
      <nav id="mainNav" className="fixed top-0 left-0 right-0 z-[500] h-[68px] flex items-center justify-between px-6 md:px-12 border-b border-[var(--bdr)] bg-[rgba(253,252,248,0.82)] backdrop-blur-[22px] transition-colors duration-500">
        <a href="#home" className="nav-logo font-[var(--font-syne)] font-extrabold text-[15px] tracking-[0.05em] lowercase text-[var(--txt)]">
          rishit<em className="text-[var(--acc)] not-italic">.</em>
        </a>
        <ul className="nav-links hidden md:flex items-center gap-10 list-none">

          <li><a href="#contact" data-nav="contact" className="font-[var(--font-syne)] text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--txt2)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-[width] after:duration-400 hover:after:w-full">Contact</a></li>
          <li><button onClick={() => setShowProjects(true)} data-nav="projects" className="font-[var(--font-syne)] text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--txt2)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-[width] after:duration-400 hover:after:w-full cursor-pointer bg-transparent border-none p-0">Projects</button></li>
        </ul>
        <div className="relative nav-cv z-[5000]">
          <button 
            onClick={() => setIsCVDropdownOpen(!isCVDropdownOpen)}
            className="font-[var(--font-syne)] text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--bg)] bg-[var(--acc)] px-5 py-[9px] rounded-[2px] transition-all duration-250 hover:bg-[#d6ff8a] flex items-center gap-[6px] cursor-pointer border-none"
          >
            CV <span className={`text-[9px] transition-transform duration-300 ${isCVDropdownOpen ? 'rotate-180' : ''}`}>▲</span>
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
                  className="font-[var(--font-syne)] text-[10px] font-medium tracking-[0.14em] uppercase text-[var(--txt2)] px-5 py-[10px] hover:bg-[var(--bg2)] hover:text-[var(--acc)] transition-colors flex justify-between items-center group/btn"
                >
                  English <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">↗</span>
                </a>
                <div className="h-[1px] bg-[var(--bdr)] mx-4 my-[2px]"></div>
                <a 
                  href="/Rishit-CV-Swedish.pdf" 
                  target="_blank" 
                  onClick={() => setIsCVDropdownOpen(false)}
                  className="font-[var(--font-syne)] text-[10px] font-medium tracking-[0.14em] uppercase text-[var(--txt2)] px-5 py-[10px] hover:bg-[var(--bg2)] hover:text-[var(--acc)] transition-colors flex justify-between items-center group/btn"
                >
                  Swedish <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">↗</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="min-h-screen pt-[68px] relative overflow-hidden">
        <div className="hero-wrap grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-68px)]">
          <div className="hero-L flex flex-col justify-center md:justify-end p-6 md:p-12 md:border-r border-[var(--bdr)] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(var(--bdr)_1px,transparent_1px),linear-gradient(90deg,var(--bdr)_1px,transparent_1px)] before:bg-[60px_60px] before:opacity-60 before:pointer-events-none">
            <p className="hero-eyebrow font-[var(--font-syne)] text-[11px] tracking-[0.2em] uppercase text-[var(--txt3)] mb-[2.2rem] flex items-center gap-3 opacity-0 translate-y-4 before:content-[''] before:w-[22px] before:h-[1px] before:bg-[var(--acc)]">
              <span>01</span> — Turning attention into intent—and intent into measurable outcomes.
            </p>
            <h1 ref={heroHlRef} className="hero-hl font-[var(--font-swifter)] font-bold text-[clamp(40px,5vw,72px)] leading-[0.88] uppercase tracking-[-0.01em]">
              <span className="lw block overflow-hidden"><span className="li block" data-word="Designing premium">Designing premium</span></span>
              <span className="lw block overflow-hidden"><span className="li block" data-word="digital experiences">digital experiences</span></span>
              <span className="lw block overflow-hidden"><span className="li block" data-word="where user desire">where user desire</span></span>
              <span className="lw block overflow-hidden"><span className="li block acc-word text-[var(--acc)]" data-word="meets business value.">meets business value.</span></span>
            </h1>
            <p className="hero-sub text-[14px] font-light text-[var(--txt2)] leading-[1.8] max-w-[480px] mt-8 mb-10 opacity-0 translate-y-4">
              Experience Designer with 5+ years shaping products across logistics, startups, and marketplaces—driving subscription growth, adoption, and scalable platform thinking.
            </p>
            <div className="hero-meta flex items-center gap-7 opacity-0 translate-y-4">
              <span className="loc-txt font-[var(--font-syne)] text-[11px] tracking-[0.14em] uppercase text-[var(--txt3)] flex items-center gap-2">
                <span className="loc-dot w-[7px] h-[7px] rounded-full bg-[var(--acc)] shrink-0 animate-[pulse_2.2s_infinite]"></span>
                Jönköping, Sweden
              </span>
              <a href="#contact" className="cta-btn font-[var(--font-syne)] text-[12px] font-semibold tracking-[0.12em] uppercase text-[var(--bg)] bg-[var(--acc)] px-8 py-[12px] rounded-[2px] transition-all duration-300 hover:bg-[#d6ff8a] hover:-translate-y-[2px] shadow-[0_4px_15px_rgba(255,99,33,0.25)] hover:shadow-[0_8px_20px_rgba(214,255,138,0.3)]">
                Let's Talk ↗
              </a>
            </div>
          </div>
          <div className="hero-R hidden md:block relative overflow-hidden">
            <div className="hero-img-full w-full h-full absolute inset-0 z-[5]">
              <img 
                src={heroPortrait} 
                alt="Rishit Bhalja" 
                className="w-full h-full object-cover object-[center_20%]" 
                referrerPolicy="no-referrer" 
              />
            </div>
            
            <div className="hero-overlays absolute inset-0 p-12 flex flex-col justify-between pointer-events-none z-[10]">
              <div className="clock-block text-right opacity-0 translate-y-4">
                <div className="clock-dig font-[var(--font-swifter)] font-light text-[clamp(44px,5vw,68px)] tracking-[0.03em] text-[var(--txt)] tabular-nums leading-none drop-shadow-md">{time}</div>
                <div className="clock-tz font-[var(--font-syne)] text-[11px] tracking-[0.16em] uppercase text-[var(--txt3)] mt-[6px]">{timeZone}</div>
              </div>
              <div className="font-[var(--font-syne)] text-[11px] tracking-[0.1em] text-[var(--txt3)] text-right opacity-0 translate-y-4">© 2026 Rishit Bhalja</div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker bg-[var(--acc)] h-[44px] overflow-hidden flex items-center">
        <div className="t-track flex whitespace-nowrap animate-[tick_24s_linear_infinite]">
          {['UX Design', 'UI Design', 'Enterprise Experience', 'User Research', 'Prototyping', 'Information Architecture', 'Jönköping Sweden', 'Interaction Design'].map((item, i) => (
            <span key={i} className="t-item font-[var(--font-swifter)] font-semibold text-[13px] tracking-[0.18em] uppercase text-[var(--bg)] px-8 flex items-center gap-7 after:content-['✦'] after:text-[9px] after:text-[rgba(8,8,8,0.3)]">
              {item}
            </span>
          ))}
          {['UX Design', 'UI Design', 'Enterprise Experience', 'User Research', 'Prototyping', 'Information Architecture', 'Jönköping Sweden', 'Interaction Design'].map((item, i) => (
            <span key={`dup-${i}`} className="t-item font-[var(--font-swifter)] font-semibold text-[13px] tracking-[0.18em] uppercase text-[var(--bg)] px-8 flex items-center gap-7 after:content-['✦'] after:text-[9px] after:text-[rgba(8,8,8,0.3)]">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <section id="projects" className="py-28 border-t border-[var(--bdr)] overflow-hidden">
        <div className="proj-header px-6 md:px-12 flex flex-col items-center text-center mb-14 gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="sec-lbl font-[var(--font-syne)] text-[11px] tracking-[0.2em] uppercase text-[var(--txt3)] flex items-center gap-[10px] mb-[0.8rem]"
          >
            <em className="text-[var(--acc)] not-italic">02</em> The Projects
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="sec-hl font-[var(--font-swifter)] font-bold text-[clamp(54px,6.5vw,90px)] leading-[0.88] uppercase tracking-[-0.01em] text-[var(--txt)]"
          >
            The Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.77, 0, 0.175, 1] }}
            className="proj-intro max-w-[480px] text-[13px] font-light text-[var(--txt2)] leading-[1.85]"
          >
            Design work at the intersection of responsible design, modernism & elegant simplicity — emphasising typography, colour & white space.
          </motion.p>
        </div>

        <div className="px-6 md:px-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {projData.map((proj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.7, delay: 0.2 + (i * 0.1), ease: [0.77, 0, 0.175, 1] }}
                className="border border-[var(--bdr)] rounded-[2px] overflow-hidden relative cursor-pointer bg-[var(--bg)] group"
                onClick={() => setShowProjects(true)}
              >
                <div className="proj-img-wrap overflow-hidden aspect-[4/3] relative">
                  <motion.div
                    initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
                    whileInView={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.8, delay: 0.3 + (i * 0.1), ease: [0.77, 0, 0.175, 1] }}
                    className="w-full h-full"
                  >
                    <img
                      src={proj.cover}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-[1.05]"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.85)_0%,transparent_50%)] opacity-0 transition-opacity duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:opacity-100 pointer-events-none"></div>
                  <div className="absolute top-4 left-4 font-[var(--font-swifter)] text-[12px] tracking-[0.14em] text-[var(--txt3)] z-[2] mix-blend-difference">{proj.id}</div>
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 translate-y-3 transition-all duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] z-[2] group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none">
                    <p className="font-[var(--font-syne)] text-[10px] tracking-[0.12em] uppercase text-[rgba(255,120,60,0.9)] mb-1">{proj.type}</p>
                    <h3 className="font-[var(--font-swifter)] font-semibold text-[20px] tracking-[0.02em] uppercase text-[var(--bg)]">{proj.title}</h3>
                  </div>
                </div>
                <div className="proj-info p-6 relative bg-[var(--bg)] transition-colors duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:bg-[var(--bg2)]">
                  <div className="font-[var(--font-swifter)] text-[11px] tracking-[0.14em] text-[var(--txt3)] mb-2 group-hover:-translate-y-1 transition-transform duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)]">{proj.year}</div>
                  <div className="font-[var(--font-swifter)] font-semibold text-[22px] tracking-[0.03em] uppercase text-[var(--txt)] mb-1 transition-all duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:text-[var(--acc)] group-hover:-translate-y-1">{proj.title}</div>
                  <div className="font-[var(--font-syne)] text-[10px] tracking-[0.12em] uppercase text-[var(--txt3)] transition-transform duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-1">{proj.type}</div>
                  <div className="absolute right-[1.4rem] top-[1.4rem] w-[34px] h-[34px] border border-[var(--bdr2)] rounded-full flex items-center justify-center text-[14px] text-[var(--txt3)] rotate-45 transition-all duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:rotate-0 group-hover:border-[var(--acc)] group-hover:bg-[var(--acc)] group-hover:text-[var(--bg)] group-hover:-translate-y-1">↗</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CONTACT */}
      <section id="contact" className="px-6 md:px-12 pt-28 border-t border-[var(--bdr)]">
        <div className="contact-inner flex flex-col items-center text-center pb-20 border-b border-[var(--bdr)]">
          <div className="sec-lbl fu font-[var(--font-syne)] text-[11px] tracking-[0.2em] uppercase text-[var(--txt3)] flex items-center gap-[10px] mb-[0.8rem]"><em className="text-[var(--acc)] not-italic">05</em> Get In Touch</div>
          <h2 className="contact-hl fu d1 font-[var(--font-swifter)] font-bold text-[clamp(60px,8vw,118px)] leading-[0.86] uppercase tracking-[-0.02em] mb-12">Let's <em className="not-italic text-[var(--acc)]">Connect</em></h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="contact-list fu flex flex-col w-full max-w-[720px]"
          >
            {[
              { platform: 'LinkedIn', url: 'Rishit Bhalja', href: 'https://www.linkedin.com/in/rishitbhalja/' },
              { platform: 'Email', url: 'rishitbhalja@gmail.com', href: 'mailto:rishitbhalja@gmail.com?subject=UX%20Designer' },
              { platform: 'Instagram', url: '@rishitbhalja', href: 'https://www.instagram.com/rishitbhalja/' },
            ].map((link, i) => (
              <motion.a
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1), ease: 'easeOut' }}
                href={link.href}
                className="contact-row flex items-center justify-between py-6 border-b border-[var(--bdr)] relative overflow-hidden transition-all duration-300 group before:content-[''] before:absolute before:inset-0 before:bg-[var(--acc2)] before:scale-y-0 before:origin-bottom before:transition-transform before:duration-400 hover:before:scale-y-100 hover:border-[var(--acc3)]"
                target="_blank"
              >
                <span className="c-platform font-[var(--font-syne)] text-[11px] tracking-[0.18em] uppercase text-[var(--txt3)] relative z-[1]">{link.platform}</span>
                <span className="c-url font-[var(--font-swifter)] text-[22px] font-medium uppercase tracking-[0.03em] text-[var(--txt)] transition-colors duration-250 relative z-[1]">{link.url}</span>
                <span className="c-arrow text-[18px] text-[var(--txt3)] rotate-45 transition-all duration-400 ease-[var(--ease)] relative z-[1] group-hover:rotate-0 group-hover:text-[var(--acc)]">↗</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="footer py-8 flex flex-col items-center gap-5 text-center"
        >
          <div className="f-logo font-[var(--font-syne)] font-extrabold text-[14px] tracking-[0.07em] lowercase">rishitbhalja</div>
          <div className="f-copy text-[12px] text-[var(--txt3)] tracking-[0.05em]">© 2026 — UX Designer</div>
          <nav className="f-socials flex gap-8">
            <a href="https://www.linkedin.com/in/rishitbhalja/" className="f-soc font-[var(--font-syne)] text-[11px] tracking-[0.12em] uppercase text-[var(--txt3)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-all after:duration-350 hover:after:w-full" target="_blank">LinkedIn</a>
            <a href="mailto:rishitbhalja@gmail.com" className="f-soc font-[var(--font-syne)] text-[11px] tracking-[0.12em] uppercase text-[var(--txt3)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-all after:duration-350 hover:after:w-full">Mail</a>
            <a href="https://www.instagram.com/rishitbhalja/" className="f-soc font-[var(--font-syne)] text-[11px] tracking-[0.12em] uppercase text-[var(--txt3)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-all after:duration-350 hover:after:w-full" target="_blank">Instagram</a>
          </nav>
        </motion.footer>
      </section>
      </>
      )}
    </>
  );
}
