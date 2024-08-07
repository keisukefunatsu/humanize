import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers, AddressLike } from "ethers";
const RPC_URL = process.env.RPC_URL || "";
if (!RPC_URL) {
  throw new Error("RPC_URL is not set");
}
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set");
}

const SCHEMA_ID = process.env.SCHEMA_ID || "";
if (!SCHEMA_ID) {
  throw new Error("SCHEMA_ID is not set");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const signer = wallet.connect(provider);


const EASContractAddress = process.env.EAS_CONTRACT_ADDRESS || "";
export const getDelegatedAttestation = async ({walletAddress, missionId, chain}: {walletAddress: AddressLike, missionId: string, chain: string}) => {
  const eas = new EAS(EASContractAddress);
  eas.connect(signer);
  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    "string missionId,string chainId"
  );
  const encodedData = schemaEncoder.encodeData([
    { name: "missionId", value: missionId, type: "string" },
    {
      name: "chainId",
      value: chain,
      type: "string",
    },
  ]);


  const delegated = await eas.getDelegated();
  const response = await delegated.signDelegatedAttestation(
    {
      schema: SCHEMA_ID,
      recipient: walletAddress.toString(),
      expirationTime: 0n, // Unix timestamp of when attestation expires (0 for no expiration)
      revocable: true,
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: encodedData,
      deadline: 0n, // Unix timestamp of when signature expires (0 for no expiration)
      value: 0n,
    },
    signer
  );

  const resMessage = {
    ...response.message,
    expirationTime: response.message.expirationTime.toString(),
    nonce: response.message.nonce ? response.message.nonce.toString() : "0",
  };

  return {
    message: resMessage,
    signature: response.signature,
  }
};
