import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY?.trim();
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY?.trim();

const pinataAxios = axios.create({
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_API_KEY
  }
});

async function uploadImageToIPFS() {
  try {
    // Convert image to base64
    const imageResponse = await fetch('/src/NFT/Carbon_credits.webp');
    const blob = await imageResponse.blob();
    
    // Create form data
    const formData = new FormData();
    formData.append('file', blob, 'carbon_credits.webp');

    const response = await pinataAxios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data;`,
        },
        maxBodyLength: Infinity
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    return response.data.IpfsHash;
  } catch (error: any) {
    console.error('Error uploading image:', error.response?.data || error);
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function uploadToIPFS(data: any, name: string) {
  try {
    // Verify Pinata credentials
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error('Pinata credentials not configured');
    }

    // Upload image first
    const imageHash = await uploadImageToIPFS();
    console.log('Image uploaded to IPFS:', imageHash);

    // Calculate total portfolio value
    const totalValue = Object.values(data).reduce((acc: number, section: any) => {
      if (Array.isArray(section)) {
        return acc + section.reduce((sum: number, item: any) => {
          if (item.price_bought_at && item.quantity) {
            return sum + (item.price_bought_at * item.quantity);
          }
          if (item.investment_amount) {
            return sum + item.investment_amount;
          }
          return sum;
        }, 0);
      }
      return acc;
    }, 0);

    // Prepare metadata
    const metadata = {
      name: `Carbon Credits - ${name}`,
      description: "Carbon Credits NFT from Viresco Finance",
      image: `ipfs://${imageHash}`,
      external_url: `https://gateway.pinata.cloud/ipfs/${imageHash}`,
      attributes: [
        {
          trait_type: "Portfolio Owner",
          value: name
        },
        {
          trait_type: "Total Value",
          value: `₹${totalValue.toLocaleString()}`
        },
        {
          trait_type: "Asset Count",
          value: data.Stocks.length + data.Mutual_funds.length + data.Fixed_deposits.length + data.Crypto.length
        },
        {
          trait_type: "Risk Tolerance",
          value: data.Investment_profile.risk_tolerance
        },
        {
          display_type: "date",
          trait_type: "Created",
          value: Math.floor(Date.now() / 1000)
        }
      ],
      properties: {
        portfolio_data: data,
        timestamp: new Date().toISOString()
      }
    };

    console.log("Uploading metadata to IPFS:", metadata);

    const response = await pinataAxios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to upload metadata: ${response.statusText}`);
    }

    const metadataHash = response.data.IpfsHash;
    console.log('Metadata uploaded to IPFS:', metadataHash);
    return metadataHash;
  } catch (error: any) {
    console.error('Error uploading to IPFS:', error.response?.data || error);
    throw new Error(error.response?.data?.message || error.message);
  }
} 