# GiftChain Integration Setup

## Quick Start

### 1. Start Hardhat Node
```bash
cd SmartContracts
npx hardhat node
```

### 2. Deploy Contracts
```bash
cd SmartContracts
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Start Backend
```bash
cd backend
npm run dev
```

### 4. Start Frontend
```bash
cd Frontend
npm run dev
```

## Configuration

### Update Contract Addresses
After deployment, update `Frontend/src/config/contracts.ts` with:
- GiftChain contract address
- MockERC20 token address

### MetaMask Setup
1. Add Hardhat network to MetaMask:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

2. Import test accounts from Hardhat node output

## Features Integrated

✅ **Smart Contract Integration**
- Gift creation with ERC20 tokens
- Gift claiming functionality
- Gift validation and reclaiming

✅ **Web3 Wallet Connection**
- MetaMask integration
- Network switching
- Account management

✅ **Backend API**
- Gift metadata storage
- User gift tracking
- Claim status management

✅ **Frontend Components**
- Create Gift UI
- Claim Gift UI
- Wallet connection
- Responsive design

## API Endpoints

- `POST /api/gifts` - Create gift metadata
- `GET /api/gifts/:giftId` - Get gift details
- `GET /api/gifts/user/:userAddress` - Get user's gifts
- `POST /api/gifts/:giftId/claim` - Mark gift as claimed

## Next Steps

1. Add gift sharing functionality
2. Implement QR code generation
3. Add email notifications
4. Deploy to testnet/mainnet
5. Add subgraph integration