'use client';
import React, { useState, useEffect } from 'react';
import { kocShopService } from '../../../src/services/koc-shop.service';
import { useCartStore } from '../../../src/stores/cartStore';
import { X, CheckCircle, CreditCard, Check } from 'lucide-react';
import { gsap } from 'gsap';

interface Product {
  _id: string;
  name: string;
  price: number;
  condition: number;
  images: string[];
}

export default function CheckoutModal({
  products,
  onClose,
  kocName,
  kocId
}: {
  products: Product[];
  onClose: () => void;
  kocName: string;
  kocId: string;
}) {
  const { removeItem } = useCartStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [activeOrderIndex, setActiveOrderIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paidProductIds, setPaidProductIds] = useState<string[]>([]);

  useEffect(() => {
    gsap.fromTo('.modal-box',
      { y: 40, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, timeLeft]);

  useEffect(() => {
    if (step === 2 && timeLeft <= 0) {
      alert('Hết thời gian. Đơn hàng đã được huỷ.');
      onClose();
    }
  }, [timeLeft, step, onClose]);

  useEffect(() => {
    if (step !== 2 || orders.length === 0) return;
    const interval = setInterval(async () => {
      try {
        const pending = orders.filter((o) => !paidProductIds.includes(o.productId));
        for (const o of pending) {
          const detail = await kocShopService.getProductDetail(o.productId);
          if (detail.status === 'sold') {
            setPaidProductIds((prev) => {
              removeItem(o.productId);
              return [...prev, o.productId];
            });
          }
        }
      } catch { /* noop */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [step, orders, paidProductIds, removeItem]);

  useEffect(() => {
    if (step === 2 && orders.length > 0 && paidProductIds.length === orders.length) setStep(3);
  }, [paidProductIds, orders, step]);

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const created: any[] = [];
    const errors: string[] = [];

    for (const product of products) {
      try {
        const shipping = { province: 'Hồ Chí Minh', district: 'Quận 1', ward: 'Phường Bến Nghé', provinceId: 202, districtId: 1442, wardCode: '20101' };
        const order = await kocShopService.createOrder({
          productId: product._id,
          customerName,
          customerPhone,
          customerAddress: `${customerAddress}, ${shipping.ward}, ${shipping.district}, ${shipping.province}`,
          shippingDetail: shipping,
          shippingFee: 0
        });
        created.push({ ...order, productName: product.name, productPrice: product.price });
      } catch { errors.push(product.name); }
    }

    if (created.length === 0) {
      alert(`Đơn hàng thất bại:\n- ${errors.join('\n- ')}`);
      onClose();
    } else {
      if (errors.length > 0) alert(`Một số sản phẩm không thể đặt:\n- ${errors.join('\n- ')}`);
      setOrders(created);
      setStep(2);
      setActiveOrderIndex(0);
    }
    setIsSubmitting(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const currentOrder = orders[activeOrderIndex];
  const bankAccount = '1234567890';
  const bankId = 'MB';
  const qrUrl = currentOrder
    ? `https://img.vietqr.io/image/${bankId}-${bankAccount}-compact2.png?amount=${currentOrder.amount}&addInfo=${currentOrder.orderCode}&accountName=KOC_PASSDO_PLATFORM`
    : '';
  const totalAmount = products.reduce((s, p) => s + (p.price ?? 0), 0);

  const fieldClass = 'w-full px-4 py-3 bg-white/[0.04] border border-white/[0.1] text-white/80 text-sm placeholder:text-white/20 outline-none focus:border-white/30 transition-colors font-mono tracking-wide';
  const labelClass = 'block text-[10px] tracking-[0.3em] text-white/30 uppercase mb-2 font-mono';

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[100] p-4"
      style={{ fontFamily: '\'JetBrains Mono\', \'Courier New\', monospace' }}>
      <div className="modal-box w-full max-w-3xl bg-[#0a0a0a] border border-white/[0.08] relative flex flex-col md:flex-row max-h-[90vh] overflow-hidden">

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-all z-20">
          <X className="w-3.5 h-3.5" />
        </button>

        {/* ── Step 1: Shipping info ── */}
        {step === 1 && (
          <>
            {/* Left */}
            <div className="flex-1 p-8 border-r border-white/[0.06] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="mb-8">
                <p className="text-[10px] tracking-[0.4em] text-white/25 uppercase mb-2">Step 1 of 2</p>
                <h3 className="text-xl font-light text-white tracking-tight">Thông tin giao hàng</h3>
              </div>

              <form onSubmit={handleSubmitInfo} className="space-y-5">
                <div>
                  <label className={labelClass}>Họ tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass}>Số điện thoại</label>
                  <input type="tel" placeholder="090..." value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass}>Địa chỉ nhận hàng</label>
                  <input type="text" placeholder="Số nhà, đường, quận..." value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)} className={fieldClass} required />
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3.5 mt-2 border border-white/20 text-white/70 text-[11px] tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận & Thanh toán →'}
                </button>
              </form>
            </div>

            {/* Right: order summary */}
            <div className="w-full md:w-72 p-8 bg-white/[0.02] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              <p className="text-[10px] tracking-[0.3em] text-white/25 uppercase mb-6">Đơn hàng</p>
              <div className="space-y-5">
                {products.map((p) => (
                  <div key={p._id} className="flex gap-3 group">
                    <div className="w-12 h-14 shrink-0 overflow-hidden border border-white/[0.06]">
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover opacity-50" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/60 text-xs truncate leading-tight">{p.name}</p>
                      <p className="text-[10px] text-white/25 mt-1">{p.condition}% condition</p>
                      <p className="text-white/50 text-xs mt-2 tracking-wider">{(p.price ?? 0).toLocaleString()}₫</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/30 uppercase tracking-wider">Số lượng</span>
                  <span className="text-white/50">{products.length} xe</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/30 uppercase tracking-wider">Ship</span>
                  <span className="text-white/50">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] tracking-[0.25em] text-white/30 uppercase">Total</span>
                  <span className="text-white/80 text-sm tracking-wider">{totalAmount.toLocaleString()}₫</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Step 2: QR Payment ── */}
        {step === 2 && currentOrder && (
          <>
            {/* Left: order list */}
            <div className="flex-1 p-8 border-r border-white/[0.06] overflow-y-auto flex flex-col gap-6" style={{ scrollbarWidth: 'none' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.4em] text-white/25 uppercase mb-1">Step 2 of 2</p>
                  <h3 className="text-xl font-light text-white">Thanh toán</h3>
                </div>
                <div className={`font-mono text-lg tabular-nums px-3 py-1 border ${timeLeft < 60 ? 'border-rose-500/40 text-rose-400' : 'border-white/15 text-white/50'}`}>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
              </div>

              <div className="space-y-3">
                {orders.map((o, idx) => {
                  const isPaid = paidProductIds.includes(o.productId);
                  const isActive = activeOrderIndex === idx;
                  return (
                    <button key={o._id} onClick={() => !isPaid && setActiveOrderIndex(idx)} disabled={isPaid}
                      className={`w-full p-4 border text-left flex items-center justify-between gap-4 transition-all ${
                        isPaid ? 'border-white/[0.05] opacity-40 cursor-not-allowed'
                        : isActive ? 'border-white/30 bg-white/[0.04]'
                        : 'border-white/[0.07] hover:border-white/15'
                      }`}>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs text-white/70 truncate ${isPaid ? 'line-through' : ''}`}>{o.productName}</p>
                        <p className="text-[10px] text-white/25 mt-1 tracking-widest">CODE: {o.orderCode}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-3">
                        <span className="text-xs text-white/50">{(o.amount ?? 0).toLocaleString()}₫</span>
                        {isPaid ? (
                          <span className="text-[9px] tracking-widest text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> PAID</span>
                        ) : isActive ? (
                          <span className="text-[9px] tracking-widest text-white/30 animate-pulse">ACTIVE</span>
                        ) : (
                          <span className="text-[9px] tracking-widest text-white/20">PENDING</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-[10px] text-white/20 leading-loose border-t border-white/[0.06] pt-4 mt-auto">
                Chuyển khoản đúng nội dung. Hệ thống xác nhận tự động trong vài giây.
              </p>
            </div>

            {/* Right: QR */}
            <div className="w-full md:w-72 p-8 flex flex-col gap-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-white/30" />
                <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">VietQR</span>
              </div>

              <div className="border border-white/[0.08] p-3 bg-white">
                <img src={qrUrl} alt="VietQR" className="w-full h-auto" />
              </div>

              <div className="space-y-3 text-xs">
                {[
                  ['Ngân hàng', bankId],
                  ['Số TK', bankAccount],
                  ['Số tiền', `${(currentOrder.amount ?? 0).toLocaleString()}₫`]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                    <span className="text-white/25 uppercase tracking-wider text-[10px]">{k}</span>
                    <span className="text-white/70 font-medium">{v}</span>
                  </div>
                ))}
                <div className="py-3 border-b border-white/[0.06]">
                  <p className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Nội dung CK</p>
                  <p className="text-white/70 font-medium tracking-widest text-sm break-all">{currentOrder.orderCode}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Step 3: Success ── */}
        {step === 3 && (
          <div className="w-full p-12 flex flex-col items-center justify-center gap-8 text-center min-h-[480px]">
            <div className="w-16 h-16 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-3xl font-light text-white mb-3 tracking-tight">Đặt hàng thành công</h3>
              <p className="text-white/30 text-sm max-w-sm leading-relaxed">
                Đơn hàng đang được xử lý. Chúng tôi sẽ liên hệ xác nhận và sắp xếp giao hàng sớm nhất.
              </p>
            </div>

            <div className="w-full max-w-xs border border-white/[0.07] p-6 text-left space-y-3">
              {[['Người nhận', customerName], ['Điện thoại', customerPhone], ['Địa chỉ', customerAddress]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] tracking-[0.25em] text-white/20 uppercase">{k}</p>
                  <p className="text-white/60 text-sm mt-1">{v}</p>
                </div>
              ))}
            </div>

            <button onClick={onClose}
              className="px-10 py-3 border border-white/20 text-white/50 text-[11px] tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-300">
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
