import { useState, useEffect } from 'react';
import { connectAptosWallet } from '@/utils/aptos';

export function useAptos() {
  const [account, setAccount] = useState<{
    address: string;
    publicKey: string;
  } | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await connectAptosWallet();
      setAccount(connected);
    };

    if (window.aptos) {
      checkConnection();

      window.aptos.onAccountChange((newAccount: any) => {
        setAccount(newAccount ? {
          address: newAccount.address,
          publicKey: newAccount.publicKey
        } : null);
      });
    }
  }, []);

  return account;
} 