@echo off
echo Starting GiftChain Setup...

echo.
echo Step 1: Setting up Smart Contracts...
cd SmartContracts
call npm install
if %errorlevel% neq 0 (
    echo Failed to install smart contract dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Setting up Backend...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Setting up Frontend...
cd ..\Frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setup complete! Now run start.bat to launch the application.
pause