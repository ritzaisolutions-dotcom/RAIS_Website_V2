interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Top ray */}
        <path d="M 50 20 L 50 35" />
        <circle cx="50" cy="15" r="4" fill="currentColor" />

        {/* Top-right ray */}
        <path d="M 65 25 L 60 30 L 57 37" />
        <circle cx="68" cy="22" r="4" fill="currentColor" />

        {/* Right ray */}
        <path d="M 80 50 L 65 50" />
        <circle cx="85" cy="50" r="4" fill="currentColor" />

        {/* Bottom-right ray */}
        <path d="M 75 65 L 70 60 L 63 57" />
        <circle cx="78" cy="68" r="4" fill="currentColor" />

        {/* Bottom ray */}
        <path d="M 50 80 L 50 65" />
        <circle cx="50" cy="85" r="4" fill="currentColor" />

        {/* Bottom-left ray */}
        <path d="M 25 75 L 30 70 L 37 63" />
        <circle cx="22" cy="78" r="4" fill="currentColor" />

        {/* Left ray */}
        <path d="M 20 50 L 35 50" />
        <circle cx="15" cy="50" r="4" fill="currentColor" />

        {/* Top-left ray */}
        <path d="M 35 25 L 40 30 L 43 37" />
        <circle cx="32" cy="22" r="4" fill="currentColor" />

        {/* Central circle */}
        <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
}
