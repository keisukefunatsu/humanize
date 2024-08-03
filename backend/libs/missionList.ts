import axios from "axios";
import { AddressLike } from "ethers";

interface Mission {
  id: string;
  chain: BlockScoutChain;
  address: AddressLike;
  status: "completed" | "in_progress" | "not_started";
  signature: string;
}

interface MissionList {
  list(userAddress: string): Promise<Mission[]>;
}

const BLOCKSCOUT_CHAIN_SYMBOLS = {
  ethereum: "eth",
  polygon: "polygon",
  binance: "bsc",
  optimism: "optimism",
};

export type BlockScoutChain = keyof typeof BLOCKSCOUT_CHAIN_SYMBOLS;

export class TransactionMissionChecker implements MissionList {
  constructor(private chain: BlockScoutChain) {}
  async list(userAddress: string): Promise<Mission[]> {
    console.log('b')
    return [];
  }
}
