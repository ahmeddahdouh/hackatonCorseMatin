# 🚀 Quick Start Guide

## Installation en 30 secondes

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement
npm run dev

# 3. Ouvrir http://localhost:5173 dans votre navigateur
```

Voilà ! L'application est prête. 🎉

---

## Structure de la première utilisation

1. **Home** : Page d'accueil avec présentation
2. **Créer un Plan Média** : Lance le Wizard
3. **6 Étapes du Wizard** :
   - Étape 1 : Nom et type du client
   - Étape 2 : Sélection des supports
   - Étape 3 : Sélection des formats
   - Étape 4 : Configuration des quantités
   - Étape 5 : Aperçu avec graphiques
   - Étape 6 : Validation et sauvegarde
4. **Dashboard** : Vue d'ensemble de tous les plans

---

## Fichiers à personnaliser

### 1. Modifier les supports (press, digital, etc.)
**Fichier** : `public/data/supports.json`

Ajoutez ou modifiez les supports média selon vos besoins.

```json
{
  "supports": [
    {
      "id": "custom_id",
      "name": "Mon support",
      "category": "Custom",
      "icon": "🎯",
      "description": "Description"
    }
  ]
}
```

### 2. Modifier les formats publicitaires
**Fichier** : `public/data/formats.json`

Changez les dimensions, les noms, les supports associés.

```json
{
  "formats": [
    {
      "id": "custom_format",
      "name": "Mon format",
      "supportIds": ["support_id_1", "support_id_2"],
      "dimensions": "1024x768px",
      "description": "Description"
    }
  ]
}
```

### 3. Modifier les tarifs
**Fichier** : `public/data/prices.json`

Mettez à jour les prix unitaires, les unités (CPM, insertion, spot).

```json
{
  "prices": [
    {
      "id": "price_custom",
      "supportId": "support_id",
      "formatId": "format_id",
      "pricePerUnit": 5000,
      "currency": "EUR",
      "minimumQuantity": 1,
      "unit": "insertion",
      "description": "Description"
    }
  ]
}
```

### 4. Modifier les audiences
**Fichier** : `public/data/audiences.json`

Changez les portées et impressions mensuelles.

```json
{
  "audiences": [
    {
      "id": "aud_custom",
      "supportId": "support_id",
      "formatId": "format_id",
      "monthlyReach": 1000000,
      "monthlyImpressions": 5000000,
      "targetDemographics": ["25-45", "Actifs"],
      "description": "Description"
    }
  ]
}
```

---

## Commandes principales

```bash
# Développement
npm run dev              # Démarrer le serveur local

# Production
npm run build            # Compiler pour la production
npm run preview          # Tester la build en local

# Linting (optionnel - ajouter plus tard)
npm run lint             # Vérifier la syntaxe
npm run format           # Formater le code
```

---

## Structures de données importantes

### Plan Média (localStorage)
```javascript
{
  id: "timestamp",
  clientName: "Société X",
  clientType: "B2C",
  planName: "Campagne Noël 2024",
  selectedSupports: [
    {
      supportId: "press_daily",
      formatId: "format_full_page",
      quantity: 2
    }
  ],
  offers: [
    {
      supportId: "press_daily",
      formatId: "format_full_page",
      supportName: "Quotidiens",
      formatName: "Pleine Page",
      quantity: 2,
      totalPrice: 30000,
      reach: 5000000,
      impressions: 15000000
    }
  ],
  totalBudget: 30000,
  totalAudience: 5000000,
  createdAt: "2024-12-11T10:00:00Z",
  updatedAt: "2024-12-11T10:00:00Z"
}
```

---

## FAQ Rapide

**Q: Puis-je modifier les données en temps réel ?**
A: Oui, éditez les fichiers JSON dans `public/data/` et rafraîchissez le navigateur.

**Q: Comment sauvegarder le plan en PDF ?**
A: Fonctionnalité future. Pour l'instant, utilisez "Imprimer" (Ctrl+P) depuis le navigateur.

**Q: Où sont stockés les plans ?**
A: Dans localStorage du navigateur. Consultez DevTools → Application → localStorage → URL.

**Q: Puis-je exporter les plans ?**
A: Les plans sont déjà en localStorage en JSON. Copiez-les directement depuis DevTools.

**Q: Comment connecter un backend ?**
A: Consultez `INTEGRATION.md` pour les patterns de migration API.

---

## Prochaines étapes

1. ✅ Tester le wizard complet
2. ✅ Créer plusieurs plans pour vérifier le dashboard
3. ✅ Ajuster les JSON selon votre catalogue réel
4. ✅ Lire la documentation complète (README.md)
5. ✅ Consulter les patterns d'intégration (INTEGRATION.md)
6. ✅ Ajouter des fonctionnalités (export PDF, etc.)

---

## Support et Documentation

- 📖 **README.md** : Documentation complète
- 🔌 **INTEGRATION.md** : Patterns techniques avancés
- 💬 **Issues** : Posez vos questions

---

**Bonne utilisation ! 🎯**
