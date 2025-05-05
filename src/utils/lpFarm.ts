import { Hex, encodeAbiParameters, parseAbiParameters } from 'viem';

// For a single incentive
export const encodeSingleIncentive = (incentiveKey: {
  rewardToken: Hex;
  pool: Hex;
  startTime: bigint;
  endTime: bigint;
  refundee: Hex;
}): Hex => {
  return encodeAbiParameters(
    parseAbiParameters('(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)'),
    [incentiveKey],
  );
};
