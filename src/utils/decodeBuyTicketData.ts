import { createPublicClient, decodeEventLog, Hex, http, PublicClient } from 'viem'
import { TICKETS } from '@/abi/tickets'
import { mode } from 'viem/chains'

// Define the type for the minted data.
export interface MintedData {
  from: Hex
  to: Hex
  tokenId: any
}

export async function decodeBuyTicketTx(
  txHash: Hex,
): Promise<MintedData | null> {

  const publicClient = createPublicClient({
    chain: mode,
    transport: http() // replace with your RPC URL if needed
  })
  try {
    // Fetch the transaction receipt.
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash })

    // Loop through each log in the receipt.
    for (const log of receipt.logs) {
      try {
        // Attempt to decode the log using the TICKETS ABI.
        const decoded = decodeEventLog({
          abi: TICKETS,
          data: log.data,
          topics: log.topics,
        })

        // Ensure decoded.args is an object and has the properties "from", "to", and "tokenId".
        if (
          decoded.eventName === 'Transfer' &&
          decoded.args &&
          typeof decoded.args === 'object' &&
          'from' in decoded.args &&
          'to' in decoded.args &&
          'tokenId' in decoded.args
        ) {
          // Cast args to the expected shape.
          const args = decoded.args as {
            from: string
            to: string
            tokenId: Hex
          }
          console.log({decoded})

          // Check if this Transfer event is a mint (i.e. "from" is the zero address).
          if (args.from === '0x0000000000000000000000000000000000000000') {
            return {
              from: args.from as  Hex,
              to: args.to as Hex,
              tokenId: args.tokenId,
            }
          }
        }
      } catch {
        // Ignore logs that do not decode with the TICKETS ABI.
        continue
      }
    }
  } catch (error) {
    console.error('Error decoding buy ticket tx:', error)
  }
  return null
}