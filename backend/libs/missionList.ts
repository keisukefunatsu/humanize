import { AddressLike } from "ethers";
import { DecodedDataItem, fetchAttestations } from "./attestationList";
import { ChainName } from "./missionChecker";

interface Mission {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  completed: boolean;
  uid?: string;
}


// TODO: persist data in database
export class MissionList {
  constructor() {}
  async all(userAddress: AddressLike, chain: ChainName): Promise<Mission[]> {
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
        id: "getNft",
        name: "Get NFT",
        description: "At least 1 NFT Transaction",
        isActive: true,
        completed: false,
      },
      {
        id: "ENSName",
        name: "ENS Name",
        description: "Have at least 1 ENS Name",
        isActive: true,
        completed: false,
      },
      {
        id: "gasConsumer",
        name: "Gas Consumer",
        description: "Consumed at least 1000000 wei of gas.",
        isActive: true,
        completed: false,
      },
      {
        id: "chainEcosystemContributor",
        name: "Chain Ecosystem \n Contributor(Free for testing)",
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
      
      const mission = missions.find(
        (mission) => mission.id === decoded.missionId && decoded.chainId === chain
      );
      
      if (mission) {
        mission.completed = true;
        mission.uid = attestation.id;
      }
    });

    return missions;
  }
}
