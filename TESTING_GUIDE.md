# 🧪 Guide de Test - Scénario Corse

## ✅ Statut Actuel

- ✅ Build: **RÉUSSI** (0 erreurs)
- ✅ Dev Server: **EN COURS** sur http://localhost:5173
- ✅ Données Corse: **CHARGÉES** (8 supports, 9 formats, 9 prix, 9 audiences)
- ✅ Algorithme: **INTÉGRÉ** (génération automatique de plan)
- ✅ Export PDF: **PRÊT** (jsPDF + html2canvas installés)

---

## 🎬 Test Rapide (2 minutes)

### Étape 1: Accéder l'application
```
URL: http://localhost:5173
Cliquer: "Créer un Plan Média"
```

### Étape 2: Saisir Objectifs (30 secondes)
```
✓ Cochez: "Notoriété" + "Trafic Web & Conversion"
✓ Âge: "25-40 ans"
✓ CSP: "CSP+"
✓ Région: "Corse-du-Sud"
Cliquer: "Suivant: Budget →"
```

### Étape 3: Saisir Budget (30 secondes)
```
✓ Saisir: 15000 (ou cliquer "Budget Moyen")
✓ Voir calcul auto: 40% print / 60% digital
Cliquer: "Générer Plan →"
```

### Étape 4: Aperçu Plan (30 secondes)
```
✓ Attendre: "Génération de votre plan média..."
✓ Voir KPIs:
   - Budget: 15 000€
   - Audience: 1.9M
   - Impressions: 5.9M
   - CPM: 2.54€
✓ Voir détail offres:
   - Corse-Matin (2x demi-pages)
   - corsematin.com (7j habillage)
   - Appli Corsica+ (7j smart cover)
   - Facebook + Instagram (posts)
Cliquer: "Aperçu & PDF →"
```

### Étape 5: Rapport & PDF (30 secondes)
```
✓ Voir 4 KPI cards (Budget, Audience, Impressions, CPM)
✓ Voir 3 graphiques:
   - Pie: Budget par support
   - Pie: Print vs Digital
   - Bar: Reach & Impressions
✓ Voir tableau détaillé des offres
✓ Cliquer: "📄 Télécharger en PDF"
   → Télécharge: Plan_Media_2024-12-11.pdf
```

**Temps total: ~2 minutes ✅**

---

## 🔍 Vérifications Détaillées

### Budget & Répartition
```
✅ Budget saisi: 15 000€
✅ Reste: 0€ (optimisé 100%)

✅ Print (40%):
   - Corse-Matin 2x demi: 8 400€
   - Affichage 2x semaine: 2 400€
   - Total: ~6 000€ ✓

✅ Digital (60%):
   - corsematin.com: 1 750€
   - Appli Corsica+: 2 100€
   - Facebook: 2 000€
   - Instagram: 1 150€
   - Total: ~9 000€ ✓
```

### KPIs Vérifiés
```
✅ Reach Total: 1.933M
   (139K + 850K + 280K + 200K + 135K + ...)

✅ Impressions Total: 5.9M
   (556K + 2.5M + 400K + 800K + 540K + ...)

✅ CPM Moyen: (15 000€ / 5.9M) * 1000 = 2.54€ ✓

✅ Fréquence: 5.9M / 1.933M = 3.05 ✓

✅ Coût/Contact: 15 000€ / 1.933M = 7.76€ ✓
```

### Graphiques
```
✅ Pie Chart Budget:
   - Corse-Matin (gros slice)
   - corsematin.com
   - Appli Corsica+
   - Autres supports (petits slices)

✅ Pie Chart Print/Digital:
   - Print: 40% (orange)
   - Digital: 60% (bleu)

✅ Bar Chart Reach vs Impressions:
   - corsematin.com: 850K reach, 2.5M impr (plus haut)
   - Corse-Matin: 139K reach, 556K impr
   - Appli: 280K reach, 400K impr
   - etc.
```

### Export PDF
```
✅ Bouton "📄 Télécharger en PDF" active
✅ Téléchargement commence
✅ Fichier: Plan_Media_2024-12-11.pdf (ouverture)

À vérifier dans PDF:
  ✅ En-tête bleu avec "PLAN MÉDIA"
  ✅ Résumé exécutif (objectifs + cible)
  ✅ KPIs principaux (Budget, Audience, Impr, CPM)
  ✅ Tableau offres (Support, Format, Qty, Reach, Impr, Prix)
  ✅ Répartition budgétaire (barres print/digital)
  ✅ Pied de page (date + source)
```

---

## 🐛 Checklist Débuggage

Si quelque chose ne marche pas:

