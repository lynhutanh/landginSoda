'use client';
/* eslint-disable no-undef */

import { useEffect, useRef, useCallback, useState } from 'react';
import Script from 'next/script';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Card, CardContent } from '@components/ui/card';
import { Marquee } from '@components/ui/3d-testimonials';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('@components/ui/globe').then(mod => mod.Globe), {
  ssr: false,
  loading: () => <div className="w-[450px] aspect-square rounded-full bg-white/5 animate-pulse" />
});

const TestimonialSlider = dynamic(() => import('@components/ui/testimonial-slider').then(mod => mod.TestimonialSlider), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] rounded-3xl bg-white/5 animate-pulse" />
});

/* ── Tổng số model-viewer cần load (can + 9 berries + 4 leaves + 2 preload) ── */
const TOTAL_MODELS = 16;

/* ── Asset URLs ── */
const ASSET_BASE = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d';
const ASSETS = {
  leaves: `${ASSET_BASE}/leaves.glb`,
  cherry: `${ASSET_BASE}/cherry.glb`,
  blueberry: `${ASSET_BASE}/blueberry.glb`,
  can: `${ASSET_BASE}/deit_soda2.glb`,
  greenSoda: `${ASSET_BASE}/Green%20Soda.png`,
  blueSoda: `${ASSET_BASE}/Blue%20Soda.png`,
  greenTexture: `${ASSET_BASE}/green%20base%20color.jpg`,
  blueTexture: `${ASSET_BASE}/blue%20base%20color.jpg`,
  bubble: `${ASSET_BASE}/bubble.png`
};

/* ── Flavor colors ── */
const FLAVORS = {
  classic: { inner: '#0b8a78', mid: '#044e3b', outer: '#011411' },
  blue: { inner: '#0b4f8a', mid: '#04294e', outer: '#010c14' }
};

