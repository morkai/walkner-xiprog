@echo off
set XIPROG_DIR=C:\workspace\walkner\walkner-xiprog
set CHROME_DIR=C:\Users\Luke\AppData\Local\Google\Chrome\Application

start /D %XIPROG_DIR%\bin /MIN /B node.exe %XIPROG_DIR%\backend\server.js
timeout /T 1 > nul
start /D %CHROME_DIR% /MAX chrome.exe --incognito --enable-kiosk-mode --kiosk http://localhost:1337/
