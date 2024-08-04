import axios from "axios";
import { AddressLike } from "ethers";

export interface DecodedValue {
  name: string;
  type: string;
  value: string;
}

export interface DecodedDataItem {
  name: string;
  type: string;
  signature: string;
  value: DecodedValue;
}

export interface Attestation {
  attester: string;
  decodedDataJson: string;
  txid: string;
  schemaId: string;
  recipient: string;
  refUID: string;
  schema: {
    creator: string;
    resolver: string;
  };
}

export interface Schema {
  id: string;
}

export interface GetAttestationsResponse {
  attestations: Attestation[];
  schema: Schema;
}

// GraphQL query
const GET_QUERY = `
  query GetAttestationsQuery(
    $where: AttestationWhereInput
    $schemaWhere2: SchemaWhereUniqueInput!
  ) {
    attestations(where: $where) {
      attester
      decodedDataJson
      txid
      schemaId
      recipient
      refUID
      schema {
        creator
        resolver
      }
    }
    schema(where: $schemaWhere2) {
      schema
    }
  }
`;

// Function to fetch attestations using axios
export const fetchAttestations = async ({
  walletAddress,
  contains,
  schema,
}: {
  walletAddress: AddressLike;
  contains?: string;
  schema: string;
}): Promise<GetAttestationsResponse> => {
  // Query variables
  const variables = {
    where: {
      decodedDataJson: {
        contains: contains ?? "",
      },
      recipient: {
        equals: walletAddress,
      },
      schemaId: {
        equals: schema,
      },
    },
    schemaWhere2: {
      id: schema,
    },
  };

  try {
    const response = await axios.post("https://sepolia.easscan.org/graphql", {
      query: GET_QUERY,
      variables: variables,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Fetched Attestations:", response.data.data);
    return response.data.data as GetAttestationsResponse;
  } catch (error) {
    console.error("Error fetching attestations:", error);
    throw error;
  }
};