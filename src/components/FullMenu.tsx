import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, X, ArrowRight, Check, Coffee } from 'lucide-react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'motion/react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    image: string;
}

const MENU_CATEGORIES = [
    {
        name: 'Handcrafted Coffee',
        items: [
            { id: 'c1', name: 'Classic Espresso', desc: 'Rich & Bold, Double Shot', price: 4.5, image: '/clasic expresso.jpg' },
            { id: 'c2', name: 'Velvet Cappuccino', desc: 'Smooth & Creamy', price: 5.5, image: '/velvetchocolateespresso.webp' },
            { id: 'c3', name: 'Hot Cocoa', desc: 'Made with Real Chocolate', price: 4.0, image: '/Hot coco.jpg' },
            { id: 'c4', name: 'Iced Mocha Macchiato', desc: 'Chilled Perfection', price: 6.0, image: '/Iced-Mocha-Macchiato1.webp' },
            { id: 'c5', name: 'Signature Latte', desc: 'Beautifully Poured', price: 5.0, image: '/Latte.jpg' },
            { id: 'c6', name: 'Artisan Tea', desc: 'Steeped to Perfection', price: 3.5, image: '/tea.jpg' },
        ]
    },
    {
        name: 'Fresh Pastries',
        items: [
            { id: 'p1', name: 'Artisan Pastry', desc: 'Baked Fresh Daily', price: 5.0, image: '/artisan.webp' },
            { id: 'p2', name: 'Chocolate Croissant', desc: 'Flaky & Buttery', price: 4.5, image: '/choclate crosont.jpg' },
            { id: 'p3', name: 'Vegan Croissant', desc: 'Plant-based Perfection', price: 5.0, image: '/Vegan-Croissants-1.jpg' },
        ]
    },
    {
        name: 'Savory Bites',
        items: [
            { id: 'b1', name: 'Classic BLT', desc: 'Bacon, Lettuce, Tomato', price: 8.5, image: '/BLT.jpg' },
            { id: 'b2', name: 'Homemade Pizza', desc: 'Air-fryer crispy edge', price: 12.0, image: '/homemade-pizza-in-air-fryer.jpg' },
            { id: 'b3', name: 'Crispy Fries', desc: 'Golden and Salty', price: 4.5, image: '/fries.jpg' },
        ]
    },
    {
        name: 'Premium Beans',
        items: [
            { id: 'r1', name: 'House Blend', desc: 'Roastly Signature', price: 15.0, image: '/house blend.png' },
        ]
    }
];

