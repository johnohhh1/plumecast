import { Chemical } from "@/data/chemicals";

// Types
export interface PlumeInput {
    windSpeed: number; // mph
    windDir: number;   // degrees
    sourceLat: number;
    sourceLon: number;
    chemical: Chemical;
}

export interface Point {
    lat: number;
    lon: number;
}

export interface PlumeResult {
    zones: {
        immediate: number[][]; // Red Zone
        caution: number[][];   // Yellow Zone
    };
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const EARTH_RADIUS = 6378137.0; // meters

/**
 * TypeScript Implementation of PlumeCast Physics
 */
export function calculatePlume(input: PlumeInput): PlumeResult {
    const { windSpeed, windDir, sourceLat, sourceLon, chemical } = input;
    const windRad = (90 - windDir) * (Math.PI / 180);

    // --- Base Physics Factors ---
    // Heuristic: Base length = 500m + (speed * 30)
    let baseLength = 500 + (windSpeed * 30);

    // Vapor Density Adjustments
    let spreadAngle = 0.5; // radians (~28 degrees) half-width

    if (chemical.vaporDensity > 1.2) {
        // Heavy Gas
        baseLength *= 0.8;
        spreadAngle *= 1.5;
    } else if (chemical.vaporDensity < 0.8) {
        // Light Gas
        baseLength *= 1.2;
        spreadAngle *= 0.8;
    }

    // Chemical Dispersion Factor
    baseLength *= chemical.dispersionFactor;

    // --- Zone Calculation ---
    // Caution Zone (Outer) is the full calculated length
    const cautionLength = baseLength;

    // Immediate Zone (Inner) is scaled based on toxicity/risk params
    // Using a ratio from the chemical data if possible, else default to 30%
    const immediateRatio = (chemical.riskParams.immediate / chemical.riskParams.caution) || 0.3;
    const immediateLength = baseLength * immediateRatio;

    // --- Geometry Generation ---
    const origin = { lat: sourceLat, lon: sourceLon };

    const cautionPoly = generatePlumePolygon(origin, cautionLength, windRad, spreadAngle);
    const immediatePoly = generatePlumePolygon(origin, immediateLength, windRad, spreadAngle);

    // Determine Risk Level
    let risk: PlumeResult['riskLevel'] = 'medium';
    if (chemical.id === 'hydrogen') risk = 'critical';
    else if (chemical.vaporDensity > 2.0) risk = 'high';

    return {
        zones: {
            immediate: immediatePoly,
            caution: cautionPoly
        },
        riskLevel: risk
    };
}

// Helper: Generate a single plume polygon
function generatePlumePolygon(origin: Point, length: number, windRad: number, spreadAngle: number): number[][] {
    const tip = projectPoint(origin, length, windRad);
    const right = projectPoint(origin, length * 0.4, windRad - spreadAngle);
    const left = projectPoint(origin, length * 0.4, windRad + spreadAngle);

    return [
        [origin.lon, origin.lat],
        [right.lon, right.lat],
        [tip.lon, tip.lat],
        [left.lon, left.lat],
        [origin.lon, origin.lat]
    ];
}

// Helper: Move lat/lon by distance
function projectPoint(start: Point, distMeters: number, angleRad: number): Point {
    const dx = distMeters * Math.cos(angleRad);
    const dy = distMeters * Math.sin(angleRad);

    const dLat = (dy / EARTH_RADIUS) * (180 / Math.PI);
    const dLon = (dx / (EARTH_RADIUS * Math.cos(start.lat * Math.PI / 180))) * (180 / Math.PI);

    return {
        lat: start.lat + dLat,
        lon: start.lon + dLon
    };
}
