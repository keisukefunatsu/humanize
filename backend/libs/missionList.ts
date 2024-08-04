import axios from "axios";
import { AddressLike } from "ethers";

interface Mission {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const BLOCKSCOUT_CHAIN_SYMBOLS = {
  ethereum: "eth",
  polygon: "polygon",
  binance: "bsc",
  optimism: "optimism",
};

export type BlockScoutChain = keyof typeof BLOCKSCOUT_CHAIN_SYMBOLS;

export class MissionList {
  constructor() {}
  async list(): Promise<Mission[]> {
    return [
      {
        id: "1",
        name: "Transaction 10",
        description: "Complete 10 transactions",
        isActive: true,
      },
      {
        id: "2",
        name: "Get ERC721 NFT",
        description: "Transfer at least 1 ERC721 NFT(Mint or Transfer)",
        isActive: true,
      },
      {
        id: "3",
        name: "First Swap at Uniswap",
        description: "Swap at least 1 token at Uniswap",
        isActive: false,
      },
      {
        id: "4",
        name: "Governance Contributor",
        description: "Vote at least 1 proposal on network governance",
        isActive: false,
      },
      {
        id: "5",
        name: "Chain EcosystemContributor",
        description: "At least 1 Github PR merged on Chain Ecosystem",
        isActive: false,
      },
    ];
  }
}
