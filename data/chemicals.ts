export interface Chemical {
    id: string;
    name: string;
    description: string;
    vaporDensity: number; // relative to air (1.0)
    dispersionFactor: number; // multiplier for plume spread
    evacMultiplier: number; // multiplier for evacuation zone radius
    ergGuide: number; // ERG Guide number (placeholder)
    riskParams: {
        immediate: number; // meters base
        caution: number; // meters base
    };
}

export const CHEMICALS: Chemical[] = [
    {
        id: 'chlorine',
        name: 'Chlorine',
        description: 'Yellow-green gas with pungent odor. Heavier than air.',
        vaporDensity: 2.5,
        dispersionFactor: 0.8, // Spreads low and slow
        evacMultiplier: 1.5,
        ergGuide: 124,
        riskParams: { immediate: 100, caution: 300 }
    },
    {
        id: 'ammonia',
        name: 'Ammonia',
        description: 'Colorless gas with sharp odor. Lighter than air.',
        vaporDensity: 0.6,
        dispersionFactor: 1.2, // Rises and disperses fast
        evacMultiplier: 1.0,
        ergGuide: 125,
        riskParams: { immediate: 60, caution: 150 }
    },
    {
        id: 'hydrogen',
        name: 'Hydrogen',
        description: 'Highly flammable colorless gas. Much lighter than air.',
        vaporDensity: 0.07,
        dispersionFactor: 1.5,
        evacMultiplier: 2.0, // Explosion risk
        ergGuide: 115,
        riskParams: { immediate: 200, caution: 500 }
    },
    {
        id: 'sulfuric_acid',
        name: 'Sulfuric Acid',
        description: 'Corrosive oily liquid. Vapor is heavier than air.',
        vaporDensity: 3.4,
        dispersionFactor: 0.6,
        evacMultiplier: 1.2,
        ergGuide: 137,
        riskParams: { immediate: 80, caution: 200 }
    },
    {
        id: 'nitric_acid',
        name: 'Nitric Acid',
        description: 'Corrosive liquid/red fumes. Heavier than air.',
        vaporDensity: 2.2,
        dispersionFactor: 0.7,
        evacMultiplier: 1.3,
        ergGuide: 157,
        riskParams: { immediate: 90, caution: 250 }
    }
];

export function getChemical(id: string): Chemical | undefined {
    return CHEMICALS.find(c => c.id === id);
}
