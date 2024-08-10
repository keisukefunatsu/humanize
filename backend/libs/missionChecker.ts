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

    if (
      attestationData.attestations.length > 0 &&
      attestationData.attestations
        .map((attestation) => attestation.decodedDataJson)
        .includes(this.chain)
    ) {
      console.log("already attested.");
      return false;
    }

    const chainSymbol = BLOCKSCOUT_CHAIN_SYMBOLS[this.chain];
    // https://optimism.blockscout.com/api/v2/addresses/0x33b926d2B21972464198b9c89B34fE9BA831Cb14/counters
    const url = `https://${chainSymbol}.blockscout.com/api/v2/addresses/${userAddress}/counters`;
    const response = await axios.get(url);
    console.log(response.data);
    if (!response.data) {
      throw new Error("Error fetching transactions from Blockscout");
    }
    const transactionCount = response.data.transactions_count;
    if (transactionCount >= this.TRANSACTION_COUNT_THRESHOLD) {
      // TODO: return signature of the mission attestation
      return true;
    } else {
      return false;
    }
  }
}


export class GasConsumerMissionChecker implements MissionChecker {
  private MISSION_ID = "gasConsumer";
  private THRESHOLD = 1000000;
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

    if (
      attestationData.attestations.length > 0 &&
      attestationData.attestations
        .map((attestation) => attestation.decodedDataJson)
        .includes(this.chain)
    ) {
      console.log("already attested.");
      return false;
    }

    const chainSymbol = BLOCKSCOUT_CHAIN_SYMBOLS[this.chain];
    // https://optimism.blockscout.com/api/v2/addresses/0x33b926d2B21972464198b9c89B34fE9BA831Cb14/counters
    const url = `https://${chainSymbol}.blockscout.com/api/v2/addresses/${userAddress}/counters`;
    const response = await axios.get(url);
    console.log(response.data);
    if (!response.data) {
      throw new Error("Error fetching transactions from Blockscout");
    }
    const gasUsageCount = response.data.gas_usage_count;
    if (Number(gasUsageCount) >= this.THRESHOLD) {
      return true;
    } else {
      return false;
    }
  }
}

export class GetNftMissionChecker implements MissionChecker {
  private MISSION_ID = "getNft";
  private THRESHOLD = 1;
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
    const url = `https://${chainSymbol}.blockscout.com/api/v2/addresses/${userAddress}/nft?type=ERC-721%2CERC-404%2CERC-1155`;
    try {
      const response = await axios.get(url);

      if (!response.data.items) {
        throw new Error("Error fetching transactions from Blockscout");
      }
      const items = response.data.items;
      if (items.length >= this.THRESHOLD) {
        console.log("NFT transactions found:", items.length);
        return true;
      } else if (items.length === 0) {
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

export class GetENSMissionChecker implements MissionChecker {
  private MISSION_ID = "ENSName";
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
    // https://optimism.blockscout.com/api/v2/addresses/0xAadb9Ed84FE0812B87Ca98341AeF5599B47eA60F
    const url = `https://${chainSymbol}.blockscout.com/api/v2/addresses/${userAddress}`;
    try {
      const response = await axios.get(url);
      console.log(response.data);
      const data = response.data;
      if (data.ens_domain_name) {
        console.log("ENS Name found:", data.ens_domain_name);
        return true;
      } else {
        console.log("No ENS Name found", response.data);
        return false;
      }
    } catch (error) {
      console.error("Error checking user NFT transactions:", error);
      throw error;
    }
  }
}
