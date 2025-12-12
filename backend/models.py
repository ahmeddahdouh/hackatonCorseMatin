"""
Modèles Pydantic pour le module de Simulation KPI Prévisionnels
Corse-Matin Media Planning
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from enum import Enum


class CategorieSupport(str, Enum):
    PRINT = "PRINT"
    DIGITAL = "DIGITAL"
    SOCIAL = "SOCIAL"
    PACK = "PACK"


class SexeCible(str, Enum):
    FEMME = "FEMME"
    HOMME = "HOMME"
    MIXTE = "MIXTE"


class AgeCible(str, Enum):
    AGE_25_49 = "25-49"
    AGE_50_PLUS = "50+"
    TOUS = "TOUS"


class AudienceProfile(BaseModel):
    """Profil d'audience d'un support média"""
    femme: float = Field(..., ge=0, le=100, description="% audience féminine")
    homme: float = Field(..., ge=0, le=100, description="% audience masculine")
    age_25_49: float = Field(..., ge=0, le=100, description="% audience 25-49 ans")
    age_50_plus: float = Field(..., ge=0, le=100, description="% audience 50+ ans")
    csp_plus: float = Field(..., ge=0, le=100, description="% CSP+")


class SupportMedia(BaseModel):
    """Définition d'un support média du catalogue"""
    id: str
    nom: str
    categorie: CategorieSupport
    description: str
    prix_ht: float = Field(..., gt=0)
    audience_brute: int = Field(..., ge=0, description="Audience brute par insertion")
    profil: AudienceProfile
    format: str = ""  # Pour détecter VIDEO, STORY, REEL
    icon: str = "Newspaper"  # Icône Lucide


class SimulationItem(BaseModel):
    """Item dans le panier de simulation"""
    id: str = Field(..., description="ID du support (ex: 'cm_demi_page')")
    quantite: int = Field(..., ge=1)


class SimulationRequest(BaseModel):
    """Requête de simulation KPI"""
    items: List[SimulationItem]
    target_sexe: SexeCible = SexeCible.MIXTE
    target_age: AgeCible = AgeCible.TOUS
    budget_net_ht: float = Field(..., gt=0, description="Budget net HT après remise")


class AudienceProfileResponse(BaseModel):
    """Profil d'audience de la campagne simulée"""
    femme: float
    homme: float
    age_25_49: float
    age_50_plus: float
    csp_plus: float


class KPIProjection(BaseModel):
    """Résultat de la projection KPI"""
    # KPIs principaux
    audience_nette: int = Field(..., description="Audience nette dédupliquée")
    total_impressions: int = Field(..., description="Total des impressions/contacts")
    grp: float = Field(..., description="Gross Rating Point")
    taux_couverture: float = Field(..., description="% de la cible touchée")
    frequence_moyenne: float = Field(..., description="Nombre moyen d'expositions")
    cpm_moyen: float = Field(..., description="Coût pour 1000 impressions")
    cout_par_grp: float = Field(..., description="Coût par point de GRP")
    
    # Engagement
    total_clics: int = Field(..., description="Estimation clics totaux")
    total_vues_video: int = Field(..., description="Estimation vues vidéo")
    
    # Répartition
    repartition_print: float = Field(..., description="% budget Print")
    repartition_digital: float = Field(..., description="% budget Digital")
    
    # Profil
    profil_audience: AudienceProfileResponse
    
    # Pénétration par segment
    penetration_par_segment: Dict[str, float] = Field(
        default_factory=dict,
        description="% de couverture par sous-groupe"
    )
    
    # Détail par support pour Sankey
    detail_par_support: List[Dict] = Field(
        default_factory=list,
        description="Détail budget/audience par support"
    )
    
    # Tunnel de conversion
    tunnel_conversion: Dict[str, int] = Field(
        default_factory=dict,
        description="Étapes du tunnel"
    )


class CatalogueResponse(BaseModel):
    """Réponse du catalogue de supports"""
    supports: List[SupportMedia]
    categories: List[str]
    total: int
