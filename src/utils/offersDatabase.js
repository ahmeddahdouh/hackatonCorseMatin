/**
 * Base de données des offres Corse Matin
 * Générée à partir des tarifs de corse_matin_data.json
 */

import { loadCorsData, getSocialMediaStats, getWebTrafficStats } from './corsDataLoader';

let offersLoaded = false;
let allOffers = [];

/**
 * Générer les offres à partir des données Corse Matin
 */
export const generateOffersFromData = async () => {
  if (offersLoaded && allOffers.length > 0) return allOffers;

  const data = await loadCorsData();
  const social = getSocialMediaStats();
  const web = getWebTrafficStats();

  allOffers = [
    // ==================== PRINT - GAMME PRIVILÈGE ====================
    {
      id: 'print_page_une_module1',
      name: 'Page Une - Module 1',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Module 90 H x 92 L en Page Une quadrichromie',
      price: 1100,
      priceSamedi: 1300,
      dimensions: '90 H x 92 L',
      audience: 159000,
      impressions: 159000,
      duration: '1 parution'
    },
    {
      id: 'print_page_une_module2',
      name: 'Page Une - Module 2',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Module 90 H x 185 L en Page Une quadrichromie',
      price: 2100,
      priceSamedi: 2500,
      dimensions: '90 H x 185 L',
      audience: 159000,
      impressions: 238500,
      duration: '1 parution'
    },
    {
      id: 'print_page_une_exclusivite',
      name: 'Exclusivité Page Une',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Exclusivité 90 H x 280 L en Page Une',
      price: 2900,
      priceSamedi: 3500,
      dimensions: '90 H x 280 L',
      audience: 159000,
      impressions: 318000,
      duration: '1 parution'
    },
    {
      id: 'print_manchette',
      name: 'Manchette Corse Matin',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Manchette 55 H x 110 L',
      price: 700,
      priceSamedi: 900,
      dimensions: '55 H x 110 L',
      audience: 159000,
      impressions: 159000,
      duration: '1 parution'
    },
    {
      id: 'print_evenement',
      name: 'Un Événement',
      channel: 'Print',
      category: 'Gamme Privilège Premium',
      description: 'Manchettes + Bas de page + DER + Habillage HP',
      price: 10000,
      priceSamedi: 13000,
      dimensions: 'Pack complet',
      audience: 159000,
      impressions: 795000,
      duration: '1 parution'
    },
    {
      id: 'print_exclu_page_une',
      name: 'Exclu de Page Une',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Manchettes + Bas de page + Web',
      price: 4500,
      priceSamedi: 6000,
      dimensions: 'Multi-support',
      audience: 159000,
      impressions: 477000,
      duration: '1 parution'
    },
    {
      id: 'print_page2_manchette',
      name: 'Page Deux - Manchette Droite',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Manchette droite page 2',
      price: 350,
      priceSamedi: 400,
      dimensions: '56 H x 90 L',
      audience: 140000,
      impressions: 140000,
      duration: '1 parution'
    },
    {
      id: 'print_page2_module',
      name: 'Page Deux - Module Pied de Page',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Module pied de page 2',
      price: 2000,
      priceSamedi: 2200,
      dimensions: '90 H x 280 L',
      audience: 140000,
      impressions: 210000,
      duration: '1 parution'
    },
    {
      id: 'print_page3_1_8',
      name: 'Page Trois - 1/8 Page',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Module Pied de Page 1/8',
      price: 1100,
      priceSamedi: 1200,
      dimensions: '159 H x 90 L',
      audience: 130000,
      impressions: 130000,
      duration: '1 parution'
    },
    {
      id: 'print_page3_1_4',
      name: 'Page Trois - 1/4 Page',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Module Pied de Page 1/4',
      price: 1900,
      priceSamedi: 2400,
      dimensions: '159 H x 185 L',
      audience: 130000,
      impressions: 195000,
      duration: '1 parution'
    },
    {
      id: 'print_page3_1_3',
      name: 'Page Trois - 1/3 Page',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Module Pied de Page 1/3',
      price: 2800,
      priceSamedi: 3500,
      dimensions: '159 H x 280 L',
      audience: 130000,
      impressions: 260000,
      duration: '1 parution'
    },
    {
      id: 'print_page3_1_2',
      name: 'Page Trois - 1/2 Page',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Exclusivité Page 3 - 1/2 Page',
      price: 4800,
      priceSamedi: 6000,
      dimensions: '212 H x 280 L',
      audience: 130000,
      impressions: 325000,
      duration: '1 parution'
    },
    {
      id: 'print_panoramique_centre',
      name: 'Panoramique Centre Journal',
      channel: 'Print',
      category: 'Gamme Privilège Premium',
      description: '2 Pages en vis-à-vis au centre',
      price: 9850,
      priceSamedi: 12000,
      dimensions: '430 H x 590 L',
      audience: 159000,
      impressions: 477000,
      duration: '1 parution'
    },
    {
      id: 'print_panoramique_pages',
      name: 'Panoramique Au fil des pages',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: '2 Pages en vis-à-vis',
      price: 7600,
      priceSamedi: 9000,
      dimensions: '2 pages',
      audience: 140000,
      impressions: 420000,
      duration: '1 parution'
    },
    {
      id: 'print_derniere_page',
      name: 'Dernière Page - Pleine Page',
      channel: 'Print',
      category: 'Gamme Privilège Premium',
      description: 'Pleine Page Quadri en DER',
      price: 8000,
      priceSamedi: 10000,
      dimensions: '430 H x 280 L',
      audience: 159000,
      impressions: 477000,
      duration: '1 parution'
    },
    {
      id: 'print_derniere_1_2',
      name: 'Dernière Page - 1/2 Page',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: '1/2 Page Quadri en DER',
      price: 4100,
      priceSamedi: 5100,
      dimensions: '212 H x 280 L',
      audience: 159000,
      impressions: 318000,
      duration: '1 parution'
    },
    {
      id: 'print_local_ajaccio_manchette',
      name: 'Cahier Local Ajaccio/Bastia - Manchette',
      channel: 'Print',
      category: 'Gamme Locale',
      description: 'Manchette droite cahier local',
      price: 290,
      priceSamedi: 350,
      dimensions: '56 H x 90 L',
      audience: 80000,
      impressions: 80000,
      duration: '1 parution'
    },
    {
      id: 'print_local_ajaccio_bandeau',
      name: 'Cahier Local Ajaccio/Bastia - Bandeau',
      channel: 'Print',
      category: 'Gamme Locale',
      description: 'Bandeau pied de page cahier local',
      price: 1800,
      priceSamedi: 2200,
      dimensions: '130.5 H x 280 L',
      audience: 80000,
      impressions: 160000,
      duration: '1 parution'
    },
    {
      id: 'print_local_autres',
      name: 'Cahier Local Autres localités',
      channel: 'Print',
      category: 'Gamme Locale',
      description: 'Manchette droite autres localités',
      price: 220,
      priceSamedi: 280,
      dimensions: '56 H x 90 L',
      audience: 40000,
      impressions: 40000,
      duration: '1 parution'
    },
    {
      id: 'print_sports_manchette',
      name: 'Cahier Sports - Manchette',
      channel: 'Print',
      category: 'Gamme Sports',
      description: 'Manchette droite cahier sports',
      price: 290,
      priceSamedi: 350,
      dimensions: '56 H x 90 L',
      audience: 100000,
      impressions: 100000,
      duration: '1 parution'
    },
    {
      id: 'print_sports_bandeau',
      name: 'Cahier Sports - Bandeau',
      channel: 'Print',
      category: 'Gamme Sports',
      description: 'Bandeau pied de page sports',
      price: 1500,
      priceSamedi: 1950,
      dimensions: '130.5 H x 280 L',
      audience: 100000,
      impressions: 200000,
      duration: '1 parution'
    },
    {
      id: 'print_meteo_bandeau',
      name: 'Page Météo - Bandeau',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Bandeau Pied de Page Météo',
      price: 650,
      priceSamedi: 800,
      dimensions: '110 H x 280 L',
      audience: 159000,
      impressions: 159000,
      duration: '1 parution'
    },
    {
      id: 'print_tv_bandeau',
      name: 'Page TV - Bandeau',
      channel: 'Print',
      category: 'Gamme Privilège',
      description: 'Bandeau Pied de Page Programmes TV',
      price: 600,
      priceSamedi: 750,
      dimensions: '90 H x 280 L',
      audience: 159000,
      impressions: 159000,
      duration: '1 parution'
    },

    // ==================== PRINT - GAMME PERFORMANCE ====================
    {
      id: 'print_corse_info_1_8',
      name: 'Corse Info - 1/8ème',
      channel: 'Print',
      category: 'Gamme Performance',
      description: 'Format 1/8 pages Corse Info',
      price: 1000,
      priceSamedi: 1100,
      dimensions: '159 H x 90 L ou 74 H x 185 L',
      audience: 130000,
      impressions: 130000,
      duration: '1 parution'
    },
    {
      id: 'print_corse_info_1_4',
      name: 'Corse Info - 1/4 Page',
      channel: 'Print',
      category: 'Gamme Performance',
      description: 'Format 1/4 page Corse Info',
      price: 1900,
      priceSamedi: 2100,
      dimensions: '159 H x 185 L',
      audience: 130000,
      impressions: 195000,
      duration: '1 parution'
    },
    {
      id: 'print_corse_info_1_2',
      name: 'Corse Info - 1/2 Page',
      channel: 'Print',
      category: 'Gamme Performance',
      description: 'Format 1/2 page Corse Info',
      price: 3500,
      priceSamedi: 3800,
      dimensions: '212 H x 280 L',
      audience: 130000,
      impressions: 325000,
      duration: '1 parution'
    },
    {
      id: 'print_corse_info_page',
      name: 'Corse Info - Pleine Page',
      channel: 'Print',
      category: 'Gamme Performance',
      description: 'Pleine page Corse Info',
      price: 7000,
      priceSamedi: 7600,
      dimensions: '430 H x 280 L',
      audience: 130000,
      impressions: 390000,
      duration: '1 parution'
    },

    // ==================== PRINT - PACKS PROXI ====================
    {
      id: 'pack_proxi_3_small',
      name: 'Pack Proxi 3 parutions - Petit',
      channel: 'Print',
      category: 'Pack Proxi Corse',
      description: '3 parutions en 15 jours - Format 46 h x 90 l',
      price: 400,
      priceAutres: 350,
      dimensions: '46 h x 90 l',
      audience: 80000,
      impressions: 240000,
      duration: '3 parutions / 15 jours'
    },
    {
      id: 'pack_proxi_5_medium',
      name: 'Pack Proxi 5 parutions - Moyen',
      channel: 'Print',
      category: 'Pack Proxi Corse',
      description: '5 parutions en 15 jours - Format 102 h x 90 l',
      price: 1200,
      priceAutres: 1100,
      dimensions: '102 h x 90 l',
      audience: 80000,
      impressions: 400000,
      duration: '5 parutions / 15 jours'
    },
    {
      id: 'pack_proxi_7_large',
      name: 'Pack Proxi 7 parutions - Grand',
      channel: 'Print',
      category: 'Pack Proxi Corse',
      description: '7 parutions en 15 jours - Format 159 h x 90 l',
      price: 2400,
      priceAutres: 2100,
      dimensions: '159 h x 90 l',
      audience: 80000,
      impressions: 560000,
      duration: '7 parutions / 15 jours'
    },

    // ==================== PRINT - DIVERTO ====================
    {
      id: 'diverto_jaquette_corse',
      name: 'Diverto Jaquette Corse',
      channel: 'Print',
      category: 'Diverto',
      description: '1/2 Jaquette + 1 Page en 2ème - Édition Corse',
      price: 4500,
      dimensions: 'Forfait jaquette + 1 page',
      audience: 197000,
      impressions: 394000,
      duration: '1 parution'
    },
    {
      id: 'diverto_page',
      name: 'Diverto - Pleine Page',
      channel: 'Print',
      category: 'Diverto',
      description: 'Pleine page intérieure quadri',
      price: 1000,
      dimensions: 'Pleine page',
      audience: 197000,
      impressions: 197000,
      duration: '1 parution'
    },
    {
      id: 'diverto_1_2_page',
      name: 'Diverto - 1/2 Page',
      channel: 'Print',
      category: 'Diverto',
      description: 'Demi-page intérieure quadri',
      price: 600,
      dimensions: '1/2 page',
      audience: 197000,
      impressions: 148000,
      duration: '1 parution'
    },
    {
      id: 'diverto_evenement',
      name: 'Diverto Un Événement',
      channel: 'Print',
      category: 'Diverto Premium',
      description: 'Pack événement Diverto Corse',
      price: 5000,
      dimensions: 'Pack complet',
      audience: 197000,
      impressions: 591000,
      duration: '1 parution'
    },

    // ==================== PRINT - FEMINA ====================
    {
      id: 'femina_page',
      name: 'Femina - Pleine Page',
      channel: 'Print',
      category: 'Femina',
      description: 'Pleine page Femina Corse',
      price: 1000,
      dimensions: 'Page',
      audience: 3339000,
      impressions: 3339000,
      duration: '1 parution'
    },
    {
      id: 'femina_1_2_page',
      name: 'Femina - 1/2 Page',
      channel: 'Print',
      category: 'Femina',
      description: '1/2 page Femina Corse',
      price: 600,
      dimensions: '1/2 Page',
      audience: 3339000,
      impressions: 2500000,
      duration: '1 parution'
    },
    {
      id: 'femina_1_4_page',
      name: 'Femina - 1/4 Page',
      channel: 'Print',
      category: 'Femina',
      description: '1/4 page Femina Corse',
      price: 350,
      dimensions: '1/4 Page',
      audience: 3339000,
      impressions: 1670000,
      duration: '1 parution'
    },
    {
      id: 'femina_publi_1_page',
      name: 'Femina - Publi-Rédactionnel 1 Page',
      channel: 'Print',
      category: 'Femina',
      description: 'Publi-rédactionnel 1 page + frais techniques',
      price: 1050,
      dimensions: '1 Page',
      audience: 3339000,
      impressions: 3339000,
      duration: '1 parution'
    },

    // ==================== PRINT - SETTIMANA ====================
    {
      id: 'settimana_une_manchette',
      name: 'Settimana - Manchette Page Une',
      channel: 'Print',
      category: 'Settimana',
      description: 'Manchette titre droite Page Une',
      price: 450,
      dimensions: '56 H x 90 L',
      audience: 50000,
      impressions: 50000,
      duration: '1 parution'
    },
    {
      id: 'settimana_une_bandeau',
      name: 'Settimana - Bandeau Page Une',
      channel: 'Print',
      category: 'Settimana',
      description: 'Module bas de page Une',
      price: 1100,
      dimensions: '90 H x 280 L',
      audience: 50000,
      impressions: 75000,
      duration: '1 parution'
    },
    {
      id: 'settimana_panoramique',
      name: 'Settimana - Panoramique',
      channel: 'Print',
      category: 'Settimana',
      description: 'Double page panoramique',
      price: 3000,
      dimensions: '2× 430 H x 280 L',
      audience: 50000,
      impressions: 150000,
      duration: '1 parution'
    },
    {
      id: 'settimana_page',
      name: 'Settimana - Pleine Page',
      channel: 'Print',
      category: 'Settimana',
      description: 'Pleine page intérieure',
      price: 4000,
      dimensions: '430 H x 280 L',
      audience: 50000,
      impressions: 100000,
      duration: '1 parution'
    },

    // ==================== PRINT - EMPLOI / IMMO ====================
    {
      id: 'emploi_mod3',
      name: 'Emploi - Module 3',
      channel: 'Print',
      category: 'Emploi & Formation',
      description: 'Module annonce emploi 1 jour',
      price: 350,
      price3Jours: 700,
      price5Jours: 1200,
      dimensions: '102 H x 90 L',
      audience: 50000,
      impressions: 50000,
      duration: '1-5 jours'
    },
    {
      id: 'emploi_1_4_page',
      name: 'Emploi - 1/4 Page Corse Info',
      channel: 'Print',
      category: 'Emploi & Formation',
      description: 'Grand format emploi',
      price: 1000,
      price3Jours: 2000,
      price5Jours: 3000,
      dimensions: '212 H x 137,5 L',
      audience: 80000,
      impressions: 120000,
      duration: '1-5 jours'
    },
    {
      id: 'immo_bandeau_une',
      name: 'Immo/Moteurs - Bandeau Page Une',
      channel: 'Print',
      category: 'Immobilier & Moteurs',
      description: 'Bandeau page une immo/moteurs',
      price: 1200,
      dimensions: '130,5 mm H x 280 mm L',
      audience: 60000,
      impressions: 90000,
      duration: '1 parution'
    },
    {
      id: 'immo_1_2_page',
      name: 'Immo/Moteurs - 1/2 Page',
      channel: 'Print',
      category: 'Immobilier & Moteurs',
      description: '1/2 page immo/moteurs',
      price: 1200,
      dimensions: '212 mm H x 280 mm L',
      audience: 60000,
      impressions: 90000,
      duration: '1 parution'
    },
    {
      id: 'immo_page',
      name: 'Immo/Moteurs - Pleine Page',
      channel: 'Print',
      category: 'Immobilier & Moteurs',
      description: 'Pleine page immo/moteurs',
      price: 2000,
      dimensions: '430 mm H x 280 mm L',
      audience: 60000,
      impressions: 120000,
      duration: '1 parution'
    },

    // ==================== DIGITAL ====================
    {
      id: 'digital_display_homepage',
      name: 'Display Homepage corsematin.com',
      channel: 'Digital',
      category: 'Display Web',
      description: 'Bannière homepage - visibilité maximale',
      price: 1500,
      dimensions: 'Bannière 970x250',
      audience: Math.round((web.visites_totales || 2746059) * 0.3),
      impressions: Math.round((web.pages_vues_totales || 13992034) * 0.1),
      duration: '1 semaine',
      cpm: 8
    },
    {
      id: 'digital_display_run',
      name: 'Display Run of Site',
      channel: 'Digital',
      category: 'Display Web',
      description: 'Rotation sur tout le site',
      price: 800,
      dimensions: 'Multi-formats',
      audience: Math.round((web.visites_totales || 2746059) * 0.2),
      impressions: Math.round((web.pages_vues_totales || 13992034) * 0.05),
      duration: '1 semaine',
      cpm: 5
    },
    {
      id: 'digital_native_article',
      name: 'Article Sponsorisé',
      channel: 'Digital',
      category: 'Native Advertising',
      description: 'Article natif sur corsematin.com',
      price: 2000,
      dimensions: 'Article complet',
      audience: Math.round((web.visites_totales || 2746059) * 0.15),
      impressions: Math.round((web.visites_totales || 2746059) * 0.25),
      duration: '1 mois',
      cpm: 12
    },
    {
      id: 'digital_newsletter',
      name: 'Encart Newsletter',
      channel: 'Digital',
      category: 'Email Marketing',
      description: 'Encart dans la newsletter quotidienne',
      price: 500,
      dimensions: 'Encart 600x200',
      audience: 50000,
      impressions: 50000,
      duration: '1 envoi',
      cpm: 10
    },
    {
      id: 'digital_habillage',
      name: 'Habillage Site',
      channel: 'Digital',
      category: 'Display Premium',
      description: 'Habillage complet du site',
      price: 3500,
      dimensions: 'Habillage total',
      audience: Math.round((web.visites_totales || 2746059) * 0.5),
      impressions: Math.round((web.pages_vues_totales || 13992034) * 0.15),
      duration: '1 semaine',
      cpm: 15
    },
    {
      id: 'digital_video_preroll',
      name: 'Vidéo Pre-roll',
      channel: 'Digital',
      category: 'Vidéo',
      description: 'Vidéo pre-roll avant contenu',
      price: 2500,
      dimensions: '1920x1080',
      audience: Math.round((web.visites_totales || 2746059) * 0.1),
      impressions: Math.round((web.visites_totales || 2746059) * 0.15),
      duration: '1 semaine',
      cpm: 20
    },

    // ==================== SOCIAL ====================
    {
      id: 'social_facebook_post',
      name: 'Post Sponsorisé Facebook',
      channel: 'Social',
      category: 'Facebook',
      description: 'Post sponsorisé sur la page Corse Matin',
      price: 300,
      dimensions: '1200x628px',
      audience: Math.round((social.facebook || 265551) * 0.1),
      impressions: Math.round((social.facebook || 265551) * 0.25),
      duration: '1 post',
      followers: social.facebook || 265551
    },
    {
      id: 'social_facebook_campagne',
      name: 'Campagne Facebook Ads',
      channel: 'Social',
      category: 'Facebook',
      description: 'Campagne publicitaire Facebook ciblée Corse',
      price: 1000,
      dimensions: 'Multi-formats',
      audience: Math.round((social.facebook || 265551) * 0.3),
      impressions: Math.round((social.facebook || 265551) * 0.8),
      duration: '1 semaine'
    },
    {
      id: 'social_instagram_post',
      name: 'Post Sponsorisé Instagram',
      channel: 'Social',
      category: 'Instagram',
      description: 'Post sponsorisé sur Instagram Corse Matin',
      price: 350,
      dimensions: '1080x1080px',
      audience: Math.round((social.instagram || 107225) * 0.15),
      impressions: Math.round((social.instagram || 107225) * 0.35),
      duration: '1 post',
      followers: social.instagram || 107225
    },
    {
      id: 'social_instagram_story',
      name: 'Story Sponsorisée Instagram',
      channel: 'Social',
      category: 'Instagram',
      description: 'Story sponsorisée Instagram',
      price: 250,
      dimensions: '1080x1920px',
      audience: Math.round((social.instagram || 107225) * 0.2),
      impressions: Math.round((social.instagram || 107225) * 0.4),
      duration: '24h',
      followers: social.instagram || 107225
    },
    {
      id: 'social_instagram_reel',
      name: 'Reel Sponsorisé Instagram',
      channel: 'Social',
      category: 'Instagram',
      description: 'Reel sponsorisé sur Instagram',
      price: 500,
      dimensions: '1080x1920px',
      audience: Math.round((social.instagram || 107225) * 0.25),
      impressions: Math.round((social.instagram || 107225) * 0.6),
      duration: '1 reel'
    },
    {
      id: 'social_linkedin_post',
      name: 'Post Sponsorisé LinkedIn',
      channel: 'Social',
      category: 'LinkedIn',
      description: 'Post sponsorisé LinkedIn Corse Matin',
      price: 400,
      dimensions: '1200x627px',
      audience: Math.round((social.linkedin || 6450) * 0.2),
      impressions: Math.round((social.linkedin || 6450) * 0.5),
      duration: '1 post',
      followers: social.linkedin || 6450
    },
    {
      id: 'social_tiktok_video',
      name: 'Vidéo TikTok Sponsorisée',
      channel: 'Social',
      category: 'TikTok',
      description: 'Vidéo sponsorisée sur TikTok',
      price: 600,
      dimensions: '1080x1920px',
      audience: Math.round((social.tiktok || 22664) * 0.3),
      impressions: Math.round((social.tiktok || 22664) * 0.8),
      duration: '1 vidéo',
      followers: social.tiktok || 22664
    },
    {
      id: 'social_youtube_preroll',
      name: 'Pre-roll YouTube',
      channel: 'Social',
      category: 'YouTube',
      description: 'Publicité pre-roll sur chaîne YouTube',
      price: 800,
      dimensions: '1920x1080',
      audience: Math.round((social.youtube || 12767) * 0.4),
      impressions: Math.round((social.youtube || 12767) * 1.2),
      duration: '1 semaine',
      followers: social.youtube || 12767
    },
    {
      id: 'social_pack_multi',
      name: 'Pack Multi-Réseaux',
      channel: 'Social',
      category: 'Pack Social',
      description: 'Campagne Facebook + Instagram + LinkedIn',
      price: 1500,
      dimensions: 'Multi-formats',
      audience: Math.round(((social.facebook || 265551) + (social.instagram || 107225) + (social.linkedin || 6450)) * 0.15),
      impressions: Math.round(((social.facebook || 265551) + (social.instagram || 107225) + (social.linkedin || 6450)) * 0.4),
      duration: '1 semaine'
    },

    // ==================== EVENT ====================
    {
      id: 'event_sponsoring_petit',
      name: 'Sponsoring Événement - Petit',
      channel: 'Event',
      category: 'Sponsoring',
      description: 'Présence logo et visibilité événement local',
      price: 2000,
      dimensions: 'Logo + mentions',
      audience: 3000,
      impressions: 9000,
      duration: '1 événement'
    },
    {
      id: 'event_sponsoring_moyen',
      name: 'Sponsoring Événement - Moyen',
      channel: 'Event',
      category: 'Sponsoring',
      description: 'Stand + visibilité + relais médias',
      price: 5000,
      dimensions: 'Stand 9m² + visibilité',
      audience: 8000,
      impressions: 24000,
      duration: '1 événement'
    },
    {
      id: 'event_sponsoring_grand',
      name: 'Sponsoring Événement - Premium',
      channel: 'Event',
      category: 'Sponsoring Premium',
      description: 'Partenaire principal + couverture médiatique complète',
      price: 10000,
      dimensions: 'Pack complet',
      audience: 15000,
      impressions: 75000,
      duration: '1 événement'
    },
    {
      id: 'event_salon',
      name: 'Participation Salon',
      channel: 'Event',
      category: 'Salons',
      description: 'Stand salon professionnel Corse',
      price: 3500,
      dimensions: 'Stand 12m²',
      audience: 5000,
      impressions: 15000,
      duration: '2-3 jours'
    },
    {
      id: 'event_conference',
      name: 'Conférence / Table Ronde',
      channel: 'Event',
      category: 'Conférences',
      description: 'Organisation conférence avec couverture médiatique',
      price: 4000,
      dimensions: 'Événement complet',
      audience: 200,
      impressions: 50000,
      duration: '1 événement'
    }
  ];

  offersLoaded = true;
  return allOffers;
};

