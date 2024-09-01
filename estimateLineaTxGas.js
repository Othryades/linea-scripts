import axios from "axios";
import Web3 from "web3";

// Infura api for Linea network and api request
const infuraUrl = "https://linea-mainnet.infura.io/v3/4731db196a49411ca707e1000a7a4c46";

// tx actual addresses
const senderAddress = "0x0bb64a4E0627CF8b4ab7f95fdfd85994aD082d8C";
const receiverAddress = "0x438EBaE42bC32b70f81cA9d50adFac3A5b458C8E";

// build the req obj for linea_estimateGas
const data = {
    jsonrpc: "2.0",
    method: "linea_estimateGas",
    params: [
        {
            from: senderAddress,
            to: receiverAddress,
            value: "0x0", // No value sent in this tx
            gasPrice: "0x3938700", // 0.06 gwei in hexa
            gas: "0x21000", // Standard gas limit for a simple tx
        },
    ],
    id: 1,
};

// Function to estimate gas using linea_estimateGas
async function estimateLineaGas() {
    try {
        const response = await axios.post(infuraUrl, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("response from infura api:", response.data);

        const { baseFeePerGas, gasLimit, priorityFeePerGas } = response.data.result;

        if (baseFeePerGas && gasLimit && priorityFeePerGas) {
            const gasLimitDecimal = parseInt(gasLimit, 16);
            const baseFeeDecimal = parseInt(baseFeePerGas, 16);
            const priorityFeeDecimal = parseInt(priorityFeePerGas, 16);

            // Calculate the total gas fee
            const totalGasFee = (baseFeeDecimal + priorityFeeDecimal) * gasLimitDecimal;

            // Convert total gas fee to ETH
            const totalGasFeeInETH = Web3.utils.fromWei(totalGasFee.toString(), "ether");

            console.log(`Estimated Gas Limit: ${gasLimitDecimal} units`);
            console.log(`Base Fee per Gas: ${Web3.utils.fromWei(baseFeeDecimal.toString(), "gwei")} Gwei`);
            console.log(`Priority Fee per Gas: ${Web3.utils.fromWei(priorityFeeDecimal.toString(), "gwei")} Gwei`);
            console.log(`Estimated Transaction Cost: ${totalGasFeeInETH} ETH`);
        } else {
            console.log("Gas estimate is not available.");
        }
    } catch (error) {
        console.error(`Error estimating gas: ${error.message}`);
    }
}

estimateLineaGas();
