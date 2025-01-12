"use client";

import { useState, useEffect } from "react";
import { HomeIcon, BookOpenIcon, LineChartIcon, NewspaperIcon, WalletIcon, HeartIcon, BarChart3Icon, PhoneIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAnonAadhaar, LogInWithAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/ui/dock";
import { connectWallet } from "@/utils/web3";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { callAPI } from '@/lib/api';

export function Navbar() {
  const location = useLocation();
  const [anonAadhaar] = useAnonAadhaar();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (err) {
          console.error('Error checking wallet:', err);
        }
      }
    };

    checkWallet();
  }, []);

  // Listen for wallet changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', function (accounts: string[]) {
        setWalletAddress(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', function () {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const handleWalletConnect = async () => {
    try {
      const walletData = await connectWallet();
      if (walletData?.address) {
        setWalletAddress(walletData.address);
        const shortAddress = `${walletData.address.slice(0, 6)}...${walletData.address.slice(-4)}`;
        toast.success(`Connected: ${shortAddress}`);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/learning', icon: BookOpenIcon, label: 'Learning' },
    { path: '/recommendation', icon: LineChartIcon, label: 'Recommendation' },
    { path: '/news', icon: NewspaperIcon, label: 'News' },
    { path: '/portfolio', icon: BarChart3Icon, label: 'Portfolio' },
    { 
      path: '#', 
      icon: PhoneIcon, 
      label: 'Start Call',
      onClick: async () => {
        try {
          await callAPI.startCall();
          toast.success('Call started successfully!');
        } catch (error) {
          toast.error('Failed to start call');
          console.error('Error starting call:', error);
        }
      }
    },
    { 
      path: '#', 
      icon: WalletIcon, 
      label: walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet',
      onClick: handleWalletConnect 
    },
  ];

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