/**
 * Obtenir toutes les offres
 */
export const getAllOffers = async () => {
  return await generateOffersFromData();
};

/**
 * Obtenir les offres par canal
 */
export const getOffersByChannel = async (channel) => {
  const offers = await generateOffersFromData();
  return offers.filter(o => o.channel === channel);
};

/**
 * Obtenir les offres par catégorie
 */
export const getOffersByCategory = async (category) => {
  const offers = await generateOffersFromData();
  return offers.filter(o => o.category === category);
};

/**
 * Obtenir une offre par ID
 */
export const getOfferById = async (id) => {
  const offers = await generateOffersFromData();
  return offers.find(o => o.id === id);
};

/**
 * Filtrer les offres par budget
 */
export const getOffersWithinBudget = async (maxBudget, channel = null) => {
  let offers = await generateOffersFromData();
  if (channel) {
    offers = offers.filter(o => o.channel === channel);
  }
  return offers.filter(o => o.price <= maxBudget);
};

/**
 * Obtenir les catégories disponibles par canal
 */
export const getCategoriesByChannel = async (channel) => {
  const offers = await getOffersByChannel(channel);
  const categories = new Set(offers.map(o => o.category));
  return Array.from(categories);
};

/**
 * Calculer les KPIs pour une sélection d'offres
 */
export const calculateKPIsForOffers = (selectedOffers, budget) => {
  let totalAudience = 0;
  let totalImpressions = 0;

  selectedOffers.forEach(offer => {
    totalAudience += offer.audience || 0;
    totalImpressions += offer.impressions || 0;
  });

  const cpm = totalImpressions > 0 ? (budget / (totalImpressions / 1000)).toFixed(2) : 0;

  return {
    estimatedReach: totalAudience,
    estimatedImpressions: totalImpressions,
    estimatedCPM: parseFloat(cpm)
  };
};

export default {
  generateOffersFromData,
  getAllOffers,
  getOffersByChannel,
  getOffersByCategory,
  getOfferById,
  getOffersWithinBudget,
  getCategoriesByChannel,
  calculateKPIsForOffers
};
