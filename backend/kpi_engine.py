"""
Moteur de calcul KPI Prévisionnels pour Corse-Matin
Implémente toute la logique de simulation des KPIs média
"""

from typing import Dict, List
from models import (
    SimulationRequest, SimulationItem, KPIProjection, 
    AudienceProfileResponse, SexeCible, AgeCible
)
from catalogue import get_support_by_id, CategorieSupport

# =============================================================================
# CONSTANTES POPULATION CORSE
# =============================================================================

POPULATION = {
    "TOTAL": 260000,
    "FEMME": 135000,
    "HOMME": 125000,
    "25-49": 110000,
    "50+": 120000,
    # Segments croisés (estimations)
    "FEMME_25_49": 58000,
    "FEMME_50_PLUS": 67000,
    "HOMME_25_49": 52000,
    "HOMME_50_PLUS": 53000,
}

# Taux de clic par catégorie de support
CTR_PAR_CATEGORIE = {
    CategorieSupport.PRINT: 0.002,      # 0.2%
    CategorieSupport.DIGITAL: 0.015,    # 1.5%
    CategorieSupport.SOCIAL: 0.015,     # 1.5%
    CategorieSupport.PACK: 0.008,       # 0.8%
}

# Formats vidéo (40% des impressions = vues)
FORMATS_VIDEO = ["VIDEO", "STORY", "REEL"]

# Facteurs de déduplication
DEDUP_MULTI_MEDIA = 0.90  # Si plusieurs types de médias
DEDUP_MONO_MEDIA = 0.80   # Si un seul type

# Plafond de saturation
PLAFOND_SATURATION = 0.96  # 96% max de la cible


