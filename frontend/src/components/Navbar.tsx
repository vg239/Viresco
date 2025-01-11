"use client";

import { useEffect } from "react";
import { HomeIcon, BookOpenIcon, LineChartIcon, NewspaperIcon, WalletIcon, HeartIcon, BarChart3Icon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAnonAadhaar, LogInWithAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
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
  { path: '/portfolio', icon: BarChart3Icon, label: 'Portfolio' },
  { path: '/watchlist', icon: HeartIcon, label: 'Watchlist' },
  { path: '#', icon: WalletIcon, label: 'Connect Wallet', onClick: () => toast.info("Wallet connection coming soon!") },
];

export function Navbar() {
  const location = useLocation();
  const [anonAadhaar] = useAnonAadhaar();

  // useEffect(() => {
  //   if (anonAadhaar?.status !== "logged-in") {
  //     toast.info("Please log in with Anon Aadhaar to access all features");
  //   }
  // }, [anonAadhaar?.status]);

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="w-48" />

          <TooltipProvider>
            <Dock className="relative !bg-transparent shadow-none ml-[+260px]">
              {navItems.map((item) => (
                <DockIcon key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {item.onClick ? (
                        <button
                          onClick={item.onClick}
                          aria-label={item.label}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                            "hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
                            "text-gray-600"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </button>
                      ) : (
                        <Link
                          to={item.path}
                          aria-label={item.label}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                            "hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
                            location.pathname === item.path 
                              ? "text-blue-600" 
                              : "text-gray-600"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </Link>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              ))}
            </Dock>
          </TooltipProvider>

          <div className="flex items-center gap-4 w-48 justify-end">
            <div className="h-4 w-auto ml-auto mr-[-100px]">
              <LogInWithAnonAadhaar 
                nullifierSeed={1234} 
                fieldsToReveal={["revealAgeAbove18"]} 
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
