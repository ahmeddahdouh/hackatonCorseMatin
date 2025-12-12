// Service de connexion à l'API Mistral pour le chatbot Plan Média
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Clé API Mistral - À configurer via variable d'environnement
const getApiKey = () => {
  return localStorage.getItem('mistral_api_key') || import.meta.env.VITE_MISTRAL_API_KEY || '';
};

// Contexte métier Corse Matin pour le chatbot
const CORSE_MATIN_CONTEXT = `
Tu es un assistant commercial expert en plan média pour Corse Matin, le principal quotidien régional de Corse.
Tu aides les commerciaux à créer des plans médias personnalisés pour leurs clients.

=== DONNÉES CORSE MATIN ===

📰 AUDIENCES PRINT:
- Corse Matin Quotidien: 159 000 lecteurs/jour (référence ACPM)
- Diffusion: 25 000 exemplaires/jour
- Zone: Toute la Corse (2A et 2B)
- Lectorat: CSP+, 35-65 ans majoritairement

📱 AUDIENCES DIGITALES:
- Site corsematin.com: 2 746 059 visites/mois
- Pages vues: 8 500 000/mois
- Temps moyen: 3 min 45 sec
- Mobile: 68% du trafic

📲 RÉSEAUX SOCIAUX:
- Facebook: 278 238 abonnés
- Instagram: 123 000 abonnés
- TikTok: 28 600 abonnés
- LinkedIn: 5 200 abonnés
- YouTube: 8 500 abonnés

=== TARIFS PUBLICITAIRES ===

🗞️ PRESSE PRINT - GAMME PRIVILÈGE (Quadri):
- Pleine page: 4 280€
- Demi-page: 2 300€
- Quart de page: 1 250€
- 1/8 page: 680€
- Manchette locale: 220€
- Manchette région: 320€

🗞️ PRESSE PRINT - GAMME PERFORMANCE:
- Module 52mm x 2 col: 180€
- Module 78mm x 3 col: 360€
- Module 104mm x 4 col: 580€

💻 DIGITAL - DISPLAY:
- Habillage HP: 2 500€/semaine
- Mega Banner: 35€ CPM
- Pavé 300x250: 25€ CPM
- Native Ads: 40€ CPM
- Interstitiel mobile: 45€ CPM
- Newsletter sponsorisée: 800€/envoi

📱 SOCIAL MEDIA:
- Post sponsorisé Facebook: 300-800€
- Story Instagram: 200-500€
- Campagne TikTok: 500-1500€
- Article LinkedIn: 400€

🎪 ÉVÉNEMENTIEL:
- Sponsoring événements: 2 000-10 000€
- Stands salons: 1 500-5 000€
- Jeux concours: 1 000-3 000€

=== PACKS PROXI CORSE ===
- Pack Bronze (5 parutions): 450€
- Pack Argent (10 parutions): 800€
- Pack Or (20 parutions): 1 400€
- Pack Platine (40 parutions): 2 500€

=== RÈGLES MÉTIER ===

1. RÉPARTITION BUDGÉTAIRE RECOMMANDÉE:
   - Budget < 5 000€: Focus Print (60%) + Digital (40%)
   - Budget 5 000-15 000€: Print (45%) + Digital (40%) + Social (15%)
   - Budget 15 000-30 000€: Print (40%) + Digital (35%) + Social (20%) + Event (5%)
   - Budget > 30 000€: Mix équilibré selon objectifs

2. OBJECTIFS ET CANAUX:
   - Notoriété: Print + Habillage digital + Social
   - Trafic web: Display + Native + Social
   - Drive-to-store: Print local + Géolocalisation mobile
   - Lancement produit: Mix 360° avec événementiel
   - Fidélisation: Newsletter + Social

3. CIBLAGE GÉOGRAPHIQUE:
   - Micro-régions: Ajaccio, Bastia, Porto-Vecchio, Calvi, Corte, Propriano
   - Corse du Sud (2A): 158 000 habitants
   - Haute-Corse (2B): 181 000 habitants

4. SAISONNALITÉ:
   - Haute saison touristique: Mai-Septembre (+30% audience)
   - Période fêtes: Novembre-Décembre
   - Basse saison: Janvier-Mars

=== TON RÔLE ===

- Pose des questions pour comprendre les besoins du client
- Propose des recommandations adaptées au budget et objectifs
- Calcule les estimations de reach et impressions
- Suggère la meilleure répartition budgétaire
- Explique les avantages de chaque support
- Aide à construire un plan média cohérent

Réponds toujours en français, de manière professionnelle mais accessible.
Utilise des emojis pour rendre les échanges plus dynamiques.
`;

/**
 * Envoyer un message au chatbot Mistral
 * @param {Array} messages - Historique des messages [{role: 'user'|'assistant', content: string}]
 * @param {string} customContext - Contexte additionnel optionnel
 * @returns {Promise<string>} - Réponse du chatbot
 */
export const sendMessageToMistral = async (messages, customContext = '') => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('Clé API Mistral non configurée. Veuillez la configurer dans les paramètres.');
  }

  // Construire le contexte système
  const systemContext = customContext 
    ? `${CORSE_MATIN_CONTEXT}\n\n=== CONTEXTE ADDITIONNEL ===\n${customContext}`
    : CORSE_MATIN_CONTEXT;

  // Préparer les messages pour l'API
  const apiMessages = [
    { role: 'system', content: systemContext },
    ...messages.map(m => ({
      role: m.role,
      content: m.content
    }))
  ];

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.95
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Erreur API Mistral: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';
  } catch (error) {
    console.error('Erreur Mistral API:', error);
    throw error;
  }
};

/**
 * Configurer la clé API Mistral
 * @param {string} apiKey - Clé API Mistral
 */
export const setMistralApiKey = (apiKey) => {
  localStorage.setItem('mistral_api_key', apiKey);
};

/**
 * Vérifier si la clé API est configurée
 * @returns {boolean}
 */
export const isMistralConfigured = () => {
  return !!getApiKey();
};

/**
 * Obtenir le contexte métier par défaut
 * @returns {string}
 */
export const getDefaultContext = () => {
  return CORSE_MATIN_CONTEXT;
};

/**
 * Générer un résumé de plan média à partir de la conversation
 * @param {Array} messages - Historique de la conversation
 * @returns {Promise<object>} - Plan média structuré
 */
export const generatePlanSummary = async (messages) => {
  const summaryPrompt = `
Basé sur notre conversation, génère un résumé structuré du plan média en JSON avec le format suivant:
{
  "clientName": "Nom du client",
  "budget": 0,
  "objectives": ["objectif1", "objectif2"],
  "distribution": {
    "print": 0,
    "digital": 0,
    "social": 0,
    "event": 0
  },
  "recommendations": ["recommandation1", "recommandation2"],
  "estimatedReach": 0,
  "estimatedImpressions": 0
}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.
`;

  const summaryMessages = [
    ...messages,
    { role: 'user', content: summaryPrompt }
  ];

  try {
    const response = await sendMessageToMistral(summaryMessages);
    // Extraire le JSON de la réponse
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Format de réponse invalide');
  } catch (error) {
    console.error('Erreur génération résumé:', error);
    return null;
  }
};

export default {
  sendMessageToMistral,
  setMistralApiKey,
  isMistralConfigured,
  getDefaultContext,
  generatePlanSummary
};