def get_population_cible(target_sexe: SexeCible, target_age: AgeCible) -> int:
    """
    Calcule la population de référence selon les critères de ciblage
    """
    if target_sexe == SexeCible.MIXTE and target_age == AgeCible.TOUS:
        return POPULATION["TOTAL"]
    
    if target_sexe == SexeCible.MIXTE:
        return POPULATION[target_age.value]
    
    if target_age == AgeCible.TOUS:
        return POPULATION[target_sexe.value]
    
    # Ciblage croisé
    key = f"{target_sexe.value}_{target_age.value.replace('-', '_').replace('+', '_PLUS')}"
    return POPULATION.get(key, POPULATION["TOTAL"] // 4)


def get_ponderation_profil(profil, target_sexe: SexeCible, target_age: AgeCible) -> float:
    """
    Calcule le coefficient de pondération basé sur le profil du support
    et la cible choisie
    """
    ponderations = []
    
    # Pondération sexe
    if target_sexe == SexeCible.FEMME:
        ponderations.append(profil.femme / 100)
    elif target_sexe == SexeCible.HOMME:
        ponderations.append(profil.homme / 100)
    else:
        ponderations.append(1.0)  # Mixte = pas de pondération
    
    # Pondération âge
    if target_age == AgeCible.AGE_25_49:
        ponderations.append(profil.age_25_49 / 100)
    elif target_age == AgeCible.AGE_50_PLUS:
        ponderations.append(profil.age_50_plus / 100)
    else:
        ponderations.append(1.0)  # Tous = pas de pondération
    
    # Moyenne géométrique pour éviter les valeurs extrêmes
    if len(ponderations) == 2:
        return (ponderations[0] * ponderations[1]) ** 0.5
    return ponderations[0] if ponderations else 1.0


def is_format_video(format_str: str) -> bool:
    """Vérifie si le format est un format vidéo"""
    return any(v in format_str.upper() for v in FORMATS_VIDEO)


def calculer_kpi_previsionnels(request: SimulationRequest) -> KPIProjection:
    """
    Moteur principal de calcul des KPIs prévisionnels
    
    Args:
        request: Requête de simulation avec items, cible et budget
    
    Returns:
        KPIProjection avec tous les KPIs calculés
    """
    
    # 1. Récupérer la population cible
    population_cible = get_population_cible(request.target_sexe, request.target_age)
    
    # 2. Initialiser les accumulateurs
    total_impressions = 0
    total_clics = 0
    total_vues_video = 0
    budget_print = 0.0
    budget_digital = 0.0
    budget_social = 0.0
    budget_pack = 0.0
    
    audiences_par_support = []
    categories_presentes = set()
    detail_supports = []
    
    # Accumulateurs pour le profil d'audience pondéré
    profil_femme_acc = 0.0
    profil_homme_acc = 0.0
    profil_25_49_acc = 0.0
    profil_50_plus_acc = 0.0
    profil_csp_plus_acc = 0.0
    total_poids_profil = 0
    
    # 3. Traiter chaque item du panier
    for item in request.items:
        support = get_support_by_id(item.id)
        if not support:
            continue
        
        categories_presentes.add(support.categorie)
        
        # Calculer l'audience pondérée pour ce support
        ponderation = get_ponderation_profil(
            support.profil, 
            request.target_sexe, 
            request.target_age
        )
        
        audience_item = int(support.audience_brute * ponderation * item.quantite)
        audiences_par_support.append(audience_item)
        
        # Impressions totales
        impressions_item = support.audience_brute * item.quantite
        total_impressions += impressions_item
        
        # Budget par catégorie
        cout_item = support.prix_ht * item.quantite
        if support.categorie == CategorieSupport.PRINT:
            budget_print += cout_item
        elif support.categorie == CategorieSupport.DIGITAL:
            budget_digital += cout_item
        elif support.categorie == CategorieSupport.SOCIAL:
            budget_social += cout_item
        else:  # PACK
            budget_pack += cout_item
        
        # Clics estimés
        ctr = CTR_PAR_CATEGORIE.get(support.categorie, 0.01)
        total_clics += int(impressions_item * ctr)
        
        # Vues vidéo
        if is_format_video(support.format):
            total_vues_video += int(impressions_item * 0.40)
        
        # Profil d'audience (pondéré par audience)
        poids = audience_item
        profil_femme_acc += support.profil.femme * poids
        profil_homme_acc += support.profil.homme * poids
        profil_25_49_acc += support.profil.age_25_49 * poids
        profil_50_plus_acc += support.profil.age_50_plus * poids
        profil_csp_plus_acc += support.profil.csp_plus * poids
        total_poids_profil += poids
        
        # Détail pour Sankey
        detail_supports.append({
            "id": support.id,
            "nom": support.nom,
            "categorie": support.categorie.value,
            "budget": cout_item,
            "audience": audience_item,
            "impressions": impressions_item
        })
    
    # 4. Calcul de la déduplication
    nb_categories = len(categories_presentes)
    facteur_dedup = DEDUP_MULTI_MEDIA if nb_categories > 1 else DEDUP_MONO_MEDIA
    
    # Audience brute combinée (somme avec déduplication)
    audience_brute_combinee = sum(audiences_par_support)
    
    # Formule de déduplication avec asymptote
    # Plus on cumule d'audience, plus la déduplication est importante
    if audience_brute_combinee > 0:
        # Modèle de reach avec saturation
        taux_brut = audience_brute_combinee / population_cible
        # Application de la formule de Sainsbury (1-reach)^n
        audience_nette = int(
            population_cible * (1 - (1 - facteur_dedup) ** taux_brut) * PLAFOND_SATURATION
        )
        # Limiter à la population cible * plafond
        audience_nette = min(audience_nette, int(population_cible * PLAFOND_SATURATION))
    else:
        audience_nette = 0
    
    # 5. Calcul des KPIs principaux
    budget_total = request.budget_net_ht
    
    # GRP = (Impressions / Population cible) * 100
    grp = (total_impressions / population_cible * 100) if population_cible > 0 else 0
    
    # Taux de couverture
    taux_couverture = (audience_nette / population_cible * 100) if population_cible > 0 else 0
    
    # Fréquence moyenne
    frequence_moyenne = (total_impressions / audience_nette) if audience_nette > 0 else 0
    
    # CPM
    cpm_moyen = (budget_total / total_impressions * 1000) if total_impressions > 0 else 0
    
    # Coût par GRP
    cout_par_grp = (budget_total / grp) if grp > 0 else 0
    
    # 6. Répartition du budget
    budget_total_catalogue = budget_print + budget_digital + budget_social + budget_pack
    if budget_total_catalogue > 0:
        repartition_print = ((budget_print + budget_pack * 0.4) / budget_total_catalogue) * 100
        repartition_digital = ((budget_digital + budget_social + budget_pack * 0.6) / budget_total_catalogue) * 100
    else:
        repartition_print = 0
        repartition_digital = 0
    
    # 7. Profil d'audience moyen
    if total_poids_profil > 0:
        profil_audience = AudienceProfileResponse(
            femme=round(profil_femme_acc / total_poids_profil, 1),
            homme=round(profil_homme_acc / total_poids_profil, 1),
            age_25_49=round(profil_25_49_acc / total_poids_profil, 1),
            age_50_plus=round(profil_50_plus_acc / total_poids_profil, 1),
            csp_plus=round(profil_csp_plus_acc / total_poids_profil, 1)
        )
    else:
        profil_audience = AudienceProfileResponse(
            femme=50, homme=50, age_25_49=50, age_50_plus=50, csp_plus=40
        )
    
    # 8. Pénétration par segment
    penetration_par_segment = calculer_penetration_segments(
        audiences_par_support, 
        detail_supports,
        facteur_dedup
    )
    
    # 9. Tunnel de conversion
    tunnel_conversion = {
        "impressions": total_impressions,
        "audience_nette": audience_nette,
        "clics": total_clics,
        "vues_video": total_vues_video
    }
    
    # 10. Construire la réponse
    return KPIProjection(
        audience_nette=audience_nette,
        total_impressions=total_impressions,
        grp=round(grp, 2),
        taux_couverture=round(taux_couverture, 2),
        frequence_moyenne=round(frequence_moyenne, 2),
        cpm_moyen=round(cpm_moyen, 2),
        cout_par_grp=round(cout_par_grp, 2),
        total_clics=total_clics,
        total_vues_video=total_vues_video,
        repartition_print=round(repartition_print, 1),
        repartition_digital=round(repartition_digital, 1),
        profil_audience=profil_audience,
        penetration_par_segment=penetration_par_segment,
        detail_par_support=detail_supports,
        tunnel_conversion=tunnel_conversion
    )


def calculer_penetration_segments(
    audiences: List[int], 
    details: List[Dict],
    facteur_dedup: float
) -> Dict[str, float]:
    """
    Calcule le taux de pénétration pour chaque segment de population
    """
    segments = {
        "FEMME": POPULATION["FEMME"],
        "HOMME": POPULATION["HOMME"],
        "25-49": POPULATION["25-49"],
        "50+": POPULATION["50+"],
    }
    
    penetration = {}
    
    for seg_nom, seg_pop in segments.items():
        # Calculer l'audience touchée dans ce segment
        audience_segment = 0
        
        for detail in details:
            support = get_support_by_id(detail["id"])
            if not support:
                continue
            
            # Pondérer par le profil du support
            if seg_nom == "FEMME":
                ratio = support.profil.femme / 100
            elif seg_nom == "HOMME":
                ratio = support.profil.homme / 100
            elif seg_nom == "25-49":
                ratio = support.profil.age_25_49 / 100
            else:  # 50+
                ratio = support.profil.age_50_plus / 100
            
            audience_segment += int(detail["audience"] * ratio)
        
        # Appliquer déduplication et plafond
        if audience_segment > 0 and seg_pop > 0:
            taux_brut = audience_segment / seg_pop
            penetration_calc = (1 - (1 - facteur_dedup) ** taux_brut) * PLAFOND_SATURATION * 100
            penetration[seg_nom] = round(min(penetration_calc, 96.0), 1)
        else:
            penetration[seg_nom] = 0.0
    
    return penetration
