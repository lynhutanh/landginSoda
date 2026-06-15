'use client';
import React, { useEffect, useRef } from 'react';
import { useCartStore, CartItem } from '../../../src/stores/cartStore';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  kocUsername?: string;
  kocId?: string;
  onCheckout: (products: CartItem[], kocId: string, kocName: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  kocUsername,
  kocId,
  onCheckout
}: CartDrawerProps) {
  const { items, removeItem } = useCartStore();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
      gsap.to(drawerRef.current, { x: 0, duration: 0.45, ease: 'power3.out' });
    } else {
      document.body.style.overflow = '';
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.25, pointerEvents: 'none' });
      gsap.to(drawerRef.current, { x: '100%', duration: 0.35, ease: 'power3.in' });
    }
  }, [isOpen]);

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.kocId]) {
        acc[item.kocId] = { kocId: item.kocId, kocName: item.kocName, kocUsername: item.kocUsername, items: [] };
      }
      acc[item.kocId].items.push(item);
      return acc;
    },
    {} as Record<string, { kocId: string; kocName: string; kocUsername: string; items: CartItem[] }>
  );

  const displayGroups = kocId
    ? Object.values(groupedItems).filter((g) => g.kocId === kocId)
    : Object.values(groupedItems);

  const totalGlobalItems = displayGroups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-50 opacity-0 pointer-events-none backdrop-blur-sm"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] z-[60] flex flex-col translate-x-full border-l border-white/[0.07]"
        style={{ fontFamily: '\'JetBrains Mono\', \'Courier New\', monospace' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.07] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-4 h-4 text-white/50" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-white/60 font-medium">
              Cart
              {totalGlobalItems > 0 && (
                <span className="ml-2 text-white/90">{totalGlobalItems}</span>
              )}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" style={{ scrollbarWidth: 'none' }}>
          {totalGlobalItems === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-5 text-center py-20">
              <div className="w-16 h-16 border border-white/10 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-white/20" />
              </div>
              <div>
                <p className="text-white/40 text-xs tracking-[0.2em] uppercase">Cart is empty</p>
                <p className="text-white/20 text-[11px] mt-2">Select products to add</p>
              </div>
            </div>
          ) : (
            displayGroups.map((group) => {
              const groupTotal = group.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
              return (
                <div key={group.kocId} className="space-y-4">
                  {/* Shop label */}
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    <span className="text-[10px] tracking-[0.3em] text-white/25 uppercase">{group.kocName}</span>
                    <span className="h-px flex-1 bg-white/[0.06]" />
                  </div>

                  {/* Product items */}
                  {group.items.map((item) => (
                    <div key={item._id} className="flex gap-4 group relative">
                      {/* Image */}
                      <div className="w-16 h-20 shrink-0 overflow-hidden bg-white/[0.03] border border-white/[0.07]">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10 text-[9px] tracking-widest">
                            NO IMG
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <p className="text-white/80 text-xs font-medium truncate leading-tight">{item.name}</p>
                          {item.condition && (
                            <span className="inline-block mt-1.5 text-[9px] tracking-[0.2em] text-white/30 uppercase">
                              {item.condition}% condition
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 text-xs tracking-wider">
                          {(item.price ?? 0).toLocaleString('vi-VN')}
                          <span className="text-white/25 ml-1">₫</span>
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="self-start mt-0.5 p-1.5 text-white/20 hover:text-white/60 transition-colors"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Group total + checkout */}
                  <div className="pt-4 border-t border-white/[0.06] space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] tracking-[0.25em] text-white/30 uppercase">Total</span>
                      <span className="text-sm text-white/80 tracking-wider">
                        {groupTotal.toLocaleString('vi-VN')}
                        <span className="text-white/30 ml-1 text-xs">₫</span>
                      </span>
                    </div>
                    <button
                      onClick={() => onCheckout(group.items, group.kocId, group.kocName)}
                      className="w-full py-3.5 border border-white/20 text-white/70 text-[11px] tracking-[0.25em] uppercase flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300 group/btn"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
