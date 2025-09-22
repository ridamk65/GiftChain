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
    try {
      const giftID = ethers.keccak256(ethers.toUtf8Bytes(`${Date.now()}-${Math.random()}`));
      const creatorHash = ethers.keccak256(ethers.solidityPacked(['address'], [await this.signer.getAddress()]));
      const expiry = Math.floor(Date.now() / 1000) + (expiryDays * 24 * 60 * 60);
      const amountWei = ethers.parseEther(amount);

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
      
      // Mint tokens first (for testing)
      console.log('Minting tokens...');
      try {
        const mintTx = await tokenContract.mint(await this.signer.getAddress(), amountWei);
        await mintTx.wait();
        console.log('Tokens minted successfully');
      } catch (e) {
        console.log('Minting failed, continuing anyway:', e);
      }

      // Approve the contract to spend tokens
      console.log('Approving token spending...');
      const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.GIFT_CHAIN, amountWei);
      await approveTx.wait();
      console.log('Approval successful');

      // Create gift
      console.log('Creating gift...');
      const tx = await this.contract.createGift(
        tokenAddress,
        amountWei,
        expiry,
        message,
        giftID,
        creatorHash
      );
      
      const receipt = await tx.wait();
      console.log('Gift created successfully!');
      return { giftID, receipt };
    } catch (error) {
      console.error('Detailed error:', error);
      throw error;
    }
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
    try {
      console.log('Validating gift ID:', giftID);
      console.log('Contract address:', this.contract.target);
      
      // Test if contract is accessible
      const code = await this.signer.provider.getCode(this.contract.target);
      console.log('Contract code exists:', code !== '0x');
      
      if (code === '0x') {
        return [false, 'Contract not found at address'];
      }
      
      const result = await this.contract.validateGift(giftID);
      console.log('Validation result:', result);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return [false, 'Gift validation failed: ' + error.message];
    }
  }

  async getGiftDetails(giftID: string) {
    return await this.contract.gifts(giftID);
  }

  async getTokenBalance(tokenAddress: string, userAddress: string) {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
    return await tokenContract.balanceOf(userAddress);
  }
}