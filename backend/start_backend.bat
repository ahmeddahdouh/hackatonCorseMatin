@echo off
echo ====================================
echo  Demarrage Backend FastAPI
echo  Corse-Matin KPI Simulator
echo ====================================
echo.

cd /d "%~dp0"

REM Verifier si Python est installe
python --version > nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas installe ou non dans le PATH
    echo Veuillez installer Python 3.10+ depuis https://python.org
    pause
    exit /b 1
)

REM Verifier si les dependances sont installees
echo Verification des dependances...
pip show fastapi > nul 2>&1
if errorlevel 1 (
    echo Installation des dependances...
    pip install -r requirements.txt
)

echo.
echo Demarrage du serveur sur http://localhost:8000
echo Documentation API: http://localhost:8000/docs
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
