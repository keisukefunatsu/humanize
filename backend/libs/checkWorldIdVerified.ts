import { ethers, AddressLike } from "ethers";
import { WorldIdVerifier__factory } from "../typechain";

export const checkWorldIdVerified = async (walletAddress: AddressLike) => {
  const WORLD_VERIFIER_ADDRESS = process.env.WORLD_VERIFIER_ADDRESS || "";
  if (!WORLD_VERIFIER_ADDRESS) {
    throw new Error("WORLD_VERIFIER_ADDRESS is not set");
  }
  const RPC_URL = process.env.RPC_URL || "";
  if (!RPC_URL) {
    throw new Error("RPC_URL is not set");
  }
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const worldIdVerifier = new ethers.Contract(
    WORLD_VERIFIER_ADDRESS,
    WorldIdVerifier__factory.abi,
    provider
  );
  const result = await worldIdVerifier.getVerifiedAddress(walletAddress)
  return result
}
