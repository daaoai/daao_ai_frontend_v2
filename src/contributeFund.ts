import Web3 from "web3";
import { requestAccounts } from "./utils/requestAccount";
import abi from "./abi.json"

const contractABI = abi;
const contractAddress = "0x91d21E16A91F74dF076a9cA52cc401e1898FEa62";
 
let web3: Web3 | null = null;

//Contribute to Dao
export const handleContribute = async (amount: string) => {
  web3 = new Web3((window as any).ethereum);
  try {
    
    if (!web3) {
      throw new Error("Web3 is not initialized. Call `initializeWeb3()` first.");
    }

    console.log("Connecting to the blockchain...");

    const accounts = await requestAccounts();
    if (accounts.length === 0) {
    
      throw new Error("No accounts found in MetaMask.");
    }

    const contributor = accounts[0];
    console.log("Preparing transaction for account:", contributor);

  
    const weiAmount = web3.utils.toWei(amount, "ether");
    console.log("Converting amount to wei:", weiAmount);

    const daosContract = new web3.eth.Contract(contractABI as any, contractAddress);
    console.log("Contract object created:", daosContract);

    const gasEstimate = await daosContract.methods.contribute().estimateGas({
      from: contributor,
      value: weiAmount,
    });
    console.log("Estimated Gas:", gasEstimate);

    console.log("Sending transaction...");

    const transactionResult = await web3.eth.sendTransaction({
      from: contributor,
      to: contractAddress,
      value: weiAmount,
      gas: gasEstimate,
      gasPrice: "800000",
    });

    console.log("Transaction result:", transactionResult);

    const txHash = transactionResult.transactionHash;
    console.log("Waiting for transaction to be mined. Hash:", txHash);

    let receipt = null;
    while (!receipt) {
      receipt = await (window as any).ethereum.request({
        method: "eth_getTransactionReceipt",
        params: [txHash],
      });
      if (!receipt) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("Transaction Receipt:", receipt);
    console.log("Contribution successful!");
    return receipt;
  } catch (error: any) {
    console.error("Error during contribution:", error);
    throw error;
  }
};
