import axios from "axios";
import useGetMissions from "../hooks/useGetMissions";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { JsonRpcSigner } from "ethers";

type Signature = {
  r: string;
  s: string;
  v: number;
};
type AttestationMessage = {
  message: {
    attester: string;
    data: string;
    expirationTime: string;
    nonce: string;
    recipient: string;
    refUID: string;
    revocable: boolean;
    schema: string;
  };
  signature: Signature;
};

function Missions({ signer }: { signer: JsonRpcSigner }) {
  const { data: missions, isLoading, error, refetch } = useGetMissions(signer.address);
  const EASContractAddress = process.env.REACT_APP_EAS_CONTRACT_ADDRESS || "";
  if (!EASContractAddress) {
    throw new Error("EASContractAddress is not set");
  }
  const eas = new EAS(EASContractAddress);
  eas.connect(signer);
  const getAttestationSignature = async (chain: string, missionId: string) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("REACT_APP_BACKEND_URL is not set");
    }
    try {
      const response = await axios.post(`${backendUrl}/api/missionCheck`, {
        walletAddress: signer.address,
        chain,
        missionId,
      });
      const { message, signature } = response.data as AttestationMessage;
      console.log("message", message);
      console.log("signature", signature);
      const transaction = await eas.attestByDelegation({
        schema: message.schema,
        data: {
          recipient: message.recipient,
          expirationTime: message.expirationTime
            ? BigInt(message.expirationTime)
            : BigInt(0), // Unix timestamp of when attestation expires (0 for no expiration),
          revocable: message.revocable,
          refUID: message.refUID,
          data: message.data,
        },
        signature: signature,
        attester: message.attester,
        deadline: BigInt(0), // Unix timestamp of when signature expires (0 for no expiration)
      });
      const receipt = await transaction.wait();
      refetch();
      console.log(receipt);

      return transaction; // Return the data received from the API
    } catch (error) {
      console.error("Error posting mission data:", error);
      
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error getting missions: {error.message}</div>;
  return (
    <div>
      <div>
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions?.map((mission) => {
              return (
                <div
                  key={mission.id}
                  className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl"
                >
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-blue-600">
                      {mission.id}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {mission.name}
                    </h3>
                    <p className="mt-3 text-gray-500">{mission.description}</p>
                    <a
                      className="text-blue-500"
                      href={
                        mission.uid
                          ? `https://optimism.easscan.org/attestation/view/${mission.uid}`
                          : ""
                      }
                    >
                      {mission.uid ? "View Attestation" : ""}
                    </a>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <button
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      disabled={!mission.isActive || mission.completed}
                      onClick={() =>
                        getAttestationSignature("optimism", mission.id)
                      }
                    >
                      {!mission.completed
                        ? "Check condition &  Claim"
                        : "Completed"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Missions;
