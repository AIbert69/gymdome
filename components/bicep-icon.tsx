import type { SVGProps } from "react";

export function BicepIcon({
  className,
  strokeWidth = 2.25,
  ...props
}: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 15c2 .5 4 .5 6-.5" />
      <path d="M3 11c1 1.5 3 2.5 6 2.5" />
      <path d="M9 13.5c1.6 2.4 3.4 3.8 6.5 3.8 3.5 0 5.5-2 5.5-5 0-2.5-2-4.3-4.5-4.3-1.6 0-2.8.6-3.7 1.6" />
      <path d="M12.8 9.6c.6-.4 1.4-.6 2.2-.6 2 0 3 1.2 3 2.6 0 1.4-1 2.4-2.5 2.4" />
    </svg>
  );
}
