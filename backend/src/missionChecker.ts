import axios from "axios";
import { AddressLike } from "ethers";

interface MissionChecker {
  check(userAddress: string): Promise<boolean>;
}

const BLOCKSCOUT_CHAIN_SYMBOLS = {
  ethereum: "eth",
  polygon: "polygon",
  binance: "bsc",
  optimism: "optimism",
};

export type BlockScoutChain = keyof typeof BLOCKSCOUT_CHAIN_SYMBOLS;

export class TransactionMissionChecker implements MissionChecker {
  private TRANSACTION_COUNT_THRESHOLD = 10;
  constructor(private chain: BlockScoutChain) {}
  async check(userAddress: AddressLike): Promise<boolean> {
    const chainSymbol = BLOCKSCOUT_CHAIN_SYMBOLS[this.chain];
    const url = `https://blockscout.com/${chainSymbol}/mainnet/api?module=account&action=txlist&address=${userAddress}`;
    try {
      const response = await axios.get(url);
      const txLength = response.data.result.length;
      if (
        response.data.status === "1" &&
        txLength >= this.TRANSACTION_COUNT_THRESHOLD
      ) {
        console.log("txLength", txLength);
        // TODO: return signature of the mission attestation
        // TODO: save signature status to database
        return true;
      } else {
        throw new Error("Error fetching transactions from Blockscout");
      }
    } catch (error) {
      console.error("Error checking user transactions:", error);
      throw error;
    }
  }
}
