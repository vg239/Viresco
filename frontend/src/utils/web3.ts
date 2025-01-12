import { ethers } from 'ethers';

const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;

export const NETWORK_CONFIGS = {
  amoy: {
    chainId: '0x13882',
    chainName: 'Polygon Amoy Testnet',
    nativeCurrency: {
      name: 'POL',
      symbol: 'POL',
      decimals: 18
    },
    rpcUrls: [`https://polygon-amoy.infura.io/v3/${INFURA_API_KEY}`],
    blockExplorerUrls: ['https://www.oklink.com/amoy']
  },
  sepolia: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: [`https://sepolia.infura.io/v3/${INFURA_API_KEY}`],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }
};

// Create default providers
const defaultProviders = {
  amoy: new ethers.providers.JsonRpcProvider(NETWORK_CONFIGS.amoy.rpcUrls[0]),
  sepolia: new ethers.providers.JsonRpcProvider(NETWORK_CONFIGS.sepolia.rpcUrls[0])
};

export async function connectWallet() {
  if (!window.ethereum) {
    return {
      address: null,
      provider: defaultProviders.sepolia,
      signer: null
    };
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    // Try networks in order: Amoy, then Sepolia
    for (const network of ['amoy', 'sepolia']) {
      try {
        const config = NETWORK_CONFIGS[network];
        
        // Try switching to network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: config.chainId }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [config]
            });
          } else {
            continue; // Try next network
          }
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Test connection
        await provider.getBlockNumber();
        
        return {
          address: accounts[0],
          provider,
          signer,
          network
        };
      } catch (error) {
        console.error(`Failed to connect to ${network}:`, error);
        continue; // Try next network
      }
    }

    // If all networks fail, return Sepolia provider
    return {
      address: null,
      provider: defaultProviders.sepolia,
      signer: null,
      network: 'sepolia'
    };

  } catch (error) {
    console.error('Wallet connection error:', error);
    return {
      address: null,
      provider: defaultProviders.sepolia,
      signer: null,
      network: 'sepolia'
    };
  }
}

export function subscribeToAccountChanges(callback: (accounts: string[]) => void) {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
  }
}

export function subscribeToChainChanges(callback: (chainId: string) => void) {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
}

