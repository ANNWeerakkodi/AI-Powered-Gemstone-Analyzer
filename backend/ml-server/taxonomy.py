"""
CycloneGems AI - Hierarchical Gemstone Taxonomy Module
Maps gem varieties to Mineral Family, Species, and Variety levels.
"""

# Complete taxonomy mapping database for Sri Lankan and global gemstones
TAXONOMY_MAP = {
    # ── Corundum Family (Al₂O₃) ──
    "Blue Sapphire": {"family": "Corundum", "species": "Sapphire", "variety": "Blue Sapphire", "formula": "Al₂O₃:Fe,Ti"},
    "Sapphire Blue": {"family": "Corundum", "species": "Sapphire", "variety": "Blue Sapphire", "formula": "Al₂O₃:Fe,Ti"},
    "Sapphire Pink": {"family": "Corundum", "species": "Sapphire", "variety": "Pink Sapphire", "formula": "Al₂O₃:Cr"},
    "Sapphire Purple": {"family": "Corundum", "species": "Sapphire", "variety": "Purple Sapphire", "formula": "Al₂O₃:V,Cr"},
    "Sapphire Yellow": {"family": "Corundum", "species": "Sapphire", "variety": "Yellow Sapphire", "formula": "Al₂O₃:Fe"},
    "Star Sapphire": {"family": "Corundum", "species": "Sapphire", "variety": "Star Sapphire (Asteriated)", "formula": "Al₂O₃:TiO₂ inclusions"},
    "Padparadscha": {"family": "Corundum", "species": "Sapphire", "variety": "Padparadscha (Pinkish-Orange)", "formula": "Al₂O₃:Cr,Fe"},
    "Ruby": {"family": "Corundum", "species": "Ruby", "variety": "Ruby (Red Corundum)", "formula": "Al₂O₃:Cr"},

    # ── Chrysoberyl Family (BeAl₂O₄) ──
    "Chrysoberyl": {"family": "Chrysoberyl", "species": "Chrysoberyl", "variety": "Golden Chrysoberyl", "formula": "BeAl₂O₄"},
    "Cats Eye": {"family": "Chrysoberyl", "species": "Chrysoberyl", "variety": "Cat's Eye (Cymophane)", "formula": "BeAl₂O₄:Rutile"},
    "Cat's Eye": {"family": "Chrysoberyl", "species": "Chrysoberyl", "variety": "Cat's Eye (Cymophane)", "formula": "BeAl₂O₄:Rutile"},
    "Alexandrite": {"family": "Chrysoberyl", "species": "Chrysoberyl", "variety": "Alexandrite (Color-Change)", "formula": "BeAl₂O₄:Cr"},

    # ── Beryl Family (Be₃Al₂Si₆O₁₈) ──
    "Emerald": {"family": "Beryl", "species": "Beryl", "variety": "Emerald (Green Beryl)", "formula": "Be₃Al₂Si₆O₁₈:Cr,V"},
    "Aquamarine": {"family": "Beryl", "species": "Beryl", "variety": "Aquamarine (Blue Beryl)", "formula": "Be₃Al₂Si₆O₁₈:Fe²⁺"},
    "Morganite": {"family": "Beryl", "species": "Beryl", "variety": "Morganite (Pink Beryl)", "formula": "Be₃Al₂Si₆O₁₈:Mn²⁺"},
    "Beryl Golden": {"family": "Beryl", "species": "Beryl", "variety": "Heliodor (Golden Beryl)", "formula": "Be₃Al₂Si₆O₁₈:Fe³⁺"},
    "Goshenite": {"family": "Beryl", "species": "Beryl", "variety": "Goshenite (Clear Beryl)", "formula": "Be₃Al₂Si₆O₁₈"},
    "Bixbite": {"family": "Beryl", "species": "Beryl", "variety": "Red Beryl (Bixbite)", "formula": "Be₃Al₂Si₆O₁₈:Mn³⁺"},

    # ── Garnet Group ──
    "Garnet": {"family": "Garnet Group", "species": "Pyrope/Almandine", "variety": "Red Garnet", "formula": "X₃Y₂(SiO₄)₃"},
    "Garnet Red": {"family": "Garnet Group", "species": "Pyrope/Almandine", "variety": "Red Garnet", "formula": "Fe₃Al₂(SiO₄)₃"},
    "Almandine": {"family": "Garnet Group", "species": "Almandine", "variety": "Almandine Garnet", "formula": "Fe₃Al₂(SiO₄)₃"},
    "Pyrope": {"family": "Garnet Group", "species": "Pyrope", "variety": "Pyrope Garnet", "formula": "Mg₃Al₂(SiO₄)₃"},
    "Rhodolite": {"family": "Garnet Group", "species": "Pyrope-Almandine", "variety": "Rhodolite Garnet", "formula": "(Mg,Fe)₃Al₂(SiO₄)₃"},
    "Hessonite": {"family": "Garnet Group", "species": "Grossular", "variety": "Hessonite (Cinnamon Garnet)", "formula": "Ca₃Al₂(SiO₄)₃:Fe"},
    "Grossular": {"family": "Garnet Group", "species": "Grossular", "variety": "Grossularite", "formula": "Ca₃Al₂(SiO₄)₃"},
    "Tsavorite": {"family": "Garnet Group", "species": "Grossular", "variety": "Tsavorite (Green Garnet)", "formula": "Ca₃Al₂(SiO₄)₃:V,Cr"},
    "Spessartite": {"family": "Garnet Group", "species": "Spessartine", "variety": "Spessartine Garnet", "formula": "Mn₃Al₂(SiO₄)₃"},
    "Andradite": {"family": "Garnet Group", "species": "Andradite", "variety": "Demantoid / Andradite", "formula": "Ca₃Fe₂(SiO₄)₃"},

    # ── Quartz Family (SiO₂) ──
    "Amethyst": {"family": "Quartz Group", "species": "Macro-Quartz", "variety": "Amethyst", "formula": "SiO₂:Fe³⁺"},
    "Citrine": {"family": "Quartz Group", "species": "Macro-Quartz", "variety": "Citrine", "formula": "SiO₂:Fe³⁺"},
    "Ametrine": {"family": "Quartz Group", "species": "Macro-Quartz", "variety": "Ametrine", "formula": "SiO₂:Fe²⁺/Fe³⁺"},
    "Quartz Rose": {"family": "Quartz Group", "species": "Macro-Quartz", "variety": "Rose Quartz", "formula": "SiO₂:Ti,Mn"},
    "Quartz Smoky": {"family": "Quartz Group", "species": "Macro-Quartz", "variety": "Smoky Quartz", "formula": "SiO₂:Al"},
    "Quartz Beer": {"family": "Quartz Group", "species": "Macro-Quartz", "variety": "Beer Quartz", "formula": "SiO₂"},
    "Quartz Lemon": {"family": "Quartz Group", "species": "Macro-Quartz", "variety": "Lemon Quartz", "formula": "SiO₂"},
    "Quartz Rutilated": {"family": "Quartz Group", "species": "Macro-Quartz", "variety": "Rutilated Quartz", "formula": "SiO₂:TiO₂"},
    "Aventurine Green": {"family": "Quartz Group", "species": "Micro-Quartz", "variety": "Green Aventurine", "formula": "SiO₂:Fuchsite"},
    "Aventurine Yellow": {"family": "Quartz Group", "species": "Micro-Quartz", "variety": "Yellow Aventurine", "formula": "SiO₂:Pyrite"},
    "Tigers Eye": {"family": "Quartz Group", "species": "Macro-Quartz", "variety": "Tiger's Eye", "formula": "SiO₂:Crocidolite"},
    "Jasper": {"family": "Quartz Group", "species": "Chalcedony", "variety": "Jasper", "formula": "SiO₂:Fe-oxides"},
    "Chalcedony": {"family": "Quartz Group", "species": "Chalcedony", "variety": "Chalcedony", "formula": "SiO₂"},
    "Chalcedony Blue": {"family": "Quartz Group", "species": "Chalcedony", "variety": "Blue Chalcedony", "formula": "SiO₂"},
    "Carnelian": {"family": "Quartz Group", "species": "Chalcedony", "variety": "Carnelian", "formula": "SiO₂:Fe₂O₃"},
    "Bloodstone": {"family": "Quartz Group", "species": "Chalcedony", "variety": "Bloodstone (Heliotrope)", "formula": "SiO₂:Hematite"},
    "Blue Lace Agate": {"family": "Quartz Group", "species": "Chalcedony", "variety": "Blue Lace Agate", "formula": "SiO₂"},
    "Onyx Black": {"family": "Quartz Group", "species": "Chalcedony", "variety": "Black Onyx", "formula": "SiO₂"},
    "Onyx Green": {"family": "Quartz Group", "species": "Chalcedony", "variety": "Green Onyx", "formula": "SiO₂"},
    "Onyx Red": {"family": "Quartz Group", "species": "Chalcedony", "variety": "Sardonyx / Red Onyx", "formula": "SiO₂"},

    # ── Feldspar Group ──
    "Moonstone": {"family": "Feldspar Group", "species": "Orthoclase/Albite", "variety": "Ceylon Moonstone (Adularia)", "formula": "KAlSi₃O₈"},
    "Labradorite": {"family": "Feldspar Group", "species": "Plagioclase", "variety": "Labradorite (Spectrolite)", "formula": "(Ca,Na)(Al,Si)₄O₈"},
    "Amazonite": {"family": "Feldspar Group", "species": "Microcline", "variety": "Amazonite", "formula": "KAlSi₃O₈:Pb"},
    "Sunstone": {"family": "Feldspar Group", "species": "Plagioclase", "variety": "Sunstone (Aventurine Feldspar)", "formula": "(Na,Ca)Al₁₋₂Si₂₋₃O₈"},

    # ── Spinel & Zircon ──
    "Spinel": {"family": "Spinel Group", "species": "Spinel", "variety": "Noble Spinel", "formula": "MgAl₂O₄"},
    "Zircon": {"family": "Zircon Group", "species": "Zircon", "variety": "High Zircon", "formula": "ZrSiO₄"},

    # ── Tourmaline & Topaz ──
    "Tourmaline": {"family": "Tourmaline Group", "species": "Elbaite", "variety": "Mixed Tourmaline", "formula": "Na(Li,Al)₃Al₆(BO₃)₃Si₆O₁₈(OH)₄"},
    "Topaz": {"family": "Topaz Group", "species": "Topaz", "variety": "Imperial / Blue Topaz", "formula": "Al₂SiO₄(F,OH)₂"},

    # ── Spodumene & Silicates ──
    "Kunzite": {"family": "Spodumene Group", "species": "Spodumene", "variety": "Kunzite", "formula": "LiAlSi₂O₆:Mn"},
    "Hiddenite": {"family": "Spodumene Group", "species": "Spodumene", "variety": "Hiddenite", "formula": "LiAlSi₂O₆:Cr"},
    "Spodumene": {"family": "Spodumene Group", "species": "Spodumene", "variety": "Yellow Spodumene (Triphane)", "formula": "LiAlSi₂O₆"},
    "Tanzanite": {"family": "Epidote Group", "species": "Zoisite", "variety": "Tanzanite", "formula": "(Ca₂Al₃(SiO₄)₃(OH)):V"},
    "Zoisite": {"family": "Epidote Group", "species": "Zoisite", "variety": "Thulite / Anyolite Zoisite", "formula": "Ca₂Al₃(SiO₄)₃(OH)"},
    "Iolite": {"family": "Cordierite Group", "species": "Cordierite", "variety": "Iolite (Water Sapphire)", "formula": "Mg₂Al₄Si₅O₁₈"},

    # ── Diamond & Precious ──
    "Diamond": {"family": "Native Element", "species": "Diamond", "variety": "Diamond", "formula": "C"},
    "Opal": {"family": "Tectosilicate (Hydrous)", "species": "Precious Opal", "variety": "Play-of-Color Opal", "formula": "SiO₂·nH₂O"},
    "Pearl": {"family": "Organic", "species": "Nacre", "variety": "Natural / Cultured Pearl", "formula": "CaCO₃:Conchiolin"},
    "Coral": {"family": "Organic", "species": "Precious Coral", "variety": "Red/Pink Coral", "formula": "CaCO₃"},
    "Amber": {"family": "Organic", "species": "Fossil Resin", "variety": "Baltic/Burmese Amber", "formula": "C₁₀H₁₆O"},

    # ── Jade & Other Minerals ──
    "Jade": {"family": "Pyroxene/Amphibole", "species": "Jadeite/Nephrite", "variety": "Imperial Jade", "formula": "NaAlSi₂O₆"},
    "Turquoise": {"family": "Phosphate", "species": "Turquoise", "variety": "Turquoise", "formula": "CuAl₆(PO₄)₄(OH)₈·4H₂O"},
    "Malachite": {"family": "Carbonate", "species": "Malachite", "variety": "Band Malachite", "formula": "Cu₂CO₃(OH)₂"},
    "Lapis Lazuli": {"family": "Metamorphic Rock", "species": "Lazurite", "variety": "Lapis Lazuli", "formula": "(Na,Ca)₈(AlSiO₄)₆(S,SO₄,Cl)₂"},
    "Peridot": {"family": "Olivine Group", "species": "Forsterite", "variety": "Peridot", "formula": "(Mg,Fe)₂SiO₄"},
    "Kyanite": {"family": "Silicate", "species": "Kyanite", "variety": "Blue Kyanite", "formula": "Al₂SiO₅"},
}


