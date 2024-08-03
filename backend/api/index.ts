
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { AddressLike } from "ethers";
import {
  BlockScoutChain,
  TransactionMissionChecker,
} from "../libs/missionChecker";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.post("/missionCheck", async (c) => {

  try {
    const {
      address,
    missionId,
    chain,
  }: { address: AddressLike; missionId: string; chain: BlockScoutChain } =
    await c.req.json();
  const client = new TransactionMissionChecker(chain);
  const result = await client.check(address);
    c.status(200);
    return c.json(result);
  } catch (e) {
    c.status(500);
    console.error(e); 
    return c.json({ message: "Internal Server Error" });
  }
});

// for local testing
export const server = app
// for vercel
export default handle(app);
