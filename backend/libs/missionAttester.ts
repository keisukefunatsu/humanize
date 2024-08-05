import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
// ethers.jsライブラリをインポート
import { ethers } from "ethers";
const RPC_URL = process.env.RPC_URL || "";
if (!RPC_URL) {
  throw new Error("RPC_URL is not set");
}

// プロバイダーの設定
const provider = new ethers.JsonRpcProvider(RPC_URL);

// ウォレット情報の設定
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set");
}

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const signer = wallet.connect(provider);

export const EASContractAddress = process.env.EAS_CONTRACT_ADDRESS || "";
export const executeOnchainAttestation = async () => {
  const eas = new EAS(EASContractAddress);
  eas.connect(signer);
  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    "string first_name,address last_name"
  );
  const encodedData = schemaEncoder.encodeData([
    { name: "first_name", value: "test0e4", type: "string" },
    {
      name: "last_name",
      value: "0x33b926d2B21972464198b9c89B34fE9BA831Cb14",
      type: "address",
    },
  ]);

  const schemaUID =
    "0xacb3801c02aac77e3b02b29afc6754f889ee8bb5eb992b4d0802146cba71d2d8";

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0x33b926d2B21972464198b9c89B34fE9BA831Cb14",
        expirationTime: BigInt(0),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);

//   const delegated = await eas.getDelegated();
//   const response = await delegated.signDelegatedAttestation(
//     {
//       schema: schemaUID,
//       recipient: "0x33b926d2B21972464198b9c89B34fE9BA831Cb14",
//       expirationTime: 0n, // Unix timestamp of when attestation expires (0 for no expiration)
//       revocable: true,
//       refUID:
//         "0x0000000000000000000000000000000000000000000000000000000000000000",
//       data: encodedData,
//       deadline: 0n, // Unix timestamp of when signature expires (0 for no expiration)
//       value: 0n,
//     },
//     signer
//   );
//   console.log(response)
};