def get_gemstone_taxonomy(gemstone_name: str) -> dict:
    """
    Get full taxonomy details for a given gemstone variety.
    """
    entry = TAXONOMY_MAP.get(gemstone_name)
    if not entry:
        # Fallback parsing
        return {
            "family": "Silicate / Mineral",
            "species": gemstone_name,
            "variety": gemstone_name,
            "formula": "Complex Mineral Structure"
        }
    return entry


def calculate_taxonomy_confidence(gemstone_name: str, top_predictions: list) -> dict:
    """
    Calculate aggregated confidence across Family, Species, and Variety levels.
    """
    tax = get_gemstone_taxonomy(gemstone_name)
    target_family = tax["family"]
    target_species = tax["species"]

    family_conf = 0.0
    species_conf = 0.0

    for pred in top_predictions:
        p_name = pred.get("name", "")
        p_conf = pred.get("confidence", 0.0)
        p_tax = get_gemstone_taxonomy(p_name)

        if p_tax["family"] == target_family:
            family_conf += p_conf
        if p_tax["species"] == target_species:
            species_conf += p_conf

    return {
        "family": target_family,
        "species": target_species,
        "variety": tax["variety"],
        "formula": tax["formula"],
        "familyConfidence": round(min(1.0, family_conf), 3),
        "speciesConfidence": round(min(1.0, species_conf), 3),
        "varietyConfidence": round(top_predictions[0].get("confidence", 0.0) if top_predictions else 0.0, 3)
    }
