"use client";

import { HomeIcon, BookOpenIcon, LineChartIcon, NewspaperIcon, WalletIcon, HeartIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAnonAadhaar, LogInWithAnonAadhaar } from "@anon-aadhaar/react";
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/ui/dock";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { path: '/', icon: HomeIcon, label: 'Dashboard' },
  { path: '/learning', icon: BookOpenIcon, label: 'Learning' },
  { path: '/recommendation', icon: LineChartIcon, label: 'Recommendation' },
  { path: '/news', icon: NewspaperIcon, label: 'News' },
  { path: '/portfolio', icon: WalletIcon, label: 'Portfolio' },
  { path: '/watchlist', icon: HeartIcon, label: 'Watchlist' },
];

export function Navbar() {
  const location = useLocation();
  const [anonAadhaar] = useAnonAadhaar();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="w-32" />

          <TooltipProvider>
            <Dock className="relative !bg-transparent shadow-none">
              {navItems.map((item) => (
                <DockIcon key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        aria-label={item.label}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                          location.pathname === item.path 
                            ? "text-blue-600" 
                            : "text-gray-600"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              ))}
            </Dock>
          </TooltipProvider>

          <div className="flex items-center gap-2 w-32 justify-end">
            <ShimmerButton variant="compact">
              Wallet
            </ShimmerButton>
            <div className="h-9 flex items-center">
              <LogInWithAnonAadhaar 
                nullifierSeed={1234} 
                fieldsToReveal={["revealAgeAbove18"]}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
