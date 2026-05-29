"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { CartIcon, WaveMark } from "./icons";

const NAV_LINKS = [
  { href: "#towels", label: "Towels" },
  { href: "#cloth", label: "Our Cloth" },
  { href: "#care", label: "Care" },
  { href: "#faq", label: "FAQ" },
] as const;

export function Header() {
  const { count, bumpToken, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const countRef = useRef<HTMLSpanElement | null>(null);

  // Sticky-header shadow once scrolled past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Restart the count bump animation whenever the cart changes.
  useEffect(() => {
    if (bumpToken === 0) return;
    setBump(false);
    // Force reflow so the class re-applies (mirrors the source void offsetWidth).
    if (countRef.current) void countRef.current.offsetWidth;
    setBump(true);
    const id = window.setTimeout(() => setBump(false), 280);
    return () => window.clearTimeout(id);
  }, [bumpToken]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header
        id="top"
        className={`sticky top-0 z-[60] bg-bone/80 backdrop-blur-md backdrop-saturate-150 border-b transition-[border-color,box-shadow,background] duration-300 ${
          scrolled
            ? "border-line shadow-[0_4px_24px_rgba(46,42,36,0.05)]"
            : "border-transparent"
        }`}
      >
        <div className="wrap-wide flex h-[74px] items-center justify-between gap-6">
          <a
            href="#top"
            className="flex items-center gap-2.5 font-display text-2xl font-semibold tracking-[0.01em] text-ink"
            aria-label="Saltmist home"
          >
            <WaveMark className="h-[18px] w-[30px] flex-none" />
            Saltmist
          </a>

          <nav className="hidden items-center gap-[34px] md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[15px] font-medium text-ink-70 transition-colors hover:text-ink"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-terracotta transition-[width] duration-[250ms] ease-brand group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={openCart}
              className="flex items-center gap-2.5 rounded-full border border-line bg-bone-2 px-[18px] py-2.5 text-[14.5px] font-semibold transition-[border-color,transform,box-shadow] hover:border-ink-40 hover:shadow-brand-sm max-[680px]:px-3.5"
              aria-label="Open cart"
            >
              <CartIcon className="h-[18px] w-[18px]" />
              <span className="max-[680px]:hidden">Cart</span>
              <span className="max-[680px]:hidden">(</span>
              <span
                ref={countRef}
                className={`cart-count inline-flex h-[21px] min-w-[21px] items-center justify-center rounded-full bg-terracotta px-1.5 text-xs font-bold text-white transition-transform duration-[250ms] ease-brand${
                  bump ? " bump" : ""
                }`}
              >
                {count}
              </span>
              <span className="max-[680px]:hidden">)</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-[10px] border border-line bg-bone-2 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={`h-0.5 w-[19px] rounded-sm bg-ink transition-transform duration-300 ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-[19px] rounded-sm bg-ink transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-[19px] rounded-sm bg-ink transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[74px] z-[55] flex flex-col gap-1.5 bg-bone px-6 py-8 transition-[opacity,transform] duration-[250ms] ease-brand md:hidden ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="border-b border-line-soft py-3.5 font-display text-3xl font-medium text-ink"
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
