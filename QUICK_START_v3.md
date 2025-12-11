# ⚡ QUICK START - v3.0 Critères Avancés

## 🚀 Démarrage Rapide (2 minutes)

### 1. Lancer le serveur
```bash
cd c:\Users\DELL\Desktop\corseMatinCalculate
npm run dev
```
✅ Accès: http://localhost:5173

### 2. Accès initial
- Vous verrez un **Wizard 4 étapes** avec barre de progression rouge
- Design **Corse-Matin** avec palette #E60000 rouge

### 3. Tester le formulaire

**Étape 1: Campagne** (2 min)
```
- Nom: "Test Campagne"
- Secteur: "Tourisme / Loisirs"
- Période: 2025-04-15 à 2025-05-15
- Zone: "Corse entière"
→ Cliquer "Continuer"
```

**Étape 2: Objectifs** (1 min)
```
- Sélectionner: ✓ Notoriété + ✓ Trafic Web
- Voir: Résumé "2 objectif(s) sélectionné(s)"
→ Cliquer "Continuer"
```

**Étape 3: Cibles** (2 min)
```
- Tranches: ✓ 25-34 ans + ✓ 35-49 ans
- CSP: ✓ CSP+ + ✓ Actifs
- Zone: ✓ Zones urbaines
- Intérêts: ✓ Tourisme (optionnel)
→ Cliquer "Continuer"
```

**Étape 4: Budget** (1 min)
```
- Budget: 25000
- Mode: "Au choix de la régie" (défaut)
- Voir: Répartition auto "Print 30%, Digital 60%, RS 10%, Event 0%"
→ Cliquer "Continuer"
```

**Total:** ~6 minutes complètement rempli ✅

---

## 🎨 Design Visuel

### Couleurs appliquées
- **Rouge**: #E60000 (Boutons, accents, progression)
- **Gris**: #333333 (Titres, textes secondaires)
- **Noir**: #000000 (Texte principal)
- **Blanc**: #FFFFFF (Fonds)

### Éléments clés
- ✅ Ligne gauche rouge pour sections
- ✅ Gradient rouge pour boutons "Continuer"
- ✅ Barre de progression rouge en haut (0-100%)
- ✅ Stepper avec numéros + checkmarks
- ✅ Responsive mobile/tablet/desktop

---

## 🔧 Fichiers Clés

### Composants (4 nouveaux)
| Fichier | Ligne | Purpose |
|---------|-------|---------|
| Step1Campaign.jsx | 350 | Infos campagne + secteur + période + zone |
| Step2Objectives.jsx | 250 | 6 objectifs multi-sélection |
| Step3Targets.jsx | 400+ | Âge/Sexe/CSP/Intérêts/Zone |
| Step4Budget.jsx | 450+ | Budget + Répartition multi-canal |

### Configuration (1 modifié)
| Fichier | Change |
|---------|--------|
| tailwind.config.js | Palette Corse-Matin intégrée |

### Données (3 fichiers)
| Fichier | Contenu |
|---------|---------|
| sectors.json | 11 secteurs d'activité |
| supports.json | 17 supports (print, digital, social, event) |
| formats.json | 22 formats publicitaires |

---

## ✅ Checklist Validation

### Champs Obligatoires Étape 1
- [ ] Nom campagne rempli
- [ ] Secteur sélectionné
- [ ] Dates OU durée remplie
- [ ] Zone géographique sélectionnée

### Champs Obligatoires Étape 2
- [ ] Min 1 objectif sélectionné

### Champs Obligatoires Étape 3
- [ ] Min 1 tranche d'âge sélectionnée
- [ ] Min 1 CSP sélectionnée
- [ ] Min 1 zone géographique sélectionnée

### Champs Obligatoires Étape 4
- [ ] Budget ≥ 1 000€
- [ ] Si mode "Personnalisé": répartition = 100%

---

## 🎯 Test d'exemple complet

### Scénario: Agence Tourisme Corse

