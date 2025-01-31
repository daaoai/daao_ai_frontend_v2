import { ethers } from "ethers";
import contractABI from "./abi.json";

const CONTRACT_ADDRESS = "0x91d21E16A91F74dF076a9cA52cc401e1898FEa62"; ``
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
  const userTiers = parseInt(await contract.userTiers(userAddress));
  const userTierLabel = TIER_LABELS[userTiers];
  console.log("userTiers is ", userTierLabel)


  console.log("end is ", end)
  console.log("fundraisingGoal is ", fundraisingGoal)
  console.log("totalRaised is ", totalRaised)


  const endDate = new Date(end.toNumber());

  // 6. Return all data in an object
  return {
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

  const userTiers = parseInt(await contract.userTiers(userAddress));
  const userTierLabel = TIER_LABELS[userTiers];
  console.log("userTiers is ", userTierLabel)

  return {
    userTierLabel
  };
};

