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
export type ChainName = keyof typeof BLOCKSCOUT_CHAIN_SYMBOLS;

export class TransactionMissionChecker implements MissionChecker {
  private MISSION_ID = "transaction5";
  private TRANSACTION_COUNT_THRESHOLD = 5;
  constructor(private chain: ChainName) {}
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

    if (attestationData.attestations.length > 0 && attestationData.attestations.map(attestation => attestation.decodedDataJson).includes(this.chain)) {
      console.log("already attested.");
      return false;
    }

    const chainSymbol = BLOCKSCOUT_CHAIN_SYMBOLS[this.chain];
    const url = `https://${chainSymbol}.blockscout.com/api?module=account&action=txlist&address=${userAddress}`;
    const response = await axios.get(url);

    if (!response.data.result) {
      throw new Error("Error fetching transactions from Blockscout");
    }
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
  private MISSION_ID = "getErc721";
  private TRANSACTION_THRESHOLD = 1;
  constructor(private chain: ChainName) {}
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
    const url = `https://${chainSymbol}.blockscout.com/api?module=account&action=tokennfttx&address=${userAddress}`;
    console.log(url);
    try {
      const response = await axios.get(url);
      const txLength = response.data.result.length;
      const status = response.data.status;
      if (status === "1" && txLength >= this.TRANSACTION_THRESHOLD) {
        console.log("NFT transactions found:", txLength);
        return true;
      } else if (status === "0" || txLength === 0) {
        return false;
      } else {
        console.log(response.data);
        throw new Error("Error fetching NFT transactions from Blockscout");
      }
    } catch (error) {
      console.error("Error checking user NFT transactions:", error);
      throw error;
    }
  }
}
