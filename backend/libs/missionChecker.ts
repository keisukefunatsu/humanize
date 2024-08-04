import axios from "axios";
import { AddressLike } from "ethers";
import { fetchAttestations } from "./attestationList";

interface MissionChecker {
  check(userAddress: string, schemaId: string): Promise<boolean>;
}

const BLOCKSCOUT_CHAIN_SYMBOLS = {
  ethereum: "eth",
  polygon: "polygon",
  base: "base",
  optimism: "optimism",
  zksync: "zksync",
  sepolia: "eth-sepolia",
};

export type BlockScoutChain = keyof typeof BLOCKSCOUT_CHAIN_SYMBOLS;

export class TransactionMissionChecker implements MissionChecker {
  private MISSION_ID = "transaction10";
  private TRANSACTION_COUNT_THRESHOLD = 10;
  constructor(private chain: BlockScoutChain) {}
  async check(userAddress: AddressLike, schemaId: string): Promise<boolean> {
    const attestationData = await fetchAttestations({
      walletAddress: userAddress,
      schema: schemaId,
      contains: this.MISSION_ID,
    });

    if (!attestationData.schema) {
      console.log("schema not found");
      return false;
    }

    if (attestationData.attestations.length > 0) {
      console.log("already attested.");
      return false;
    }

    const chainSymbol = BLOCKSCOUT_CHAIN_SYMBOLS[this.chain];
    const url = `https://${chainSymbol}.blockscout.com/api?module=account&action=txlist&address=${userAddress}`;
    const response = await axios.get(url);
    const txLength = response.data.result.length;
    const status = response.data.status;
    if (status === "1" && txLength >= this.TRANSACTION_COUNT_THRESHOLD) {
      // TODO: return signature of the mission attestation
      return true;
    } else if (
      (status === "1" && txLength < this.TRANSACTION_COUNT_THRESHOLD) ||
      status === "0" ||
      txLength === 0
    ) {
      return false;
    } else {
      throw new Error("Error fetching transactions from Blockscout");
    }
  }
}

export class GetERC721MissionChecker implements MissionChecker {
  private MISSION_ID = "2";
  private TRANSACTION_THRESHOLD = 10;
  constructor(private chain: BlockScoutChain) {}
  async check(userAddress: AddressLike): Promise<boolean> {
    return true;
    // const chainSymbol = BLOCKSCOUT_CHAIN_SYMBOLS[this.chain];
    // const url = `https://blockscout.com/${chainSymbol}/mainnet/api?module=account&action=txlist&address=${userAddress}`;
    // try {
    //   const response = await axios.get(url);
    //   const txLength = response.data.result.length;
    //   const status = response.data.status;
    //   if (
    //     status === "1" &&
    //     txLength >= this.TRANSACTION_COUNT_THRESHOLD
    //   ) {
    //     console.log("txLength", txLength);
    //     // TODO: return signature of the mission attestation
    //     // TODO: save signature status to database
    //     return true;
    //   } else if (status === "0" || txLength === 0) {
    //     return false;
    //   } else {
    //     console.log(response.data);
    //     throw new Error("Error fetching transactions from Blockscout");
    //   }
    // } catch (error) {
    //   console.error("Error checking user transactions:", error);
    //   throw error;
    // }
  }
}