export default function FullMenu() {
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('roastly_cart');
            if (saved) return JSON.parse(saved);
        }
        return [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [orderResult, setOrderResult] = useState<{ short_id: string } | null>(null);

    useEffect(() => {
        localStorage.setItem('roastly_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: any) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === item.id);
            if (existing) {
                return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const updateQty = (id: string, delta: number) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) return { ...p, qty: Math.max(0, p.qty + delta) };
            return p;
        }).filter(p => p.qty > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setCheckoutStatus('loading');

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart, total: cartTotal })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Checkout failed');

            setOrderResult(data.order);
            setCheckoutStatus('success');
            setCart([]); // clear cart
        } catch (err) {
            console.error(err);
            setCheckoutStatus('error');
        }
    };

    return (
        <div className="pt-32 pb-24 bg-[var(--color-bg-primary)] min-h-screen relative z-0 overflow-hidden">

            {/* Decorative Assets - Proper Theme Styling */}
            <img src="/purpleflora.png" alt="" className="absolute top-[2%] left-[-4%] opacity-40 mix-blend-multiply leaf-sway pointer-events-none w-40 md:w-64 h-auto z-[1]" />
            <img src="/ladybug.png" alt="" className="absolute top-[18%] right-[2%] opacity-70 mix-blend-multiply leaf-sway pointer-events-none w-28 md:w-48 h-auto z-[1] -scale-x-100" style={{ animationDelay: '2s' }} />
            <img src="/bean.png" alt="" className="absolute top-[35%] left-[8%] opacity-50 mix-blend-multiply leaf-sway pointer-events-none w-24 md:w-40 h-auto z-[1]" style={{ animationDelay: '3s' }} />
            <img src="/beanfall.png" alt="" className="absolute top-[50%] right-[15%] opacity-40 mix-blend-multiply pointer-events-none rotate-45 w-20 h-auto z-[1]" />
            <img src="/purpleflora.png" alt="" className="absolute bottom-[20%] left-[-5%] opacity-30 mix-blend-multiply leaf-sway pointer-events-none w-48 h-auto z-[1]" style={{ animationDelay: '1.5s' }} />
            <img src="/crosont.png" alt="" className="absolute bottom-[5%] right-[-2%] opacity-20 mix-blend-multiply leaf-sway pointer-events-none w-56 h-auto z-[1]" style={{ animationDelay: '4s' }} />
            <img src="/beanbag.png" alt="" className="absolute top-[75%] right-[5%] opacity-15 mix-blend-multiply leaf-sway pointer-events-none w-64 h-auto z-[1]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <p className="font-handwritten text-[22px] md:text-[28px] text-[var(--color-accent)] mb-1">Curated Selections</p>
                    <h1 className="text-[36px] md:text-[48px] font-display font-bold text-[var(--color-text-primary)] mb-2">
                        The Full Menu
                    </h1>
                    <p className="text-[15px] font-sans text-[var(--color-text-secondary)]">Craft your perfect order. Pay at the counter.</p>
                </div>

                <div className="space-y-20">
                    {MENU_CATEGORIES.map((category, idx) => (
                        <div key={idx}>
                            <h2 className="text-[24px] font-display font-bold text-[var(--color-text-primary)] mb-8 pb-3 border-b border-[var(--color-border)]">
                                {category.name}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {category.items.map((item, i, arr) => {
                                    let colSpan = 'md:col-span-4';
                                    let rowSpan = 'md:row-span-1';
                                    let isHero = false;

                                    if (arr.length === 6) {
                                        if (i === 0) { colSpan = 'md:col-span-8'; rowSpan = 'md:row-span-2'; isHero = true; }
                                        else { colSpan = 'md:col-span-4'; rowSpan = 'md:row-span-1'; }
                                    } else if (arr.length === 3) {
                                        if (i === 0) { colSpan = 'md:col-span-8'; rowSpan = 'md:row-span-2'; isHero = true; }
                                        else { colSpan = 'md:col-span-4'; rowSpan = 'md:row-span-1'; }
                                    } else if (arr.length === 4) {
                                        if (i === 0) { colSpan = 'md:col-span-7'; rowSpan = 'md:row-span-1'; }
                                        else if (i === 1) { colSpan = 'md:col-span-5'; rowSpan = 'md:row-span-1'; }
                                        else if (i === 2) { colSpan = 'md:col-span-5'; rowSpan = 'md:row-span-1'; }
                                        else { colSpan = 'md:col-span-7'; rowSpan = 'md:row-span-1'; }
                                    } else if (arr.length === 1) {
                                        colSpan = 'md:col-span-12'; rowSpan = 'md:row-span-2'; isHero = true;
                                    } else {
                                        colSpan = 'md:col-span-6'; rowSpan = 'md:row-span-1';
                                    }

                                    return (
                                        <motion.div
                                            key={item.id}
                                            className={`group bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-[2rem] p-4 hover:border-[var(--color-accent)] transition-all duration-300 shadow-sm hover:shadow-2xl flex flex-col z-10 relative overflow-hidden ${colSpan} ${rowSpan}`}
                                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                                        >
                                            <div className="absolute inset-0 bg-[var(--color-accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem] pointer-events-none" />

                                            <div className="flex flex-col h-full space-y-4 relative">
                                                <div className={`relative ${isHero && rowSpan === 'md:row-span-2' ? 'flex-1 min-h-[300px]' : 'h-[240px] shrink-0'} rounded-[1.5rem] overflow-hidden bg-[var(--color-bg-secondary)] flex items-center justify-center`}>
                                                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute top-4 right-4 bg-[var(--color-bg-primary)]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[14px] font-sans font-bold text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border)]">
                                                        ${item.price.toFixed(2)}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col flex-1 px-1">
                                                    <div className="mb-4">
                                                        <h3 className={`font-display font-semibold text-[var(--color-text-primary)] ${isHero && rowSpan === 'md:row-span-2' ? 'text-[28px] mb-2' : 'text-[18px] mb-1'}`}>{item.name}</h3>
                                                        <p className={`font-sans text-[var(--color-text-secondary)] ${isHero && rowSpan === 'md:row-span-2' ? 'text-[16px]' : 'text-[14px] line-clamp-2'}`}>{item.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="w-full mt-auto py-3.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[14px] font-semibold text-[var(--color-text-primary)] flex justify-center items-center gap-2 hover:bg-[var(--color-text-primary)] hover:text-[var(--color-bg-primary)] transition-all"
                                                    >
                                                        <Plus size={16} /> Add to Order
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Cart Button */}
            {cartCount > 0 && (
                <motion.button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-8 right-8 z-40 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="relative">
                        <ShoppingBag size={24} />
                        <span className="absolute -top-2 -right-3 bg-[var(--color-accent)] text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    </div>
                    <span className="font-semibold text-[15px] font-sans border-l border-white/20 pl-3">
                        ${cartTotal.toFixed(2)}
                    </span>
                </motion.button>
            )}

            {/* Cart Drawer Overlay */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => checkoutStatus !== 'success' && setIsCartOpen(false)}
                        />
                        <motion.div
                            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[var(--color-bg-primary)] shadow-2xl z-50 flex flex-col"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            {checkoutStatus === 'success' && orderResult ? (
                                // Order Success View
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                        <Check size={40} />
                                    </div>
                                    <h2 className="text-[28px] font-display font-bold text-[var(--color-text-primary)] mb-2">Order Confirmed</h2>
                                    <p className="text-[15px] font-sans text-[var(--color-text-secondary)] mb-8">
                                        Your order has been sent to the barista.
                                    </p>

                                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-2xl w-full mb-8 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-accent)]" />
                                        <p className="text-[13px] text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold mb-1 mt-2">Order Number</p>
                                        <p className="text-[44px] font-display font-bold text-[var(--color-text-primary)] leading-none mb-6 tracking-widest">{orderResult.short_id}</p>

                                        <div className="bg-white p-4 rounded-xl flex justify-center mb-4 border border-[var(--color-border)]">
                                            <QRCode value={`ROASTLY-${orderResult.short_id}`} size={160} />
                                        </div>
                                        <p className="text-[15px] font-bold text-[var(--color-accent)] flex items-center justify-center gap-2">
                                            Show this at the counter to pay
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            setCheckoutStatus('idle');
                                        }}
                                        className="w-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] py-4 rounded-xl font-semibold text-[15px]"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                // Cart View
                                <>
                                    <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                                        <h2 className="text-[20px] font-display font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                            <ShoppingBag size={20} className="text-[var(--color-accent)]" /> Your Order
                                        </h2>
                                        <button onClick={() => setIsCartOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] p-2 rounded-full">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                        {cart.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                                <Coffee size={48} className="mb-4" />
                                                <p className="font-sans text-[15px]">Your cup is empty.</p>
                                            </div>
                                        ) : (
                                            cart.map(item => (
                                                <div key={item.id} className="flex gap-4 items-center">
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-[var(--color-border)]" />
                                                    <div className="flex-1">
                                                        <h4 className="font-display font-semibold text-[15px] text-[var(--color-text-primary)]">{item.name}</h4>
                                                        <p className="font-sans text-[14px] text-[var(--color-text-secondary)]">${(item.price * item.qty).toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-1">
                                                        <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-[var(--color-accent)]"><Minus size={14} /></button>
                                                        <span className="font-sans text-[14px] font-semibold w-4 text-center">{item.qty}</span>
                                                        <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-[var(--color-accent)]"><Plus size={14} /></button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="font-sans text-[15px] font-medium text-[var(--color-text-secondary)]">Total</span>
                                            <span className="font-display text-[24px] font-bold text-[var(--color-text-primary)]">${cartTotal.toFixed(2)}</span>
                                        </div>
                                        {checkoutStatus === 'error' && (
                                            <p className="text-red-500 text-sm mb-4 text-center">Failed to process order. Check DB config.</p>
                                        )}
                                        <button
                                            onClick={handleCheckout}
                                            disabled={cart.length === 0 || checkoutStatus === 'loading'}
                                            className="w-full bg-[var(--color-accent)] text-[var(--color-text-primary)] py-4 rounded-xl font-bold font-sans text-[15px] flex justify-center items-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all"
                                        >
                                            {checkoutStatus === 'loading' ? 'Processing...' : 'Submit Order'}
                                            {checkoutStatus !== 'loading' && <ArrowRight size={18} />}
                                        </button>
                                        <p className="text-center text-[12px] text-[var(--color-text-secondary)] mt-4 font-sans uppercase tracking-wider font-semibold">Pay at the counter when ready</p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
