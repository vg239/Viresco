import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { FinancePortfolioABI, CONTRACT_ADDRESS } from '../contracts/FinancePortfolio';
import { uploadToIPFS } from '../utils/pinata';
import { connectWallet } from '../utils/web3';

interface CarbonCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioData?: any;
}

export function CarbonCreditsModal({ isOpen, onClose, portfolioData }: CarbonCreditsModalProps) {
  const [minting, setMinting] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<{
    hash: string;
    imageUrl: string;
  } | null>(null);

  const mintNFT = async () => {
    try {
      setMinting(true);

      // Step 1: Connect wallet
      const walletData = await connectWallet();
      if (!walletData?.signer) {
        console.error("No signer available");
        return;
      }

      // Step 2: Upload to IPFS
      let ipfsHash;
      try {
        ipfsHash = await uploadToIPFS(portfolioData, portfolioData?.name || "Anonymous");
        console.log("Portfolio data uploaded to IPFS:", ipfsHash);
      } catch (error) {
        console.error("Failed to upload to IPFS:", error);
        return;
      }

      // Step 3: Mint NFT
      try {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          FinancePortfolioABI,
          walletData.signer
        );

        const gasEstimate = await contract.estimateGas.mintCarbonCredits(ipfsHash);
        const tx = await contract.mintCarbonCredits(ipfsHash, {
          gasLimit: gasEstimate.mul(120).div(100)
        });
        
        const receipt = await tx.wait();
        
        // Only set mintedNFT if both IPFS upload and minting succeed
        setMintedNFT({
          hash: ipfsHash,
          imageUrl: `/src/NFT/Carbon_credits.webp`
        });

        // Add NFT to MetaMask
        if (window.ethereum) {
          try {
            await window.ethereum.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC721',
                options: {
                  address: CONTRACT_ADDRESS,
                  tokenId: receipt.events[0].args.tokenId.toString(),
                  image: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
                },
              },
            });
          } catch (error) {
            console.error("Error adding NFT to wallet:", error);
          }
        }
      } catch (error) {
        console.error("Minting failed:", error);
      }
    } catch (error) {
      console.error("Error in mint process:", error);
    } finally {
      setMinting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {mintedNFT ? 'NFT Minted Successfully!' : 'Redeem Carbon Credits'}
                </h3>

                {mintedNFT ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <img 
                        src={mintedNFT.imageUrl}
                        alt="Carbon Credits NFT" 
                        className="w-full h-64 object-cover rounded-xl mb-4"
                      />
                      <p className="text-sm text-gray-600 break-all">
                        IPFS Hash: {mintedNFT.hash}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${mintedNFT.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        View on IPFS
                      </a>
                      <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <img 
                        src="/src/NFT/Carbon_credits.webp"
                        alt="Carbon Credits NFT Preview" 
                        className="w-full h-64 object-cover rounded-xl mb-4"
                      />
                      <p className="text-gray-600">
                        Mint your Carbon Credits NFT to showcase your contribution to environmental sustainability.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={mintNFT}
                        disabled={minting}
                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {minting ? (
                          <>
                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                            Minting...
                          </>
                        ) : (
                          'Mint NFT'
                        )}
                      </button>
                      <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating NFT Preview */}
      <AnimatePresence>
        {mintedNFT && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3">
              <img
                src="/src/NFT/Carbon_credits.webp"
                alt="Carbon Credits NFT"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-800">Carbon Credits NFT</p>
                <p className="text-gray-500 text-xs">Successfully minted!</p>
              </div>
              <button
                onClick={() => setMintedNFT(null)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 