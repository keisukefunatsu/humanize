import { Hono } from "hono";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";
import { AddressLike, isAddress } from "ethers";
import {
  BlockScoutChain,
  GetERC721MissionChecker,
  TransactionMissionChecker,
} from "../libs/missionChecker";
import { MissionList } from "../libs/missionList";
import { EASContractAddress, executeOnchainAttestation } from "../libs/missionAttester";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.get("/missionAttester", async (c) => {
  try {
    await executeOnchainAttestation()
    c.status(200);
    return c.json(true);
  } catch (e) {
    c.status(500);
    console.error(e);
    return c.json({ message: "Internal Server Error" });
  }
});

app.get("/missions/:walletAddress", async (c) => {
  try {
    const { walletAddress }: { walletAddress: AddressLike } = c.req.param();
    if (!walletAddress || !isAddress(walletAddress)) {
      c.status(400);
      return c.json({ message: "walletAddress is required" });
    }
    const missionList = new MissionList();
    const missions = await missionList.all(walletAddress);
    return c.json(missions);
  } catch (e) {
    return c.json([])
  }
});

app.post("/missionCheck", async (c) => {
  try {
    const {
      address,
      missionId,
      chain,
    }: { address: AddressLike; missionId: string; chain: BlockScoutChain } =
      await c.req.json();
    let client: any;
    let result: boolean = false;
    const { SCHEMA_ID } = env<{ SCHEMA_ID: string }>(c);
    switch (missionId) {
      case "1":
        client = new TransactionMissionChecker(chain);
        result = await client.check(address, SCHEMA_ID);
        break;
      case "2":
        client = new GetERC721MissionChecker(chain);
        result = await client.check(address, SCHEMA_ID);
        break;
    }
    c.status(200);
    return c.json(result);
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
