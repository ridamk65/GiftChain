const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  async createGift(giftData: any) {
    const response = await fetch(`${API_BASE_URL}/gifts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(giftData)
    });
    return response.json();
  },

  async getGift(giftId: string) {
    const response = await fetch(`${API_BASE_URL}/gifts/${giftId}`);
    return response.json();
  },

  async getUserGifts(userAddress: string) {
    const response = await fetch(`${API_BASE_URL}/gifts/user/${userAddress}`);
    return response.json();
  },

  async claimGift(giftId: string, claimerAddress: string) {
    const response = await fetch(`${API_BASE_URL}/gifts/${giftId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimerAddress })
    });
    return response.json();
  }
};