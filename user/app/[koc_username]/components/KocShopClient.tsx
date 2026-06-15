'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, ArrowDown, Activity, ChevronRight, Play, Zap, Shield, Star, Award, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../../src/stores/cartStore';
import CartDrawer from './CartDrawer';
import { kocShopService } from '../../../src/services/koc-shop.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from 'lenis';
import DemoOne from '@components/ui/demo';

interface KocShopClientProps {
  initialKoc: any;
  initialProducts: any[];
  categories: any[];
  username: string;
}

const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80'
];

const SECTION_THEMES = [
  { bg: '#000000', accent: '#ffffff', text: '#ffffff' }, // Hero
  { bg: '#0a0010', accent: '#a855f7', text: '#e9d5ff' }, // Stats + Marquee
  { bg: '#000a0f', accent: '#06b6d4', text: '#cffafe' }, // Manifesto
  { bg: '#0f0a00', accent: '#f59e0b', text: '#fde68a' }, // Horizontal Gallery
  { bg: '#00050a', accent: '#10b981', text: '#d1fae5' }, // Split Screen
  { bg: '#0f0005', accent: '#f43f5e', text: '#fce7f3' }, // Massive Video
  { bg: '#0f0000', accent: '#ff1801', text: '#ffe5e5' }, // F1 Section
  { bg: '#050010', accent: '#8b5cf6', text: '#ddd6fe' }, // 3D Testimonials
  { bg: '#080808', accent: '#ffffff', text: '#ffffff' } // Awards
];

