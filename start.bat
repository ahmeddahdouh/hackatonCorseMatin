@echo off
REM 🚀 Script de démarrage rapide pour Windows

echo.
echo 🎉 Démarrage de Plan Média Pro
echo ========================================
echo.

REM Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ❌ Erreur: package.json non trouvé
    echo Exécutez ce script depuis la racine du projet
    pause
    exit /b 1
)

echo 📦 Installation des dépendances...
call npm install

echo.
echo ✅ Installation terminée!
echo.
echo 🔧 Démarrage du serveur...
echo.
echo ========================================
echo 🌐 L'application est accessible sur:
echo    http://localhost:5173
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

call npm run dev
pause
