// swap.ts
import { ethers } from "ethers";
import clPoolRouterABI from "./router.json";

// Example function to execute getSwapResult on CLPoolRouter.
// It calculates a minimumOutputAmount with ~1% slippage allowance
// and sets a 5-minute deadline from "now".
export async function swapTokens(
  routerAddress: string,
  poolAddress: string,
  zeroForOne: boolean,
  userAmount: string, // e.g. "0.1" if user enters "0.1" in a text field
  expectedOutput: number // e.g. 100000 if you fetched a quote
) {
  // 1. Connect to the user's wallet
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  // 2. Prepare contract instance
  const clPoolRouter = new ethers.Contract(routerAddress, clPoolRouterABI, signer);

  // 3. Convert input amounts to the proper format
  //    Example: parse 0.1 token with 18 decimals
  const amountSpecified = ethers.utils.parseUnits(userAmount, 18); // int256 for the swap
  //    We'll assume sqrtPriceLimitX96 is fixed for demonstration (e.g. no limit).
  const sqrtPriceLimitX96 = "1461446703485210103287273052203988822378723970341"; // ~max for Uniswap v3 style
  // 4. Derive min output with a 1% slippage buffer
  //    If the user expects 100000 output, min is 99000
  const slippageTolerance = 0.01; // 1%
  const minimumOutputAmount = Math.floor(expectedOutput * (1 - slippageTolerance)).toString(); // uint256

  // 5. Derive a 5-minute deadline
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5; // 5 min from now

  // 6. Send transaction
  const tx = await clPoolRouter.getSwapResult(
    poolAddress,
    zeroForOne,
    amountSpecified,           // int256
    sqrtPriceLimitX96,         // uint160
    minimumOutputAmount,       // uint256
    deadline                   // uint256
  );

  // 7. Wait for confirmation
  const receipt = await tx.wait();
  return receipt;
}
