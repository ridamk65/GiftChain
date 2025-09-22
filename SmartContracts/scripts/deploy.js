// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy MockERC20 token
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy("Test Token", "TEST", hre.ethers.parseEther("1000000"));
  await mockToken.waitForDeployment();
  console.log("MockERC20 deployed to:", await mockToken.getAddress());

  // Deploy GiftChain with deployer as relayer
  const GiftChain = await hre.ethers.getContractFactory("GiftChain");
  const giftChain = await GiftChain.deploy(deployer.address);
  await giftChain.waitForDeployment();
  console.log("GiftChain deployed to:", await giftChain.getAddress());

  console.log("\n=== UPDATE YOUR FRONTEND CONFIG ===");
  console.log("GIFT_CHAIN:", await giftChain.getAddress());
  console.log("MOCK_ERC20:", await mockToken.getAddress());
}

// Run the script and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