// Unique reviews data
const testimonials = [
  {
    name: 'Ava Green',
    username: '@ava',
    body: 'Cascade AI made my workflow 10x faster!',
    img: 'https://randomuser.me/api/portraits/women/32.jpg',
    country: '🇦🇺 Australia'
  },
  {
    name: 'Ana Miller',
    username: '@ana',
    body: 'Vertical marquee is a game changer!',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    country: '🇩🇪 Germany'
  },
  {
    name: 'Mateo Rossi',
    username: '@mat',
    body: 'Animations are buttery smooth!',
    img: 'https://randomuser.me/api/portraits/men/51.jpg',
    country: '🇮🇹 Italy'
  },
  {
    name: 'Maya Patel',
    username: '@maya',
    body: 'Setup was a breeze!',
    img: 'https://randomuser.me/api/portraits/women/53.jpg',
    country: '🇮🇳 India'
  },
  {
    name: 'Noah Smith',
    username: '@noah',
    body: 'Best marquee component!',
    img: 'https://randomuser.me/api/portraits/men/33.jpg',
    country: '🇺🇸 USA'
  },
  {
    name: 'Lucas Stone',
    username: '@luc',
    body: 'Very customizable and smooth.',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    country: '🇫🇷 France'
  },
  {
    name: 'Haruto Sato',
    username: '@haru',
    body: 'Impressive performance on mobile!',
    img: 'https://randomuser.me/api/portraits/men/85.jpg',
    country: '🇯🇵 Japan'
  },
  {
    name: 'Emma Lee',
    username: '@emma',
    body: 'Love the pause on hover feature!',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
    country: '🇨🇦 Canada'
  },
  {
    name: 'Carlos Ray',
    username: '@carl',
    body: 'Great for testimonials and logos.',
    img: 'https://randomuser.me/api/portraits/men/61.jpg',
    country: '🇪🇸 Spain'
  }
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-50 bg-white/5 border-white/10 text-white backdrop-blur-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className="bg-white/10 text-white">{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-white flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-white/50">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-white/80">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

const foundersReviews = [
  {
    id: 1,
    name: 'Ashley Nguyen',
    affiliation: 'Founder & CEO, Diet Soda',
    quote:
      'We created Diet Soda to redefine healthy refreshment. It\'s not just about zero sugar; it\'s about the perfect balance of a modern lifestyle and pure energy.',
    imageSrc:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&q=80',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=120&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Jacob Le',
    affiliation: 'Co-Founder & Chief Product Officer',
    quote:
      'Over 18 months of research with hundreds of test formulas to find the perfect natural Stevia ratio. Diet Soda is our promise of pure quality.',
    imageSrc:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=120&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Elara Tran',
    affiliation: 'Co-Founder & Art Director',
    quote:
      'Refreshment comes not only from taste, but also from vision. The minimalist, 100% recyclable aluminum design is how we respect your experience and the environment.',
    imageSrc:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&q=80',
    thumbnailSrc:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=120&fit=crop&q=80'
  }
];

export default function SodaLandingClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapReady = useRef(false);
  const modelViewerReady = useRef(false);
  const scrollTriggerReady = useRef(false);
  const animFrameRef = useRef<number>(0);
  const bubbleIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const loadedCount = useRef(0);

  /* ── Theo dõi model-viewer load events ── */
  const onModelLoaded = useCallback(() => {
    loadedCount.current++;
    const pct = Math.min(Math.round((loadedCount.current / TOTAL_MODELS) * 100), 100);
    setLoadProgress(pct);
    if (loadedCount.current >= TOTAL_MODELS) {
      setTimeout(() => setIsLoading(false), 400);
    }
  }, []);

  /* ── Safety timeout: tối đa 15s thì ẩn loader ── */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  /* ── Listen 'load' event trên tất cả model-viewer ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new MutationObserver(() => {
      const viewers = containerRef.current?.querySelectorAll('model-viewer');
      viewers?.forEach(mv => {
        if (!(mv as any).__loadListenerAdded) {
          (mv as any).__loadListenerAdded = true;
          mv.addEventListener('load', onModelLoaded, { once: true });
        }
      });
    });
    observer.observe(containerRef.current, { childList: true, subtree: true });
    // Bind cho những model-viewer đã có sẵn
    const existing = containerRef.current.querySelectorAll('model-viewer');
    existing.forEach(mv => {
      if (!(mv as any).__loadListenerAdded) {
        (mv as any).__loadListenerAdded = true;
        mv.addEventListener('load', onModelLoaded, { once: true });
      }
    });
    return () => observer.disconnect();
  }, [onModelLoaded]);

  const initAnimations = useCallback(() => {
    if (!gsapReady.current || !modelViewerReady.current || !scrollTriggerReady.current) return;
    if (!containerRef.current) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    // Dọn dẹp tất cả các ScrollTrigger cũ trước khi khởi tạo để tránh xung đột trùng lặp
    ScrollTrigger.getAll().forEach((t: any) => t.kill());

    gsap.registerPlugin(ScrollTrigger);

    const modelViewer = containerRef.current.querySelector('#product-model') as any;
    const berriesFG = containerRef.current.querySelector('.berries-container') as HTMLElement;
    const berriesBG = containerRef.current.querySelector('.berries-container-bg') as HTMLElement;
    const leavesBG = containerRef.current.querySelector('.leaves-container') as HTMLElement;
    const allBerries = containerRef.current.querySelectorAll('.berry') as NodeListOf<HTMLElement>;
    const cards = containerRef.current.querySelectorAll('.card') as NodeListOf<HTMLElement>;
    const bubblesContainer = containerRef.current.querySelector('#bubbles-container') as HTMLElement;

    if (!modelViewer || !berriesFG || !berriesBG || !leavesBG) return;

    /* ── SCROLL ANIMATIONS ── */
    gsap.set(modelViewer, { xPercent: -50, yPercent: -50, left: '50%', top: '50%', rotation: 25 });
    
    gsap.to(berriesBG, {
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
      yPercent: -40, rotation: 30, ease: 'none'
    });
    gsap.to(berriesFG, {
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
      yPercent: -60, rotation: -30, ease: 'none'
    });
    gsap.to(leavesBG, {
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
      yPercent: -80, ease: 'none'
    });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });
      tl.to(modelViewer, { left: '90%', top: '30%', scale: 0.6, rotation: 15, ease: 'none', duration: 1.3 }) // Hero -> Features
        .to(modelViewer, { left: '10%', top: '75%', scale: 0.6, rotation: -15, ease: 'none', duration: 2.3 }) // Features -> Ingredients
        .to(modelViewer, { left: '90%', top: '30%', scale: 0.6, rotation: 15, ease: 'none', duration: 1.5 }) // Ingredients -> Flavors
        .to(modelViewer, { left: '10%', top: '70%', scale: 0.6, rotation: -15, ease: 'none', duration: 1.5 }) // Flavors -> Global Network
        .to(modelViewer, { left: '90%', top: '30%', scale: 0.6, rotation: 15, ease: 'none', duration: 1.5 }) // Global Network -> Reviews
        .to(modelViewer, { left: '10%', top: '50%', scale: 0.6, rotation: -15, ease: 'none', duration: 1.5 }) // Reviews -> CTA
        .to(modelViewer, { left: '50%', top: '150%', scale: 0, opacity: 0, rotation: 45, ease: 'none', duration: 1.9 }); // CTA -> Footer
    });
    mm.add('(max-width: 899px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });
      tl.to(modelViewer, { left: '50%', top: '30%', scale: 0.4, rotation: 0, ease: 'none', duration: 1.3 })
        .to(modelViewer, { left: '50%', top: '30%', scale: 0.4, rotation: 0, ease: 'none', duration: 2.3 })
        .to(modelViewer, { left: '50%', top: '20%', scale: 0.4, rotation: 0, ease: 'none', duration: 1.5 })
        .to(modelViewer, { left: '50%', top: '30%', scale: 0.4, rotation: 0, ease: 'none', duration: 1.5 }) // Global Network
        .to(modelViewer, { left: '50%', top: '30%', scale: 0.4, rotation: 0, ease: 'none', duration: 1.5 }) // Reviews
        .to(modelViewer, { left: '50%', top: '30%', scale: 0.4, rotation: 0, ease: 'none', duration: 1.5 }) // CTA
        .to(modelViewer, { left: '50%', top: '150%', scale: 0, opacity: 0, rotation: 0, ease: 'none', duration: 3.4 });
    });

    ScrollTrigger.refresh();

    let isSwitching = false;
    let switchSpin = 0;
    let blueTextureObj: any = null;
    let greenTextureObj: any = null;

    /* ── Texture preload ── */
    modelViewer.addEventListener('load', async () => {
      try {
        blueTextureObj = await modelViewer.createTexture(ASSETS.blueTexture);
        greenTextureObj = await modelViewer.createTexture(ASSETS.greenTexture);
        if (modelViewer.model) {
          const material = modelViewer.model.materials[0];
          if (material?.pbrMetallicRoughness?.baseColorTexture) {
            material.pbrMetallicRoughness.baseColorTexture.setTexture(blueTextureObj);
            await new Promise(r => requestAnimationFrame(r));
            material.pbrMetallicRoughness.baseColorTexture.setTexture(greenTextureObj);
          }
        }
      } catch (e) { console.error('Texture preload failed', e); }
    });

    /* ── Flavor switch ── */
    async function switchFlavor(flavor: string) {
      if (isSwitching) return;
      isSwitching = true;
      const body = document.body;
      const berries = containerRef.current!.querySelectorAll('.berry') as NodeListOf<HTMLElement>;
      const heroCenter = containerRef.current!.querySelector('.hero-center') as HTMLElement;
      const target = flavor === 'blue' ? FLAVORS.blue : FLAVORS.classic;

      gsap.to(body, {
        '--bg-inner': target.inner, '--bg-mid': target.mid, '--bg-outer': target.outer,
        duration: 1.5, ease: 'power2.inOut'
      });

      const spinObj = { val: 0, blur: 0 };
      gsap.to(spinObj, {
        val: 360, blur: 15, duration: 0.6, ease: 'power2.in',
        onUpdate: () => { switchSpin = spinObj.val; modelViewer.style.filter = `blur(${spinObj.blur}px)`; },
        onComplete: async () => {
          if (flavor === 'blue') {
            body.classList.add('blue-theme');
            if (modelViewer.model && blueTextureObj) {
              modelViewer.model.materials.forEach((m: any) => {
                m.pbrMetallicRoughness?.baseColorTexture?.setTexture(blueTextureObj);
              });
            }
          } else {
            body.classList.remove('blue-theme');
            if (modelViewer.model && greenTextureObj) {
              modelViewer.model.materials.forEach((m: any) => {
                m.pbrMetallicRoughness?.baseColorTexture?.setTexture(greenTextureObj);
              });
            }
          }
          gsap.to(spinObj, {
            val: 720, blur: 0, duration: 1.5, ease: 'back.out(0.7)',
            onUpdate: () => { switchSpin = spinObj.val; modelViewer.style.filter = `blur(${spinObj.blur}px)`; },
            onComplete: () => { switchSpin = 0; modelViewer.style.filter = 'none'; }
          });
        }
      });

      let completedBerries = 0;
      berries.forEach((berry, i) => {
        const bW = berry.offsetWidth / 2;
        const bH = berry.offsetHeight / 2;
        const centerX = window.innerWidth / 2 - berry.offsetLeft - bW;
        const centerY = window.innerHeight / 2 - berry.offsetTop - bH;
        const startAngle = parseFloat(berry.dataset.angle || '0');
        const currentBaseX = parseFloat(berry.dataset.baseX || '0');
        const currentBaseY = parseFloat(berry.dataset.baseY || '0');
        const nextBaseX = (Math.random() - 0.5) * 200;
        const nextBaseY = (Math.random() - 0.5) * 200;

        gsap.set(berry, { rotation: startAngle, x: currentBaseX, y: currentBaseY });
        const tl = gsap.timeline();
        tl.to(berry, {
          x: centerX, y: centerY, rotation: startAngle + 45, scale: 0.1, opacity: 0,
          duration: 0.5, ease: 'power2.in',
          onComplete: () => {
            berry.setAttribute('src', flavor === 'blue' ? ASSETS.blueberry : ASSETS.cherry);
            heroCenter.style.zIndex = '50';
          }
        })
        .to(berry, { duration: 0.3 })
        .to(berry, {
          onStart: () => { heroCenter.style.zIndex = '1'; },
          x: nextBaseX, y: nextBaseY, rotation: startAngle + 90, scale: 1, opacity: 1,
          duration: 0.9, ease: 'back.out(1.5)',
          onComplete: () => {
            berry.dataset.angle = String(startAngle + 90);
            berry.dataset.baseX = String(nextBaseX);
            berry.dataset.baseY = String(nextBaseY);
            berry.dataset.rx = '0'; berry.dataset.ry = '0';
            completedBerries++;
            if (completedBerries === berries.length) isSwitching = false;
          }
        });
      });
    }

    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (isSwitching) return;
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        switchFlavor(card.dataset.flavor || 'classic');
      });
    });

    /* ── Berry init ── */
    allBerries.forEach(b => {
      b.dataset.rx = '0'; b.dataset.ry = '0';
      b.dataset.angle = String(Math.random() * 360);
      b.dataset.baseX = '0'; b.dataset.baseY = '0';
    });

    /* ── Mouse tracking ── */
    const mouse = { x: 0, y: 0, px: 0, py: 0 };
    const currentMouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.y = (e.clientY / window.innerHeight) - 0.5;
      mouse.px = e.clientX; mouse.py = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    /* ── Animation loop ── */
    function animate() {
      const time = Date.now() * 0.001;
      currentMouse.x += (mouse.x - currentMouse.x) * 0.05;
      currentMouse.y += (mouse.y - currentMouse.y) * 0.05;

      modelViewer.cameraOrbit = `${(currentMouse.x * 40) + switchSpin}deg ${90 + (currentMouse.y * 20)}deg 380%`;
      gsap.set(berriesFG, { x: currentMouse.x * 60, y: currentMouse.y * 60 });
      gsap.set(berriesBG, { x: currentMouse.x * -30, y: currentMouse.y * -30 });
      gsap.set(leavesBG, { x: currentMouse.x * -15, y: currentMouse.y * -15 });

      if (!isSwitching) {
        allBerries.forEach((berry, i) => {
          const rect = berry.getBoundingClientRect();
          const bx = rect.left + rect.width / 2;
          const by = rect.top + rect.height / 2;
          const dx = mouse.px - bx, dy = mouse.py - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let targetRx = 0, targetRy = 0, speedMult = 1;
          if (dist < 400) {
            const force = (400 - dist) / 400;
            targetRx = (dx / dist) * force * -80;
            targetRy = (dy / dist) * force * -80;
            speedMult = 1 + force * 5;
          }
          let rx = parseFloat(berry.dataset.rx || '0');
          let ry = parseFloat(berry.dataset.ry || '0');
          let angle = parseFloat(berry.dataset.angle || '0');
          const baseX = parseFloat(berry.dataset.baseX || '0');
          const baseY = parseFloat(berry.dataset.baseY || '0');
          rx += (targetRx - rx) * 0.1; ry += (targetRy - ry) * 0.1;
          angle += 0.2 * speedMult;
          berry.dataset.rx = String(rx); berry.dataset.ry = String(ry); berry.dataset.angle = String(angle);
          const dur = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10][i % 9];
          const phase = (time + i * 0.7) * (Math.PI * 2 / dur);
          const floatY = Math.sin(phase) * 15;
          const floatAngle = Math.cos(phase) * 6;
          berry.style.transform = `translate(calc(${rx + baseX}px), calc(${ry + baseY}px + ${floatY}px)) rotate(calc(${angle}deg + ${floatAngle}deg))`;
        });
      }

      containerRef.current?.querySelectorAll('.leaf').forEach((leaf, i) => {
        const el = leaf as HTMLElement;
        const dur = 10 + i * 2;
        const phase = (time + i * 1.2) * (Math.PI * 2 / dur);
        el.style.transform = `translate(${Math.cos(phase * 0.5) * 15}px, ${Math.sin(phase) * 20}px) rotate(${Math.sin(phase * 0.3) * 15}deg)`;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    }
    animFrameRef.current = requestAnimationFrame(animate);

    /* ── Bubbles ── */
    function createBubble() {
      if (!bubblesContainer) return;
      const img = document.createElement('img');
      img.src = ASSETS.bubble;
      img.className = 'bubble-img';
      const size = Math.random() * 20 + 10 + 'px';
      img.style.width = size; img.style.height = 'auto';
      img.style.left = Math.random() * 100 + '%';
      img.style.bottom = '-50px';
      img.style.opacity = String(Math.random() * 0.4 + 0.2);
      const duration = Math.random() * 6 + 4;
      img.style.animation = `floatUpImg ${duration}s linear forwards`;
      bubblesContainer.appendChild(img);
      setTimeout(() => img.remove(), duration * 1000);
    }
    bubbleIntervalRef.current = setInterval(createBubble, 400);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (bubbleIntervalRef.current) clearInterval(bubbleIntervalRef.current);
      if ((window as any).ScrollTrigger) (window as any).ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  useEffect(() => {
    if ((window as any).gsap) gsapReady.current = true;
    if (customElements.get('model-viewer')) modelViewerReady.current = true;
    if (gsapReady.current && modelViewerReady.current && scrollTriggerReady.current) {
      const cleanup = initAnimations();
      return cleanup;
    }
  }, [initAnimations]);

  /* ── Scroll Reveal Observer ── */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <>
      {/* External Scripts */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        strategy="afterInteractive"
        onLoad={() => { gsapReady.current = true; initAnimations(); }}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
        strategy="afterInteractive"
        onLoad={() => { scrollTriggerReady.current = true; initAnimations(); }}
      />
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        strategy="afterInteractive"
        type="module"
        onLoad={() => { modelViewerReady.current = true; initAnimations(); }}
      />

      {/* Inline critical CSS */}
      <style jsx global>{`
        :root {
          --bg-inner: #0b8a78;
          --bg-mid: #044e3b;
          --bg-outer: #011411;
          --text-color: #ffffff;
          --muted-color: rgba(255, 255, 255, 0.7);
          --glass-bg: rgba(255, 255, 255, 0.05);
          --glass-border: rgba(255, 255, 255, 0.1);
          --font-main: 'Inter', sans-serif;
          --font-heading: 'Galada', cursive;
        }
        body {
          background: radial-gradient(circle at center, var(--bg-inner) 0%, var(--bg-mid) 50%, var(--bg-outer) 100%);
          color: var(--text-color);
          font-family: var(--font-main);
          overflow-x: hidden;
          margin: 0;
          transition: background 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        body.blue-theme {
          --bg-inner: #0b4f8a;
          --bg-mid: #04294e;
          --bg-outer: #010c14;
        }

        /* ══ LOADING OVERLAY ══ */
        .loading-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at center, #0b8a78 0%, #044e3b 50%, #011411 100%);
          z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s;
        }
        .loading-overlay.hidden {
          opacity: 0; visibility: hidden; pointer-events: none;
        }
        .loader-can {
          width: 80px; height: 120px; position: relative;
          animation: loaderFloat 2s ease-in-out infinite;
        }
        .loader-can-body {
          width: 60px; height: 100px; background: linear-gradient(135deg, #0d9b87 0%, #065f4c 100%);
          border-radius: 8px 8px 12px 12px; margin: 0 auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative; overflow: hidden;
        }
        .loader-can-body::before {
          content: ''; position: absolute; top: 0; left: -60px; width: 30px; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: loaderShine 2s ease-in-out infinite;
        }
        .loader-can-top {
          width: 50px; height: 8px; background: linear-gradient(135deg, #c0c0c0, #e0e0e0);
          border-radius: 4px 4px 0 0; margin: 0 auto;
          box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
        }
        .loader-tab {
          width: 16px; height: 6px; background: #d0d0d0;
          border-radius: 3px; margin: 0 auto; margin-top: -1px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .loader-label {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          font-family: var(--font-heading); font-size: 0.7rem; color: rgba(255,255,255,0.9);
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .loader-bubbles { position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); width: 60px; height: 40px; }
        .loader-bubble {
          position: absolute; width: 6px; height: 6px;
          background: rgba(255,255,255,0.3); border-radius: 50%;
          animation: loaderBubbleUp 1.5s ease-in infinite;
        }
        .loader-bubble:nth-child(1) { left: 10px; animation-delay: 0s; }
        .loader-bubble:nth-child(2) { left: 25px; animation-delay: 0.3s; width: 4px; height: 4px; }
        .loader-bubble:nth-child(3) { left: 40px; animation-delay: 0.6s; width: 5px; height: 5px; }
        .loader-bubble:nth-child(4) { left: 18px; animation-delay: 0.9s; width: 3px; height: 3px; }
        .loader-bubble:nth-child(5) { left: 35px; animation-delay: 1.2s; }

        .loader-progress-wrap {
          margin-top: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;
        }
        .loader-progress-bar {
          width: 200px; height: 3px; background: rgba(255,255,255,0.1);
          border-radius: 2px; overflow: hidden;
        }
        .loader-progress-fill {
          height: 100%; background: linear-gradient(90deg, #fbcfe8, #ffffff);
          border-radius: 2px; transition: width 0.4s ease-out;
          box-shadow: 0 0 12px rgba(251, 207, 232, 0.5);
        }
        .loader-text {
          font-family: 'Manrope', sans-serif; font-size: 0.75rem;
          color: rgba(255,255,255,0.5); letter-spacing: 0.15em; text-transform: uppercase;
        }

        @keyframes loaderFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes loaderShine {
          0% { left: -60px; }
          50%, 100% { left: 80px; }
        }
        @keyframes loaderBubbleUp {
          0% { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(-35px); opacity: 0; }
        }

        #bubbles-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
        .bubble-img { position: absolute; pointer-events: none; }
        @keyframes floatUpImg {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-110vh) translateX(30px) rotate(360deg); opacity: 0; }
        }

        .soda-header { display: flex; justify-content: space-between; align-items: center; padding: 2rem 4%; position: fixed; top: 0; width: 100%; z-index: 100; }
        .soda-logo { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 1.2rem; font-family: var(--font-heading); color: white; }
        .soda-nav { display: flex; gap: 0.5rem; padding: 0.4rem; border-radius: 100px; position: relative; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .soda-nav-item { font-family: 'Manrope', sans-serif; color: var(--muted-color); text-decoration: none; font-size: 0.85rem; font-weight: 500; padding: 0.5rem 1.2rem; border-radius: 100px; transition: all 0.3s ease; }
        .soda-nav-item:hover, .soda-nav-item.active { background: #fbcfe8; color: #011d17; }
        .soda-contact-btn { background: rgba(0,0,0,0.5); color: white; border: none; padding: 0.9rem 2rem; border-radius: 100px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.3s ease; }
        .soda-contact-btn:hover { background: rgba(0,0,0,0.7); transform: translateY(-2px); }

        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 0 4%; padding-top: 5rem; }
        .hero-content { display: flex; justify-content: space-between; align-items: stretch; width: 100%; max-width: 100%; padding: 0; height: 100%; position: relative; }
        .main-title, .side-title { font-family: var(--font-heading); font-size: clamp(5rem, 10vw, 12rem); line-height: 0.8; font-weight: 400; white-space: nowrap; color: white; }

        .leaves-container { position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: -1; }
        .leaf { position: absolute; width: 60px; height: 60px; pointer-events: none; z-index: -1; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2)); }
        .l1 { top: 10%; left: 15%; }
        .l2 { top: 40%; left: 80%; width: 140px; height: 140px; opacity: 0.4; }
        .l3 { top: 70%; left: 75%; width: 80px; height: 80px; }
        .l4 { top: 85%; left: 20%; width: 120px; height: 120px; opacity: 0.3; }

        .hero-left { display: flex; flex-direction: column; height: 100%; padding: 6rem 0; gap: 2rem; z-index: 100; }
        .soda-description { color: var(--muted-color); font-size: 1.1rem; line-height: 1.6; max-width: 400px; }
        .primary-btn { display: flex; align-items: center; gap: 1.5rem; background: rgba(0,0,0,0.5); color: white; border: none; padding: 0.4rem 0.4rem 0.4rem 1.5rem; border-radius: 100px; font-weight: 700; cursor: pointer; width: fit-content; transition: all 0.3s ease; }
        .primary-btn:hover { background: rgba(0,0,0,0.7); transform: translateY(-3px); }
        .plus-icon { background: #fbcfe8; color: #011d17; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 1.4rem; font-weight: 900; line-height: 1; padding-bottom: 2px; }
        .award-badge { display: flex; align-items: center; gap: 1rem; margin-top: auto; }
        .award-icon { width: 48px; height: 48px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .award-text { display: flex; flex-direction: column; }
        .award-title { font-size: 0.7rem; letter-spacing: 0.1em; color: var(--muted-color); }
        .award-subtitle { font-size: 0.85rem; font-weight: 600; }

        .hero-center { display: flex; justify-content: center; align-items: center; position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 300 !important; opacity: 0; animation: fadeIn 1.5s ease-out 0.3s forwards, float 6s ease-in-out infinite; pointer-events: none; background: radial-gradient(circle at center, rgba(16,185,129,0.05) 0%, transparent 70%); }
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .main-product-3d { width: 80vw; height: 80vh; outline: none; --progress-bar-color: transparent; --poster-color: transparent; z-index: 300 !important; position: absolute !important; pointer-events: none; }
        .main-product-3d[camera-controls] { pointer-events: auto; }

        .berries-container { position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 110; }
        .berries-container-bg { position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; }
        .berry { position: absolute; width: 120px; height: 120px; outline: none; --progress-bar-color: transparent; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .b1 { top: 25%; left: 30%; width: 220px; height: 220px; }
        .b2 { top: 60%; left: 42%; width: 100px; height: 100px; }
        .b3 { top: 30%; left: 62%; width: 250px; height: 250px; }
        .b4 { top: 15%; left: 48%; width: 140px; height: 140px; }
        .b5 { top: 75%; left: 20%; width: 120px; height: 120px; }
        .b6 { top: 45%; left: 75%; width: 180px; height: 180px; }
        .b7 { top: 15%; left: 40%; width: 80px; height: 80px; opacity: 0.7; }
        .b8 { top: 50%; left: 55%; width: 70px; height: 70px; opacity: 0.6; }
        .b9 { top: 80%; left: 35%; width: 75px; height: 75px; opacity: 0.7; }

        .hero-right { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; text-align: right; height: 100%; padding: 6rem 0; z-index: 100; width: 450px; pointer-events: none; }
        .product-carousel { display: flex; flex-direction: column; gap: 1.5rem; align-items: flex-end; pointer-events: auto; }
        .carousel-cards { display: flex; gap: 1rem; }
        .card { background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 1rem; padding-top: 5rem; border-radius: 28px; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); width: 135px; position: relative; backdrop-filter: blur(10px); text-align: center; }
        .card:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.4); }
        .card.active { border-color: #fbcfe8; }
        .card img { width: 140px; height: auto; margin-top: -8rem; filter: drop-shadow(0 20px 35px rgba(0,0,0,0.5)); transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important; display: block; will-change: transform; pointer-events: none; }
        .card:hover img { transform: translateY(-30px) rotate(-12deg) scale(1.15) !important; }
        .card-info { display: flex; flex-direction: column; font-size: 0.7rem; width: 100%; }
        .card-info span:first-child { font-weight: 600; }
        .card-info span:last-child { color: var(--muted-color); }
        .carousel-nav { display: flex; gap: 1rem; }
        .nav-arrow { background: var(--glass-bg); border: 1px solid var(--glass-border); color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.3s; }
        .nav-arrow:hover { background: rgba(255,255,255,0.1); }
        .side-title { align-self: flex-end; text-align: right; }

        @media (max-width: 1200px) {
          .main-product-3d { width: 100vw; height: 60vh; top: 40%; }
          .main-title, .side-title { font-size: 5rem; }
          .hero-right { align-items: center; text-align: center; }
          .side-title { align-self: center; text-align: center; }
        }

        /* ══════════ SCROLL SECTIONS ══════════ */
        .scroll-reveal {
          opacity: 0; transform: translateY(60px);
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .scroll-reveal.revealed { opacity: 1; transform: translateY(0); }
        .scroll-reveal.delay-1 { transition-delay: 0.1s; }
        .scroll-reveal.delay-2 { transition-delay: 0.2s; }
        .scroll-reveal.delay-3 { transition-delay: 0.3s; }
        .scroll-reveal.delay-4 { transition-delay: 0.4s; }

        .s-section {
          position: relative; z-index: 200; padding: 8rem 4%;
        }
        .s-section-dark { background: rgba(5, 14, 12, 0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid rgba(255,255,255,0.05); }
        .s-section-mid { background: rgba(7, 26, 22, 0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid rgba(255,255,255,0.05); }
        .s-section-accent { background: rgba(10, 31, 26, 0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid rgba(255,255,255,0.05); }
        .s-section-cta { background: rgba(5, 14, 12, 0.6); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid rgba(255,255,255,0.05); }

        .s-label {
          font-family: 'Manrope', sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; color: #fbcfe8;
          margin-bottom: 1rem; display: inline-block;
        }
        .s-heading {
          font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 5rem);
          line-height: 1; color: white; margin-bottom: 1.5rem;
        }
        .s-sub {
          color: rgba(255,255,255,0.5); font-size: 1.1rem; line-height: 1.7;
          max-width: 560px;
        }

        /* ── Section 1: Features ── */
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
          margin-top: 4rem; max-width: 1200px; margin-left: auto; margin-right: auto;
        }
        .feature-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 2.5rem; backdrop-filter: blur(10px);
          transition: all 0.4s ease; position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(251,207,232,0.3), transparent);
          opacity: 0; transition: opacity 0.4s;
        }
        .feature-card:hover { background: rgba(255,255,255,0.06); transform: translateY(-4px); }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, rgba(251,207,232,0.15), rgba(251,207,232,0.05));
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.5rem; font-size: 1.5rem;
        }
        .feature-card h3 { font-family: 'Manrope', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem; }
        .feature-card p { color: rgba(255,255,255,0.5); font-size: 0.9rem; line-height: 1.6; }

        .stats-row {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem;
          margin-top: 5rem; max-width: 1200px; margin-left: auto; margin-right: auto;
          border-top: 1px solid rgba(255,255,255,0.06); padding-top: 3rem;
        }
        .stat-item { text-align: center; }
        .stat-value {
          font-family: var(--font-heading); font-size: clamp(2rem, 4vw, 3.5rem);
          color: white; line-height: 1;
        }
        .stat-label {
          font-family: 'Manrope', sans-serif; font-size: 0.75rem;
          color: rgba(255,255,255,0.4); text-transform: uppercase;
          letter-spacing: 0.1em; margin-top: 0.5rem;
        }

        /* ── Section 2: Ingredients ── */
        .ingredients-layout {
          display: grid; grid-template-columns: 1fr 1fr; gap: 6rem;
          max-width: 1200px; margin: 4rem auto 0; align-items: center;
        }
        .ingredient-list { display: flex; flex-direction: column; gap: 2rem; }
        .ingredient-item {
          display: flex; align-items: center; gap: 1.5rem;
          padding: 1.5rem; border-radius: 20px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s ease;
        }
        .ingredient-item:hover { background: rgba(255,255,255,0.05); border-color: rgba(251,207,232,0.2); }
        .ingredient-circle {
          width: 64px; height: 64px; min-width: 64px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.8rem; background: linear-gradient(135deg, rgba(11,138,120,0.3), rgba(11,138,120,0.1));
        }
        .ingredient-info h4 { font-family: 'Manrope', sans-serif; font-weight: 700; margin-bottom: 0.3rem; }
        .ingredient-info p { color: rgba(255,255,255,0.4); font-size: 0.85rem; line-height: 1.5; }

        /* ── Section 3: Flavors ── */
        .flavors-scroll {
          display: flex; gap: 2rem; margin-top: 4rem;
          max-width: 1200px; margin-left: auto; margin-right: auto;
          overflow-x: auto; padding-bottom: 2rem;
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .flavors-scroll::-webkit-scrollbar { display: none; }
        .flavor-card {
          min-width: 280px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 28px;
          padding: 2rem; text-align: center; transition: all 0.4s ease;
          position: relative; overflow: hidden;
        }
        .flavor-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-6px); border-color: rgba(251,207,232,0.3); }
        .flavor-emoji { font-size: 3rem; margin-bottom: 1rem; display: block; }
        .flavor-card h3 { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem; }
        .flavor-card p { color: rgba(255,255,255,0.4); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.5rem; }
        .flavor-tag {
          display: inline-block; padding: 0.4rem 1rem; border-radius: 100px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
          background: rgba(251,207,232,0.1); color: #fbcfe8; border: 1px solid rgba(251,207,232,0.2);
        }

        /* ── Section 4: Testimonials ── */
        .testimonials-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
          margin-top: 4rem; max-width: 1200px; margin-left: auto; margin-right: auto;
        }
        .testimonial-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 2.5rem; position: relative;
          transition: all 0.3s ease;
        }
        .testimonial-card:hover { background: rgba(255,255,255,0.06); }
        .testimonial-quote {
          font-size: 2rem; color: rgba(251,207,232,0.3); font-family: serif;
          line-height: 1; margin-bottom: 1rem;
        }
        .testimonial-card blockquote {
          color: rgba(255,255,255,0.7); font-size: 0.95rem; line-height: 1.7;
          margin-bottom: 1.5rem; font-style: italic;
        }
        .testimonial-author { display: flex; align-items: center; gap: 1rem; }
        .testimonial-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #0b8a78, #044e3b);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.9rem;
        }
        .testimonial-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 0.9rem; }
        .testimonial-role { color: rgba(255,255,255,0.4); font-size: 0.75rem; }
        .testimonial-stars { color: #fbcfe8; font-size: 0.8rem; margin-top: 0.3rem; letter-spacing: 2px; }

        /* ── Section 5: CTA + Footer ── */
        .cta-box {
          max-width: 700px; margin: 0 auto; text-align: center;
        }
        .cta-box .s-heading { margin-bottom: 1rem; }
        .cta-box .s-sub { margin: 0 auto 3rem; }
        .cta-form {
          display: flex; gap: 0.5rem; max-width: 480px; margin: 0 auto;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px; padding: 0.4rem;
        }
        .cta-form input {
          flex: 1; background: none; border: none; outline: none;
          color: white; padding: 0.8rem 1.2rem; font-size: 0.9rem;
          font-family: var(--font-main);
        }
        .cta-form input::placeholder { color: rgba(255,255,255,0.3); }
        .cta-form button {
          background: #fbcfe8; color: #011d17; border: none;
          padding: 0.8rem 2rem; border-radius: 100px; font-weight: 700;
          font-size: 0.85rem; cursor: pointer; transition: all 0.3s;
          white-space: nowrap;
        }
        .cta-form button:hover { background: #f9a8d4; transform: scale(1.02); }

        .soda-footer {
          margin-top: 8rem; padding-top: 4rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; justify-content: space-between; align-items: flex-start;
          max-width: 1200px; margin-left: auto; margin-right: auto;
          flex-wrap: wrap; gap: 3rem;
        }
        .footer-brand .soda-logo { margin-bottom: 1rem; }
        .footer-brand p { color: rgba(255,255,255,0.3); font-size: 0.85rem; max-width: 280px; line-height: 1.6; }
        .footer-links h4 {
          font-family: 'Manrope', sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.4);
          margin-bottom: 1rem;
        }
        .footer-links a {
          display: block; color: rgba(255,255,255,0.6); text-decoration: none;
          font-size: 0.85rem; margin-bottom: 0.6rem; transition: color 0.3s;
        }
        .footer-links a:hover { color: #fbcfe8; }
        .footer-bottom {
          width: 100%; text-align: center; padding-top: 3rem; margin-top: 3rem;
          border-top: 1px solid rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.2); font-size: 0.75rem;
        }

        @media (max-width: 900px) {
          .features-grid, .testimonials-grid { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .ingredients-layout { grid-template-columns: 1fr; gap: 3rem; }
          .soda-footer { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>

      {/* ══ LOADING OVERLAY ══ */}
      <div className={`loading-overlay${isLoading ? '' : ' hidden'}`}>
        <div className="loader-can">
          <div className="loader-tab" />
          <div className="loader-can-top" />
          <div className="loader-can-body">
            <span className="loader-label">Soda</span>
          </div>
          <div className="loader-bubbles">
            <div className="loader-bubble" />
            <div className="loader-bubble" />
            <div className="loader-bubble" />
            <div className="loader-bubble" />
            <div className="loader-bubble" />
          </div>
        </div>
        <div className="loader-progress-wrap">
          <div className="loader-progress-bar">
            <div className="loader-progress-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <span className="loader-text">Loading experience... {loadProgress}%</span>
        </div>
      </div>

      <div ref={containerRef}>
        {/* Bubbles */}
        <div id="bubbles-container" />

        {/* Header */}
        <header className="soda-header">
          <div className="soda-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <span>Soda</span>
          </div>
          <nav className="soda-nav">
            <a href="#" className="soda-nav-item active">Home</a>
            <a href="#" className="soda-nav-item">Ingredients</a>
            <a href="#" className="soda-nav-item">Taste</a>
            <a href="#" className="soda-nav-item">Eco</a>
            <a href="#" className="soda-nav-item">Reviews</a>
          </nav>
          <button className="soda-contact-btn">Contact Us</button>
        </header>

        {/* Hero */}
        <main className="hero">
          <div className="hero-content">
            {/* Leaves */}
            <div className="leaves-container">
              {(['45deg 75deg 105%', '-30deg 60deg 105%', '120deg 85deg 105%', '10deg 45deg 105%'] as const).map((orbit, i) => (
                <model-viewer key={i} className={`leaf l${i + 1}`} src={ASSETS.leaves} environment-image="neutral" exposure="1.0" interaction-prompt="none" camera-orbit={orbit} />
              ))}
            </div>

            {/* Left */}
            <div className="hero-left">
              <h1 className="main-title"><span>Pure</span><br />Zero</h1>
              <p className="soda-description">
                Unleash the crisp taste of zero sugar. <br />
                Refreshment redefined in every bubble — <br />
                all in one sleek design.
              </p>
              <div>
                <button className="primary-btn">Shop Now<span className="plus-icon">+</span></button>
              </div>
              <div className="award-badge">
                <div className="award-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 15L15 18L19 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div className="award-text">
                  <span className="award-title">DESIGN AWARDS</span>
                  <span className="award-subtitle">PREMIUM BEVERAGE 2025</span>
                </div>
              </div>
            </div>

            {/* BG Berries */}
            <div className="berries-container-bg">
              {[{ cls: 'b7', orbit: '-20deg 110deg 105%' }, { cls: 'b8', orbit: '160deg 45deg 105%' }, { cls: 'b9', orbit: '45deg 20deg 105%' }].map(b => (
                <model-viewer key={b.cls} className={`berry ${b.cls}`} src={ASSETS.cherry} environment-image="neutral" exposure="1.0" interaction-prompt="none" camera-orbit={b.orbit} />
              ))}
            </div>

            {/* Center Can */}
            <div className="hero-center">
              <model-viewer id="product-model" src={ASSETS.can} alt="Diet Soda 3D Model" camera-controls disable-zoom shadow-intensity="0" environment-image="neutral" exposure="1.5" interaction-prompt="none" camera-orbit="0deg 90deg 380%" field-of-view="30deg" className="main-product-3d" />
            </div>

            {/* FG Berries */}
            <div className="berries-container">
              {[
                { cls: 'b1', orbit: '45deg 120deg 105%' }, { cls: 'b2', orbit: '-120deg 45deg 105%' },
                { cls: 'b3', orbit: '200deg 90deg 105%' }, { cls: 'b4', orbit: '10deg 20deg 105%' },
                { cls: 'b5', orbit: '-45deg 160deg 105%' }, { cls: 'b6', orbit: '80deg 75deg 105%' }
              ].map(b => (
                <model-viewer key={b.cls} className={`berry ${b.cls}`} src={ASSETS.cherry} environment-image="neutral" exposure="1.2" interaction-prompt="none" camera-orbit={b.orbit} />
              ))}
            </div>

            {/* Right */}
            <div className="hero-right">
              <div className="product-carousel">
                <div className="carousel-cards">
                  <div className="card active" data-flavor="classic">
                    <img src={ASSETS.greenSoda} alt="Diet Classic" />
                    <div className="card-info"><span>Diet Classic</span><span>$2.99</span></div>
                  </div>
                  <div className="card" data-flavor="blue">
                    <img src={ASSETS.blueSoda} alt="Zero Lime" style={{ filter: 'brightness(0.7)' }} />
                    <div className="card-info"><span>Zero Lime</span><span>$2.99</span></div>
                  </div>
                </div>
                <div className="carousel-nav">
                  <button className="nav-arrow">←</button>
                  <button className="nav-arrow">→</button>
                </div>
              </div>
              <h2 className="side-title"><span>Refreshingly</span><br />Clean</h2>
            </div>
          </div>
        </main>



        {/* ══════ SECTION 1: FEATURES ══════ */}
        <section className="s-section s-section-dark" id="features">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="scroll-reveal">
              <span className="s-label">Why Zero?</span>
              <h2 className="s-heading">Zero Sugar.<br />Maximum Taste.</h2>
              <p className="s-sub">We stripped away the sugar but kept everything that matters — bold flavor, clean finish, and a refreshment that hits different.</p>
            </div>
            <div className="features-grid">
              {[
                { icon: '🍃', title: 'Zero Sugar', desc: 'Absolutely no added sugar. Just clean, crisp taste that doesn\'t compromise on flavor or your health goals.' },
                { icon: '💧', title: 'Natural Flavors', desc: 'Every sip is infused with real fruit extracts and natural essences. No artificial colors or preservatives.' },
                { icon: '♻️', title: 'Eco Packaging', desc: '100% recyclable aluminum cans made with 70% recycled material. Good for you, better for the planet.' }
              ].map((f, i) => (
                <div key={i} className={`feature-card scroll-reveal delay-${i + 1}`}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="stats-row">
              {[
                { value: '0g', label: 'Sugar per can' },
                { value: '100%', label: 'Natural flavors' },
                { value: '5', label: 'Unique flavors' },
                { value: '10M+', label: 'Cans sold globally' }
              ].map((s, i) => (
                <div key={i} className={`stat-item scroll-reveal delay-${i + 1}`}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ SECTION 2: INGREDIENTS ══════ */}
        <section className="s-section s-section-mid" id="ingredients">
          <div className="ingredients-layout">
            <div className="scroll-reveal">
              <span className="s-label">What Goes In</span>
              <h2 className="s-heading">Pure<br />Ingredients</h2>
              <p className="s-sub">Transparency is our recipe. Every ingredient is carefully selected, ethically sourced, and scientifically balanced for the perfect zero-sugar formula.</p>
            </div>
            <div className="ingredient-list">
              {[
                { emoji: '🫧', name: 'Carbonated Water', desc: 'Triple-filtered sparkling water for the perfect micro-bubble effervescence.' },
                { emoji: '🍋', name: 'Natural Citrus Extract', desc: 'Cold-pressed lemon and lime oils for a crisp, authentic citrus profile.' },
                { emoji: '🌿', name: 'Stevia Leaf', desc: 'Plant-based sweetener with zero glycemic impact. Sweet without the guilt.' },
                { emoji: '🧊', name: 'Electrolyte Blend', desc: 'Potassium and magnesium for light hydration support in every can.' }
              ].map((ing, i) => (
                <div key={i} className={`ingredient-item scroll-reveal delay-${i + 1}`}>
                  <div className="ingredient-circle">{ing.emoji}</div>
                  <div className="ingredient-info">
                    <h4>{ing.name}</h4>
                    <p>{ing.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ SECTION 3: FLAVORS ══════ */}
        <section className="s-section s-section-accent" id="flavors">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="scroll-reveal">
              <span className="s-label">The Collection</span>
              <h2 className="s-heading">Find Your<br />Flavor</h2>
              <p className="s-sub">Five carefully crafted profiles. From classic cherry to exotic tropical blends — there&apos;s a zero for every mood.</p>
            </div>
            <div className="flavors-scroll">
              {[
                { emoji: '🍒', name: 'Cherry Classic', desc: 'The OG. Bold cherry with a smooth, clean finish.', tag: 'BESTSELLER' },
                { emoji: '🫐', name: 'Blue Raspberry', desc: 'Sweet and tangy with an electric blue attitude.', tag: 'NEW' },
                { emoji: '🍋', name: 'Lemon Zero', desc: 'Bright, zesty citrus that cuts through everything.', tag: 'FAN FAVORITE' },
                { emoji: '🥭', name: 'Tropical Mango', desc: 'Sun-kissed mango with a hint of passion fruit.', tag: 'LIMITED' },
                { emoji: '🍓', name: 'Strawberry Fizz', desc: 'Summer strawberries in every sparkling sip.', tag: 'COMING SOON' }
              ].map((fl, i) => (
                <div key={i} className={`flavor-card scroll-reveal delay-${Math.min(i + 1, 4)}`}>
                  <span className="flavor-emoji">{fl.emoji}</span>
                  <h3>{fl.name}</h3>
                  <p>{fl.desc}</p>
                  <span className="flavor-tag">{fl.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ SECTION: GLOBAL NETWORK ══════ */}
        <section className="s-section s-section-mid" id="global-network">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="scroll-reveal">
              <span className="s-label">Distribution</span>
              <h2 className="s-heading">Global<br />Network</h2>
              <p className="s-sub">With a distribution network covering all continents, Diet Soda is ready to bring crisp refreshment straight to your hands, no matter where you are in the world. Cold-chain preserved and super-fast delivery guaranteed.</p>
            </div>
            <div className="flex justify-center scroll-reveal delay-1">
              <Globe 
                className="w-full max-w-[450px]"
                dark={1}
                baseColor={[0.1, 0.5, 0.45]}
                markerColor={[251/255, 207/255, 232/255]}
                glowColor={[11/255, 138/255, 120/255]}
                arcColor={[251/255, 207/255, 232/255]}
                markers={[
                  { id: '1', location: [21.0285, 105.8542], label: 'Hanoi' },
                  { id: '2', location: [35.6762, 139.6503], label: 'Tokyo' },
                  { id: '3', location: [37.7749, -122.4194], label: 'San Francisco' },
                  { id: '4', location: [51.5074, -0.1278], label: 'London' }
                ]}
                arcs={[
                  { id: 'a1', from: [21.0285, 105.8542], to: [35.6762, 139.6503] },
                  { id: 'a2', from: [21.0285, 105.8542], to: [37.7749, -122.4194] },
                  { id: 'a3', from: [21.0285, 105.8542], to: [51.5074, -0.1278] }
                ]}
              />
            </div>
          </div>
        </section>

        {/* ══════ SECTION 4: TESTIMONIALS ══════ */}
        <section className="s-section s-section-dark" id="reviews">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span className="s-label">Reviews</span>
              <h2 className="s-heading">Real People,<br />Real Refresh</h2>
              <p className="s-sub" style={{ margin: '0 auto' }}>Don&apos;t take our word for it. Here&apos;s what the community has to say about making the switch to zero.</p>
            </div>
            <div className="flex justify-center mt-12 w-full scroll-reveal">
              <div className="border border-white/10 rounded-2xl relative flex h-[480px] w-full max-w-[900px] flex-row items-center justify-center overflow-hidden gap-4 [perspective:300px] bg-white/[0.02] backdrop-blur-md">
                <div
                  className="flex flex-row items-center gap-4"
                  style={{
                    transform:
                      'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)'
                  }}
                >
                  {/* Vertical Marquee (downwards) */}
                  <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
                    {testimonials.map((review) => (
                      <TestimonialCard key={review.username} {...review} />
                    ))}
                  </Marquee>
                  {/* Vertical Marquee (upwards) */}
                  <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
                    {testimonials.map((review) => (
                      <TestimonialCard key={review.username} {...review} />
                    ))}
                  </Marquee>
                  {/* Vertical Marquee (downwards) */}
                  <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
                    {testimonials.map((review) => (
                      <TestimonialCard key={review.username} {...review} />
                    ))}
                  </Marquee>
                  {/* Vertical Marquee (upwards) */}
                  <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
                    {testimonials.map((review) => (
                      <TestimonialCard key={review.username} {...review} />
                    ))}
                  </Marquee>
                </div>
                {/* Gradient overlays for vertical marquee */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[var(--bg-outer)] to-transparent"></div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[var(--bg-outer)] to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[var(--bg-outer)] to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[var(--bg-outer)] to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ SECTION: FOUNDERS ══════ */}
        <section className="s-section s-section-accent" id="founders-story">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="s-label">Behind The Taste</span>
              <h2 className="s-heading">Our Founders</h2>
              <p className="s-sub" style={{ margin: '0 auto' }}>Meet the visionary minds behind the breakthrough healthy formula of Diet Soda.</p>
            </div>
            <div className="scroll-reveal delay-1">
              <TestimonialSlider reviews={foundersReviews} />
            </div>
          </div>
        </section>

        {/* ══════ SECTION 5: CTA + FOOTER ══════ */}
        <section className="s-section s-section-cta">
          <div className="cta-box scroll-reveal">
            <span className="s-label">Stay Refreshed</span>
            <h2 className="s-heading">Ready to Make<br />The Switch?</h2>
            <p className="s-sub">Join 10 million+ people who chose zero sugar without zero taste. Get exclusive drops, flavors, and merch straight to your inbox.</p>
            <form className="cta-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
          <footer className="soda-footer">
            <div className="footer-brand">
              <div className="soda-logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                <span>Soda</span>
              </div>
              <p>Zero sugar, zero compromise. Crafted for those who refuse to settle for less.</p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <a href="#">All Flavors</a>
              <a href="#">Ingredients</a>
              <a href="#">Nutrition</a>
              <a href="#">Where to Buy</a>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Sustainability</a>
              <a href="#">Careers</a>
              <a href="#">Press Kit</a>
            </div>
            <div className="footer-links">
              <h4>Connect</h4>
              <a href="#">Instagram</a>
              <a href="#">Twitter / X</a>
              <a href="#">TikTok</a>
              <a href="#">Discord</a>
            </div>
            <div className="footer-bottom">
              © 2025 Soda Inc. All rights reserved. Zero sugar. Maximum vibes.
            </div>
          </footer>
        </section>

        {/* Preload */}
        <div style={{ display: 'none' }}>
          <model-viewer src={ASSETS.blueberry} />
          <model-viewer src={ASSETS.cherry} />
        </div>
      </div>
    </>
  );
}
