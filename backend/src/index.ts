import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env, getRuntimeKey } from "hono/adapter";
import { BlockScoutChain, TransactionMissionChecker } from "./missionChecker";
import { AddressLike } from "ethers";

const app = new Hono();

app.post("/api/missionCheck", async (c) => {
  const {
    address,
    missionId,
    chain,
  }: { address: AddressLike; missionId: string; chain: BlockScoutChain } =
    await c.req.json();
  const client = new TransactionMissionChecker(chain);
  const result = await client.check(
    address
  );
  return c.json(result);
});

const port = 3002;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
