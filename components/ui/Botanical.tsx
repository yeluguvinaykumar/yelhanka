import type { Accent, ProductTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

type GlyphProps = {
  theme: ProductTheme;
  className?: string;
  muted?: boolean;
};

const themeColors: Record<ProductTheme, { main: string; secondary: string; leaf: string }> = {
  strawberry: { main: "#B33245", secondary: "#E8838C", leaf: "#175C32" },
  mango: { main: "#E1A12B", secondary: "#F3CD6B", leaf: "#175C32" },
  kiwi: { main: "#7C9A45", secondary: "#B7C97B", leaf: "#4F6A2E" },
  banana: { main: "#D9B44A", secondary: "#F1DC96", leaf: "#6B7F5E" },
  okra: { main: "#5F7F45", secondary: "#93AE72", leaf: "#3A532B" },
  beet: { main: "#7C2336", secondary: "#B24A5F", leaf: "#175C32" },
  "sweet-potato": { main: "#C97A35", secondary: "#E7AE74", leaf: "#6B7F5E" },
  kale: { main: "#2F6440", secondary: "#6D9978", leaf: "#103F25" },
  berry: { main: "#7C2745", secondary: "#B55477", leaf: "#175C32" },
  pineapple: { main: "#C99A2E", secondary: "#E8C56A", leaf: "#4F6A2E" },
  powder: { main: "#B49A58", secondary: "#D9C48A", leaf: "#175C32" },
  moringa: { main: "#175C32", secondary: "#5E8F5C", leaf: "#103F25" },
  gift: { main: "#103F25", secondary: "#B49A58", leaf: "#651C2B" },
};

export function FruitGlyph({ theme, className, muted = false }: GlyphProps) {
  const c = themeColors[theme] ?? themeColors.gift;
  const main = muted ? "currentColor" : c.main;
  const secondary = muted ? "currentColor" : c.secondary;
  const leaf = muted ? "currentColor" : c.leaf;

  const common = {
    className: cn("h-full w-full", className),
    viewBox: "0 0 120 120",
    fill: "none",
    "aria-hidden": true as const,
  };

  switch (theme) {
    case "strawberry":
      return (
        <svg {...common}>
          <path
            d="M60 108c-18 0-31-11-35-26-3-11 1-20 8-24 8-5 17-4 27-4s19-1 27 4c7 4 11 13 8 24-4 15-17 26-35 26Z"
            fill={main}
          />
          <path
            d="M60 108c-18 0-31-11-35-26-3-11 1-20 8-24 8-5 17-4 27-4"
            stroke={secondary}
            strokeOpacity=".55"
            strokeWidth="2"
          />
          {[
            [48, 62], [64, 60], [56, 72], [70, 76], [44, 82], [60, 88], [72, 90], [52, 96],
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="1.7" ry="2.6" fill="#FFF3D8" opacity=".9" />
          ))}
          <path
            d="M60 54c-8-10-20-9-24-3 6 3 11 3 15 3-6 2-9 5-11 9 8 2 14-1 18-5 3 4 7 6 12 6-1-4-4-8-10-10Z"
            fill={leaf}
          />
          <path d="M59 54c0-6 1-10 4-14" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "mango":
      return (
        <svg {...common}>
          <ellipse cx="60" cy="68" rx="34" ry="38" transform="rotate(-14 60 68)" fill={main} />
          <ellipse cx="48" cy="56" rx="13" ry="20" transform="rotate(-20 48 56)" fill={secondary} opacity=".65" />
          <path d="M70 33c6-10 16-13 23-10-2 9-10 15-20 15" fill={leaf} />
          <path d="M69 36c-3-8-2-14 1-19" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "kiwi":
      return (
        <svg {...common}>
          <circle cx="60" cy="62" r="38" fill={main} />
          <circle cx="60" cy="62" r="30" fill={secondary} opacity=".55" />
          <circle cx="60" cy="62" r="19" fill="#FFFDF5" />
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            return (
              <ellipse
                key={i}
                cx={60 + Math.cos(angle) * 12}
                cy={62 + Math.sin(angle) * 12}
                rx="1.4"
                ry="2.8"
                fill="#283329"
                transform={`rotate(${(angle * 180) / Math.PI + 90} ${60 + Math.cos(angle) * 12} ${62 + Math.sin(angle) * 12})`}
              />
            );
          })}
          <path d="M82 28c4-8 11-11 18-10-2 8-8 13-16 13" fill={leaf} />
        </svg>
      );
    case "banana":
      return (
        <svg {...common}>
          <path
            d="M28 38c2 29 19 50 47 50 12 0 20-4 24-9-30 2-48-16-55-44-2-7-6-9-10-6-3 2-6 5-6 9Z"
            fill={main}
          />
          <path d="M32 38c6 25 22 41 47 43" stroke={secondary} strokeWidth="3" strokeLinecap="round" opacity=".7" />
          <path d="M26 33c-1-5 2-8 7-9" stroke={leaf} strokeWidth="5" strokeLinecap="round" />
          <path d="M98 78c3-1 5 2 4 6-1 3-4 4-7 3" stroke={leaf} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "okra":
      return (
        <svg {...common}>
          <circle cx="60" cy="62" r="36" fill={main} />
          <circle cx="60" cy="62" r="27" fill="#FFFDF5" opacity=".92" />
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            return (
              <g key={i}>
                <circle cx={60 + Math.cos(angle) * 13} cy={62 + Math.sin(angle) * 13} r="4.6" fill={secondary} />
                <circle cx={60 + Math.cos(angle) * 6} cy={62 + Math.sin(angle) * 6} r="2" fill={main} opacity=".7" />
              </g>
            );
          })}
          <circle cx="60" cy="62" r="4" fill={main} />
          <path d="M82 30c5-7 11-9 17-8-2 7-7 11-14 11" fill={leaf} />
        </svg>
      );
    case "beet":
      return (
        <svg {...common}>
          <path d="M42 48c0-6 8-10 18-10s18 4 18 10c0 5-3 7-3 13 0 13-6 35-15 35s-15-22-15-35c0-6-3-8-3-13Z" fill={main} />
          <path d="M52 58c4 10 5 22 3 34" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" opacity=".6" />
          <path d="M58 38c-8-8-8-16-4-23 6 3 9 9 8 16 5-6 11-8 17-6-1 7-6 12-13 14" fill={leaf} />
          <path d="M62 38c-1-7 0-12 3-17" stroke={leaf} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M72 80c4-2 7 0 7 4" stroke={secondary} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "sweet-potato":
      return (
        <svg {...common}>
          <ellipse cx="58" cy="64" rx="38" ry="20" transform="rotate(-24 58 64)" fill={main} />
          <ellipse cx="50" cy="56" rx="17" ry="6" transform="rotate(-24 50 56)" fill={secondary} opacity=".55" />
          <path d="M84 43c7-6 13-6 18-2-4 6-10 8-16 6" fill={leaf} />
          {[
            [42, 72], [55, 78], [66, 61], [48, 60],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.3" fill="#FFF6E4" opacity=".8" />
          ))}
        </svg>
      );
    case "kale":
      return (
        <svg {...common}>
          <path
            d="M60 104c-4-22-4-40 0-54 3-12 8-21 16-29 3 10 3 19 0 27 8-5 15-5 22-1-5 7-11 11-18 13 9 1 15 5 19 12-8 4-15 5-22 3 5 6 7 13 5 21-7-2-13-6-17-12 1 12-1 19-5 20Z"
            fill={main}
          />
          <path d="M60 101c0-24 1-44 8-64" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
          {[70, 78, 86].map((y, i) => (
            <path key={i} d={`M64 ${y}c6-4 11-4 16-1`} stroke={secondary} strokeWidth="2" strokeLinecap="round" opacity=".6" />
          ))}
        </svg>
      );
    case "berry":
      return (
        <svg {...common}>
          <circle cx="46" cy="68" r="22" fill={main} />
          <circle cx="72" cy="62" r="18" fill={secondary} />
          <circle cx="62" cy="86" r="17" fill={main} />
          <path d="M48 48c0-8 3-14 9-18M72 44c1-7 4-12 9-15" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
          <path d="M42 46c5-4 11-5 17-2-4 5-9 6-14 4M68 40c6-3 11-2 15 2-4 4-9 5-14 2" fill={leaf} />
          {[[40, 62], [51, 74], [70, 55], [79, 66], [59, 92]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.4" fill="#FFFDF5" opacity=".7" />
          ))}
        </svg>
      );
    case "pineapple":
      return (
        <svg {...common}>
          <ellipse cx="60" cy="72" rx="27" ry="34" fill={main} />
          <path d="M42 50 78 94M42 64 72 100M42 78 64 104M48 44 84 80M58 42 88 68" stroke={secondary} strokeWidth="1.6" opacity=".65" />
          <path d="M60 40c-6-12-4-22 3-29 5 6 7 14 4 22 5-6 12-8 19-5-4 8-11 12-19 12" fill={leaf} />
          <path d="M60 38c0-8 2-15 6-21" stroke={leaf} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "powder":
      return (
        <svg {...common}>
          <ellipse cx="60" cy="99" rx="34" ry="6" fill="#283329" opacity=".12" />
          <path d="M27 64h66c0 20-11 33-33 33S27 84 27 64Z" fill={main} opacity=".92" />
          <ellipse cx="60" cy="64" rx="33" ry="9" fill={secondary} />
          <path d="M48 62c1-14 5-22 12-22s11 8 12 22" fill={secondary} opacity=".85" />
          <path d="M60 38c-2-8 1-14 8-17 1 7-1 12-5 15" fill={leaf} />
          <path d="M44 76c4 5 9 7 16 7" stroke="#FFFDF5" strokeWidth="2" strokeLinecap="round" opacity=".55" />
        </svg>
      );
    case "moringa":
      return (
        <svg {...common}>
          <path d="M60 106c0-30 1-48 6-66 3-11 6-19 11-25" stroke={main} strokeWidth="3.5" strokeLinecap="round" />
          {[
            [66, 30, -40], [54, 42, 40], [70, 46, -38], [56, 58, 38], [72, 62, -38],
            [58, 74, 38], [70, 78, -38], [52, 88, 40], [64, 92, -38],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="11" ry="6" transform={`rotate(${r} ${x} ${y})`} fill={i % 2 ? secondary : main} />
          ))}
        </svg>
      );
    case "gift":
      return (
        <svg {...common}>
          <rect x="26" y="50" width="68" height="52" rx="4" fill={main} />
          <rect x="22" y="40" width="76" height="16" rx="3" fill={secondary} />
          <rect x="54" y="40" width="12" height="62" fill={secondary} opacity=".8" />
          <path d="M60 40c-6-10-16-13-21-6-4 7 4 10 21 6Zm0 0c6-10 16-13 21-6 4 7-4 10-21 6Z" fill={secondary} />
          <path d="M36 40c0-13 10-20 24-6M84 40c0-13-10-20-24-6" stroke={secondary} strokeWidth="3" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <path
        d="M39 8C24 8 12 16 11 29c0 6 4 11 10 11 14 0 20-15 18-32Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M38 10C29 19 22 28 18 39" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M33 17c-3-1-6-2-9-1M28 24c4 0 7 1 9 3M24 31c-3-1-6-1-8-1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="11" cy="40" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function GoldSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" fill="none" aria-hidden className={className}>
      <path d="M40 116C40 84 38 54 24 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 30 + i * 14;
        return (
          <g key={i}>
            <ellipse cx={24 + (i % 2 ? -10 : -2)} cy={y} rx="7" ry="3" transform={`rotate(${i % 2 ? 25 : -25} ${24 + (i % 2 ? -10 : -2)} ${y})`} stroke="currentColor" strokeWidth="0.9" />
            <ellipse cx={36 + (i % 2 ? 8 : 1)} cy={y + 6} rx="6" ry="2.6" transform={`rotate(${i % 2 ? -25 : 25} ${36 + (i % 2 ? 8 : 1)} ${y + 6})`} stroke="currentColor" strokeWidth="0.9" />
          </g>
        );
      })}
    </svg>
  );
}

