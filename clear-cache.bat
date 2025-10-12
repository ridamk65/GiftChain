@echo off
echo Clearing frontend cache and restarting...

cd Frontend
echo Clearing node_modules cache...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q .vite 2>nul
rmdir /s /q dist 2>nul

echo Restarting frontend with cache cleared...
npm run dev -- --force