import { useEthersSigner } from "./libs/ethers";
import { useEffect, useState } from "react";
import Missions from "./components/Missions";
import Layout from "./layout";

function Home() {
  const signer = useEthersSigner();
  const [activeChain, setActiveChain] = useState("optimism");

  const handleChainChange = (chain: string) => {
    setActiveChain(chain);
  };

  useEffect(() => {}, [signer]);

  return (
    <Layout onChainChange={handleChainChange}>
      <div>
        <main>
          {signer ? (
            <Missions signer={signer} chain={activeChain ?? "optimism"} />
          ) : (
            <div className="p-8 text-center text-gray-800 rounded-lg shadow-lg max-w-xl mx-auto my-10">
              <h1 className="text-3xl font-bold mb-4">Humanize</h1>
              <p className="text-lg font-semibold mb-2 text-gray-600">
                Proof of Human Actions
              </p>
              <p className="text-base mb-6">
                The Humanize project promotes contributions to chain activities
                by humans. Through engagement on the blockchain, we aim to prove
                our humanity and work together towards a better future. Join us
                and make your contributions count!
              </p>
              <p className="text-base mb-6 font-semibold">
                Connect your wallet to claim your proof of contribution now!
              </p>
              <div className="hidden md:flex justify-center items-center h-full">
                <w3m-button></w3m-button>
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

export default Home;
