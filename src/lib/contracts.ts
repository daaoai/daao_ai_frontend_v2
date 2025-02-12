import { getContract as viemGetContract } from 'viem'

export const getContract = ({
    address,
    abi,
    publicClient
}: {
    address: `0x${string}`
    abi: any
    publicClient: any
}) => {
    return viemGetContract({
        address,
        abi,
        client: { public: publicClient }
    })
}