export function BotanicalCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 220" fill="none" aria-hidden className={className}>
      <path d="M8 212C8 130 44 58 120 18" stroke="currentColor" strokeWidth="1" opacity=".6" />
      <path d="M20 212C26 140 58 82 128 48" stroke="currentColor" strokeWidth=".7" opacity=".4" />
      {[
        [30, 150, -30], [52, 122, -50], [80, 98, -40], [108, 76, -55],
        [42, 178, 10], [72, 146, 20], [98, 116, 5], [124, 92, -12],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="19" ry="7" transform={`rotate(${r} ${x} ${y})`} stroke="currentColor" strokeWidth=".9" opacity=".65" />
      ))}
      <circle cx="8" cy="212" r="2" fill="currentColor" opacity=".5" />
    </svg>
  );
}

export const accentStyles: Record<
  Accent,
  { body: string; spine: string; seal: string; text: string; soft: string; ring: string }
> = {
  forest: {
    body: "from-[#1d6b3a] via-[#175C32] to-[#0d331e]",
    spine: "#0b2c19",
    seal: "#B49A58",
    text: "#FFFDF5",
    soft: "bg-forest",
    ring: "ring-forest/20",
  },
  burgundy: {
    body: "from-[#7d2639] via-[#651C2B] to-[#44101c]",
    spine: "#370c15",
    seal: "#D8BE7E",
    text: "#FFFDF5",
    soft: "bg-burgundy",
    ring: "ring-burgundy/20",
  },
  gold: {
    body: "from-[#c7ac6d] via-[#B49A58] to-[#877040]",
    spine: "#6f5b32",
    seal: "#103F25",
    text: "#FFFDF5",
    soft: "bg-gold",
    ring: "ring-gold/25",
  },
  moss: {
    body: "from-[#7d916f] via-[#6B7F5E] to-[#4b5b41]",
    spine: "#3f4d36",
    seal: "#F4F0E5",
    text: "#FFFDF5",
    soft: "bg-moss",
    ring: "ring-moss/25",
  },
};
