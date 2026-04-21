"use client";

import React, { useState, useEffect } from 'react';
import PlumeMap from '@/components/ui/plume-map';
import CommandPane from '@/components/ui/command-pane';
import TacticalOverlay from '@/components/ui/tactical-overlay';
import { useWeather } from '@/hooks/use-weather';
import { useVoice } from '@/hooks/use-voice';
import { CHEMICALS, Chemical } from '@/data/chemicals';

export default function Home() {
  const [incidentLoc, setIncidentLoc] = useState<{ lat: number; lon: number } | null>(null);

  // Chemical State
  const [activeChemical, setActiveChemical] = useState<Chemical>(CHEMICALS[0]); // Default to Chlorine

  // Weather State
  const [useLiveWeather, setUseLiveWeather] = useState(true);
  const [windSpeed, setWindSpeed] = useState(15);
  const [windDir, setWindDir] = useState(45); // NE

  // Live Weather Hook
  const weather = useWeather(incidentLoc?.lat ?? null, incidentLoc?.lon ?? null);

  // Voice Hook (Lifted to Top Level to share state)
  const { speak, voices, selectedVoice, setVoice } = useVoice();

  // Sync Live Weather if enabled
  useEffect(() => {
    if (useLiveWeather && !weather.loading && !weather.error) {
      if (weather.windSpeed !== undefined) {
        setWindSpeed(weather.windSpeed);
        setWindDir(weather.windDir);
      }
    }
  }, [useLiveWeather, weather]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030508]">

      {/* Layer 0: Full Screen Map */}
      <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
        <PlumeMap
          windSpeed={windSpeed}
          windDir={windDir}
          incidentLoc={incidentLoc}
          setIncidentLoc={setIncidentLoc}
          activeChemical={activeChemical}
          onAlert={(text) => speak(text, 'high')}
        />
      </div>

      {/* Layer 1: Tactical Overlay (Left Side Info) */}
      <TacticalOverlay
        incidentLoc={incidentLoc}
        activeChemical={activeChemical}
        windSpeed={windSpeed}
        windDir={windDir}
      />

      {/* Layer 2: Command Pane (Right Sidebar) */}
      <CommandPane
        plumeContext={{
          windSpeed,
          windDir,
          incidentLoc,
          riskLevel: 'high',
          weatherDesc: weather.description,
          isLive: useLiveWeather,
          chemical: activeChemical
        }}
        windSpeed={windSpeed}
        setWindSpeed={setWindSpeed}
        windDir={windDir}
        setWindDir={setWindDir}
        useLiveWeather={useLiveWeather}
        setUseLiveWeather={setUseLiveWeather}
        weatherLoading={weather.loading}
        activeChemical={activeChemical}
        setActiveChemical={setActiveChemical}
        voices={voices}
        selectedVoice={selectedVoice}
        setVoice={setVoice}
        onTestVoice={() => speak("System ready. Operating in tactical mode.", 'high')}
      />

    </main>
  );
}
