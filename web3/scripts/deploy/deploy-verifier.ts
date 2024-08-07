import hre from "hardhat";

async function main() {
  const WORLD_ID_ROUTER_ADDRESS = process.env.WORLD_ID_ROUTER_ADDRESS;
  if (!WORLD_ID_ROUTER_ADDRESS) {
    throw new Error("WORLD_ID_ROUTER_ADDRESS is required");
  }

  const WORLD_APP_ID = process.env.WORLD_APP_ID;
  if (!WORLD_APP_ID) {
    throw new Error("WORLD_APP_ID is required");
  }
  const WORLD_APP_ACTION_ID = process.env.WORLD_APP_ACTION_ID;
  if (!WORLD_APP_ACTION_ID) {
    throw new Error("WORLD_APP_ACTION_ID is required");
  }
  const [owner] = await hre.ethers.getSigners();

  console.log('deploying WorldIdVerifier...')
  console.log('WORLD_ID_ROUTER_ADDRESS', WORLD_ID_ROUTER_ADDRESS);
  console.log('WORLD_APP_ID', WORLD_APP_ID);
  console.log('WORLD_APP_ACTION_ID', WORLD_APP_ACTION_ID);

  const WorldIdVerifier = await hre.ethers.getContractFactory("WorldIdVerifier");
  const worldIdVerifier = await WorldIdVerifier.deploy(
    WORLD_ID_ROUTER_ADDRESS,
    WORLD_APP_ID,
    WORLD_APP_ACTION_ID
  );
  await worldIdVerifier.deployed();

  console.log("WorldIdVerifier deployed to:", worldIdVerifier.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
