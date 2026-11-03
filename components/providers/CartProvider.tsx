"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type { CartItem, Product } from "@/lib/types";

type AddPayload = Omit<CartItem, "key" | "qty">;

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  hydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, packIndex: number, qty?: number) => void;
  addCustom: (payload: AddPayload, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  notify: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "tt-cart-v1";

function itemKey(productId: string, packLabel: string) {
  return `${productId}::${packLabel}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item) => item && item.key && item.qty > 0));
        }
      }
    } catch {
      // Corrupt storage is ignored and replaced on the next write.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        setItems(JSON.parse(event.newValue) as CartItem[]);
      } catch {
        // Ignore malformed values from other tabs.
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const notify = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const addCustom = useCallback(
    (payload: AddPayload, qty = 1) => {
      const key = itemKey(payload.productId, payload.packLabel);
      setItems((current) => {
        const existing = current.find((item) => item.key === key);
        if (existing) {
          return current.map((item) =>
            item.key === key ? { ...item, qty: Math.min(item.qty + qty, 99) } : item,
          );
        }
        return [...current, { ...payload, key, qty }];
      });
      notify(`${payload.name} added to your cart`);
    },
    [notify],
  );

  const addItem = useCallback(
    (product: Product, packIndex: number, qty = 1) => {
      const pack = product.packs[packIndex] ?? product.packs[0];
      if (!pack) return;
      addCustom(
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          packLabel: pack.label,
          grams: pack.grams,
          price: pack.price,
          accent: product.accent,
          theme: product.theme,
          image: product.image,
        },
        qty,
      );
    },
    [addCustom],
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((current) =>
      qty <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) => (item.key === key ? { ...item, qty: Math.min(qty, 99) } : item)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((total, item) => total + item.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.qty, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      hydrated,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      addCustom,
      updateQty,
      removeItem,
      clearCart,
      notify,
    }),
    [items, count, subtotal, isOpen, hydrated, addItem, addCustom, updateQty, removeItem, clearCart, notify],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 z-[90] w-[min(92vw,420px)] -translate-x-1/2"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3 rounded-full border border-gold/30 bg-forest px-5 py-3.5 text-ivory shadow-lift">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                <Check className="h-4 w-4" strokeWidth={2} />
              </span>
              <p className="text-[13px] leading-snug tracking-wide">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
