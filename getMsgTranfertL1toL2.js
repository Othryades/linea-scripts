import { LineaSDK } from "@consensys/linea-sdk";
import { ethers } from "ethers"; // ether fo utility functions

// Init SDK
const sdk = new LineaSDK({
    l1RpcUrl: "https://mainnet.infura.io/v3/4731db196a49411ca707e1000a7a4c46", // L1 RPC URL
    l2RpcUrl: "https://linea-mainnet.infura.io/v3/4731db196a49411ca707e1000a7a4c46", // L2 RPC URL
    network: "linea-mainnet", // Network you want to interact with (either linea-mainnet or linea-sepolia)
    mode: "read-only", // Contract wrapper class mode
});

async function getMessageInfo(transactionHash) {
    try {
        // Get the L1 contract instance
        const l1Contract = sdk.getL1Contract();

        // Fetch msg by tx hash from L1
        const messages = await l1Contract.getMessagesByTransactionHash(transactionHash);

        console.log("Fetched messages:", messages); // cl response

        if (!messages || messages.length === 0) {
            console.error("No messages found for this tx.");
            return;
        }

        // Parse msg and log the details
        messages.forEach((message) => {
            console.log("----------------------------");
            console.log("Sender:", message.messageSender);
            console.log("Destination:", message.destination);
            console.log("Fee:", ethers.formatEther(message.fee)); // Properly format fee
            console.log("Value:", ethers.formatEther(message.value)); // Properly format value
            console.log("Message Nonce:", message.messageNonce.toString());
            console.log("Calldata:", message.calldata);
            console.log("Message Hash:", message.messageHash);
            console.log("----------------------------");
        });
    } catch (error) {
        console.error("Error fetching message information:", error);
    }
}

// tx hash to check (L1 hash!)
const transactionHash = "0x0d5f6397bfb0e0f2b80406e849849fa73f9d1c36d8bb34d870de19289133de4c";
getMessageInfo(transactionHash);
