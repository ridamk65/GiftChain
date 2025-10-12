@echo off
echo Starting GiftChain Application...

echo.
echo Starting Hardhat Network...
start "Hardhat Network" cmd /k "cd SmartContracts && npx hardhat node"

echo Waiting for Hardhat to start...
timeout /t 5 /nobreak >nul

echo.
echo Deploying Smart Contracts...
start "Deploy Contracts" cmd /k "cd SmartContracts && npx hardhat run scripts/deploy.js --network localhost"

echo Waiting for deployment...
timeout /t 10 /nobreak >nul

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo All services started!
echo - Hardhat Network: http://127.0.0.1:8545
echo - Backend API: http://localhost:3001
echo - Frontend: http://localhost:5173
echo.
echo Don't forget to:
echo 1. Add Hardhat Network to MetaMask (Chain ID: 31337, RPC: http://127.0.0.1:8545)
echo 2. Import test accounts from Hardhat terminal
echo 3. Update contract addresses in Frontend/src/config/contracts.ts
pause