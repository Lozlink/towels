"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { ColourwayId } from "@/lib/colourways";
import { getProduct } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

/** A cart line is keyed by product id + colourway, matching the source. */
export interface CartLine {
  readonly key: string;
  readonly productId: string;
  readonly colour: ColourwayId;
  readonly qty: number;
}

type CartState = Record<string, CartLine>;

type CartAction =
  | { type: "add"; productId: string; colour: ColourwayId }
  | { type: "changeQty"; key: string; delta: number }
  | { type: "remove"; key: string };

function lineKey(productId: string, colour: ColourwayId): string {
  return `${productId}|${colour}`;
}

/** Returns a new state object with `key` removed (avoids unused-binding lint). */
function removeKey(state: CartState, key: string): CartState {
  const next: CartState = {};
  for (const k of Object.keys(state)) {
    if (k !== key) {
      const line = state[k];
      if (line) next[k] = line;
    }
  }
  return next;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.productId, action.colour);
      const existing = state[key];
      return {
        ...state,
        [key]: existing
          ? { ...existing, qty: existing.qty + 1 }
          : { key, productId: action.productId, colour: action.colour, qty: 1 },
      };
    }
    case "changeQty": {
      const existing = state[action.key];
      if (!existing) return state;
      const qty = existing.qty + action.delta;
      if (qty <= 0) {
        return removeKey(state, action.key);
      }
      return { ...state, [action.key]: { ...existing, qty } };
    }
    case "remove": {
      if (!state[action.key]) return state;
      return removeKey(state, action.key);
    }
    default:
      return state;
  }
}

export interface CartContextValue {
  readonly lines: readonly CartLine[];
  readonly count: number;
  readonly subtotal: number;
  readonly isOpen: boolean;
  readonly freeShippingThreshold: number;
  readonly hasFreeShipping: boolean;
  readonly remainingForFreeShipping: number;
  /** Bumps each time count increases — drives the header count animation. */
  readonly bumpToken: number;
  add: (productId: string, colour: ColourwayId) => void;
  changeQty: (key: string, delta: number) => void;
  remove: (key: string) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {} as CartState);
  const [isOpen, setIsOpen] = useState(false);
  const [bumpToken, setBumpToken] = useState(0);

  const lines = useMemo(() => Object.values(state), [state]);

  const { count, subtotal } = useMemo(() => {
    return lines.reduce(
      (acc, line) => {
        const product = getProduct(line.productId);
        if (!product) return acc;
        return {
          count: acc.count + line.qty,
          subtotal: acc.subtotal + product.price * line.qty,
        };
      },
      { count: 0, subtotal: 0 },
    );
  }, [lines]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const add = useCallback((productId: string, colour: ColourwayId) => {
    dispatch({ type: "add", productId, colour });
    setBumpToken((t) => t + 1);
    setIsOpen(true);
  }, []);

  const changeQty = useCallback((key: string, delta: number) => {
    dispatch({ type: "changeQty", key, delta });
    setBumpToken((t) => t + 1);
  }, []);

  const remove = useCallback((key: string) => {
    dispatch({ type: "remove", key });
    setBumpToken((t) => t + 1);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    return {
      lines,
      count,
      subtotal,
      isOpen,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      hasFreeShipping,
      remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      bumpToken,
      add,
      changeQty,
      remove,
      openCart,
      closeCart,
    };
  }, [
    lines,
    count,
    subtotal,
    isOpen,
    bumpToken,
    add,
    changeQty,
    remove,
    openCart,
    closeCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
