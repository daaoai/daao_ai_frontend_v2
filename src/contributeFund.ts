import Web3 from "web3";
import { requestAccounts } from "./utils/requestAccount";
import abi from "./abi.json"
import ercAbi from "./erc20Abi.json"
import { parseAbi } from 'viem'
import { useAccount, useReadContracts } from 'wagmi'


const contractABI = abi;
const contractAddress = "0x29F07AA75328194C274223F11cffAa329fD1c319";
const tokenAddress = "0xDfc7C877a950e49D2610114102175A06C2e3167a"; 
 
let web3: Web3 | null = null;

//Contribute to Dao
export const handleContribute = async (amount: string) => {
  if (!window.ethereum) {
    throw new Error("No Ethereum provider found.");
  }
  if (!web3) {
    web3 = new Web3(window.ethereum);
  }

  try {
    
    console.log("Connecting to the blockchain...");

    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      throw new Error("No connected accounts found. Please connect your wallet.");
    }

    const contributor = accounts[0];
    console.log("Preparing transaction for account:", contributor);

    const weiAmount = web3.utils.toWei(amount.toString(), "ether");
    console.log("Converting amount to wei:", weiAmount);

    const daosContract = new web3.eth.Contract(contractABI as any, contractAddress);
    console.log("Contract object created:", daosContract);

    const tokenContract = new web3.eth.Contract(ercAbi as any, tokenAddress);

    const currentAllowanceRaw = await tokenContract.methods.allowance(contributor, contractAddress).call();
 
   
    const currentAllowance = BigInt(
      typeof currentAllowanceRaw === "string" && currentAllowanceRaw !== ""
        ? currentAllowanceRaw
        : "0"
    );
    

    if (BigInt(currentAllowance) < BigInt(weiAmount)) {
      console.log("Approving token spend...");
      const approveTx = {
        from: contributor,
        to: tokenAddress,
        data: tokenContract.methods.approve(contractAddress, weiAmount).encodeABI(),
        gas: "50000", // Adjust gas limit accordingly
      };
      const approveTxHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [approveTx],
      });
      console.log("Waiting for approval transaction to be mined...");
      let approvalReceipt = null;
      while (approvalReceipt === null) {
        approvalReceipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [approveTxHash],
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      console.log("Approval Successful!", approvalReceipt);
    } else {
      console.log("Approval already sufficient, skipping...");
    }

    const gasEstimate = await daosContract.methods.contribute(parseInt(weiAmount)).estimateGas({
      from: contributor,
    });
    console.log("Estimated Gas:", gasEstimate);

    console.log("Sending transaction...");
    const transactionParameters = {
      from: accounts[0],
      to: contractAddress,
      data: daosContract.methods.contribute(parseInt(weiAmount)).encodeABI(),
      gas: String(gasEstimate),
      gasPrice: '800000',
  };
   
    console.log("Transaction result:", transactionParameters);

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
  })
    let receipt = null;
    while (receipt === null) {
      receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
      });
      console.log(receipt);
      console.log("Waiting for transaction to be mined...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

  }
    console.log("Transaction Receipt:", receipt);
    console.log("Contribution successful!");
    return receipt;
  } catch (error: any) {
    console.error("Error during contribution:", error);
    throw error;
  }
};
