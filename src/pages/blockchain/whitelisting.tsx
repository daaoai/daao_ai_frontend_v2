import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { requestAccounts } from "./requestAccount";
import { sign } from "crypto";

const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_fundraisingGoal",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_symbol",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_fundraisingDeadline",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_fundExpiry",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_daoManager",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_liquidityLockerFactory",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_maxWhitelistAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_protocolAdmin",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_maxPublicContributionAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "AddWhitelist",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "contributor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Contribution",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "name": "FundraisingFinalized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "contributor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Refund",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "RemoveWhitelist",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "POSITION_MANAGER",
        "outputs": [
            {
                "internalType": "contract INonfungiblePositionManager",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "SUPPLY_TO_FUNDRAISERS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "SUPPLY_TO_LP",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "UNISWAP_V3_FACTORY",
        "outputs": [
            {
                "internalType": "contract IUniswapV3Factory",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "UNI_V3_FEE",
        "outputs": [
            {
                "internalType": "uint24",
                "name": "",
                "type": "uint24"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WETH",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "addresses",
                "type": "address[]"
            }
        ],
        "name": "addToWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contribute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "contributions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "contributors",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "daoToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyEscape",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "contracts",
                "type": "address[]"
            },
            {
                "internalType": "bytes[]",
                "name": "data",
                "type": "bytes[]"
            },
            {
                "internalType": "uint256[]",
                "name": "msgValues",
                "type": "uint256[]"
            }
        ],
        "name": "execute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newFundExpiry",
                "type": "uint256"
            }
        ],
        "name": "extendFundExpiry",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newFundraisingDeadline",
                "type": "uint256"
            }
        ],
        "name": "extendFundraisingDeadline",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "int24",
                "name": "initialTick",
                "type": "int24"
            },
            {
                "internalType": "int24",
                "name": "upperTick",
                "type": "int24"
            },
            {
                "internalType": "bytes32",
                "name": "salt",
                "type": "bytes32"
            }
        ],
        "name": "finalizeFundraising",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fundExpiry",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fundraisingDeadline",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fundraisingFinalized",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fundraisingGoal",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWhitelistLength",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "goalReached",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "liquidityLocker",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "liquidityLockerFactory",
        "outputs": [
            {
                "internalType": "contract ILockerFactory",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lpFeesCut",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxPublicContributionAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxWhitelistAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "onERC721Received",
        "outputs": [
            {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "protocolAdmin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "refund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "removedAddress",
                "type": "address"
            }
        ],
        "name": "removeFromWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_maxPublicContributionAmount",
                "type": "uint256"
            }
        ],
        "name": "setMaxPublicContributionAmount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_maxWhitelistAmount",
                "type": "uint256"
            }
        ],
        "name": "setMaxWhitelistAmount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalRaised",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "whitelist",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "whitelistArray",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];
const contractAddress = "0xAa90e743bADc66A05EdA2E37181baf8f9970F351";

const AddToWhitelist: React.FC = () => {
    const [addresses, setAddresses] = useState<string[]>([""]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>("");
    const [web3, setWeb3] = useState<Web3 | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            setWeb3(new Web3(window.ethereum));
        } else {
            setStatus("MetaMask not detected. Please install MetaMask.");
        }
    }, []);

    // Function to call `addToWhitelist`
    const handleAddToWhitelist = async () => {
        try {
            if (!web3) {
                throw new Error("Web3 is not initialized.");
            }

            setLoading(true);
            setStatus("Connecting to the blockchain...");
            const accounts = await requestAccounts();
            if (accounts.length === 0) {
                throw new Error("No accounts found.");
            }

            const daosContract = new web3.eth.Contract(contractABI, contractAddress);

            console.log("contracts is ", daosContract);
            const gasEstimate = await daosContract.methods.addToWhitelist(addresses).estimateGas({ from: accounts[0] });
            console.log("Gas estimation is:", gasEstimate);

            const transactionParameters = {
                from: accounts[0],
                to: contractAddress,
                data: daosContract.methods.addToWhitelist(addresses).encodeABI(),
                gas: String(gasEstimate),
                gasPrice: '800000',
            };
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

            setStatus("Addresses successfully added to the whitelist!");
            setAddresses([""]);
        } catch (error: any) {
            console.error("Error adding to whitelist:", error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Add a new address input field
    const addAddressField = () => {
        setAddresses([...addresses, ""]);
    };

    // Handle change in address fields
    const handleAddressChange = (index: number, value: string) => {
        const updatedAddresses = [...addresses];
        updatedAddresses[index] = value;
        setAddresses(updatedAddresses);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Add Addresses to Whitelist</h2>
            <p>Enter the addresses below and click "Add to Whitelist".</p>

            {addresses.map((address, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => handleAddressChange(index, e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>
            ))}

            <button
                onClick={addAddressField}
                style={{
                    marginBottom: "20px",
                    padding: "10px 20px",
                    borderRadius: "4px",
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Add Another Address
            </button>

            <button
                onClick={handleAddToWhitelist}
                disabled={loading || addresses.some((addr) => addr.trim() === "")}
                style={{
                    display: "block",
                    width: "100%",
                    padding: "15px",
                    borderRadius: "4px",
                    background: loading ? "#ccc" : "#28a745",
                    color: "#fff",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Processing..." : "Add to Whitelist"}
            </button>

            {status && (
                <p
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        borderRadius: "4px",
                        background: status.includes("Error") ? "#f8d7da" : "#d4edda",
                        color: status.includes("Error") ? "#721c24" : "#155724",
                    }}
                >
                    {status}
                </p>
            )}
        </div>
    );
};

export default AddToWhitelist;
