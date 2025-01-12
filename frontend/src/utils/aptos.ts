import { AptosClient, AptosAccount, FaucetClient, TokenClient } from "aptos";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";

export const aptosClient = new AptosClient(NODE_URL);
export const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
export const tokenClient = new TokenClient(aptosClient);

export async function connectAptosWallet() {
  try {
    if (!window.aptos) {
      throw new Error("Aptos wallet not found");
    }

    await window.aptos.connect();
    const account = await window.aptos.account();
    
    return {
      address: account.address,
      publicKey: account.publicKey
    };
  } catch (error) {
    console.error("Error connecting to Aptos wallet:", error);
    return null;
  }
}

export async function executeMove(
  moduleAddress: string,
  moduleName: string,
  functionName: string,
  typeArgs: string[],
  args: any[]
) {
  try {
    if (!window.aptos) {
      throw new Error("Aptos wallet not found");
    }

    const transaction = {
      type: "entry_function_payload",
      function: `${moduleAddress}::${moduleName}::${functionName}`,
      type_arguments: typeArgs,
      arguments: args
    };

    const pendingTransaction = await window.aptos.signAndSubmitTransaction(transaction);
    return await aptosClient.waitForTransaction(pendingTransaction.hash);
  } catch (error) {
    console.error("Error executing Move function:", error);
    throw error;
  }
} 