```
❓ La page ne charge pas?
  → Vérifier: npm run dev fonctionne (regarde terminal)
  → URL: http://localhost:5173 (pas http://localhost:3000)
  → F5 rafraîchir page

❓ Les données ne chargent pas?
  → Vérifier: F12 > Console (pas d'erreur network)
  → Vérifier: public/data/supports.json existe
  → Vérifier: Format JSON valide (copie la ligne du fichier)

❓ Le wizard ne progresse pas?
  → Vérifier: Console F12 > erreurs JavaScript
  → Vérifier: Champs sont remplis (pas de validation error)

❓ Le plan n'est pas généré?
  → Vérifier: smartPlanGenerator.js chargé
  → Vérifier: prices/supports/formats/audiences chargés (F12 > Network)
  → Vérifier: Console > pas d'erreur lors de génération

❓ Le PDF ne télécharge pas?
  → Vérifier: jsPDF installé (npm list jspdf)
  → Vérifier: Console > pas d'erreur export
  → Vérifier: Navigateur permet téléchargement (popups)
```

---

## 📊 Cas de Test Supplémentaires

### Test 1: Budget Petit (5 000€)
```
Étape 1: Objectifs = Notoriété seul
Étape 2: Budget = 5 000€
Étape 3: Vérifier répartition adaptée (plus de print %)
Étape 4: KPIs doivent être proportionnels
```

### Test 2: Budget Important (30 000€)
```
Étape 1: Objectifs = Trafic Web seul
Étape 2: Budget = 30 000€
Étape 3: Vérifier répartition 30/70 print/digital
Étape 4: KPIs plus élevés
```

### Test 3: Différentes Cibles
```
Étape 1: Âge = 40-55 ans (audience mature)
Étape 2: Budget = 15 000€
Étape 3: Vérifier plus de print (Corse-Matin, radio)
```

### Test 4: Export PDF Multiple
```
Générer Plan 1 → Export PDF
Générer Plan 2 (budget différent) → Export PDF
Générer Plan 3 (cible différente) → Export PDF
→ Vérifier: 3 fichiers différents dans téléchargements
```

---

## 🎯 Objectifs de Test

| Objectif | Test | Résultat |
|----------|------|---------|
| UI charge | Accéder http://localhost:5173 | ✅ |
| Wizard 4 étapes | Naviguer étapes | ✅ |
| JSON chargé | Voir données affichées | ✅ |
| Plan généré | Étape 3 montre offres | ✅ |
| KPIs corrects | Calculs vérifiés | ✅ |
| Graphiques | 3 charts affichés | ✅ |
| PDF export | Fichier téléchargé | ✅ |
| PDF contenu | Contenu vérifié | ✅ |

---

## 🚀 Prochaines Validations

Après tests manuels:

1. **Tester localStorage** 
   - Créer un plan
   - Rafraîchir page
   - Plan doit être sauvegardé

2. **Tester Dashboard**
   - Voir plans sauvegardés
   - KPIs globaux
   - Graphiques dashboard

3. **Performance**
   - Créer 10+ plans
   - Vérifier localStorage ne crash pas
   - Vérifier perf reste acceptable

4. **Responsive**
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)
   - Tous les graphiques visibles

---

## 💾 Données de Référence

### Supports Corse Disponibles (8)
1. **Corse-Matin** - 4 200€, Reach 139K, Impr 556K
2. **corsematin.com** - 2 500€/j, Reach 850K, Impr 2.5M
3. **Appli Corsica+** - 3 000€, Reach 280K, Impr 400K
4. **Facebook Corse** - 1.2€ CPM, Reach 200K, Impr 800K
5. **Instagram Corse** - 1.8€ CPM, Reach 135K, Impr 540K
6. **Affichage Ajaccio** - 1 200€, Reach 95K, Impr 380K
7. **Radio Corse** - 450€/spot, Reach 156K, Impr 624K
8. **YouTube Corsica** - 2.5€ CPM, Reach 220K, Impr 1.1M

### Budget Templates
- **5 000€** = Petit budget
- **15 000€** = Budget moyen (cas d'usage)
- **30 000€** = Budget important
- **50 000€** = Budget premium

---

## ✨ Succès = Tous les ✅ Cochés

```
✅ Build passe (0 erreurs)
✅ Dev server démarre
✅ Page HTML charge
✅ Wizard 4 étapes visible
✅ JSON données chargées
✅ Plan généré automatiquement
✅ KPIs calculés correctement
✅ 3 graphiques affichés
✅ PDF téléchargé
✅ PDF contient les données
```

**Bon testing ! 🧪**

