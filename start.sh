#!/bin/bash
# 🚀 Script de démarrage rapide

echo "🎉 Démarrage de Plan Média Pro"
echo "========================================"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    echo "Exécutez ce script depuis la racine du projet"
    exit 1
fi

echo "📦 Installation des dépendances..."
npm install

echo ""
echo "✅ Installation terminée!"
echo ""
echo "🔧 Démarrage du serveur..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 L'application est accessible sur:"
echo "   http://localhost:5173"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

npm run dev
