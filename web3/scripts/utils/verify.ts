import hre from "hardhat";
import { WorldIdVerifier } from "../../typechain";

async function main() {
  const [user] = await hre.ethers.getSigners();
  const verifierContractAddress = process.env.VERIFIER_CONTRACT_ADDRESS;
  console.log("verifierContractAddress", verifierContractAddress);
  if (!verifierContractAddress) {
    throw new Error("VERIFIER_CONTRACT_ADDRESS is not set");
  }
  const verifier: WorldIdVerifier = await hre.ethers.getContractAt(
    "WorldIdVerifier",
    verifierContractAddress,
    user
  );
  const address = "0x33b926d2B21972464198b9c89B34fE9BA831Cb14";
  const data = {
    verification_level: "orb",
    proof:
      "0x16a1bb0aa1c78c880be8c6fcab6954678ab991fddcded72891fdbddf3c3ff15810f261ed84f692820ee2ec1157c99b448b8db760556f6a319c7e574d48e4f9b926add64505349bbc96c3191dbaa9cb12040ed8afcfba7230b82ffe7353ceb79b0a6efdf9b5d89812ceface71deae96ac14ba6280418ad6a0fa45cf5dcc3f3e851bc1cc34ec1acc6ae20554505b28b722662fa201a587dcd8cac3fd7dbee8a29f256e855e8bc004f0465cf7aa352b16bd521b47c9617bca454eb9d0e5e0d4092a2e8a14f9fc39c1ebc59590a6aeb56b68cacadb8643398b8034ed40fe6a1688a303a71efd5a01080895614ad9244659d2fd0fd8d71589db3825acabc5943e8b4c",
    nullifier_hash:
      "0x2d4899d727f45e5cd1e9b8841532b087fbc054282f24241f8e7e8766073e35c1",
    merkle_root:
      "0x12612637e15bd0feb1775e1ff174030f4b439e0c61950a2f6e1051d9773b437b",
    credential_type: "orb",
  };
  const root = hre.ethers.BigNumber.from(data.merkle_root);
  const nullifierHash = hre.ethers.BigNumber.from(data.nullifier_hash);

  const unpackedProof = hre.ethers.utils.defaultAbiCoder.decode(
    ["uint256[8]"],
    data.proof
  )[0];
  const tx = await verifier.verifyAndExecute(
    address,
    root,
    nullifierHash,
    unpackedProof
  );

  const result = await tx.wait();

  console.log("result", result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
