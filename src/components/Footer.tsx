import { FacebookIcon, InstagramIcon, TikTokIcon, WaveMark } from "./icons";

const SHOP_LINKS = [
  { href: "#towels", label: "Bath Towel" },
  { href: "#towels", label: "Bath Sheet" },
  { href: "#towels", label: "Hand Towel" },
  { href: "#towels", label: "Face Cloth" },
  { href: "#towels", label: "The Bundle" },
] as const;

const LEARN_LINKS = [
  { href: "#cloth", label: "Our Cloth" },
  { href: "#care", label: "Care Guide" },
  { href: "#faq", label: "FAQ" },
  { href: "#faq", label: "Shipping & Returns" },
] as const;

const SOCIALS = [
  { href: "#", label: "Saltmist on Facebook", Icon: FacebookIcon },
  { href: "#", label: "Saltmist on Instagram", Icon: InstagramIcon },
  { href: "#", label: "Saltmist on TikTok", Icon: TikTokIcon },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-kelp pb-9 pt-[72px] text-bone">
      <div className="wrap-wide">
        <div className="mb-12 grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 max-[980px]:grid-cols-2 max-[680px]:grid-cols-1 max-[680px]:gap-7">
          <div>
            <a
              href="#top"
              className="mb-4 flex items-center gap-2.5 font-display text-2xl font-semibold text-bone"
              aria-label="Saltmist home"
            >
              <WaveMark className="h-[18px] w-[30px] flex-none" />
              Saltmist
            </a>
            <p className="max-w-[280px] text-[14.5px] text-bone/60">
              Plush, quick-drying bath towels made with bamboo viscose and
              cotton. Softness, settled.
            </p>
            <div className="mt-[22px] flex gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/20 text-bone transition-[background,border-color,transform] hover:-translate-y-0.5 hover:border-terracotta hover:bg-terracotta"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Shop">
            <h5 className="m-0 mb-[18px] font-sans text-[13px] font-bold uppercase tracking-[0.1em] text-bone/50">
              Shop
            </h5>
            {SHOP_LINKS.map((link, i) => (
              <a
                key={`${link.label}-${i}`}
                href={link.href}
                className="block py-1.5 text-[14.5px] text-bone/[0.78] transition-colors hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav aria-label="Learn">
            <h5 className="m-0 mb-[18px] font-sans text-[13px] font-bold uppercase tracking-[0.1em] text-bone/50">
              Learn
            </h5>
            {LEARN_LINKS.map((link, i) => (
              <a
                key={`${link.label}-${i}`}
                href={link.href}
                className="block py-1.5 text-[14.5px] text-bone/[0.78] transition-colors hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav aria-label="Contact">
            <h5 className="m-0 mb-[18px] font-sans text-[13px] font-bold uppercase tracking-[0.1em] text-bone/50">
              Contact
            </h5>
            <a
              href="mailto:hello@saltmist.com.au"
              className="block py-1.5 text-[14.5px] text-bone/[0.78] transition-colors hover:text-bone"
            >
              hello@saltmist.com.au
            </a>
            <a
              href="#signup"
              className="block py-1.5 text-[14.5px] text-bone/[0.78] transition-colors hover:text-bone"
            >
              Newsletter
            </a>
            <a
              href="#"
              className="block py-1.5 text-[14.5px] text-bone/[0.78] transition-colors hover:text-bone"
            >
              Stockists
            </a>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-[18px] border-t border-bone/15 pt-[26px]">
          <p className="m-0 text-[13px] text-bone/55">
            © {year} Saltmist. All rights reserved.
          </p>
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-bone/80">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            Designed in Australia · Made in Thailand
          </span>
          <p className="m-0 text-[13px] text-bone/55">
            70% bamboo viscose, 30% cotton · 650 GSM · Wash cold, no softener.
          </p>
        </div>
      </div>
    </footer>
  );
}
