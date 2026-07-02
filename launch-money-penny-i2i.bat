@echo off
REM Launch Money Penny / GOAT Royalty App with i2i drive model pools

set "APP_DIR=%~dp0"
set "I2I_DRIVE=I:"
set "AGENT007_MODELS=%I2I_DRIVE%\Agent-007-Models"
set "MONEYPENNY_MODELS=%I2I_DRIVE%\Money-Penny-Models"
set "APP_MODELS=%APP_DIR%models"

if exist "%AGENT007_MODELS%" set "MODEL_PATHS=%AGENT007_MODELS%"
if exist "%MONEYPENNY_MODELS%" set "MODEL_PATHS=%MODEL_PATHS%,%MONEYPENNY_MODELS%"
if exist "%APP_MODELS%" set "MODEL_PATHS=%MODEL_PATHS%,%APP_MODELS%"

set "GOAT_DATA_PATH=%I2I_DRIVE%\GOAT-Royalty-Data"
set "GOAT_MODEL_PATHS=%MODEL_PATHS%"

echo 🐐👑 Launching Money Penny / GOAT Royalty App
echo    App dir: %APP_DIR%
echo    Data path: %GOAT_DATA_PATH%
echo    Model paths: %GOAT_MODEL_PATHS%

cd /d "%APP_DIR%"
node server.js
