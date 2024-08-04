import { AddressLike } from "ethers";
import { DecodedDataItem, fetchAttestations } from "./attestationList";

interface Mission {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  completed: boolean;
}

const BLOCKSCOUT_CHAIN_SYMBOLS = {
  ethereum: "eth",
  polygon: "polygon",
  binance: "bsc",
  optimism: "optimism",
};

export type BlockScoutChain = keyof typeof BLOCKSCOUT_CHAIN_SYMBOLS;

// TODO: persist data in database
export class MissionList {
  constructor() {}
  async all(userAddress: AddressLike, schemaId: string): Promise<Mission[]> {
    const attestationData = await fetchAttestations({
      walletAddress: userAddress,
      schema: schemaId,
    });
    if (!attestationData.schema) {
      console.log("schema not found");
      return []
    }

    const missions = [
      {
        id: "transaction10",
        name: "Transaction 10",
        description: "Complete 10 transactions",
        isActive: true,
        completed: false,
      },
      {
        id: "getErc721",
        name: "Get ERC721 NFT",
        description: "Transfer at least 1 ERC721 NFT(Mint or Transfer)",
        isActive: true,
        completed: false,
      },
      {
        id: "uniswapFirstSwap",
        name: "First Swap at Uniswap",
        description: "Swap at least 1 token at Uniswap",
        isActive: false,
        completed: false,
      },
      {
        id: "governanceContributor",
        name: "Governance Contributor",
        description: "Vote at least 1 proposal on network governance",
        isActive: false,
        completed: false,
      },
      {
        id: "chainEcosystemContributor",
        name: "Chain EcosystemContributor",
        description: "At least 1 Github PR merged on Chain Ecosystem",
        isActive: false,
        completed: false,
      },
    ];

    const attestations = attestationData.attestations;

    attestations.forEach((attestation) => {
      const decodeData = JSON.parse(
        attestation.decodedDataJson
      ) as DecodedDataItem[]
      const decoded = decodeData.reduce((accm, item) => {
        return {...accm, [item.value.name]: item.value.value}
      }, {}) 
          const mission = missions.find(
            (mission) => mission.id === decoded.name
          );
          if (mission) {
            mission.completed = true;
          }
      
    });

    return missions;
  }
}