export default function KocShopClient({ initialKoc: koc, initialProducts, categories: initialCategories, username }: KocShopClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCartStore();
  const kocCartItems = items.filter(item => item.kocId === koc._id);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scroll & GSAP
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    ScrollTrigger.clearScrollMemory();

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8
    });

    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', () => lenis.resize());

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0, 0);

    let ctx: gsap.Context;

    // Trì hoãn việc khởi tạo ScrollTrigger để đảm bảo vị trí cuộn đã về 0 và DOM ổn định
    const initTimer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Hero reveal
        gsap.fromTo('.hero-reveal', 
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power4.out', delay: 0.5 }
        );

        // Parallax images
        gsap.utils.toArray('.parallax-img').forEach((img: any) => {
          gsap.fromTo(img, 
            { y: '-20%' },
            {
              y: '20%',
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        });

        // ── Color Section — background color transition ──────────────────
        SECTION_THEMES.forEach((theme, i) => {
          ScrollTrigger.create({
            trigger: `.color-section-${i}`,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => gsap.to('body', { backgroundColor: theme.bg, duration: 1, ease: 'power2.inOut' }),
            onEnterBack: () => gsap.to('body', { backgroundColor: theme.bg, duration: 1, ease: 'power2.inOut' })
          });
        });

        // Split Screen Pinned Section
        const splitLeft = document.querySelector('.split-left');
        const splitRight = document.querySelector('.split-right');
        if (splitLeft && splitRight) {
          ScrollTrigger.create({
            trigger: '.split-section',
            start: 'top top',
            end: 'bottom bottom',
            pin: '.split-left'
          });
        }

        // Continuous Marquee
        gsap.to('.marquee-inner', {
          xPercent: -50,
          ease: 'none',
          duration: 20,
          repeat: -1
        });

        // Custom Cursor Logic
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
          const onMove = (e: MouseEvent) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
          };
          const onEnter = () => {
            gsap.to(cursor, { width: 28, height: 28, opacity: 0.6, duration: 0.2 });
          };
          const onLeave = () => {
            gsap.to(cursor, { width: 12, height: 12, opacity: 1, duration: 0.2 });
          };
          window.addEventListener('mousemove', onMove);
          document.querySelectorAll('button, a, .product-card, .hz-item').forEach((el) => {
            el.addEventListener('mouseenter', onEnter);
            el.addEventListener('mouseleave', onLeave);
          });
        }

        // HORIZONTAL SCROLL GALLERY with Skew
        const horizontalSection = document.querySelector('.horizontal-scroll-section');
        const horizontalContainer = document.querySelector('.horizontal-scroll-container');
        
        if (horizontalSection && horizontalContainer) {
          gsap.to(horizontalContainer, {
            x: () => -(horizontalContainer.scrollWidth - window.innerWidth) + 'px',
            ease: 'none',
            scrollTrigger: {
              trigger: horizontalSection,
              start: 'top top',
              end: () => '+=' + horizontalContainer.scrollWidth,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const velocity = self.getVelocity();
                gsap.to('.hz-item', {
                  skewX: velocity / -200,
                  duration: 0.5,
                  ease: 'power3.out',
                  overwrite: 'auto'
                });
                clearTimeout((window as any).skewTimeout);
                (window as any).skewTimeout = setTimeout(() => {
                  gsap.to('.hz-item', { skewX: 0, duration: 0.5, ease: 'power3.out' });
                }, 100);
              }
            }
          });
        }

        // Massive Video Parallax Reveal
        gsap.fromTo('.massive-video',
          { scale: 1.5, filter: 'blur(10px)' },
          {
            scale: 1,
            filter: 'blur(0px)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.video-parallax-section',
              start: 'top bottom',
              end: 'center center',
              scrub: 1
            }
          }
        );

        // F1 Video scale reveal
        gsap.fromTo('.video-reveal-f1',
          { scale: 1.4, filter: 'brightness(0.3) blur(8px)' },
          {
            scale: 1,
            filter: 'brightness(0.7) blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: '.video-reveal-section-f1',
              start: 'top bottom',
              end: 'center center',
              scrub: 1.2
            }
          }
        );

        // Reveal text on scroll
        gsap.utils.toArray('.reveal-up').forEach((elem: any) => {
          gsap.fromTo(elem,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: elem,
                start: 'top 85%'
              }
            }
          );
        });

        // Accent color text glow on scroll
        gsap.utils.toArray('.glow-on-scroll').forEach((el: any) => {
          const color = el.getAttribute('data-glow') || '#ffffff';
          ScrollTrigger.create({
            trigger: el,
            start: 'top 75%',
            end: 'bottom 25%',
            onEnter: () => gsap.to(el, { textShadow: `0 0 40px ${color}80, 0 0 80px ${color}40`, duration: 0.8 }),
            onLeave: () => gsap.to(el, { textShadow: 'none', duration: 0.6 }),
            onEnterBack: () => gsap.to(el, { textShadow: `0 0 40px ${color}80, 0 0 80px ${color}40`, duration: 0.8 }),
            onLeaveBack: () => gsap.to(el, { textShadow: 'none', duration: 0.6 })
          });
        });

        // Accent line draw
        gsap.utils.toArray('.line-draw').forEach((el: any) => {
          gsap.fromTo(el,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.2, ease: 'power3.inOut',
              scrollTrigger: { trigger: el, start: 'top 90%' }
            }
          );
        });

        // Counter animation
        gsap.utils.toArray('.count-up').forEach((el: any) => {
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const suffix = el.getAttribute('data-suffix') || '';
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              const obj = { val: 0 };
              gsap.fromTo(obj, { val: 0 }, {
                val: target, duration: 2, ease: 'power2.out',
                onUpdate() {
                  el.textContent = obj.val.toFixed(target % 1 !== 0 ? 1 : 0) + suffix;
                }
              });
            }
          });
        });
      }, containerRef);

      ScrollTrigger.refresh();
    }, 150);

    const refreshAll = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', refreshAll);

    const handleFirstScroll = () => {
      ScrollTrigger.refresh();
      window.removeEventListener('scroll', handleFirstScroll);
    };
    window.addEventListener('scroll', handleFirstScroll);

    const timer1 = setTimeout(refreshAll, 200);
    const timer2 = setTimeout(refreshAll, 600);
    const timer3 = setTimeout(refreshAll, 1200);

    return () => {
      window.removeEventListener('load', refreshAll);
      window.removeEventListener('scroll', handleFirstScroll);
      clearTimeout(initTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      lenis.destroy();
      if (ctx) ctx.revert();
      gsap.ticker.remove(ticker);
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  const handleCategoryClick = async (categoryId: string) => {
    setActiveCategory(categoryId);
    try {
      if (categoryId === 'all') {
        setProducts(initialProducts);
      } else {
        const data = await kocShopService.getAllProducts(undefined, categoryId);
        setProducts(data.products || []);
      }
      
      // Re-trigger animations for new products
      setTimeout(() => {
        ScrollTrigger.refresh();
        gsap.fromTo('.product-card',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
      }, 100);
    } catch (error) {
      console.error('Error filtering products:', error);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        
        body { background-color: #000000; color: #FFFFFF; overflow-x: hidden; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .grid-bg {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 100px 100px;
        }

        /* Hide scrollbar for Lenis */
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        
        /* Custom cursor dot — overlay trên con trỏ mặc định */
        .custom-cursor {
          mix-blend-mode: difference;
          pointer-events: none;
          position: fixed;
          top: 0; left: 0;
          z-index: 9999;
          width: 12px; height: 12px;
          background: white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, opacity 0.2s;
        }
      `}} />

      {/* Custom cursor dot — không ẩn con trỏ hệ thống */}
      <div className="custom-cursor" aria-hidden />

      <div ref={containerRef} className="min-h-screen font-sans selection:bg-white selection:text-black">
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference px-6 md:px-12 py-8 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <h1 className="font-mono text-sm tracking-[0.2em] uppercase">
              {koc.name} <span className="opacity-50">/ AUTOMOTIVE</span>
            </h1>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto flex items-center gap-2 font-mono text-xs tracking-widest hover:opacity-70 transition-opacity"
          >
            <span>CART</span>
            <span className="w-6 h-6 border border-white flex items-center justify-center rounded-full">
              {kocCartItems.length}
            </span>
          </button>
        </header>

        {/* HERO SECTION - FULL SCREEN CINEMATIC */}
        <section className="color-section-0 relative h-screen w-full flex flex-col justify-end pb-24 px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-black">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-60 parallax-img"
            >
              <source src="/Xe_hơi_chạy_cho_website_202606061442.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <div className="hero-reveal font-mono text-xs tracking-[0.3em] text-white/50 mb-6 flex items-center gap-4">
                <span className="w-12 h-px bg-white/50" />
                MISSION CRITICAL ASSETS
              </div>
              <h2 className="hero-reveal text-5xl md:text-8xl font-light tracking-tighter leading-[0.9] uppercase">
                Engineering <br />
                <span className="font-semibold">Excellence.</span>
              </h2>
            </div>

            <div className="hero-reveal flex flex-col gap-6 md:min-w-[300px]">
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Precision-engineered automotive machinery. Designed for absolute performance and uncompromising aesthetics.
              </p>
              <button 
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-4 w-fit"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <ArrowDown className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs tracking-[0.2em] uppercase">Explore Fleet</span>
              </button>
            </div>
          </div>
        </section>

        {/* STATS DIVIDER */}
        <section className="color-section-1 py-24 border-y border-white/10 relative z-10 bg-black">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
            {[
              { val: 42.5, suf: 'M', label: 'GLOBAL REACH', color: '#a855f7' },
              { val: 1204, suf: '', label: 'ASSETS SECURED', color: '#a855f7' },
              { val: 99.9, suf: '%', label: 'SYSTEM UPTIME', color: '#a855f7' },
              { val: 7, suf: ' YRS', label: 'ENGINEERING', color: '#a855f7', countOverride: '7' }
            ].map((stat, i) => (
              <div key={i} className="reveal-up">
                <div className="font-mono text-[10px] tracking-[0.2em] text-white/40 mb-2">{stat.label}</div>
                <div className="text-3xl md:text-5xl font-light tracking-tight glow-on-scroll" data-glow={stat.color}>
                  {stat.countOverride ? (
                    <span>{stat.countOverride}</span>
                  ) : (
                    <span className="count-up" data-target={stat.val} data-suffix={stat.suf}>0</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: MANIFESTO / STORY */}
        <section className="color-section-2 py-40 bg-[#000a0f] relative z-10 border-y border-white/10">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
            <h3 className="font-mono text-xs tracking-[0.4em] text-cyan-400/60 mb-12 reveal-up uppercase flex items-center justify-center gap-4">
              <span className="line-draw h-px w-12 bg-cyan-400/40 block" />
              The Architecture of Speed
              <span className="line-draw h-px w-12 bg-cyan-400/40 block" />
            </h3>
            <p className="text-3xl md:text-5xl font-light leading-[1.2] tracking-tight reveal-up text-white/90">
              WE DO NOT BUILD CARS. WE FORGE ADRENALINE INTO METAL. EVERY CURVE, EVERY ENGINE ROAR IS METICULOUSLY CALCULATED TO{' '}
              <span className="text-cyan-300 glow-on-scroll" data-glow="#06b6d4">
                DEFY THE LIMITS
              </span>
              {' '}OF PHYSICS.
            </p>
          </div>
        </section>

        {/* DEMO: HORIZONTAL SCROLL SECTION (UNIFIERS OF JAPAN STYLE) */}
        <section className="color-section-3 horizontal-scroll-section relative h-screen bg-[#0A0A0A] overflow-hidden flex items-center border-b border-white/10 z-10">
          <div className="absolute top-12 left-12 font-mono text-xs tracking-[0.3em] text-white/50 z-20 mix-blend-difference">
            ARCHIVE GALLERY // HORIZONTAL SCROLL
          </div>
          
          <div className="horizontal-scroll-container flex gap-12 px-[10vw] h-[60vh] items-center w-max">
            {[
              'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
              'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1000&q=80',
              'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
              'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
              'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80'
            ].map((imgUrl, index) => (
              <div key={index} className="hz-item w-[60vw] md:w-[40vw] h-full shrink-0 relative group">
                <div className="absolute inset-0 bg-[#111111] overflow-hidden border border-white/10">
                  <img 
                    src={imgUrl} 
                    alt="Gallery" 
                    className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                  />
                </div>
                <div className="absolute -bottom-16 left-0 font-heading text-4xl md:text-6xl font-light text-white/80 whitespace-nowrap">
                  EXHIBIT 0{index + 1}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: SPLIT SCREEN FEATURES */}
        <section className="color-section-4 split-section relative bg-black z-10">
          <div className="flex flex-col md:flex-row">
            {/* Left side (Pinned) */}
            <div className="split-left w-full md:w-1/2 h-screen flex flex-col justify-center px-6 md:px-12 border-r border-white/10">
              <h3 className="text-5xl md:text-7xl font-light tracking-tighter uppercase mb-6 glow-on-scroll" data-glow="#10b981">
                Absolute <br/><span className="font-semibold text-emerald-300">Control.</span>
              </h3>
              <p className="text-white/50 font-light max-w-sm">
                Experience raw power paired with surgical precision. Our automotive assets are engineered for those who demand nothing less than perfection on the tarmac.
              </p>
            </div>
            
            {/* Right side (Scrolling) */}
            <div className="split-right w-full md:w-1/2 flex flex-col">
              {/* Video block instead of image */}
              <div className="h-screen w-full relative border-b border-white/10 overflow-hidden">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 scale-110">
                  <source src="/Xe_hơi_chạy_cho_website_202606061442.mp4" type="video/mp4" />
                </video>
                <div className="absolute bottom-6 left-6 font-mono text-xs tracking-widest bg-black/50 px-4 py-2 backdrop-blur-md">V8 BI-TURBO ENGINE [LIVE]</div>
              </div>
              <div className="h-screen w-full relative border-b border-white/10">
                <img src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Aerodynamics" />
                <div className="absolute bottom-6 left-6 font-mono text-xs tracking-widest bg-black/50 px-4 py-2 backdrop-blur-md">CARBON FIBER AERO</div>
              </div>
              <div className="h-screen w-full relative">
                <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Interior" />
                <div className="absolute bottom-6 left-6 font-mono text-xs tracking-widest bg-black/50 px-4 py-2 backdrop-blur-md">ALCANTARA COCKPIT</div>
              </div>
            </div>
          </div>
        </section>

        {/* INFINITE MARQUEE */}
        <section className="py-8 bg-white text-black overflow-hidden relative z-10 border-y border-white/10">
          <div className="marquee-container flex whitespace-nowrap w-max">
            <div className="marquee-inner flex font-mono text-2xl md:text-4xl tracking-widest uppercase font-bold">
              <span className="mx-8">• NO COMPROMISE</span>
              <span className="mx-8">• PURE PERFORMANCE</span>
              <span className="mx-8">• AERODYNAMIC EXCELLENCE</span>
              <span className="mx-8">• LIMITLESS SPEED</span>
              <span className="mx-8">• NO COMPROMISE</span>
              <span className="mx-8">• PURE PERFORMANCE</span>
              <span className="mx-8">• AERODYNAMIC EXCELLENCE</span>
              <span className="mx-8">• LIMITLESS SPEED</span>
            </div>
          </div>
        </section>

        {/* SECTION: MASSIVE VIDEO PARALLAX */}
        <section className="color-section-5 video-reveal-section relative h-screen w-full overflow-hidden bg-black z-10 border-b border-white/10">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="video-reveal w-full h-full object-cover opacity-80"
          >
            <source src="/Xe_hơi_chạy_cho_website_202606061442.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
            <h2 className="reveal-up text-white text-6xl md:text-9xl font-light tracking-tighter uppercase leading-none">
              Push
            </h2>
            <h2 className="reveal-up text-rose-300 text-6xl md:text-9xl font-semibold tracking-tighter uppercase glow-on-scroll leading-none" data-glow="#f43f5e">
              Limits.
            </h2>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6 — FORMULA 1 - BREAK THE BARRIER (F1 Red Accent)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="color-section-6 video-reveal-section-f1 relative h-screen overflow-hidden bg-black z-10">
          <video autoPlay loop muted playsInline
            className="video-reveal-f1 absolute inset-0 w-full h-full object-cover">
            <source src="/Formula_1_car_breaking_barrier_202606062152.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/75" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="reveal-up font-mono text-[10px] tracking-[0.5em] text-[#ff1801] mb-6 uppercase">
              // RETHINKING LAWS OF PHYSICS
            </div>
            <h2 className="reveal-up text-[clamp(2.5rem,10vw,8rem)] font-extralight tracking-[-0.04em] uppercase text-white/95 leading-none mb-2">
              Break The
            </h2>
            <h2 className="reveal-up text-[clamp(2.5rem,10vw,8rem)] font-bold tracking-[-0.04em] uppercase text-[#ff1801] glow-on-scroll leading-none" data-glow="#ff1801">
              Barrier.
            </h2>
            <p className="reveal-up mt-8 text-white/50 text-sm max-w-md font-light leading-relaxed">
              Experience the raw, unrestrained energy of Formula 1. Aerodynamics refined to perfection, designed to slice through air and shatter expectations.
            </p>
          </div>
          {/* Overlay metadata */}
          <div className="absolute bottom-10 left-10 reveal-up hidden md:block font-mono text-[9px] tracking-[0.3em] text-white/25">
            F1 SPECIAL DIVISION · 2026
          </div>
          <div className="absolute bottom-10 right-10 reveal-up hidden md:block font-mono text-[9px] tracking-[0.3em] text-[#ff1801]/60">
            0-100 KM/H IN 1.8S · OVERLOAD G-FORCE
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 7 — 3D TESTIMONIALS (violet accent)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="color-section-7 relative z-10 py-32 overflow-hidden flex flex-col items-center justify-center border-y border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-xl text-left">
              <div className="reveal-left font-mono text-[10px] tracking-[0.4em] text-violet-400/60 mb-6 flex items-center gap-4">
                <span className="line-draw h-px w-12 bg-violet-400/40 block" />
                COLLECTOR VOICE
              </div>
              <h2 className="reveal-up text-5xl md:text-7xl font-extralight uppercase tracking-tight mb-8">
                What They<br /><span className="font-semibold text-violet-300 glow-on-scroll" data-glow="#8b5cf6">Say.</span>
              </h2>
              <p className="reveal-up text-white/40 text-sm leading-loose max-w-md">
                Hear from the elite circle of automotive collectors who have acquired their legendary machines through our custom concierge channel.
              </p>
            </div>
            <div className="w-full lg:w-auto reveal-scale flex justify-center">
              <DemoOne />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 8 — AWARDS & TRUST SIGNALS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="color-section-8 relative z-10 py-32 bg-[#080808] border-y border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-24 reveal-up">
              <div className="font-mono text-[10px] tracking-[0.4em] text-white/20 mb-8 flex items-center justify-center gap-4">
                <span className="line-draw h-px w-12 bg-white/10 block" />
                WHY CHOOSE US
                <span className="line-draw h-px w-12 bg-white/10 block" />
              </div>
              <h2 className="text-4xl md:text-6xl font-extralight uppercase tracking-tight">
                Trusted by collectors <br />
                <span className="font-semibold">worldwide.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Award className="w-7 h-7" />, title: 'Certified Quality', val: '100%', desc: 'Factory-certified condition reports on all vehicles' },
                { icon: <Shield className="w-7 h-7" />, title: 'Full Warranty', val: '2 YRS', desc: 'Comprehensive mechanical warranty included' },
                { icon: <TrendingUp className="w-7 h-7" />, title: 'Value Growth', val: '+34%', desc: 'Average appreciation of our collector fleet' },
                { icon: <Star className="w-7 h-7" />, title: 'Client Rating', val: '4.97★', desc: 'From 1,200+ verified buyers globally' }
              ].map((item, i) => (
                <div key={i} className="reveal-up group border border-white/[0.07] p-8 hover:border-white/20 transition-colors duration-500 bg-black/30">
                  <div className="text-white/30 group-hover:text-white/70 transition-colors mb-6">{item.icon}</div>
                  <div className="font-mono text-4xl font-extralight text-white mb-2">{item.val}</div>
                  <div className="text-sm font-semibold text-white/70 mb-3">{item.title}</div>
                  <div className="text-xs text-white/25 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATALOG SECTION */}
        <section id="catalog-section" className="py-32 relative z-10 bg-black">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 reveal-up">
              <div>
                <h3 className="text-4xl md:text-6xl font-light tracking-tight uppercase">The Fleet</h3>
              </div>
              
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none border-b border-white/10 w-full md:w-auto">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`pb-4 font-mono text-xs tracking-[0.1em] uppercase transition-colors whitespace-nowrap ${
                    activeCategory === 'all' ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  All Assets
                </button>
                {(categories || []).map((cat: any) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat._id)}
                    className={`pb-4 font-mono text-xs tracking-[0.1em] uppercase transition-colors whitespace-nowrap ${
                      activeCategory === cat._id ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-24">
              {(products || []).map((p: any, idx: number) => {
                const isAvailable = p.status === 'available';
                // Offset even items for a staggered layout
                const isEven = idx % 2 !== 0;

                return (
                  <div 
                    key={p._id} 
                    onClick={() => router.push(`/${username}/product/${p._id}`)}
                    className={`product-card group cursor-pointer ${isEven ? 'md:mt-32' : ''}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#0A0A0A] mb-6">
                      {p.images && p.images[0] ? (
                        <div className="w-full h-full h-[120%] -mt-[10%]">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="parallax-img w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-white/20">NO VISUAL DATA</div>
                      )}
                      
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <span className="font-mono text-xs tracking-[0.3em] uppercase border border-white/20 px-6 py-2">
                            {p.status === 'holding' ? 'LOCKED' : 'ACQUIRED'}
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.2em] text-white/50 bg-black/50 px-2 py-1 backdrop-blur-md">
                        ID: {p._id.substring(0,8)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-xl font-light uppercase tracking-tight group-hover:underline decoration-1 underline-offset-4">
                          {p.name}
                        </h4>
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                      
                      <div className="font-mono text-sm tracking-widest text-white/70">
                        {(p.price ?? 0).toLocaleString('vi-VN')} VND
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {(!products || products.length === 0) && (
              <div className="py-32 text-center border border-white/10">
                <div className="font-mono text-xs tracking-[0.2em] text-white/40">NO ASSETS FOUND IN THIS CATEGORY.</div>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 border-t border-white/10 bg-black relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-mono text-xs tracking-[0.2em] text-white/50">
              © 2026 {koc.name}. ALL SYSTEMS NOMINAL.
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-white/30">
              POWERED BY KOC PLATFORM
            </div>
          </div>
        </footer>

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          kocUsername={username}
          kocId={koc._id}
          onCheckout={() => {}}
        />
      </div>
    </>
  );
}
