import type { SVGProps } from "react";

/**
 * Inline icon set ported from the source markup. Each icon inherits colour via
 * currentColor and is decorative by default (aria-hidden). Pass aria-label and
 * remove aria-hidden at the call site if an icon needs to be announced.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/**
 * PLACEHOLDER ZYNZYA brand mark — a geometric "tribal symbol" woven-diamond
 * emblem in the brand triad (bamboo green / marigold / scarlet). This is a
 * stand-in: the client will supply their own tribal symbol. To swap it, replace
 * the SVG body below (and the matching favicon data-URI in app/layout.tsx). See
 * README → "Logo / brand mark (placeholder)". Kept a fixed three-colour mark so
 * it reads on both the cream header and the deep-forest footer.
 */
export function TribalMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 36" aria-hidden="true" {...props}>
      {/* Outer woven diamond */}
      <path
        d="M20 2l16 16-16 16L4 18z"
        fill="none"
        stroke="#1FA85C"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* Chevron weave */}
      <path
        d="M9 18l11-11 11 11M9 22l11 11 11-11"
        fill="none"
        stroke="#1FA85C"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.55"
      />
      {/* Inner marigold lozenge */}
      <path d="M20 9l8 9-8 9-8-9z" fill="#F4B81E" />
      {/* Scarlet centre node */}
      <circle cx="20" cy="18" r="3" fill="#DC3A2C" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M9 7a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.7" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M5 12l4 4 10-10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 12l3 3 5-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function QuickDryIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 3v4M12 21v-2M4 8l3 2M20 8l-3 2M5 16l3-1M19 16l-3-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 3l2.3 4.7 5.2.8-3.8 3.6.9 5.1L12 14.9 7.4 17.2l.9-5.1L4.5 8.5l5.2-.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M3 14l2-6h10l3 4h3v4h-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function HandFeelIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M5 12c3-5 11-5 14 0-3 5-11 5-14 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function DropIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 3c3 4 5 6 5 9a5 5 0 1 1-10 0c0-3 2-5 5-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </Icon>
  );
}

export function LinesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function WashColdIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="14" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 7h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Icon>
  );
}

export function TumbleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
    </Icon>
  );
}

export function NoSoftenerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M5 17l4-9 3 5 2-3 5 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Icon>
  );
}

export function NoBleachIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M7 4h10v4l-5 4v6m0-6L7 8V4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Icon>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 8.5V7c0-.8.2-1.3 1.4-1.3H17V3h-2.4C11.9 3 11 4.4 11 6.6v1.9H9V11h2v10h3v-10h2.2l.3-2.5H14Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </Icon>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M15 3c.3 2 1.6 3.5 3.6 3.8v2.5c-1.3 0-2.5-.4-3.6-1v5.6a5.3 5.3 0 1 1-5.3-5.3c.3 0 .6 0 .9.1v2.7a2.6 2.6 0 1 0 1.8 2.5V3H15Z" />
    </svg>
  );
}

export function EmptyCartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9 7a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}
