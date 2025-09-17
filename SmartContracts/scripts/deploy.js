// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy GiftChain
  const GiftChain = await hre.ethers.getContractFactory("GiftChain");
  const giftChain = await GiftChain.deploy(deployer.address);

  await giftChain.waitForDeployment();
  console.log("GiftChain deployed to:", await giftChain.getAddress());
}

// Run the script and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
