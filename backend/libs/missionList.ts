import { AddressLike } from "ethers";
import { DecodedDataItem, fetchAttestations } from "./attestationList";

interface Mission {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  completed: boolean;
  uid?: string;
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
  async all(userAddress: AddressLike): Promise<Mission[]> {
    const SCHEMA_ID = process.env.SCHEMA_ID || "";
    if (!SCHEMA_ID) {
      throw new Error("SCHEMA_ID is not set");
    }

    const missions: Mission[] = [
      {
        id: "transaction5",
        name: "Complete 5 Transactions",
        description: "Complete 5 transactions",
        isActive: true,
        completed: false,
      },
      {
        id: "getErc721",
        name: "Get ERC721 NFT(Dummy, anyone can attest)",
        description: "Transfer at least 1 ERC721 NFT(Mint or Transfer)",
        isActive: true,
        completed: false,
      },
      {
        id: "uniswapFirstSwap",
        name: "First Swap at Uniswap(Dummy, anyone can attest)",
        description: "Swap at least 1 token at Uniswap",
        isActive: true,
        completed: false,
      },
      {
        id: "governanceContributor",
        name: "Governance Contributor(Dummy)",
        description: "Vote at least 1 proposal on network governance",
        isActive: true,
        completed: false,
      },
      {
        id: "chainEcosystemContributor",
        name: "Chain EcosystemContributor(Dummy, anyone can attest)",
        description: "At least 1 Github PR merged on Chain Ecosystem",
        isActive: true,
        completed: false,
      },
    ];

    const attestationData = await fetchAttestations({
      walletAddress: userAddress,
      schema: SCHEMA_ID,
    });
    if (!attestationData.schema) {
      throw new Error("schema not found");
    }

    const attestations = attestationData.attestations;

    attestations.forEach((attestation) => {
      const decodeData = JSON.parse(
        attestation.decodedDataJson
      ) as DecodedDataItem[];
      const decoded = decodeData.reduce((accm, item) => {
        return { ...accm, [item.value.name]: item.value.value };
      }, {}) as { missionId: string; chainId: string };
      console.log(decoded);
      const mission = missions.find(
        (mission) => mission.id === decoded.missionId
      );
      if (mission) {
        mission.completed = true;
        mission.uid = attestation.id;
      }
    });

    return missions;
  }
}
