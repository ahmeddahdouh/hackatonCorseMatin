"""
Catalogue des supports média Corse-Matin
Définition complète de tous les supports avec leurs audiences et profils
"""

from models import SupportMedia, CategorieSupport, AudienceProfile

# =============================================================================
# CATALOGUE DES SUPPORTS MÉDIA CORSE-MATIN
# =============================================================================

CATALOGUE_SUPPORTS: list[SupportMedia] = [
    # =========================================================================
    # PRINT - Journal Corse-Matin
    # =========================================================================
    SupportMedia(
        id="cm_pleine_page",
        nom="Pleine Page Couleur",
        categorie=CategorieSupport.PRINT,
        description="Pleine page couleur dans le journal Corse-Matin",
        prix_ht=4500.0,
        audience_brute=85000,
        profil=AudienceProfile(femme=52, homme=48, age_25_49=35, age_50_plus=55, csp_plus=42),
        format="PRINT_FULL",
        icon="Newspaper"
    ),
    SupportMedia(
        id="cm_demi_page",
        nom="Demi-Page Couleur",
        categorie=CategorieSupport.PRINT,
        description="Demi-page couleur dans le journal",
        prix_ht=2800.0,
        audience_brute=75000,
        profil=AudienceProfile(femme=52, homme=48, age_25_49=35, age_50_plus=55, csp_plus=42),
        format="PRINT_HALF",
        icon="Newspaper"
    ),
    SupportMedia(
        id="cm_quart_page",
        nom="Quart de Page Couleur",
        categorie=CategorieSupport.PRINT,
        description="Quart de page couleur dans le journal",
        prix_ht=1600.0,
        audience_brute=65000,
        profil=AudienceProfile(femme=52, homme=48, age_25_49=35, age_50_plus=55, csp_plus=42),
        format="PRINT_QUARTER",
        icon="Newspaper"
    ),
    SupportMedia(
        id="cm_une",
        nom="Manchette Une",
        categorie=CategorieSupport.PRINT,
        description="Encart premium en Une du journal",
        prix_ht=3200.0,
        audience_brute=90000,
        profil=AudienceProfile(femme=50, homme=50, age_25_49=38, age_50_plus=52, csp_plus=45),
        format="PRINT_UNE",
        icon="Star"
    ),
    SupportMedia(
        id="cm_encart",
        nom="Encart Publicitaire",
        categorie=CategorieSupport.PRINT,
        description="Encart inséré dans le journal",
        prix_ht=2200.0,
        audience_brute=70000,
        profil=AudienceProfile(femme=54, homme=46, age_25_49=32, age_50_plus=58, csp_plus=38),
        format="PRINT_INSERT",
        icon="FileText"
    ),
    SupportMedia(
        id="cm_supplement",
        nom="Supplément Magazine",
        categorie=CategorieSupport.PRINT,
        description="Page dans le supplément magazine hebdomadaire",
        prix_ht=3800.0,
        audience_brute=55000,
        profil=AudienceProfile(femme=58, homme=42, age_25_49=42, age_50_plus=48, csp_plus=52),
        format="PRINT_MAG",
        icon="BookOpen"
    ),
    
    # =========================================================================
    # DIGITAL - Site Web & Display
    # =========================================================================
    SupportMedia(
        id="web_habillage",
        nom="Habillage Site Web",
        categorie=CategorieSupport.DIGITAL,
        description="Habillage complet de la homepage corsematin.com",
        prix_ht=1800.0,
        audience_brute=120000,
        profil=AudienceProfile(femme=48, homme=52, age_25_49=58, age_50_plus=32, csp_plus=48),
        format="DIGITAL_SKIN",
        icon="Monitor"
    ),
    SupportMedia(
        id="web_megabanner",
        nom="Méga Banner",
        categorie=CategorieSupport.DIGITAL,
        description="Banner 970x250 en haut de page",
        prix_ht=950.0,
        audience_brute=95000,
        profil=AudienceProfile(femme=48, homme=52, age_25_49=58, age_50_plus=32, csp_plus=48),
        format="DIGITAL_BANNER",
        icon="LayoutTop"
    ),
    SupportMedia(
        id="web_pave",
        nom="Pavé 300x250",
        categorie=CategorieSupport.DIGITAL,
        description="Pavé publicitaire sidebar",
        prix_ht=650.0,
        audience_brute=80000,
        profil=AudienceProfile(femme=48, homme=52, age_25_49=58, age_50_plus=32, csp_plus=48),
        format="DIGITAL_MPU",
        icon="Square"
    ),
    SupportMedia(
        id="web_interstitiel",
        nom="Interstitiel",
        categorie=CategorieSupport.DIGITAL,
        description="Format plein écran entre deux pages",
        prix_ht=1200.0,
        audience_brute=70000,
        profil=AudienceProfile(femme=46, homme=54, age_25_49=62, age_50_plus=28, csp_plus=50),
        format="DIGITAL_INTERSTITIAL",
        icon="Maximize"
    ),
    SupportMedia(
        id="web_native",
        nom="Article Sponsorisé",
        categorie=CategorieSupport.DIGITAL,
        description="Contenu natif intégré éditorialement",
        prix_ht=2500.0,
        audience_brute=45000,
        profil=AudienceProfile(femme=50, homme=50, age_25_49=55, age_50_plus=35, csp_plus=55),
        format="DIGITAL_NATIVE",
        icon="FileEdit"
    ),
    SupportMedia(
        id="web_video_preroll",
        nom="Vidéo Pré-roll",
        categorie=CategorieSupport.DIGITAL,
        description="Vidéo 15-30s avant contenu vidéo",
        prix_ht=1400.0,
        audience_brute=55000,
        profil=AudienceProfile(femme=45, homme=55, age_25_49=65, age_50_plus=25, csp_plus=52),
        format="VIDEO_PREROLL",
        icon="Play"
    ),
    SupportMedia(
        id="web_newsletter",
        nom="Newsletter Sponsorisée",
        categorie=CategorieSupport.DIGITAL,
        description="Encart dans la newsletter quotidienne",
        prix_ht=800.0,
        audience_brute=35000,
        profil=AudienceProfile(femme=55, homme=45, age_25_49=45, age_50_plus=45, csp_plus=58),
        format="DIGITAL_EMAIL",
        icon="Mail"
    ),
    
    # =========================================================================
    # SOCIAL - Réseaux Sociaux
    # =========================================================================
    SupportMedia(
        id="fb_post_sponsorise",
        nom="Post Facebook Sponsorisé",
        categorie=CategorieSupport.SOCIAL,
        description="Publication sponsorisée sur la page Facebook CM",
        prix_ht=450.0,
        audience_brute=65000,
        profil=AudienceProfile(femme=56, homme=44, age_25_49=48, age_50_plus=42, csp_plus=38),
        format="SOCIAL_POST",
        icon="Facebook"
    ),
    SupportMedia(
        id="fb_story",
        nom="Story Facebook",
        categorie=CategorieSupport.SOCIAL,
        description="Story sponsorisée Facebook 24h",
        prix_ht=350.0,
        audience_brute=40000,
        profil=AudienceProfile(femme=58, homme=42, age_25_49=55, age_50_plus=35, csp_plus=35),
        format="STORY_FB",
        icon="Camera"
    ),
    SupportMedia(
        id="insta_post",
        nom="Post Instagram",
        categorie=CategorieSupport.SOCIAL,
        description="Publication sponsorisée Instagram",
        prix_ht=550.0,
        audience_brute=55000,
        profil=AudienceProfile(femme=62, homme=38, age_25_49=72, age_50_plus=18, csp_plus=45),
        format="SOCIAL_INSTA",
        icon="Instagram"
    ),
    SupportMedia(
        id="insta_story",
        nom="Story Instagram",
        categorie=CategorieSupport.SOCIAL,
        description="Story sponsorisée Instagram 24h",
        prix_ht=400.0,
        audience_brute=48000,
        profil=AudienceProfile(femme=64, homme=36, age_25_49=75, age_50_plus=15, csp_plus=42),
        format="STORY_INSTA",
        icon="Sparkles"
    ),
    SupportMedia(
        id="insta_reel",
        nom="Reel Instagram",
        categorie=CategorieSupport.SOCIAL,
        description="Reel vidéo sponsorisé Instagram",
        prix_ht=700.0,
        audience_brute=70000,
        profil=AudienceProfile(femme=60, homme=40, age_25_49=78, age_50_plus=12, csp_plus=40),
        format="REEL_INSTA",
        icon="Film"
    ),
    SupportMedia(
        id="tiktok_video",
        nom="Vidéo TikTok",
        categorie=CategorieSupport.SOCIAL,
        description="Vidéo sponsorisée TikTok",
        prix_ht=600.0,
        audience_brute=45000,
        profil=AudienceProfile(femme=55, homme=45, age_25_49=85, age_50_plus=5, csp_plus=32),
        format="VIDEO_TIKTOK",
        icon="Video"
    ),
    SupportMedia(
        id="linkedin_post",
        nom="Post LinkedIn",
        categorie=CategorieSupport.SOCIAL,
        description="Publication sponsorisée LinkedIn",
        prix_ht=750.0,
        audience_brute=25000,
        profil=AudienceProfile(femme=42, homme=58, age_25_49=70, age_50_plus=25, csp_plus=78),
        format="SOCIAL_LINKEDIN",
        icon="Linkedin"
    ),
    
    # =========================================================================
    # PACKS - Offres combinées
    # =========================================================================
    SupportMedia(
        id="pack_360",
        nom="Pack 360° Premium",
        categorie=CategorieSupport.PACK,
        description="Print + Digital + Social - Couverture maximale",
        prix_ht=8500.0,
        audience_brute=180000,
        profil=AudienceProfile(femme=52, homme=48, age_25_49=50, age_50_plus=40, csp_plus=48),
        format="PACK_FULL",
        icon="Layers"
    ),
    SupportMedia(
        id="pack_print_digital",
        nom="Pack Print + Digital",
        categorie=CategorieSupport.PACK,
        description="Journal + Site Web combinés",
        prix_ht=5800.0,
        audience_brute=140000,
        profil=AudienceProfile(femme=50, homme=50, age_25_49=45, age_50_plus=45, csp_plus=46),
        format="PACK_PD",
        icon="Package"
    ),
    SupportMedia(
        id="pack_digital_social",
        nom="Pack Digital + Social",
        categorie=CategorieSupport.PACK,
        description="Site Web + Réseaux sociaux",
        prix_ht=3200.0,
        audience_brute=130000,
        profil=AudienceProfile(femme=54, homme=46, age_25_49=62, age_50_plus=28, csp_plus=44),
        format="PACK_DS",
        icon="Share2"
    ),
    SupportMedia(
        id="pack_video",
        nom="Pack Vidéo Multi-Plateforme",
        categorie=CategorieSupport.PACK,
        description="Vidéo sur Web + Instagram + TikTok",
        prix_ht=2400.0,
        audience_brute=110000,
        profil=AudienceProfile(femme=55, homme=45, age_25_49=70, age_50_plus=20, csp_plus=42),
        format="VIDEO_PACK",
        icon="PlayCircle"
    ),
    SupportMedia(
        id="pack_notoriete",
        nom="Pack Notoriété Locale",
        categorie=CategorieSupport.PACK,
        description="UNE + Habillage Web + Posts Social",
        prix_ht=6200.0,
        audience_brute=160000,
        profil=AudienceProfile(femme=51, homme=49, age_25_49=48, age_50_plus=42, csp_plus=50),
        format="PACK_BRAND",
        icon="Award"
    ),
    SupportMedia(
        id="pack_evenement",
        nom="Pack Événementiel",
        categorie=CategorieSupport.PACK,
        description="Couverture complète pour événement",
        prix_ht=4500.0,
        audience_brute=125000,
        profil=AudienceProfile(femme=53, homme=47, age_25_49=52, age_50_plus=38, csp_plus=45),
        format="PACK_EVENT",
        icon="Calendar"
    ),
]


def get_catalogue() -> list[SupportMedia]:
    """Retourne le catalogue complet des supports"""
    return CATALOGUE_SUPPORTS


def get_support_by_id(support_id: str) -> SupportMedia | None:
    """Récupère un support par son ID"""
    for support in CATALOGUE_SUPPORTS:
        if support.id == support_id:
            return support
    return None


def get_supports_by_categorie(categorie: CategorieSupport) -> list[SupportMedia]:
    """Filtre les supports par catégorie"""
    return [s for s in CATALOGUE_SUPPORTS if s.categorie == categorie]


def get_categories() -> list[str]:
    """Retourne la liste des catégories disponibles"""
    return [c.value for c in CategorieSupport]
