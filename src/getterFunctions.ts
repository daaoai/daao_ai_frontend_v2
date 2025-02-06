import { ethers } from "ethers";
import contractABI from "./abi.json";
import Web3 from "web3";

let web3: Web3 | null = null;

const CONTRACT_ADDRESS = "0x29F07AA75328194C274223F11cffAa329fD1c319"; ``
const TIER_LABELS = ["None", "Platinum", "Gold", "Silver"];

export const getContractData = async () => {
  if (!window.ethereum) {
    throw new Error("No Ethereum provider found.");
  }
  if (!web3) {
    web3 = new Web3(window.ethereum);
  }

  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  console.log("Provider object created:", provider);
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      throw new Error("No connected accounts found. Please connect your wallet.");
    }

  const userAddress = accounts[0];

  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
  console.log("Contract object created:", contract);

  //   const start = await contract.getStartDate();        
  const end = (await contract.fundraisingDeadline());
  const fundraisingGoal = (await contract.fundraisingGoal()).toString();
  const totalRaised = (await contract.totalRaised()).toString();
  const goalReached = (await contract.goalReached());
  const finalisedFundraising = (await contract.fundraisingFinalized());
  const daoToken = (await contract.daoToken());
  const veloFactory = (await contract.VELODROME_FACTORY());
  const iswhitelistedData = (await contract.getWhitelistInfo(userAddress));
  const iswhitelisted = iswhitelistedData.isActive
  console.log("iswhitelisted is ", iswhitelisted)

  const userTiers = await contract.getWhitelistInfo(userAddress);
  const tierNumber = userTiers.tier;
  const maxLimit = Number((await contract.tierLimits(tierNumber)).toString())/10**18;

  const userTierLabel = TIER_LABELS[tierNumber];
  console.log("userTiers is ", goalReached, finalisedFundraising)

  console.log("userTiers is ", userTierLabel)


  console.log("end is ", end.toString())
  console.log("fundraisingGoal is ", fundraisingGoal)
  console.log("totalRaised is ", totalRaised)


  const endDate = new Date(end.toNumber() * 1000);
  console.log("endDate is ", endDate)

  // 6. Return all data in an object
  return {
    maxLimit,
    tierNumber,
    iswhitelisted,
    veloFactory,
    daoToken,
    goalReached,
    finalisedFundraising,
    endDate,
    fundraisingGoal,
    totalRaised,
    userTierLabel
  };
};

export const getTier = async () => {
  if (!(window as any).ethereum) {
    throw new Error("Ethereum wallet provider not found. Please install MetaMask.");
  }


  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  console.log("Provider object created:", provider);

  const signer = provider.getSigner();
  console.log("Signer object created:", signer);
  const userAddress = await signer.getAddress();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
  console.log("Contract object created:", contract);

  const userTiers = await contract.getWhitelistInfo(userAddress);
  const userTierLabel = TIER_LABELS[userTiers.tier];
  console.log("userTiers is ", userTierLabel)

  return {
    userTierLabel
  };
};