```
ÉTAPE 1: CAMPAGNE
├─ Nom: "Été 2025 Agence Corsica Tours"
├─ Secteur: Tourisme / Loisirs
├─ Diffusion: 01/06/2025 → 31/08/2025 (3 mois)
├─ Zone: Corse entière
└─ Micro-régions: (non sélectionnées)

ÉTAPE 2: OBJECTIFS
├─ ✓ Notoriété (faire connaître l'agence)
├─ ✓ Trafic Web (réserver en ligne)
└─ Fidélisation: (non sélectionné)

ÉTAPE 3: CIBLES
├─ Âges: ✓ 25-34, ✓ 35-49, ✓ 50-64
├─ Sexe: Mixte
├─ CSP: ✓ CSP+, ✓ Actifs, ✓ Retraités
├─ Intérêts: ✓ Tourisme, ✓ Shopping
└─ Zone: ✓ Zones urbaines

ÉTAPE 4: BUDGET
├─ Budget: 40 000€
├─ Mode: "Au choix de la régie"
├─ Distribution auto:
│  ├─ Print: 30% = 12 000€
│  ├─ Digital: 60% = 24 000€
│  └─ RS: 10% = 4 000€
└─ ✅ Prêt pour phase suivante
```

**Résultat attendu:** Système devrait générer plan média optimisé (Phase 2)

---

## 🐛 Dépannage

### Erreur: "Failed to resolve import 'lucide-react'"
```bash
npm install lucide-react
npm run build
```

### Erreur: Build échoue
```bash
# Vérifier les dépendances
npm install

# Forcer rebuilding
rm -r node_modules dist
npm install
npm run build
```

### Couleurs ne changent pas
1. Vérifier: `tailwind.config.js` a palette Corse-Matin
2. Relancer: `npm run dev`
3. Hard refresh: Ctrl+Shift+R

### Validation ne marche pas
- Vérifier console: `F12 → Console`
- Messages d'erreur doivent apparaître en rouge
- Boutons désactivés si invalide

---

## 📊 État Actuel

### Build Status
```
✅ SUCCÈS
├─ 2339 modules transformed
├─ CSS: 36.46 kB
├─ JS: 605.73 kB
├─ Build time: 5.96s
└─ Aucune erreur
```

### Composants
```
✅ Wizard.jsx (Core navigation)
✅ Step1Campaign.jsx (Campagne)
✅ Step2Objectives.jsx (Objectifs)
✅ Step3Targets.jsx (Cibles)
✅ Step4Budget.jsx (Budget)
```

### Données
```
✅ sectors.json (11 secteurs)
✅ supports.json (17 supports)
✅ formats.json (22 formats)
⚠️ prices.json (À enrichir Phase 2)
⚠️ audiences.json (À enrichir Phase 2)
```

---

## 🎓 Prochaines Étapes (Phase 2)

### Court terme (1-2 jours)
- [ ] Enrichir prices.json avec tous les supports
- [ ] Enrichir audiences.json avec données réelles
- [ ] Adapter smartPlanGenerator.js pour nouveaux objectifs
- [ ] Créer Step5Supports pour sélection supports

### Moyen terme (3-5 jours)
- [ ] Step6GeneratedPlan avec auto-génération
- [ ] Step7Review avec validation
- [ ] Step8PDF avec export KPIs enrichis
- [ ] Ajouter localStorage persistence

### Long terme (1-2 semaines)
- [ ] Mode Simulation (plan prédéfini)
- [ ] Tests unitaires
- [ ] Documentation API
- [ ] Déploiement production

---

## 📚 Documentation

| Document | Contenu |
|----------|---------|
| **UPGRADE_v3_0.md** | Détails complets des changements |
| **STRUCTURE_v3.md** | Arborescence & architecture |
| **QUICK_START.md** | Ce fichier (instructions rapides) |
| **README.md** | À mettre à jour |

---

## 🎯 Objectifs Atteints

✅ **Critères de saisie** - 4 étapes détaillées  
✅ **Charte Corse-Matin** - Palette #E60000 appliquée  
✅ **Validation** - Tous les champs obligatoires  
✅ **UX/UI** - Responsive, moderne, intuitive  
✅ **Build** - 0 erreurs, prêt production  

---

## 💬 Questions Fréquentes

**Q: Combien de temps pour remplir le formulaire?**  
R: ~6 minutes pour compléter les 4 étapes

**Q: Quels sont les champs obligatoires?**  
R: Voir checklist validation ci-dessus

**Q: Comment modifier les couleurs?**  
R: Éditer `tailwind.config.js` section `colors`

**Q: Phase 2 contient quoi?**  
R: Sélection supports + Génération auto + PDF export

**Q: Données où viennent?**  
R: `public/data/*.json` (modifiables)

---

## 📞 Support

- **Issues:** Vérifier console (F12)
- **Fichiers:** Voir STRUCTURE_v3.md
- **Modification:** UPGRADE_v3_0.md a tous les détails

---

**Prêt à tester?**

```bash
npm run dev
# → http://localhost:5173 ⚡
```

**Bonne utilisation!** 🎉

