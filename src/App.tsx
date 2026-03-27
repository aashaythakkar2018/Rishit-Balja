import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, AnimatePresence } from 'motion/react';
import ProjectsPage, { projects as projData } from './ProjectsPage';
import heroPortrait from './hero-portrait.jpg';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [password, setPassword] = useState('');
  const [passError, setPassError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [preloadingComplete, setPreloadingComplete] = useState(false);
  const [preloadingProgress, setPreloadingProgress] = useState(0);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [isCVDropdownOpen, setIsCVDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const heroHlRef = useRef<HTMLHeadingElement>(null);
  const projScrollerRef = useRef<HTMLDivElement>(null);
  const featImgRef = useRef<HTMLDivElement>(null);
  const featImgInnerRef = useRef<HTMLDivElement>(null);

  // Preloader progress effect
  useEffect(() => {
    if (!isLoaded && !preloadingComplete) {
      const duration = 2400; // Slightly longer for better feel
      const start = Date.now();
      const timer = setInterval(() => {
        const timePassed = Date.now() - start;
        const progress = Math.min(timePassed / duration, 1);
        setPreloadingProgress(progress);
        if (progress >= 1) {
          clearInterval(timer);
          // Give a small buffer before showing the form
          setTimeout(() => setPreloadingComplete(true), 600);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isLoaded, preloadingComplete]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Keepitsimple*123') {
      setIsAuthenticating(true);
      setPassError(false);
      // Brief delay for the aesthetic transition
      setTimeout(() => {
        setIsLoaded(true);
      }, 800);
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };
  // Initial body overflow hidden, set to auto when loaded
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (isLoaded) {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoaded]);



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

    // Hero Reveal (Instant)
    const heroLines = heroHlRef.current?.querySelectorAll('.li');
    gsap.set(heroLines, { y: '0%' });
    gsap.set('.hero-sub', { opacity: 1, y: 0 });
    gsap.set('.hero-meta', { opacity: 1, y: 0 });
    gsap.set('.hero-overlays div', { opacity: 1, y: 0 });
    gsap.set('.hero-img-full', { opacity: 1, scale: 1 });


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
      <div ref={cursorDotRef} className="cdot hidden md:block fixed w-[7px] h-[7px] bg-[var(--acc)] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-[left,top] mix-blend-difference"></div>
      <div ref={cursorRingRef} className="cring hidden md:block fixed w-[38px] h-[38px] border border-[rgba(255,99,33,0.35)] rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color] duration-[0.28s] ease-[var(--ease)] will-change-[left,top]"></div>

      {showProjects ? (
        <ProjectsPage onBack={(targetId?: string) => { 
          setShowProjects(false); 
          setTimeout(() => {
            const id = targetId || 'projects';
            const targetElement = document.getElementById(id);
            if (targetElement) {
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
              window.scrollTo({ top: targetPosition, behavior: 'instant' });
            }
          }, 10); 
        }} />
      ) : (
      <>
      {/* LOADER */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1, y: 0 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[9999] bg-[var(--bg)] flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center w-full max-w-[400px] px-6">
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)', letterSpacing: '-0.02em' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.01em' }}
                transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
                className="font-[var(--font-syne)] text-[clamp(40px,6vw,72px)] font-light text-[var(--txt)] text-center tracking-[-0.03em] relative mb-12"
              >
                rishitbhalja<span className="text-[var(--acc)]">.</span>
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isAuthenticating ? 1 : preloadingProgress }}
                  transition={{ duration: 0.1, ease: "linear" }}
                  className="absolute -bottom-3 left-0 right-0 h-[2px] bg-[var(--acc)] origin-left"
                  style={{ opacity: preloadingComplete ? 0.3 : 1 }}
                />
              </motion.div>

              <AnimatePresence>
                {preloadingComplete && (
                  <motion.form 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleAuth}
                    className="w-full flex flex-col gap-4"
                  >
                    <div className="relative group">
                      <input 
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-transparent border-b ${passError ? 'border-[#ff4d4d]' : 'border-[var(--bdr2)]'} py-3 text-[13px] font-[var(--font-syne)] text-[var(--txt)] text-center placeholder:text-[var(--txt3)] placeholder:opacity-50 outline-none transition-all focus:border-[var(--acc)]`}
                        autoFocus
                      />
                      {passError && (
                        <motion.span 
                          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                          className="absolute left-0 right-0 -bottom-6 text-[10px] text-[#ff4d4d] font-[var(--font-syne)] tracking-wide text-center"
                        >
                          Incorrect password. Please try again.
                        </motion.span>
                      )}
                    </div>
                    <button 
                      type="submit"
                      disabled={isAuthenticating}
                      className="mt-6 self-center font-[var(--font-syne)] text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--txt)] border border-[var(--bdr2)] px-8 py-4 rounded-[4px] transition-all duration-300 flex items-center gap-3 group hover:bg-[var(--acc)] hover:border-[var(--acc)] hover:text-black hover:-translate-y-1"
                    >
                      {isAuthenticating ? 'Authenticating...' : 'Access Site'} 
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.2, delay: 0.9 }}
              className="absolute inset-0 bg-white mix-blend-overlay pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOISE */}
      <div className="noise"></div>

      {/* PROGRESS */}
      <div id="pgbar" className="fixed top-0 left-0 h-[2px] bg-[var(--acc)] z-[9000] shadow-[0_0_12px_rgba(255,99,33,0.5)] transition-[width] duration-75 linear" style={{ width: `${scrollProgress}%` }}></div>



      {/* NAV */}
      <nav id="mainNav" className="fixed top-0 left-0 right-0 z-[500] h-[68px] flex items-center justify-between px-6 md:px-12 border-b border-[var(--bdr)] bg-[rgba(246,247,249,0.82)] backdrop-blur-[22px] transition-colors duration-500">
        <a href="#home" className="nav-logo font-[var(--font-syne)] font-extrabold text-[17px] tracking-[0.05em] lowercase text-[var(--txt)] cursor-pointer">
          rishit<em className="text-[var(--acc)] not-italic">.</em>
        </a>
        
        {/* Desktop Links */}
        <ul className="nav-links hidden md:flex items-center gap-10 list-none">
          <li><a href="#contact" className="font-[var(--font-syne)] text-[11px] font-medium tracking-[0.14em] text-[var(--txt2)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-[width] after:duration-400 hover:after:w-full">Contact</a></li>
          <li><button onClick={() => setShowProjects(true)} className="font-[var(--font-syne)] text-[11px] font-medium tracking-[0.14em] text-[var(--txt2)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-[width] after:duration-400 hover:after:w-full cursor-pointer bg-transparent border-none p-0">Projects</button></li>
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
                    English <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">↗</span>
                  </a>
                  <div className="h-[1px] bg-[var(--bdr)] mx-4 my-[2px]"></div>
                  <a 
                    href="/Rishit-CV-Swedish.pdf" 
                    target="_blank" 
                    onClick={() => setIsCVDropdownOpen(false)}
                    className="font-[var(--font-syne)] text-[10px] font-medium tracking-[0.14em] text-[var(--txt2)] px-5 py-[10px] hover:bg-[var(--bg2)] hover:text-[var(--acc)] transition-colors flex justify-between items-center group/btn"
                  >
                    Swedish <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">↗</span>
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
      </nav>

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
              <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="font-[var(--font-swifter)] text-[32px] font-light tracking-tight text-[var(--txt)]">Contact</a></li>
              <li><button onClick={() => { setShowProjects(true); setIsMobileMenuOpen(false); }} className="font-[var(--font-swifter)] text-[32px] font-light tracking-tight text-[var(--txt)] bg-transparent border-none">Projects</button></li>
              <li>
                 <button 
                  onClick={() => setIsCVDropdownOpen(!isCVDropdownOpen)}
                  className="font-[var(--font-swifter)] text-[32px] font-light tracking-tight text-[var(--txt)] bg-transparent border-none"
                >
                  CV
                </button>
                {isCVDropdownOpen && (
                  <div className="flex flex-col gap-4 mt-4">
                    <a href="https://cdn.prod.website-files.com/625569d4ab664a2be0140994/62a7873d1f8a98ba088a241e_RishitBhaljaCV.pdf" target="_blank" className="font-[var(--font-syne)] text-[12px] tracking-[0.1em] text-[var(--acc)]">English ↗</a>
                    <a href="/Rishit-CV-Swedish.pdf" target="_blank" className="font-[var(--font-syne)] text-[12px] tracking-[0.1em] text-[var(--acc)]">Swedish ↗</a>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section id="home" className="min-h-screen pt-[68px] relative overflow-hidden">
        <div className="hero-wrap grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-68px)]">
          <div className="hero-L flex flex-col justify-center md:justify-end p-6 md:p-12 md:border-r border-[var(--bdr)] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(var(--bdr)_1px,transparent_1px),linear-gradient(90deg,var(--bdr)_1px,transparent_1px)] before:bg-[60px_60px] before:opacity-60 before:pointer-events-none">
            <h1 ref={heroHlRef} className="hero-hl font-[var(--font-swifter)] font-light text-[clamp(44px,6vw,72px)] leading-[1.05] tracking-[-0.01em] text-[var(--txt)] py-2">
              <span className="lw block overflow-hidden pb-4 mb-[-1rem]"><span className="li block" data-word="Designing premium">Designing premium</span></span>
              <span className="lw block overflow-hidden pb-4 mb-[-1rem]"><span className="li block" data-word="digital experiences">digital experiences</span></span>
              <span className="lw block overflow-hidden pb-4 mb-[-1rem]"><span className="li block" data-word="where user desire">where user <span className="font-medium">desire</span></span></span>
              <span className="lw block overflow-hidden pb-4 mb-[-1rem]"><span className="li block" data-word="meets business value.">meets business <span className="font-medium">value</span><span className="text-[var(--acc)] font-light">.</span></span></span>
            </h1>
            <p className="hero-sub text-[14px] font-light text-[var(--txt2)] leading-[1.8] max-w-[480px] mt-8 mb-10">
              Turning attention into intent—and intent into measurable outcomes.
            </p>
            <div className="hero-meta flex items-center gap-7">
              <a href="#contact" className="cta-btn font-[var(--font-syne)] text-[12px] font-light tracking-[0.12em] text-[#080808] border border-[#080808] px-8 py-[12px] rounded-[2px] transition-all duration-300 hover:bg-[var(--acc)] hover:border-[var(--acc)] hover:-translate-y-[2px] shadow-[0_4px_15px_rgba(8,8,8,0.03)] hover:shadow-[0_8px_20px_rgba(255,99,33,0.15)]">
                Let's Connect
              </a>
            </div>
          </div>
          <div className="hero-R block relative overflow-hidden h-[50vh] md:h-auto">
            <div className="hero-img-full w-full h-full absolute inset-0 z-[5]">
              <img 
                src={heroPortrait} 
                alt="Rishit Bhalja" 
                className="w-full h-full object-cover object-[center_20%]" 
                referrerPolicy="no-referrer" 
              />
            </div>
            
            <div className="hero-overlays absolute inset-0 p-6 md:p-12 flex flex-col justify-end pointer-events-none z-[10]">
              <div className="font-[var(--font-syne)] text-[11px] tracking-[0.1em] text-[var(--txt3)] text-right">© 2026 Rishit Bhalja</div>
            </div>
          </div>
        </div>
      </section>



      {/* PROJECTS */}
      <section id="projects" className="py-28 border-t border-[var(--bdr)] overflow-hidden">
        <div className="proj-header px-6 md:px-12 flex flex-col items-center text-center mb-14 gap-4">

          <motion.h2
            className="sec-hl font-[var(--font-swifter)] font-light text-[clamp(54px,6.5vw,90px)] leading-[0.88] tracking-[-0.01em] text-[var(--txt)]"
          >
            The Projects
          </motion.h2>
        </div>

        <div className="px-6 md:px-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {projData.map((proj, i) => (
              <motion.div
                key={i}
                className="border border-[var(--bdr)] rounded-[2px] overflow-hidden relative cursor-pointer bg-[var(--bg)] group"
                onClick={() => setShowProjects(true)}
              >
                <div className="proj-img-wrap overflow-hidden aspect-[4/3] relative">
                  <div className="w-full h-full">
                    <img
                      src={proj.cover}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.85)_0%,transparent_50%)] opacity-0 transition-opacity duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:opacity-100 pointer-events-none"></div>
                  <div className="absolute top-4 left-4 font-[var(--font-swifter)] text-[12px] tracking-[0.14em] text-[var(--txt3)] z-[2] mix-blend-difference">{proj.id}</div>
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 translate-y-3 transition-all duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] z-[2] group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none">
                    <p className="font-[var(--font-syne)] text-[10px] tracking-[0.12em] text-[rgba(255,120,60,0.9)] mb-1">{proj.type}</p>
                    <h3 className="font-[var(--font-swifter)] font-light text-[20px] tracking-[0.02em] text-[var(--bg)]">{proj.title}</h3>
                  </div>
                </div>
                <div className="proj-info p-6 relative bg-[var(--bg)] transition-colors duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:bg-[var(--bg2)]">
                  <div className="font-[var(--font-swifter)] text-[11px] tracking-[0.14em] text-[var(--txt3)] mb-2 group-hover:-translate-y-1 transition-transform duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)]">{proj.year}</div>
                  <div className="font-[var(--font-swifter)] font-light text-[22px] tracking-[0.03em] text-[var(--txt)] mb-1 transition-all duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:text-[var(--acc)] group-hover:-translate-y-1">{proj.title}</div>
                  <div className="font-[var(--font-syne)] text-[10px] tracking-[0.12em] text-[var(--txt3)] transition-transform duration-[0.6s] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-1">{proj.type}</div>
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

          <h2 className="contact-hl fu d1 font-[var(--font-swifter)] font-light text-[clamp(48px,8vw,118px)] leading-[0.86] tracking-[-0.02em] mb-12">Social<em className="not-italic text-[var(--acc)]">s</em></h2>
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
                className="contact-row flex items-center justify-between px-10 py-6 border-b border-[var(--bdr)] relative overflow-hidden transition-all duration-300 group before:content-[''] before:absolute before:inset-0 before:bg-[var(--acc2)] before:scale-y-0 before:origin-bottom before:transition-transform before:duration-400 hover:before:scale-y-100 hover:border-[var(--acc3)]"
                target="_blank"
              >
                <span className="c-platform font-[var(--font-syne)] text-[11px] tracking-[0.18em] text-[var(--txt3)] relative z-[1]">{link.platform}</span>
                <span className="c-url font-[var(--font-swifter)] text-[22px] font-medium tracking-[0.03em] text-[var(--txt)] transition-colors duration-250 relative z-[1]">{link.url}</span>
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
            <a href="https://www.linkedin.com/in/rishitbhalja/" className="f-soc font-[var(--font-syne)] text-[11px] tracking-[0.12em] text-[var(--txt3)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-all after:duration-350 hover:after:w-full" target="_blank">LinkedIn</a>
            <a href="mailto:rishitbhalja@gmail.com" className="f-soc font-[var(--font-syne)] text-[11px] tracking-[0.12em] text-[var(--txt3)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-all after:duration-350 hover:after:w-full">Mail</a>
            <a href="https://www.instagram.com/rishitbhalja/" className="f-soc font-[var(--font-syne)] text-[11px] tracking-[0.12em] text-[var(--txt3)] relative transition-colors duration-250 hover:text-[var(--txt)] after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:height-[1px] after:bg-[var(--acc)] after:transition-all after:duration-350 hover:after:w-full" target="_blank">Instagram</a>
          </nav>
        </motion.footer>
      </section>
      </>
      )}
    </>
  );
}
