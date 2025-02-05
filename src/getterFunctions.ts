import { ethers } from "ethers";
import contractABI from "./abi.json";

const CONTRACT_ADDRESS = "0xb728B1fB0779AAd53359a7472845b2e1a1A2e2B2"; ``
const TIER_LABELS = ["None", "Platinum", "Gold", "Silver"];
export const getContractData = async () => {
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

  //   const start = await contract.getStartDate();        
  const end = (await contract.fundraisingDeadline());
  const fundraisingGoal = (await contract.fundraisingGoal()).toString();
  const totalRaised = (await contract.totalRaised()).toString();
  const goalReached = (await contract.goalReached());
  const finalisedFundraising = (await contract.fundraisingFinalized());
  const userTiers = await contract.getWhitelistInfo(userAddress);
  const userTierLabel = TIER_LABELS[userTiers.tier];
  console.log("userTiers is ", goalReached, finalisedFundraising)

  console.log("userTiers is ", userTierLabel)


  console.log("end is ", end.toString())
  console.log("fundraisingGoal is ", fundraisingGoal)
  console.log("totalRaised is ", totalRaised)


  const endDate = new Date(end.toNumber() * 1000);
  console.log("endDate is ", endDate)

  // 6. Return all data in an object
  return {
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

