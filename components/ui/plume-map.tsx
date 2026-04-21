"use client";

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { PolygonLayer } from '@deck.gl/layers';
import { AlertTriangle } from 'lucide-react';
import { Chemical } from '@/data/chemicals';
import { calculatePlume } from '@/lib/physics-engine';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PlumeMapProps {
  windSpeed: number;
  windDir: number;
  incidentLoc: { lat: number; lon: number } | null;
  setIncidentLoc: (loc: { lat: number; lon: number }) => void;
  activeChemical: Chemical;
  onAlert: (text: string) => void;
}

export default function PlumeMap({
  windSpeed,
  windDir,
  incidentLoc,
  setIncidentLoc,
  activeChemical,
  onAlert
}: PlumeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [tokenError, setTokenError] = useState(false);

  // Local Plume State
  const [plumeData, setPlumeData] = useState<any[]>([]);

  // Calculate Plume (Using TS Engine)
  useEffect(() => {
    if (incidentLoc) {
      try {
        const result = calculatePlume({
          windSpeed,
          windDir,
          sourceLat: incidentLoc.lat,
          sourceLon: incidentLoc.lon,
          chemical: activeChemical
        });

        // Flatten zones for Deck.gl
        const polyData = [
          { polygon: result.zones.caution, type: 'caution', risk: result.riskLevel },
          { polygon: result.zones.immediate, type: 'immediate', risk: result.riskLevel }
        ];

        setPlumeData(polyData);

      } catch (e) {
        console.error("Physics Calculation Error:", e);
      }
    }
  }, [windSpeed, windDir, incidentLoc, activeChemical]);

  // Alerts
  useEffect(() => {
    if (incidentLoc && activeChemical) {
      const text = `Alert. ${activeChemical.name} plume dispersion. Wind ${windSpeed.toFixed(0)} miles per hour from ${windDir}.`;
      onAlert(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChemical, incidentLoc?.lat, incidentLoc?.lon]);
  // Note: We avoid speaking on every wind update to prevent spam, unless significant?
  // Current logic: speak only on chemical or location change.


  // Handle Marker Updates
  useEffect(() => {
    if (!mapRef.current) return;

    if (incidentLoc) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ color: '#ef4444', draggable: true }) // Red marker
          .setLngLat([incidentLoc.lon, incidentLoc.lat])
          .addTo(mapRef.current);

        // Allow dragging to update
        markerRef.current.on('dragend', () => {
          const lngLat = markerRef.current!.getLngLat();
          setIncidentLoc({ lat: lngLat.lat, lon: lngLat.lng });
        });
      } else {
        markerRef.current.setLngLat([incidentLoc.lon, incidentLoc.lat]);
      }
    }
  }, [incidentLoc, setIncidentLoc]);

  // Update Deck.gl Overlay when data changes
  useEffect(() => {
    if (overlayRef.current) {
      const layer = new PolygonLayer({
        id: 'plume-layer',
        data: plumeData,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: true,
        wireframe: true,
        lineWidthMinPixels: 2,
        getPolygon: (d: any) => d.polygon,
        getFillColor: (d: any) => {
          if (d.type === 'immediate') return [220, 38, 38, 200]; // Strong Red
          if (d.type === 'caution') return [234, 179, 8, 80];    // Yellow transparent
          return [100, 100, 100, 100];
        },
        getLineColor: [255, 255, 255, 150],
        getElevation: (d: any) => d.type === 'immediate' ? 100 : 50, // Immediate zone higher
        updateTriggers: {
          getPolygon: [plumeData],
          getFillColor: [plumeData]
        }
      });

      overlayRef.current.setProps({
        layers: [layer]
      });
    }
  }, [plumeData]);


  // Initialize Map
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || token.includes("example")) {
      setTokenError(true);
      return;
    }

    if (mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-74.0060, 40.7128],
      zoom: 14,
      pitch: 45,
      bearing: -17,
      projection: { name: 'globe' } as any
    });

    mapRef.current = map;

    map.on('load', () => {
      const overlay = new MapboxOverlay({
        layers: []
      });
      map.addControl(overlay as any);
      overlayRef.current = overlay;
    });

    // Right-click to set incident
    map.on('contextmenu', (e) => {
      setIncidentLoc({ lat: e.lngLat.lat, lon: e.lngLat.lng });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // One-time bootstrap
  useEffect(() => {
    if (incidentLoc === null) {
      setIncidentLoc({ lat: 40.7128, lon: -74.0060 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (tokenError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#030508] text-white z-0">
        <div className="tactical-panel tactical-panel-danger text-center p-8 max-w-lg">
          <div className="relative inline-block mb-6">
            <AlertTriangle className="w-16 h-16 text-[#ff6b00]" />
            <div className="absolute inset-0 blur-md">
              <AlertTriangle className="w-16 h-16 text-[#ff6b00] opacity-50" />
            </div>
          </div>
          <h2 className="font-['Orbitron'] text-xl font-bold mb-3 text-[#ff6b00] tracking-wider">
            SYSTEM CONFIGURATION ERROR
          </h2>
          <p className="text-white/60 mb-6 font-['Rajdhani'] text-lg leading-relaxed">
            The 3D Tactical Map requires a valid Mapbox access token.
            Configure <code className="bg-black/40 px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[#00ff41] text-sm">NEXT_PUBLIC_MAPBOX_TOKEN</code> in your <code className="bg-black/40 px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[#00ff41] text-sm">.env.local</code> file.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded">
            <div className="w-2 h-2 rounded-full bg-[#ff6b00] animate-pulse" />
            <span className="font-['JetBrains_Mono'] text-[#ff6b00] text-xs tracking-wider">MAP OFFLINE</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}
