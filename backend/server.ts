import { serve } from "@hono/node-server";
import {server} from "./api/index";

const port = 3002;
console.log(`Server is running on port ${port}`);

serve({
  fetch: server.fetch,
  port,
});