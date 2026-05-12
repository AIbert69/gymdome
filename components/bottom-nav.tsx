"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TabDumbbellIcon,
  TabProgressIcon,
  TabAppleIcon,
  TabUserIcon,
} from "@/components/gym-icons";
import { cn } from "@/lib/utils";

type Tab = {
  href: string;
  label: string;
  icon: (props: { size?: number; color?: string; active?: boolean }) => React.ReactNode;
};

const tabs: Tab[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (p) => <TabDumbbellIcon {...p} />,
  },
  {
    href: "/workouts",
    label: "Workouts",
    icon: (p) => <TabDumbbellIcon {...p} />,
  },
  {
    href: "/progress",
    label: "Progress",
    icon: (p) => <TabProgressIcon {...p} />,
  },
  {
    href: "/nutrition",
    label: "Nutrition",
    icon: (p) => <TabAppleIcon {...p} />,
  },
  { href: "/profile", label: "Profile", icon: (p) => <TabUserIcon {...p} /> },
];

// Routes where the bottom nav should be hidden — focused flows where the
// CTA needs the full bottom of the screen and the user shouldn't tab away.
const HIDE_NAV_PREFIXES = ["/workouts/new", "/login"];

export function BottomNav() {
  const pathname = usePathname();

  if (HIDE_NAV_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 pt-2 pb-7"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 35%)",
      }}
    >
      <div className="mx-auto max-w-[480px] grid grid-cols-5 px-2">
        {tabs.map(({ href, label, icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");
          const color = active ? "#FF1F2D" : "#7A7A7A";
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={cn(
                "relative flex min-h-[44px] flex-col items-center justify-center gap-1 pt-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              {icon({ size: 22, color, active })}
              <span
                className={cn(
                  "text-[11px]",
                  active ? "font-bold" : "font-medium"
                )}
                style={{ color }}
              >
                {label}
              </span>
              {active && (
                <span className="absolute -bottom-1 h-[2.5px] w-[18px] rounded-[2px] bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
