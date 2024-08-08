import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";
import { AddressLike, isAddress } from "ethers";
import {
  ChainName,
  GetERC721MissionChecker,
  TransactionMissionChecker,
} from "../libs/missionChecker";
import { MissionList } from "../libs/missionList";
import { getDelegatedAttestation } from "../libs/missionAttester";
import { checkWorldIdVerified } from "../libs/checkWorldIdVerified";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");
app.use(
  "*",
  cors({
    origin: "*",
  })
);

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.get("/missions/:walletAddress", async (c) => {
  try {
    const { walletAddress }: { walletAddress: AddressLike } = c.req.param();
    const chain = c.req.query("chain") as ChainName; // Extract chain directly and cast to ChainName
    if (!walletAddress || !isAddress(walletAddress)) {
      c.status(400);
      return c.json({ message: "walletAddress is required" });
    }
    if (!chain) {
      c.status(400);
      return c.json({ message: "chain is required" });
    }
    const missionList = new MissionList();
    const missions = await missionList.all(walletAddress, chain);
    return c.json(missions);
  } catch (e) {
    console.error(e);
    return c.json([]);
  }
});

app.post("/missionCheck", async (c) => {
  try {
    const {
      walletAddress,
      missionId,
      chain,
    }: { walletAddress: AddressLike; missionId: string; chain: ChainName } =
      await c.req.json();
    let client: any;
    let result: boolean = false;
    if (!walletAddress || !isAddress(walletAddress)) {
      c.status(400);
      return c.json({ message: "walletAddress is required" });
    }
    const { SCHEMA_ID } = env<{ SCHEMA_ID: string }>(c);
  
    switch (missionId) {
      case "transaction5":
        client = new TransactionMissionChecker(chain);
        result = await client.check(walletAddress, SCHEMA_ID);
        break;
      case "getErc721":
        client = new GetERC721MissionChecker(chain);
        result = await client.check(walletAddress, SCHEMA_ID);
        break;
      case "uniswapFirstSwap":
        result = true;
        break;
      case "governanceContributor":
        result = true;
        break;
      case "chainEcosystemContributor":
        result = true;
        break;
      default:
        return c.json({ message: "Invalid missionId" });
    }
    
    if (!result) {
      c.status(400);
      return c.json({ message: "Not eligible" });
    }
    const verified = await checkWorldIdVerified(walletAddress);
    if (!verified) {
      c.status(400);
      return c.json({ message: "Not verified" });
    }
    const signature = await getDelegatedAttestation({ walletAddress, missionId, chain });
    c.status(200);
    console.log(signature);
    return c.json(signature);
  } catch (e) {
    c.status(500);
    console.error(e);
    return c.json({ message: "Internal Server Error" });
  }
});

// for local testing
export const server = app;
// for vercel
export default handle(app);