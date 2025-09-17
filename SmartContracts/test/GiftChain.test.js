const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GiftChain", function () {
  let giftChain, mockToken, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy MockERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Test Token", "TEST", 18);
    await mockToken.waitForDeployment();

    // Deploy GiftChain
    const GiftChain = await ethers.getContractFactory("GiftChain");
    giftChain = await GiftChain.deploy(owner.address);
    await giftChain.waitForDeployment();

    // Mint tokens to owner
    await mockToken.mint(owner.address, ethers.parseEther("1000"));
  });

  describe("Gift Creation", function () {
    it("Should create a gift successfully", async function () {
      const amount = ethers.parseEther("10");
      const expiration = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const message = "Happy Birthday!";

      // Approve tokens
      await mockToken.approve(await giftChain.getAddress(), amount);

      // Create gift
      await expect(giftChain.createGift(await mockToken.getAddress(), amount, expiration, message))
        .to.emit(giftChain, "GiftCreated");
    });
  });

  describe("Gift Claiming", function () {
    it("Should allow claiming a valid gift", async function () {
      const amount = ethers.parseEther("10");
      const expiration = Math.floor(Date.now() / 1000) + 3600;
      const message = "Test Gift";

      // Approve and create gift
      await mockToken.approve(await giftChain.getAddress(), amount);
      const tx = await giftChain.createGift(await mockToken.getAddress(), amount, expiration, message);
      const receipt = await tx.wait();
      
      // Get giftId from event
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === "GiftCreated");
      const giftId = event.args[0];

      // Claim gift
      await expect(giftChain.connect(addr1).claimGift(giftId))
        .to.emit(giftChain, "GiftClaimed");

      // Check recipient balance
      expect(await mockToken.balanceOf(addr1.address)).to.equal(amount);
    });
  });
});