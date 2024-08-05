import hre from "hardhat";

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const easContractAddress = process.env.EAS_CONTRACT_ADDRESS || ''
  if (easContractAddress === '') {
    throw new Error('EAS_CONTRACT_ADDRESS env variable is required')
  }

  // For contract base attestation
  // const AttesterFactory = await hre.ethers.getContractFactory("Attester");
  // const attester = await AttesterFactory.deploy(easContractAddress);
  // await attester.deployed();
  // console.log("Attester deployed to:", attester.address);

  // const attesterResolverFactory = await hre.ethers.getContractFactory("AttesterResolver");
  // const attesterResolver = await attesterResolverFactory.deploy(easContractAddress, attester.address);
  // await attesterResolver.deployed();
  // console.log("AttesterResolver deployed to:", attesterResolver.address);


  // For authorized account attestation
  const attesterResolverFactory = await hre.ethers.getContractFactory("AttesterResolver");
  const attesterResolver = await attesterResolverFactory.deploy(easContractAddress, owner.address);
  await attesterResolver.deployed();
  console.log("AttesterResolver deployed to:", attesterResolver.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
