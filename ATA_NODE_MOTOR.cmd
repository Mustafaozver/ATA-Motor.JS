@echo off
title NodeJS Runner By Mustafa
cls
echo.
echo Node
node --version
node --inspect --max-old-space-size=10000 ATA_NODE_MOTOR.js
pause