"""
API FastAPI pour le module de Simulation KPI Prévisionnels
Corse-Matin Media Planning
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

from models import (
    SimulationRequest, KPIProjection, CatalogueResponse,
    SupportMedia, CategorieSupport
)
from catalogue import get_catalogue, get_support_by_id, get_categories
from kpi_engine import calculer_kpi_previsionnels

# =============================================================================
# CONFIGURATION FASTAPI
# =============================================================================

app = FastAPI(
    title="Corse-Matin KPI Simulator API",
    description="API de simulation des KPIs prévisionnels pour le média planning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration CORS pour le frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# ENDPOINTS
# =============================================================================

@app.get("/")
async def root():
    """Endpoint racine - Health check"""
    return {
        "status": "ok",
        "service": "Corse-Matin KPI Simulator",
        "version": "1.0.0"
    }


@app.get("/api/catalogue", response_model=CatalogueResponse)
async def get_catalogue_supports(
    categorie: Optional[str] = None,
    search: Optional[str] = None
):
    """
    Récupère le catalogue des supports média
    
    Args:
        categorie: Filtrer par catégorie (PRINT, DIGITAL, SOCIAL, PACK)
        search: Recherche textuelle dans le nom/description
    
    Returns:
        Liste des supports correspondants
    """
    supports = get_catalogue()
    
    # Filtrer par catégorie
    if categorie and categorie != "TOUS":
        try:
            cat_enum = CategorieSupport(categorie)
            supports = [s for s in supports if s.categorie == cat_enum]
        except ValueError:
            pass  # Catégorie invalide, on garde tout
    
    # Filtrer par recherche textuelle
    if search:
        search_lower = search.lower()
        supports = [
            s for s in supports
            if search_lower in s.nom.lower() 
            or search_lower in s.description.lower()
        ]
    
    return CatalogueResponse(
        supports=supports,
        categories=get_categories(),
        total=len(supports)
    )


@app.get("/api/catalogue/{support_id}", response_model=SupportMedia)
async def get_support(support_id: str):
    """
    Récupère un support spécifique par son ID
    
    Args:
        support_id: Identifiant unique du support
    
    Returns:
        Détails du support
    """
    support = get_support_by_id(support_id)
    if not support:
        raise HTTPException(
            status_code=404,
            detail=f"Support '{support_id}' non trouvé"
        )
    return support


@app.post("/api/plan/simulate", response_model=KPIProjection)
async def simulate_kpi(request: SimulationRequest):
    """
    Lance la simulation des KPIs prévisionnels
    
    Args:
        request: Configuration de la simulation (items, cible, budget)
    
    Returns:
        Projection complète des KPIs
    """
    # Validation des items
    if not request.items:
        raise HTTPException(
            status_code=400,
            detail="Le panier ne peut pas être vide"
        )
    
    # Vérifier que tous les supports existent
    for item in request.items:
        if not get_support_by_id(item.id):
            raise HTTPException(
                status_code=400,
                detail=f"Support '{item.id}' non trouvé dans le catalogue"
            )
    
    # Validation du budget
    if request.budget_net_ht <= 0:
        raise HTTPException(
            status_code=400,
            detail="Le budget net HT doit être supérieur à 0"
        )
    
    try:
        # Lancer le calcul
        result = calculer_kpi_previsionnels(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du calcul des KPIs: {str(e)}"
        )


@app.get("/api/population")
async def get_population_stats():
    """
    Retourne les statistiques de population de référence (Corse)
    """
    return {
        "total": 260000,
        "segments": {
            "FEMME": 135000,
            "HOMME": 125000,
            "25-49": 110000,
            "50+": 120000,
        },
        "region": "Corse"
    }


# =============================================================================
# POINT D'ENTRÉE
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
