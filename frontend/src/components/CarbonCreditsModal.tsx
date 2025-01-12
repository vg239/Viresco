import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
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
    signature?: string;
  } | null>(null);

  const handleMint = async () => {
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

      // Step 3: Get MetaMask signature
      try {
        const message = `Signing Carbon Credits NFT with IPFS hash: ${ipfsHash}`;
        const signature = await walletData.signer.signMessage(message);
        
        // Set the minted NFT state with IPFS hash and signature
        setMintedNFT({
          hash: ipfsHash,
          imageUrl: `/src/NFT/Carbon_credits.webp`,
          signature
        });

        console.log("Signature:", signature);
      } catch (error) {
        console.error("Error getting signature:", error);
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
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Carbon Credits NFT</h2>
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
                      {mintedNFT.signature && (
                        <p className="text-sm text-gray-600 break-all mt-2">
                          Signature: {mintedNFT.signature.slice(0, 30)}...
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${mintedNFT.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-center"
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
                        Upload your portfolio data to IPFS and sign with MetaMask.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleMint}
                        disabled={minting}
                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {minting ? (
                          <>
                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Upload & Sign'
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

      {/* Success Notification */}
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
                <p className="font-medium text-gray-800">Portfolio Data</p>
                <p className="text-gray-500 text-xs">Successfully uploaded & signed!</p>
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