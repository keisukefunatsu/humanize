import { AddressLike } from "ethers";
import { gql, GraphQLClient } from "graphql-request";

export interface attestationSchema {
    
}
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

const graphQLClient = new GraphQLClient("https://sepolia.easscan.org/graphql", {
  headers: {
    "Content-Type": "application/json",
  },
});

// GraphQL query
const GET_QUERY = gql`
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

// Function to fetch attestations
export const fetchAttestations = async ({
  walletAddress,
  contains,
  schema,
}: {
  walletAddress: AddressLike;
  contains?: string;
  schema: string;
}) => {
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
    const response = await graphQLClient.request<GetAttestationsResponse>(
      GET_QUERY,
      variables
    );
    console.log("Fetched Attestations:", response);
    return response;
  } catch (error) {
    console.error("Error fetching attestations:", error);
    throw error;
  }
};
