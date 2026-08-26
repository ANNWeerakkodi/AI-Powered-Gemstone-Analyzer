@echo off
echo ============================================
echo  CycloneGems AI - ML Server Setup
echo ============================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

:: Create virtual environment
if not exist "venv" (
    echo [1/4] Creating virtual environment...
    python -m venv venv
) else (
    echo [1/4] Virtual environment already exists.
)

:: Activate
echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

:: Install dependencies
echo [3/4] Installing dependencies (this may take a while)...
pip install -r requirements.txt

:: Verify model
echo [4/4] Checking model file...
if exist "..\mlmodel\model.keras" (
    echo [OK] Model file found: ..\mlmodel\model.keras
) else (
    echo [WARNING] Model file not found at ..\mlmodel\model.keras
    echo Please ensure the Keras model is in the mlmodel directory.
)

echo.
echo ============================================
echo  Setup complete!
echo  Run: python app.py
echo ============================================
pause
