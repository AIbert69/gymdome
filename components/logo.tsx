import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Gym Dome"
      width={1478}
      height={1064}
      priority
      sizes="120px"
      className={`h-16 w-auto ${className}`}
    />
  );
}
