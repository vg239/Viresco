export const FinancePortfolioABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "mintCarbonCredits",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
  // Add other contract functions as needed
];

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"; 