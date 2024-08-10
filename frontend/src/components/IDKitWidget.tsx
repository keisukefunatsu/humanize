import React, { useState } from "react";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
import {
  WORLD_APP_ID,
  WORLD_APP_ACTION_ID,
  isAppKey,
  WORLD_VERIFIER_ADDRESS,
} from "../constants";
import {
  useContractRead,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { WorldIdVerifier__factory } from "../typechain/factories/contracts/WorldIdVerifier__factory";
import {
  Address,
  decodeAbiParameters,
  hexToBigInt,
  parseAbiParameters,
} from "viem";
import ModalComponent from "./Modal"; // Import the ModalComponent

export function SignInWithWorldID({
  walletAddress,
}: {
  walletAddress: string;
}) {
  const [proof, setProof] = useState<ISuccessResult | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  if (!isAppKey(WORLD_APP_ID)) {
    throw new Error('REACT_APP_WORLD_APP_ID must start with "app_"');
  }
  if (!WORLD_APP_ACTION_ID) {
    throw new Error("REACT_APP_WORLD_APP_ACTION_ID is required");
  }
  if (!WORLD_VERIFIER_ADDRESS) {
    throw new Error("REACT_APP_WORLD_VERIFIER_ADDRESS is required");
  }

  const { data: verified } = useContractRead({
    address: WORLD_VERIFIER_ADDRESS as Address,
    abi: WorldIdVerifier__factory.abi,
    functionName: "verifiedAddress",
    args: [walletAddress as Address],
  });

  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const onSuccess = (result: ISuccessResult) => {
    setProof(result);
  };

  const handleVerify = async (proof: ISuccessResult) => {
    return;
  };

  const prove = async () => {
    if (proof) {
      setModalTitle("Transaction in Progress");
      setModalMessage("Your verification is being processed...");
      setModalIsOpen(true); // Open the modal when starting the transaction

      const root = hexToBigInt(proof.merkle_root as `0x${string}`);
      const nullifierHash = hexToBigInt(proof.nullifier_hash as `0x${string}`);

      const unpackedProof = decodeAbiParameters(
        parseAbiParameters("uint256[8]"),
        proof.proof as `0x${string}`
      )[0];
      try {
        await writeContractAsync({
          address: WORLD_VERIFIER_ADDRESS as Address,
          abi: WorldIdVerifier__factory.abi,
          functionName: "verifyAndExecute",
          args: [walletAddress as Address, root, nullifierHash, unpackedProof],
        });

        setModalTitle("Success");
        setModalMessage("Verification completed successfully.");
      } catch (error) {
        setModalTitle("Error");
        setModalMessage(
          "Verification failed. Please check network. Please also check onchain verification is allowed only once."
        );
      }
    }
  };

  return (
    <>
      <IDKitWidget
        app_id={WORLD_APP_ID}
        action={WORLD_APP_ACTION_ID}
        onSuccess={onSuccess}
        handleVerify={handleVerify}
        verification_level={VerificationLevel.Orb}
        signal={walletAddress}
      >
        {({ open }) => (
          <button
            className={`border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300 hidden md:block ${
              isPending || isConfirming ? "cursor-not-allowed opacity-50" : ""
            } ${verified ? "bg-blue-500 text-white" : "bg-white border"}`}
            onClick={proof ? prove : open}
            disabled={isPending || isConfirming || verified}
          >
            <div className="mx-3 my-1">
              {verified
                ? "World ID Verified"
                : proof
                ? "Verify Onchain"
                : "Verify Human with World ID"}
            </div>
          </button>
        )}
      </IDKitWidget>

      {/* Modal Component */}
      <ModalComponent
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </>
  );
}
