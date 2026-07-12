interface ClaudeCodeLogoProps {
  className?: string;
}

export function ClaudeCodeLogo({ className = "h-8 w-8" }: ClaudeCodeLogoProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="2" width="10" height="6" fill="#D27D5F" />
      <rect x="5" y="3" width="2" height="3" fill="#f5f0eb" />
      <rect x="9" y="3" width="2" height="3" fill="#f5f0eb" />
      <rect x="1" y="5" width="3" height="2" fill="#D27D5F" />
      <rect x="12" y="5" width="3" height="2" fill="#D27D5F" />
      <rect x="3" y="8" width="10" height="2" fill="#D27D5F" />
      <rect x="4" y="10" width="2" height="3" fill="#D27D5F" />
      <rect x="7" y="10" width="2" height="3" fill="#D27D5F" />
      <rect x="10" y="10" width="2" height="3" fill="#D27D5F" />
    </svg>
  );
}
