use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::f64::consts::PI;

#[derive(Serialize, Deserialize)]
pub struct PlumeInput {
    pub wind_speed_mph: f64,
    pub wind_direction_deg: f64, // 0 = North, 90 = East
    pub source_lat: f64,
    pub source_lon: f64,
}

#[derive(Serialize, Deserialize)]
pub struct PolygonResult {
    pub coordinates: Vec<Vec<f64>>, // [[lon, lat], [lon, lat], ...]
    pub risk_level: String,
}

#[wasm_bindgen]
pub fn calculate_plume(input: JsValue) -> JsValue {
    let params: PlumeInput = serde_wasm_bindgen::from_value(input).unwrap();
    
    // Basic "Cone" Logic to prove pipeline
    // 1. Calculate centerline downwind
    // 2. Add width spreading
    // 3. Convert meters to lat/lon offsets (EARTH_RADIUS approximation)

    let wind_rad = (90.0 - params.wind_direction_deg).to_radians(); // Math convention (CCW from East) is different from Compass (CW from North)
    
    // Length of plume based on wind speed (Simple heurisitc for now)
    let plume_length_m = 500.0 + (params.wind_speed_mph * 20.0);
    
    // Generate Polygon Points (Origin, Right, Tip, Left)
    let origin = (params.source_lon, params.source_lat);
    
    let tip = project_point(origin, plume_length_m, wind_rad);
    let right = project_point(origin, plume_length_m * 0.3, wind_rad - 0.5); // 0.5 rad spread
    let left = project_point(origin, plume_length_m * 0.3, wind_rad + 0.5);

    let poly = vec![
        vec![origin.0, origin.1],
        vec![right.0, right.1],
        vec![tip.0, tip.1],
        vec![left.0, left.1],
        vec![origin.0, origin.1], // Close loop
    ];

    let result = PolygonResult {
        coordinates: poly,
        risk_level: "high".to_string(),
    };

    serde_wasm_bindgen::to_value(&result).unwrap()
}

// Helper: Move a lat/lon point by distance (meters) and angle (radians)
fn project_point(start: (f64, f64), dist_m: f64, angle_rad: f64) -> (f64, f64) {
    let r_earth = 6378137.0;
    
    let dx = dist_m * angle_rad.cos();
    let dy = dist_m * angle_rad.sin();
    
    let d_lat = (dy / r_earth) * (180.0 / PI);
    let d_lon = (dx / (r_earth * (start.1 * PI / 180.0).cos())) * (180.0 / PI);
    
    (start.0 + d_lon, start.1 + d_lat)
}
