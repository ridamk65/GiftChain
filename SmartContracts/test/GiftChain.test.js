const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");

describe("GiftChain", function () {
  let owner, recipient, relayer, token, giftChain;
  let amount, expiry, message, giftID, creatorHash;

  beforeEach(async function () {
    [owner, recipient, relayer] = await ethers.getSigners();

    // Deploy MockERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy("MockToken", "MTK", 18);
    await token.waitForDeployment();

    // Mint tokens to relayer (since relayer calls transferFrom)
    await token.mint(relayer.address, ethers.parseEther("1000"));

    // Deploy GiftChain with relayer address
    const GiftChain = await ethers.getContractFactory("GiftChain");
    giftChain = await GiftChain.deploy(relayer.address);
    await giftChain.waitForDeployment();

    // Prepare test data
    amount = ethers.parseEther("10");
    expiry = (await ethers.provider.getBlock("latest")).timestamp + 3600;
    message = "Happy Birthday!";
    giftID = ethers.keccak256(ethers.toUtf8Bytes("gift1"));
    creatorHash = ethers.keccak256(ethers.solidityPacked(["address"], [owner.address]));

    // Relayer approves the contract to spend tokens
    await token.connect(relayer).approve(await giftChain.getAddress(), amount * 10n);
  });

  it("Should create a gift successfully", async function () {
    await expect(
      giftChain.connect(relayer).createGift(
        await token.getAddress(),
        amount,
        expiry,
        message,
        giftID,
        creatorHash
      )
    ).to.emit(giftChain, "GiftCreated");
    
    const gift = await giftChain.gifts(giftID);
    expect(gift.amount).to.equal(amount);
    expect(gift.message).to.equal(message);
  });

  it("Should allow recipient to claim a gift", async function () {
    await giftChain.connect(relayer).createGift(
      await token.getAddress(),
      amount,
      expiry,
      message,
      giftID,
      creatorHash
    );
    
    await expect(
      giftChain.connect(recipient).claimGift(giftID)
    ).to.emit(giftChain, "GiftClaimed");

    const recipientBalance = await token.balanceOf(recipient.address);
    expect(recipientBalance).to.equal(amount);

    const gift = await giftChain.gifts(giftID);
    expect(gift.claimed).to.equal(true);
  });

  // ------------------
  // ❌ Negative Tests
  // ------------------

  it("Should fail if non-relayer tries to create a gift", async function () {
    await expect(
      giftChain.connect(owner).createGift(
        await token.getAddress(),
        amount,
        expiry,
        message,
        giftID,
        creatorHash
      )
    ).to.be.revertedWithCustomError(giftChain, "ONLY_RELAYER_HAS_ACCESS");
  });

  it("Should not allow claiming twice", async function () {
    await giftChain.connect(relayer).createGift(
      await token.getAddress(),
      amount,
      expiry,
      message,
      giftID,
      creatorHash
    );
    await giftChain.connect(recipient).claimGift(giftID);

    await expect(
      giftChain.connect(recipient).claimGift(giftID)
    ).to.be.revertedWithCustomError(giftChain, "GIFT_CLAIMED");
  });

  it("Should not allow claiming after expiry", async function () {
    const expiredGiftID = ethers.keccak256(ethers.toUtf8Bytes("expiredGift"));
    
    await giftChain.connect(relayer).createGift(
      await token.getAddress(),
      amount,
      expiry,
      message,
      expiredGiftID,
      creatorHash
    );

    // Fast forward time past expiry
    await ethers.provider.send("evm_increaseTime", [3700]); // 1 hour + 100 seconds
    await ethers.provider.send("evm_mine");

    await expect(
      giftChain.connect(recipient).claimGift(expiredGiftID)
    ).to.be.revertedWithCustomError(giftChain, "GIFT_EXPIRED");
  });

  it("Should not allow claiming non-existent gift", async function () {
    const fakeGiftID = ethers.keccak256(ethers.toUtf8Bytes("fakeGift"));

    await expect(
      giftChain.connect(recipient).claimGift(fakeGiftID)
    ).to.be.revertedWithCustomError(giftChain, "INVALID_GIFTID");
  });
});
