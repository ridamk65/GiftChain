# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- MetaMask browser extension
- Git

## Automated Setup (Windows)

1. **Run Setup Script:**
   ```bash
   setup.bat
   ```

2. **Start Application:**
   ```bash
   start.bat
   ```

## Manual Setup

1. **Install Dependencies:**
   ```bash
   # Smart Contracts
   cd SmartContracts
   npm install
   
   # Backend
   cd ../backend
   npm install
   
   # Frontend
   cd ../Frontend
   npm install
   ```

2. **Start Services:**
   ```bash
   # Terminal 1: Hardhat Network
   cd SmartContracts
   npx hardhat node
   
   # Terminal 2: Deploy Contracts
   cd SmartContracts
   npx hardhat run scripts/deploy.js --network localhost
   
   # Terminal 3: Backend
   cd backend
   npm run dev
   
   # Terminal 4: Frontend
   cd Frontend
   npm run dev
   ```

## MetaMask Configuration

1. **Add Hardhat Network:**
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account:**
   - Copy private key from Hardhat terminal
   - Import in MetaMask

## Update Contract Addresses

After deployment, copy addresses from terminal to:
`Frontend/src/config/contracts.ts`

## Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Hardhat Network: http://127.0.0.1:8545