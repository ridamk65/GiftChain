const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = {
  async createGift(giftData: any) {
    const response = await fetch(`${API_BASE_URL}/gifts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(giftData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async getGift(giftId: string) {
    const response = await fetch(`${API_BASE_URL}/gifts/${giftId}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async getUserGifts(userAddress: string) {
    const response = await fetch(`${API_BASE_URL}/gifts/user/${userAddress}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async claimGift(giftId: string, claimerAddress: string) {
    const response = await fetch(`${API_BASE_URL}/gifts/${giftId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ claimerAddress })
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
};