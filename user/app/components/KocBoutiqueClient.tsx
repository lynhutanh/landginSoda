'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ChevronRight, ArrowDown, Play, Zap, Shield, Star, Award, Heart, Sparkles, Plus, Check, Mail, Phone, MapPin, Search, User, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../src/stores/cartStore';
import CartDrawer from '../[koc_username]/components/CartDrawer';
import { kocShopService } from '../../src/services/koc-shop.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from 'lenis';
import DemoOne from '@components/ui/demo';

interface KocBoutiqueClientProps {
  koc: any;
  products?: any[];
  initialProducts?: any[];
  categories?: any[];
  initialCategories?: any[];
  username: string;
  isDemoMode?: boolean;
}

// ── Danh mục hình tròn đặc trưng của SneakerX ───────────────────────────
const SNEAKER_CATEGORIES = [
  { name: 'Nike', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', count: '12 Items' },
  { name: 'Adidas', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80', count: '8 Items' },
  { name: 'Jordan', img: 'https://images.unsplash.com/photo-1550399504-8953e1a6ac87?auto=format&fit=crop&w=150&q=80', count: '15 Items' },
  { name: 'New Balance', img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=150&q=80', count: '6 Items' },
  { name: 'Converse', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=150&q=80', count: '10 Items' },
  { name: 'Vans', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=150&q=80', count: '14 Items' },
];

// ── Bài viết Blog SneakerX ───────────────────────────
const SNEAKER_BLOGS = [
  {
    title: 'Cách chọn size giày Sneaker chuẩn xác nhất cho mọi thương hiệu',
    date: '14 Tháng 6, 2026',
    img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80',
    desc: 'Việc chọn đúng size giày không chỉ mang lại sự thoải mái mà còn giúp bảo vệ đôi chân của bạn. Hãy cùng khám phá...'
  },
  {
    title: '5 cách bảo quản giày Sneaker luôn như mới trong mùa mưa',
    date: '10 Tháng 6, 2026',
    img: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=80',
    desc: 'Mùa mưa luôn là nỗi ám ảnh của các sneakerhead. Dưới đây là những mẹo giúp bảo quản đôi giày yêu quý của bạn...'
  },
  {
    title: 'Xu hướng Sneaker hot nhất năm nay bạn không thể bỏ lỡ',
    date: '05 Tháng 6, 2026',
    img: 'https://images.unsplash.com/photo-1537151608828-ea2b117b62e4?auto=format&fit=crop&w=500&q=80',
    desc: 'Những mẫu giày nào sẽ làm mưa làm gió trong năm nay? Hãy cùng chúng tôi điểm qua những xu hướng nổi bật nhất...'
  }
];

export default function KocBoutiqueClient({
  koc,
  products: productsProp,
  initialProducts,
  categories: categoriesProp,
  initialCategories,
  username,
  isDemoMode = false,
}: KocBoutiqueClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(productsProp || initialProducts || []);
  const [categories, setCategories] = useState(categoriesProp || initialCategories || []);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const { items } = useCartStore();
  const kocCartItems = items.filter((item) => item.kocId === koc._id);

  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // ── Khởi tạo Lenis và GSAP ScrollTrigger ────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    ScrollTrigger.clearScrollMemory();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    });
    lenisRef.current = lenis;

    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', () => lenis.resize());

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0, 0);

    let ctx: gsap.Context;

    const initTimer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Hero animation
        const heroTl = gsap.timeline({ delay: 0.2 });
        heroTl
          .fromTo('.hero-line-1', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power4.out' })
          .fromTo('.hero-line-2', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, '-=0.9')
          .fromTo('.hero-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7')
          .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5');

        // Parallax image
        gsap.utils.toArray<HTMLElement>('.parallax-slow').forEach((el) => {
          gsap.fromTo(el,
            { yPercent: -15 },
            { yPercent: 15, ease: 'none',
              scrollTrigger: { trigger: el.parentElement!, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
            }
          );
        });

        // Reveal elements when scroll
        gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
          gsap.fromTo(el,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('.reveal-left').forEach((el) => {
          gsap.fromTo(el,
            { x: -60, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('.reveal-right').forEach((el) => {
          gsap.fromTo(el,
            { x: 60, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
            }
          );
        });

        // Stagger grid cards
        gsap.utils.toArray<HTMLElement>('.stagger-parent').forEach((parent) => {
          const children = parent.querySelectorAll('.stagger-child');
          gsap.fromTo(children,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
              scrollTrigger: { trigger: parent, start: 'top 85%', toggleActions: 'play none none reverse' }
            }
          );
        });

        // Line draw animation
        gsap.utils.toArray<HTMLElement>('.line-draw').forEach((el) => {
          gsap.fromTo(el,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.2, ease: 'power3.inOut',
              scrollTrigger: { trigger: el, start: 'top 92%' }
            }
          );
        });

        // Counter count-up
        gsap.utils.toArray<HTMLElement>('.count-up').forEach((el) => {
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const suffix = el.getAttribute('data-suffix') || '';
          ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              const obj = { val: 0 };
              gsap.fromTo(obj, { val: 0 }, {
                val: target, duration: 1.8, ease: 'power2.out',
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

    const refreshAll = () => ScrollTrigger.refresh();
    window.addEventListener('load', refreshAll);
    return () => {
      window.removeEventListener('load', refreshAll);
      clearTimeout(initTimer);
      lenis.destroy();
      if (ctx) ctx.revert();
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  const handleCategoryClick = async (categoryId: string) => {
    setActiveCategory(categoryId);
    try {
      if (categoryId === 'all') {
        setProducts(productsProp || initialProducts || []);
      } else {
        const data = await kocShopService.getAllProducts(undefined, categoryId);
        setProducts(data.products || []);
      }
      setTimeout(() => {
        ScrollTrigger.refresh();
        gsap.fromTo('.product-card',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
        );
      }, 50);
    } catch {/* noop */}
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      condition: product.condition,
      kocId: koc._id,
      kocName: koc.name,
      kocUsername: username,
      status: product.status || 'available',
      description: product.description
    });
    setIsCartOpen(true);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Baloo+Bhaina+2:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        
        body { 
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #F9FAFB; 
          color: #1A1A1A; 
          overflow-x: hidden; 
        }
        
        .title-font {
          font-family: 'Baloo Bhaina 2', cursive, sans-serif;
        }

        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        
        /* Custom cursor follow */
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

        /* Dấu chân bay lơ lửng */
        .sneaker-print {
          position: absolute;
          opacity: 0.06;
          color: #111111;
          pointer-events: none;
        }
      `}} />

      <div className="custom-cursor" aria-hidden />

      <div ref={containerRef} className="relative min-h-screen text-[#1A1A1A] bg-[#F9FAFB]">

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 — HEADER (Logo SneakerX & Thanh điều hướng)
        ══════════════════════════════════════════════════════════════════ */}
        <header className="sticky top-0 z-40 bg-white/95 border-b border-[#E5E7EB] px-6 md:px-14 py-4 flex justify-between items-center backdrop-blur-md">
          <p className="title-font text-3xl font-extrabold tracking-tight text-[#111111] flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <Heart className="w-8 h-8 fill-[#FF4500] text-[#FF4500] animate-pulse" />
            SneakerX
          </p>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-sm">
            <a href="#" className="text-[#111111] hover:text-[#111111] transition-colors">Trang Chủ</a>
            <a href="#about" className="text-[#1A1A1A] hover:text-[#111111] transition-colors">Giới Thiệu</a>
            <a href="#catalog" className="text-[#1A1A1A] hover:text-[#111111] transition-colors">Cửa Hàng</a>
            <a href="#services" className="text-[#1A1A1A] hover:text-[#111111] transition-colors">Dịch Vụ</a>
            <a href="#testimonials" className="text-[#1A1A1A] hover:text-[#111111] transition-colors">Đánh Giá</a>
            <a href="#blogs" className="text-[#1A1A1A] hover:text-[#111111] transition-colors">Tin Tức</a>
          </nav>

          {/* Right Action Header */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#1A1A1A] hover:text-[#111111] transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#1A1A1A] hover:text-[#111111] transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 font-semibold text-sm text-[#1A1A1A] hover:text-[#111111] transition-colors bg-[#F9FAFB] px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              <ShoppingBag className="w-4 h-4 text-[#111111]" />
              <span className="hidden sm:inline">GIỎ HÀNG</span>
              <span className="w-5 h-5 bg-[#FF4500] text-[#1A1A1A] rounded-full flex items-center justify-center text-[10px] font-extrabold">
                {kocCartItems.length}
              </span>
            </button>
            <a href="#services" className="hidden xl:inline-flex bg-[#FF4500] text-[#1A1A1A] px-6 py-2.5 rounded-full text-xs font-bold tracking-wider hover:bg-[#111111] hover:text-white transition-all duration-300 shadow-md">
              TƯ VẤN NGAY
            </a>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 — HERO BANNER (We Care Your Pets)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center py-20 px-6 md:px-14 bg-gradient-to-br from-[#E5E7EB]/40 via-[#F9FAFB] to-[#111111]/5 overflow-hidden">
          {/* Floating Paw Elements */}
          <div className="sneaker-print top-1/4 left-1/4 scale-150"><Heart className="w-6 h-6 fill-current" /></div>
          <div className="sneaker-print top-2/3 left-10 scale-125"><Heart className="w-6 h-6 fill-current" /></div>
          <div className="sneaker-print top-10 right-1/3 scale-150"><Heart className="w-6 h-6 fill-current" /></div>

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Left */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#111111] bg-[#111111]/10 px-4 py-1.5 rounded-full mb-6 font-bold">
                <Sparkles className="w-3.5 h-3.5 fill-[#FF4500] text-[#FF4500]" />
                PREMIUM AUTHENTIC SNEAKERS
              </div>

              <div className="clip-overflow mb-2">
                <h1 className="hero-line-1 title-font text-[clamp(2.5rem,6vw,5rem)] font-extrabold tracking-tight leading-[1.15] text-[#1A1A1A]">
                  Step Into
                </h1>
              </div>
              <div className="clip-overflow mb-6">
                <h1 className="hero-line-2 title-font text-[clamp(2.5rem,6vw,5rem)] font-extrabold tracking-tight leading-[1.15] text-[#111111]">
                  The Future.
                </h1>
              </div>

              <p className="hero-sub text-[#767676] text-base md:text-lg font-light leading-relaxed max-w-lg mb-8">
                Chào mừng bạn đến với SneakerX. Chúng tôi cung cấp những mẫu giày sneaker chính hãng chất lượng cao, đa dạng mẫu mã và luôn cập nhật xu hướng mới nhất.
              </p>

              <div className="hero-cta flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#FF4500] text-[#1A1A1A] hover:bg-[#111111] hover:text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider shadow-lg transition-all duration-300">
                  MUA SẮM NGAY
                </button>
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-[#1A1A1A]/20 hover:border-[#111111] text-[#1A1A1A] hover:text-[#111111] px-8 py-4 rounded-full font-bold text-sm tracking-wider transition-all duration-300">
                  BỘ SƯU TẬP
                </button>
              </div>
            </div>

            {/* Visual Right */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-square">
                {/* Decorative Shapes */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#111111]/30 to-[#FF4500]/20 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] animate-pulse duration-[6000ms]" />
                <div className="absolute inset-6 bg-[#FFFFFF] rounded-[50%_40%_30%_70%_/_50%_60%_40%_60%] shadow-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=800&q=80" 
                    alt="Happy Dog"
                    className="w-full h-full object-cover scale-105"
                  />
                </div>
                {/* Float badges */}
                <div className="absolute top-10 -left-6 bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-[4000ms]">
                  <div className="w-10 h-10 rounded-full bg-[#FF4500] flex items-center justify-center text-white">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#1A1A1A]">100% Authentic</p>
                    <p className="text-[10px] text-[#767676]">Cam Kết Chính Hãng</p>
                  </div>
                </div>

                <div className="absolute bottom-10 -right-6 bg-[#111111] p-4 rounded-2xl shadow-xl flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-[#FF4500] text-[#FF4500]" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold">Đánh giá 5★</p>
                    <p className="text-[10px] text-white/70">Dịch vụ hàng đầu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3 — CATEGORY CIRCLES (Dog, Cat, Toys, New Balance...)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-6 md:px-14">
            <div className="text-center mb-16 reveal-up">
              <span className="font-mono text-xs tracking-[0.35em] text-[#111111] font-bold uppercase">// MUA SẮM THEO DANH MỤC</span>
              <h2 className="title-font text-4xl font-extrabold text-[#1A1A1A] mt-3">Danh Mục Yêu Thích</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 stagger-parent justify-center">
              {SNEAKER_CATEGORIES.map((cat, i) => (
                <div key={i} className="stagger-child group flex flex-col items-center cursor-pointer text-center"
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                  <div className="w-28 h-28 rounded-full border-2 border-transparent group-hover:border-[#111111] p-1.5 transition-all duration-300 mb-4 bg-[#F9FAFB] shadow-inner">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <h3 className="title-font text-base font-bold text-[#1A1A1A] group-hover:text-[#111111] transition-colors">{cat.name}</h3>
                  <span className="text-xs text-[#767676] font-medium mt-1">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4 — ABOUT US (We Care Your Pets As A Family Member)
        ══════════════════════════════════════════════════════════════════ */}
        <section id="about" className="py-32 bg-[#F9FAFB] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Image grid */}
            <div className="reveal-left relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-lg border border-[#E5E7EB]">
                  <img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=80" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#FF4500] p-8 rounded-2xl shadow-lg text-[#1A1A1A] text-center">
                  <p className="title-font text-5xl font-extrabold count-up" data-target={15} data-suffix="K+">0</p>
                  <p className="text-xs tracking-wider font-bold mt-2">KHÁCH HÀNG HÀI LÒNG</p>
                </div>
              </div>
              <div className="space-y-4 pt-10">
                <div className="bg-[#111111] p-8 rounded-2xl shadow-lg text-white text-center">
                  <p className="title-font text-5xl font-extrabold count-up" data-target={99.8} data-suffix="%">0</p>
                  <p className="text-xs tracking-wider font-bold mt-2">ĐÁNH GIÁ 5 SAO</p>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-lg border border-[#E5E7EB]">
                  <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80" alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="reveal-right">
              <span className="font-mono text-xs tracking-[0.35em] text-[#111111] font-bold uppercase">// VỀ CHÚNG TÔI</span>
              <h2 className="title-font text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-tight mt-3 mb-6">
                Mang đến trải nghiệm mua sắm Sneaker tuyệt vời nhất
              </h2>
              <p className="text-[#767676] text-base leading-relaxed mb-8">
                SneakerX tin rằng mỗi đôi giày không chỉ là phụ kiện mà còn là phong cách sống. Chúng tôi không ngừng tìm kiếm và mang đến những mẫu sneaker độc đáo, chất lượng nhất cho bạn.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  'Cung cấp giày sneaker chính hãng từ các thương hiệu hàng đầu.',
                  'Dịch vụ tư vấn size và mẫu mã chuyên nghiệp, tận tâm.',
                  'Chính sách bảo hành và đổi trả linh hoạt, đảm bảo quyền lợi khách hàng.',
                  'Hỗ trợ khách hàng 24/7, giao hàng siêu tốc tận nơi trên toàn quốc.'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF4500] flex items-center justify-center text-[#1A1A1A] shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-[#1A1A1A] font-semibold text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#111111] text-white hover:bg-[#FF4500] hover:text-[#1A1A1A] px-8 py-3.5 rounded-full font-bold text-sm tracking-wider shadow-lg transition-all duration-300">
                TÌM HIỂU THÊM
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5 — SERVICES (Pet Boarding, New Balance, Training...)
        ══════════════════════════════════════════════════════════════════ */}
        <section id="services" className="py-24 bg-white border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-6 md:px-14">
            <div className="text-center mb-16 reveal-up">
              <span className="font-mono text-xs tracking-[0.35em] text-[#111111] font-bold uppercase">// BỘ SƯU TẬP CHĂM SÓC</span>
              <h2 className="title-font text-4xl font-extrabold text-[#1A1A1A] mt-3">Gói Dịch Vụ Nổi Bật</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-parent">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-[#FF4500]" />,
                  title: 'Pet New Balance & Spa',
                  desc: 'Làm sạch chuyên sâu, phục hồi màu sắc và bảo dưỡng giày sneaker chuyên nghiệp.',
                  price: 'Từ 200,000đ'
                },
                {
                  icon: <Shield className="w-6 h-6 text-[#FF4500]" />,
                  title: 'Authentic Check',
                  desc: 'Kiểm tra và xác thực hàng chính hãng với đội ngũ chuyên gia giàu kinh nghiệm.',
                  price: 'Từ 150,000đ/ngày'
                },
                {
                  icon: <Star className="w-6 h-6 text-[#FF4500]" />,
                  title: 'Custom Sneaker',
                  desc: 'Thiết kế và cá nhân hóa đôi giày của bạn theo phong cách độc nhất vô nhị.',
                  price: 'Tư vấn miễn phí'
                },
                {
                  icon: <Heart className="w-6 h-6 text-[#FF4500]" />,
                  title: 'Pre-order Limited',
                  desc: 'Nhận đặt trước các mẫu giày giới hạn, phiên bản đặc biệt từ các thương hiệu.',
                  price: 'Liên hệ tư vấn'
                }
              ].map((service, idx) => (
                <div key={idx} className="stagger-child group bg-[#F9FAFB] rounded-3xl p-8 border border-[#E5E7EB] hover:border-[#111111] hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:bg-[#111111] group-hover:text-white transition-colors duration-300">
                      {service.icon}
                    </div>
                    <h3 className="title-font text-xl font-bold text-[#1A1A1A] mb-3">{service.title}</h3>
                    <p className="text-[#767676] text-xs leading-relaxed mb-6">{service.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-[#E5E7EB] flex justify-between items-center mt-auto">
                    <span className="text-xs font-bold text-[#111111]">{service.price}</span>
                    <a href="#services" className="text-xs font-extrabold text-[#1A1A1A] hover:underline flex items-center gap-1">
                      Chi tiết <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6 — PRODUCTS SHOP (Top Selling Products)
        ══════════════════════════════════════════════════════════════════ */}
        <section id="catalog" className="py-24 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-6 md:px-14">
            
            {/* Catalog Header */}
            <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 reveal-up">
              <div>
                <span className="font-mono text-xs tracking-[0.35em] text-[#111111] font-bold uppercase">// CỬA HÀNG PETPAL</span>
                <h2 className="title-font text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mt-3">Sản Phẩm Bán Chạy</h2>
              </div>

              {/* Dynamic Filter Tabs */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`font-mono text-xs tracking-wider uppercase pb-2 px-3 border-b-2 transition-all whitespace-nowrap font-bold ${
                    activeCategory === 'all' 
                      ? 'text-[#111111] border-[#111111]' 
                      : 'text-[#767676] border-transparent hover:text-[#1A1A1A]'
                  }`}>
                  Tất Cả
                </button>
                {categories.map((cat: any) => (
                  <button key={cat._id}
                    onClick={() => handleCategoryClick(cat._id)}
                    className={`font-mono text-xs tracking-wider uppercase pb-2 px-3 border-b-2 transition-all whitespace-nowrap font-bold ${
                      activeCategory === cat._id 
                        ? 'text-[#111111] border-[#111111]' 
                        : 'text-[#767676] border-transparent hover:text-[#1A1A1A]'
                    }`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-[#E5E7EB] rounded-3xl bg-white shadow-sm">
                <div className="font-mono text-xs tracking-widest text-[#767676] font-bold">KHÔNG CÓ SẢN PHẨM TRONG DANH MỤC NÀY.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((p: any) => {
                  const isAvailable = p.status === 'available';
                  return (
                    <div key={p._id}
                      onClick={() => router.push(`/user/product/${p._id}`)}
                      className="product-card group cursor-pointer bg-white rounded-3xl p-5 border border-[#E5E7EB] hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">

                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden bg-[#F9FAFB] rounded-2xl mb-5 shrink-0">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#767676]/40">
                            HÌNH ẢNH SẢN PHẨM
                          </div>
                        )}

                        {/* Status Badge */}
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1.5px] flex items-center justify-center rounded-2xl">
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase border border-white/30 px-4 py-1.5 text-white bg-black/60 rounded-full font-bold">
                              {p.status === 'holding' ? 'ĐANG ĐẶT' : 'HẾT HÀNG'}
                            </span>
                          </div>
                        )}

                        {/* Condition / Hot badge */}
                        {p.condition && (
                          <div className="absolute top-3 left-3 font-mono text-[9px] tracking-widest bg-[#111111] text-white px-3 py-1 rounded-full font-extrabold shadow-md">
                            POPULAR
                          </div>
                        )}

                        {/* Quick Add To Cart */}
                        {isAvailable && (
                          <button
                            onClick={(e) => handleAddToCart(e, p)}
                            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 w-11 h-11 rounded-full bg-[#FF4500] text-[#1A1A1A] flex items-center justify-center shadow-lg hover:bg-[#111111] hover:text-white transform translate-y-2 group-hover:translate-y-0">
                            <Plus className="w-5 h-5 font-bold" />
                          </button>
                        )}
                      </div>

                      {/* Info Container */}
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          {/* Rating Star */}
                          <div className="flex items-center gap-1 mb-2">
                            {Array(5).fill(0).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#FF4500] text-[#FF4500]" />
                            ))}
                            <span className="text-[10px] text-[#767676] ml-1 font-semibold">(5.0)</span>
                          </div>

                          <h3 className="title-font text-lg font-bold text-[#1A1A1A] group-hover:text-[#111111] transition-colors leading-snug mb-2 line-clamp-2">
                            {p.name}
                          </h3>
                          {p.description && (
                            <p className="text-[#767676] text-xs leading-relaxed line-clamp-2 mb-4">
                              {p.description}
                            </p>
                          )}
                        </div>

                        {/* Price Area */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] mt-auto">
                          <div className="title-font text-lg font-extrabold text-[#111111]">
                            {(p.price ?? 0).toLocaleString('vi-VN')}
                            <span className="text-[11px] ml-0.5 text-[#767676] font-medium font-sans">₫</span>
                          </div>
                          
                          <span className={`text-[9px] font-mono tracking-[0.15em] uppercase px-3 py-1 rounded-full font-bold ${
                            isAvailable ? 'text-[#111111] bg-[#111111]/10' : 'text-[#767676] bg-[#EFEFEF]'
                          }`}>
                            {isAvailable ? 'CÒN HÀNG' : 'HẾT HÀNG'}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 7 — DISCOUNT BANNER (Ưu đãi thành viên)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-28 bg-[#111111] text-white overflow-hidden text-center px-6">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1550399504-8953e1a6ac87?auto=format&fit=crop&w=1200&q=80" 
              alt="Promo background" 
              className="parallax-slow absolute inset-0 w-full h-[130%] object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-[#111111]/85" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="font-mono text-xs tracking-[0.35em] text-[#FF4500] bg-[#FF4500]/10 px-4 py-1.5 rounded-full mb-6 font-bold inline-block">
              MÃ GIẢM GIÁ ĐẦU TIÊN
            </span>
            <h2 className="title-font text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Giảm Ngay 20% Cho Đơn Hàng<br />Đăng Ký Đầu Tiên
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Đăng ký nhận bản tin khuyến mãi từ SneakerX ngay hôm nay để nhận voucher giảm giá 20% cùng cơ hội tham gia các buổi spa trải nghiệm hoàn toàn miễn phí.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Nhập địa chỉ email của bạn..." 
                className="w-full px-6 py-4 rounded-full bg-white text-[#1A1A1A] text-sm font-semibold outline-none border border-[#E5E7EB] shadow-inner focus:ring-2 focus:ring-[#FF4500]"
              />
              <button className="bg-[#FF4500] text-[#1A1A1A] hover:bg-[#FFFFFF] hover:text-[#111111] px-8 py-4 rounded-full font-bold text-sm tracking-wider shadow-lg transition-all duration-300 shrink-0">
                ĐĂNG KÝ
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 8 — TESTIMONIALS (Đánh giá khách hàng)
        ══════════════════════════════════════════════════════════════════ */}
        <section id="testimonials" className="py-24 bg-white border-b border-[#E5E7EB] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-14 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl text-[#1A1A1A] reveal-left">
              <span className="font-mono text-xs tracking-[0.35em] text-[#111111] font-bold uppercase">// PHẢN HỒI THỰC TẾ</span>
              <h2 className="title-font text-4xl md:text-5xl font-extrabold leading-tight mt-3 mb-6">
                Khách hàng luôn đồng hành và tin tưởng
              </h2>
              <p className="text-[#767676] text-sm leading-relaxed mb-8">
                Những chia sẻ đầy chân thật từ khách hàng sau khi trải nghiệm các dịch vụ chăm sóc giày, xác thực hàng chính hãng và mua sắm sneaker tại SneakerX.
              </p>
              <div className="flex gap-8">
                {[
                  ['4.9/5', '1200+ ĐÁNH GIÁ'],
                  ['98%', 'QUAY LẠI SỬ DỤNG'],
                ].map(([v, l]) => (
                  <div key={l}>
                    <div className="title-font text-3xl font-extrabold text-[#111111]">{v}</div>
                    <div className="font-mono text-[9px] tracking-[0.2em] text-[#767676] mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-auto reveal-scale flex justify-center text-white">
              <DemoOne />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 9 — BLOGS (Kiến thức nuôi dạy cún mèo)
        ══════════════════════════════════════════════════════════════════ */}
        <section id="blogs" className="py-24 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-6 md:px-14">
            <div className="text-center mb-16 reveal-up">
              <span className="font-mono text-xs tracking-[0.35em] text-[#111111] font-bold uppercase">// TIN TỨC PETPAL</span>
              <h2 className="title-font text-4xl font-extrabold text-[#1A1A1A] mt-3">Kiến Thức Bổ Ích</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-parent">
              {SNEAKER_BLOGS.map((blog, idx) => (
                <div key={idx} className="stagger-child bg-white rounded-3xl overflow-hidden border border-[#E5E7EB] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group">
                  <div className="aspect-[4/3] overflow-hidden bg-[#F9FAFB]">
                    <img src={blog.img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] tracking-wider text-[#111111] font-bold">{blog.date}</span>
                      <h3 className="title-font text-lg font-bold text-[#1A1A1A] group-hover:text-[#111111] transition-colors mt-2 mb-3 leading-snug line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-[#767676] text-xs leading-relaxed line-clamp-3 mb-6">{blog.desc}</p>
                    </div>
                    <a href="#blogs" className="text-xs font-bold text-[#1A1A1A] hover:text-[#111111] flex items-center gap-1 mt-auto">
                      Đọc thêm <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 10 — FOOTER (Thông tin liên hệ & Đăng ký)
        ══════════════════════════════════════════════════════════════════ */}
        <footer className="bg-[#111111] text-white/80 py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Info */}
            <div className="space-y-4">
              <p className="title-font text-3xl font-extrabold text-white flex items-center gap-2 cursor-pointer">
                <Heart className="w-6 h-6 fill-[#FF4500] text-[#FF4500]" />
                SneakerX
              </p>
              <p className="text-xs leading-relaxed text-white/70">
                Hệ thống chăm sóc thú cưng toàn diện số 1 Việt Nam. Đồng hành cùng ba mẹ mang lại hạnh phúc cho bé cưng của bạn.
              </p>
              <div className="flex gap-4 pt-2">
                {['FB', 'INSTA', 'TIKTOK', 'YT'].map((net) => (
                  <span key={net} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white hover:bg-[#FF4500] hover:text-[#1A1A1A] transition-colors cursor-pointer">{net}</span>
                ))}
              </div>
            </div>

            {/* Column 2: Quick links */}
            <div className="space-y-4">
              <h3 className="title-font text-lg font-bold text-white uppercase tracking-wider">Danh Mục</h3>
              <ul className="space-y-2.5 text-xs font-medium text-white/70">
                <li><a href="#" className="hover:text-[#FF4500] transition-colors">Về Chúng Tôi</a></li>
                <li><a href="#catalog" className="hover:text-[#FF4500] transition-colors">Thức Ăn Hạt Organic</a></li>
                <li><a href="#services" className="hover:text-[#FF4500] transition-colors">Gói Spa New Balance</a></li>
                <li><a href="#services" className="hover:text-[#FF4500] transition-colors">Đặt Phòng Lưu Trú</a></li>
                <li><a href="#blogs" className="hover:text-[#FF4500] transition-colors">Kiến Thức Nuôi Dạy</a></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="space-y-4">
              <h3 className="title-font text-lg font-bold text-white uppercase tracking-wider">Liên Hệ</h3>
              <ul className="space-y-3 text-xs text-white/70">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FF4500] shrink-0" />
                  <span>123 Đường Ba Tháng Hai, Quận 10, TP. Hồ Chí Minh</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#FF4500] shrink-0" />
                  <span>0987.654.321 / 0123.456.789</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#FF4500] shrink-0" />
                  <span>support@sneakerx.com.vn</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="space-y-4">
              <h3 className="title-font text-lg font-bold text-white uppercase tracking-wider">Nhận Bản Tin</h3>
              <p className="text-xs leading-relaxed text-white/70">
                Đăng ký nhận bản tin khuyến mãi và các chia sẻ hữu ích mới nhất từ các chuyên gia dinh dưỡng thú cưng.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email..." 
                  className="w-full px-4 py-2.5 rounded-full bg-white/10 text-white placeholder-white/50 text-xs border border-white/20 outline-none focus:bg-white focus:text-[#1A1A1A]" 
                />
                <button className="bg-[#FF4500] text-[#1A1A1A] hover:bg-white hover:text-[#111111] px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wider transition-colors duration-300">
                  GỬI
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="max-w-7xl mx-auto px-6 md:px-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
            <div>
              © 2026 {koc.name} · SneakerX Store. ĐÃ ĐĂNG KÝ BẢN QUYỀN THƯƠNG HIỆU.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">Bảo Mật</a>
              <a href="#" className="hover:underline">Điều Khoản</a>
              <a href="#" className="hover:underline">Sitemap</a>
            </div>
          </div>
        </footer>

        {/* Giỏ hàng Drawer */}
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
