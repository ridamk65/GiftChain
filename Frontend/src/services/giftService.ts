import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, GIFT_CHAIN_ABI, ERC20_ABI } from '../config/contracts';

export class GiftService {
  private contract: ethers.Contract;
  private signer: ethers.JsonRpcSigner;

  constructor(signer: ethers.JsonRpcSigner) {
    this.signer = signer;
    this.contract = new ethers.Contract(CONTRACT_ADDRESSES.GIFT_CHAIN, GIFT_CHAIN_ABI, signer);
  }

  async createGift(tokenAddress: string, amount: string, expiryDays: number, message: string) {
    const giftID = ethers.keccak256(ethers.toUtf8Bytes(`${Date.now()}-${Math.random()}`));
    const creatorHash = ethers.keccak256(ethers.solidityPacked(['address'], [await this.signer.getAddress()]));
    const expiry = Math.floor(Date.now() / 1000) + (expiryDays * 24 * 60 * 60);
    const amountWei = ethers.parseEther(amount);

    // Approve token transfer first
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
    const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.GIFT_CHAIN, amountWei);
    await approveTx.wait();

    // Create gift
    const tx = await this.contract.createGift(
      tokenAddress,
      amountWei,
      expiry,
      message,
      giftID,
      creatorHash
    );
    
    const receipt = await tx.wait();
    return { giftID, receipt };
  }

  async claimGift(giftID: string) {
    const tx = await this.contract.claimGift(giftID);
    return await tx.wait();
  }

  async reclaimGift(giftID: string) {
    const tx = await this.contract.reclaimGift(giftID);
    return await tx.wait();
  }

  async validateGift(giftID: string) {
    return await this.contract.validateGift(giftID);
  }

  async getGiftDetails(giftID: string) {
    return await this.contract.gifts(giftID);
  }

  async getTokenBalance(tokenAddress: string, userAddress: string) {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
    return await tokenContract.balanceOf(userAddress);
  }
}