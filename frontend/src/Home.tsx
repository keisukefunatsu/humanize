import { useEthersSigner } from "./libs/ethers";
import { useEffect } from "react";
import Missions from "./components/Missions";
import Layout from "./layout";

function Home() {
  const signer = useEthersSigner();
  useEffect(() => {}, [signer]);

  return (
    <Layout>
      <div>
        <main>
          {signer && <Missions signer={signer}></Missions>}
        </main>
      </div>
    </Layout>
  );
}

export default Home;
