type IconName =
  | "leaf"
  | "snowflake"
  | "spark"
  | "pouch"
  | "heart"
  | "harvest"
  | "wash"
  | "freeze"
  | "vacuum"
  | "sublimate"
  | "dry"
  | "pack"
  | "drop"
  | "seal"
  | "recycle";

export function LineIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "leaf":
      return (
        <svg {...common}>
          <path d="M39 9C24 9 12 17 11 30c0 6 4 10 10 10 14 0 20-15 18-31Z" />
          <path d="M38 11C29 20 22 29 18 40M33 18c-4-1-7-1-10 0M28 25c4 0 7 1 9 3M24 32c-3-1-6-1-8 0" />
        </svg>
      );
    case "snowflake":
      return (
        <svg {...common}>
          <path d="M24 5v38M8 14l32 20M40 14 8 34" />
          <path d="m24 10-4 5m4-5 4 5m-4 23-4-5m4 5 4-5M13 18l6-1m-6 1 1 6m22 8-6 1m6-1-1-6M13 30l6 1m-6-1 1-6m22-8-6-1m6 1-1 6" />
          <circle cx="24" cy="24" r="4" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M24 5c1.5 10 5 15 15 17-10 2-13.5 6-15 16-1.5-10-5-14-15-16 10-2 13.5-9 15-17Z" />
          <path d="M36 34c.7 3.8 2.2 5.3 6 6-3.8.7-5.3 2.2-6 6-.7-3.8-2.2-5.3-6-6 3.8-.7 5.3-2.2 6-6Z" />
        </svg>
      );
    case "pouch":
      return (
        <svg {...common}>
          <path d="M14 9h20l3 6v26a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V15l3-6Z" />
          <path d="M11 16h26M17 24h14M17 29h14M22 9v4m4-4v4" />
          <path d="M30 38h3" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M24 40S7 30 7 18c0-6 4-10 10-10 4 0 6 2 7 5 1-3 3-5 7-5 6 0 10 4 10 10 0 12-17 22-17 22Z" />
          <path d="M15 20c1-3 3-5 6-5" />
        </svg>
      );
    case "harvest":
      return (
        <svg {...common}>
          <path d="M9 39h30M12 39V22m24 17V22M9 22h30L24 10 9 22Z" />
          <path d="M18 39v-8h12v8M24 22v-6" />
        </svg>
      );
    case "wash":
      return (
        <svg {...common}>
          <path d="M10 23c4-2 7-2 11 0s7 2 11 0 5-2 6-1v12c-4 2-7 2-11 0s-7-2-11 0-5 2-6 1V23Z" />
          <path d="M24 6c4 6 7 9 7 13a7 7 0 1 1-14 0c0-4 3-7 7-13Z" />
          <path d="M20 19a4 4 0 0 0 4 4" />
        </svg>
      );
    case "freeze":
      return (
        <svg {...common}>
          <rect x="8" y="10" width="32" height="28" rx="3" />
          <path d="M20 10v28M29 10v28M8 21h32M8 29h32" />
          <path d="M24 15v3m-2-1.5 4 3m-4 0 4-3" />
        </svg>
      );
    case "vacuum":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="15" />
          <path d="M24 9v6m0 18v6M9 24h6m18 0h6M14 14l4 4m12 12 4 4m0-20-4 4M18 30l-4 4" />
          <circle cx="24" cy="24" r="4" />
        </svg>
      );
    case "sublimate":
      return (
        <svg {...common}>
          <path d="M14 37c0-7 3-9 5-13 2-3 1-8 5-8s3 5 5 8c2 4 5 6 5 13a10 10 0 0 1-20 0Z" />
          <path d="M18 14c2-3 1-5 4-7m8 7c-2-3-1-5-4-7M24 8v6" />
        </svg>
      );
    case "dry":
      return (
        <svg {...common}>
          <path d="M24 6v20M16 18l8 8 8-8" />
          <path d="M12 26c4-2 7-2 11 0s7 2 11 0 5-2 6-1v9c-4 2-7 2-11 0s-7-2-11 0-5 2-6 1v-9Z" />
        </svg>
      );
    case "pack":
      return (
        <svg {...common}>
          <path d="M8 15 24 7l16 8v18l-16 8-16-8V15Z" />
          <path d="M8 15l16 8 16-8M24 23v18M16 11l16 8" />
          <path d="M12 30l6 3" />
        </svg>
      );
    case "drop":
      return (
        <svg {...common}>
          <path d="M24 6c6 9 10 13 10 19a10 10 0 1 1-20 0c0-6 4-10 10-19Z" />
          <path d="M18 27a6 6 0 0 0 6 6" />
        </svg>
      );
    case "seal":
      return (
        <svg {...common}>
          <path d="m24 5 4.5 4 6 .5.5 6 4 4.5-4 4.5-.5 6-6 .5-4.5 4-4.5-4-6-.5-.5-6-4-4.5 4-4.5.5-6 6-.5 4.5-4Z" />
          <path d="m18 24 4 4 8-9" />
        </svg>
      );
    case "recycle":
      return (
        <svg {...common}>
          <path d="M20 10h8l4 7m-4 21H16l-4-7m0-7 4-7" />
          <path d="m16 7 4 3-3 4m19 6 3 4-5 2M10 31l-2 5 5 2" />
        </svg>
      );
    default:
      return null;
  }
}
