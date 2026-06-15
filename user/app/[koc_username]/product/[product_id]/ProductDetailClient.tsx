'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Plus, Check, ShieldCheck, Zap, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../../../src/stores/cartStore';
import CartDrawer from '../../components/CartDrawer';
import CheckoutModal from '../../components/CheckoutModal';
import ChatWidget from '../../components/ChatWidget';
import { kocShopService } from '../../../../src/services/koc-shop.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ProductDetailClientProps {
  product: any;
  koc: any;
  otherProducts: any[];
  username: string;
}

export default function ProductDetailClient({
  product: initialProduct,
  koc,
  otherProducts,
  username
}: ProductDetailClientProps) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutProducts, setCheckoutProducts] = useState<any[] | null>(null);

  const { items, addItem } = useCartStore();
  const kocCartItems = items.filter(item => item.kocId === koc._id);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const infoSectionRef = useRef<HTMLDivElement | null>(null);
  const recommendationsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(imageContainerRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      );

      if (infoSectionRef.current) {
        tl.fromTo(infoSectionRef.current.children,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          '-=0.6'
        );
      }

      if (recommendationsRef.current) {
        gsap.fromTo(recommendationsRef.current.querySelectorAll('.recommend-card-item'),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: recommendationsRef.current,
              start: 'top 85%'
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [product]);

  const handleAddToCart = (e: React.MouseEvent) => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      condition: product.condition,
      images: product.images,
      kocId: koc._id,
      kocUsername: username,
      kocName: koc.name,
      status: product.status as any,
      description: product.description
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    setCheckoutProducts([product]);
  };

  const handleCartCheckout = (itemsToCheckout: any[]) => {
    setCheckoutProducts(itemsToCheckout);
    setIsCartOpen(false);
  };

  const isProductInCart = items.some(item => item._id === product._id);
  const isAvailable = product.status === 'available';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        .font-heading { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(30, 41, 59, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 41, 59, 0.3) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
        }
      `}} />

      <div ref={containerRef} className="min-h-screen bg-[#030304] font-body text-[#FFFFFF] relative overflow-x-hidden selection:bg-[#F7931A] selection:text-white pb-24">
        
        {/* Ambient Blurs */}
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F7931A] opacity-[0.05] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0 fixed" />

        {/* HEADER */}
        <header className={`sticky top-0 z-50 transition-all duration-300 border-b border-white/10 ${
          isScrolled ? 'bg-[#030304]/80 backdrop-blur-lg py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-[#030304] py-6'
        }`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <Link 
                href={`/${username}`}
                className="p-2.5 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all flex items-center justify-center hover:border-white/30"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#F7931A]/30 bg-[#0F1115] shadow-[0_0_15px_rgba(247,147,26,0.2)]">
                  {koc.avatarUrl ? (
                    <Image src={koc.avatarUrl} alt={koc.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-heading font-bold text-[#F7931A] text-xs">AUTO</div>
                  )}
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-heading font-bold text-white text-lg tracking-tight flex items-center gap-2">
                    {koc.name} <span className="text-[#94A3B8] font-light text-sm">Network</span>
                  </h1>
                  <p className="font-mono text-[10px] text-[#F7931A] tracking-wider uppercase">VERIFIED NODE</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-white/5 border border-white/10 hover:border-[#F7931A]/50 hover:bg-[#F7931A]/10 text-white rounded-full transition-all duration-300 group shadow-[0_0_15px_rgba(247,147,26,0)] hover:shadow-[0_0_20px_rgba(247,147,26,0.3)] flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 group-hover:text-[#F7931A] transition-colors" strokeWidth={1.5} />
                {kocCartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white text-[10px] font-mono font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(247,147,26,0.5)]">
                    {kocCartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <main className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* CỘT TRÁI: HÌNH ẢNH SẢN PHẨM */}
            <div className="space-y-6">
              <div 
                ref={imageContainerRef}
                className="relative aspect-[4/3] lg:aspect-square w-full rounded-2xl border border-white/10 bg-[#0F1115] shadow-[0_0_50px_rgba(247,147,26,0.05)] overflow-hidden group"
              >
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:contrast-110 z-10 relative"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-[#1E293B] text-xl z-10 relative">
                    [ NO_IMAGE_DATA ]
                  </div>
                )}

                {/* Badge độ mới */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-[#F7931A]/30 text-white font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(247,147,26,0.2)] z-20">
                  <Activity className="w-3 h-3 text-[#F7931A]" />
                  <span>COND: {product.condition}%</span>
                </div>

                {/* SOLD OUT Overlay */}
                {!isAvailable && (
                  <div className="absolute inset-0 bg-[#030304]/80 flex items-center justify-center z-30 backdrop-blur-sm">
                    <span className="text-red-500 font-heading font-bold text-4xl uppercase tracking-widest border border-red-500/50 bg-red-500/10 px-6 py-2 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                      {product.status === 'holding' ? 'RESERVED' : 'SOLD OUT'}
                    </span>
                  </div>
                )}
                
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#F7931A]/50 rounded-tl-2xl z-20" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#F7931A]/50 rounded-br-2xl z-20" />
              </div>

              {/* Danh sách ảnh nhí */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden transition-all duration-300 border ${
                        activeImage === img 
                          ? 'border-[#F7931A] shadow-[0_0_15px_rgba(247,147,26,0.3)]' 
                          : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: CHI TIẾT SẢN PHẨM */}
            <div ref={infoSectionRef} className="flex flex-col space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 rounded-md">
                  <Zap className="w-3 h-3 text-[#FFD600]" />
                  <span className="font-mono text-[10px] text-[#FFD600] uppercase tracking-widest">VERIFIED AUTHENTIC</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
                  {product.name}
                </h2>

                <div className="flex flex-col gap-2 pt-6 border-t border-white/10">
                  <span className="font-mono text-sm text-[#94A3B8]">MARKET PRICE</span>
                  <div className="flex items-end gap-4">
                    <span className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent">
                      {(product.price ?? 0).toLocaleString('vi-VN')} <span className="text-2xl">VND</span>
                    </span>
                  </div>
                </div>

                {/* Mô tả sản phẩm */}
                <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-6 relative group hover:border-[#F7931A]/30 transition-colors duration-300">
                  <ShieldCheck className="absolute top-4 right-4 w-16 h-16 text-white/[0.02] group-hover:text-white/[0.05] transition-colors" />
                  <h4 className="font-mono text-xs text-[#94A3B8] mb-3">PRODUCT DETAILS</h4>
                  <p className="font-body text-sm text-white/80 leading-relaxed whitespace-pre-wrap relative z-10">
                    {product.description || 'Legit checked by our expert team. Guaranteed 100% authentic.'}
                  </p>
                </div>

                {/* Cam kết */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-[#030304] border border-white/10 p-4 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-[#F7931A]" />
                    <span className="font-mono text-[10px] text-[#94A3B8] tracking-wide">100% ORIGINAL<br/><span className="text-white">GUARANTEED</span></span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#030304] border border-white/10 p-4 rounded-xl">
                    <Zap className="w-6 h-6 text-[#FFD600]" />
                    <span className="font-mono text-[10px] text-[#94A3B8] tracking-wide">EXPRESS<br/><span className="text-white">SHIPPING</span></span>
                  </div>
                </div>
              </div>

              {/* Các nút hành động */}
              <div className="space-y-4 pt-6 mt-auto border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    disabled={!isAvailable}
                    onClick={handleAddToCart}
                    className={`py-4 rounded-full font-mono text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                      isAvailable
                        ? isProductInCart
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'bg-transparent text-white border border-white/20 hover:border-[#F7931A] hover:bg-[#F7931A]/10'
                        : 'bg-[#0F1115] text-[#1E293B] border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {isProductInCart ? (
                      <>
                        <Check className="w-4 h-4" /> QUEUED
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> ADD TO BAG
                      </>
                    )}
                  </button>

                  <button
                    disabled={!isAvailable}
                    onClick={handleBuyNow}
                    className={`py-4 rounded-full font-mono text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                      isAvailable
                        ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] hover:scale-[1.02]'
                        : 'bg-[#0F1115] text-[#1E293B] border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {product.status === 'holding' ? 'RESERVED' : 'BUY NOW'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* SECTION SẢN PHẨM KHÁC */}
        {otherProducts.length > 0 && (
          <section ref={recommendationsRef} className="max-w-7xl mx-auto px-6 mt-32 relative z-10 border-t border-white/10 pt-16">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-heading font-bold text-2xl md:text-3xl text-white">OTHER RELEASES FROM {koc.name}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherProducts.slice(0, 4).map((p: any) => {
                const isPAvailable = p.status === 'available';

                return (
                  <div
                    key={p._id}
                    onClick={() => router.push(`/${username}/product/${p._id}`)}
                    className="recommend-card-item group bg-[#0F1115] rounded-2xl border border-white/10 overflow-hidden hover:-translate-y-1 hover:border-[#F7931A]/50 hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.2)] transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    {/* Ảnh */}
                    <div className="relative aspect-[4/3] w-full bg-black/40 overflow-hidden border-b border-white/5">
                      {p.images && p.images[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 group-hover:contrast-125 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[#1E293B] text-sm">
                          [ NO_PIC ]
                        </div>
                      )}
                      
                      {/* Badge độ mới */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-[#F7931A]/30 text-white font-mono text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                        <Activity className="w-3 h-3 text-[#F7931A]" />
                        <span>{p.condition}%</span>
                      </div>

                      {!isPAvailable && (
                        <div className="absolute inset-0 bg-[#030304]/80 flex items-center justify-center z-10 backdrop-blur-sm">
                          <span className="text-red-500 font-heading font-bold uppercase text-xl border border-red-500/50 bg-red-500/10 px-4 py-1 rounded-lg">
                            {p.status === 'holding' ? 'RESERVED' : 'SOLD OUT'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Chi tiết */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="font-mono text-[9px] text-[#94A3B8] tracking-widest mb-1 block">ID: {p._id.substring(0,6)}</span>
                        <h4 className="font-heading font-semibold text-white group-hover:text-[#F7931A] transition-colors duration-300 line-clamp-1">
                          {p.name}
                        </h4>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <span className="font-mono text-sm text-[#94A3B8] block mb-1">PRICE</span>
                        <div className="font-heading font-bold text-xl text-white">
                          {(p.price ?? 0).toLocaleString('vi-VN')} <span className="text-xs text-[#FFD600]">VND</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          kocUsername={username}
          kocId={koc._id}
          onCheckout={handleCartCheckout}
        />

        {checkoutProducts && (
          <CheckoutModal
            products={checkoutProducts}
            kocName={koc.name}
            kocId={koc._id}
            onClose={() => {
              setCheckoutProducts(null);
              kocShopService.getProductDetail(product._id).then(res => {
                if (res) setProduct(res);
              });
            }}
          />
        )}

        <ChatWidget kocId={koc._id} kocName={koc.name} />
      </div>
    </>
  );
}
