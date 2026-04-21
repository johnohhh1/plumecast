"use client";

import React from 'react';
import { Wind, Radio, Loader2, FlaskConical, Mic, Volume2 } from 'lucide-react';
import { CHEMICALS, Chemical } from '@/data/chemicals';

interface ControlsProps {
    windSpeed: number;
    setWindSpeed: (val: number) => void;
    windDir: number;
    setWindDir: (val: number) => void;
    useLiveWeather: boolean;
    setUseLiveWeather: (val: boolean) => void;
    weatherLoading?: boolean;
    activeChemical: Chemical;
    setActiveChemical: (c: Chemical) => void;
    // Voice Props
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    setVoice: (v: SpeechSynthesisVoice) => void;
    onTestVoice: () => void;
}

export default function Controls({
    windSpeed,
    setWindSpeed,
    windDir,
    setWindDir,
    useLiveWeather,
    setUseLiveWeather,
    weatherLoading,
    activeChemical,
    setActiveChemical,
    voices,
    selectedVoice,
    setVoice,
    onTestVoice
}: ControlsProps) {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/50 p-5 rounded-2xl text-white w-[28rem] shadow-2xl z-50 pointer-events-auto flex flex-col gap-6 max-h-[90vh] overflow-y-auto">

            {/* Chemical Selector */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                    <FlaskConical className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider text-xs">Hazardous Material</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {CHEMICALS.map(chem => (
                        <button
                            key={chem.id}
                            onClick={() => setActiveChemical(chem)}
                            className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${activeChemical.id === chem.id
                                ? 'bg-purple-900/40 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                }`}
                        >
                            <div className="font-bold">{chem.name}</div>
                            <div className="text-[10px] opacity-70">ERG {chem.ergGuide}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Weather Controls */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Wind className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-wider text-xs">Atmosphere</span>
                    </div>

                    <button
                        onClick={() => setUseLiveWeather(!useLiveWeather)}
                        className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1 transition-colors ${useLiveWeather
                            ? 'bg-green-900/50 border-green-700 text-green-400'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                            }`}
                    >
                        {weatherLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Radio className="w-3 h-3" />}
                        {useLiveWeather ? 'LIVE SYNC' : 'MANUAL'}
                    </button>
                </div>

                <div className={`space-y-4 transition-opacity ${useLiveWeather ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-zinc-400">
                            <span>WIND SPEED</span>
                            <span>{windSpeed} MPH</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={windSpeed}
                            onChange={(e) => setWindSpeed(Number(e.target.value))}
                            disabled={useLiveWeather}
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-zinc-400">
                            <span>DIRECTION</span>
                            <span>{windDir}°</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={windDir}
                            onChange={(e) => setWindDir(Number(e.target.value))}
                            disabled={useLiveWeather}
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Voice Settings */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-orange-400">
                        <Mic className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-wider text-xs">Tactical Voice</span>
                    </div>
                    <button
                        onClick={onTestVoice}
                        className="text-[10px] px-2 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-zinc-300 flex items-center gap-1"
                    >
                        <Volume2 className="w-3 h-3" /> Test
                    </button>
                </div>

                <div className="relative">
                    <select
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded px-3 py-2 text-xs text-zinc-300 outline-none focus:border-orange-500 appearance-none"
                        value={selectedVoice?.name || ''}
                        onChange={(e) => {
                            const voice = voices.find(v => v.name === e.target.value);
                            if (voice) setVoice(voice);
                        }}
                    >
                        {voices.map(v => (
                            <option key={v.name} value={v.name}>
                                {v.name} ({v.lang})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

        </div>
    );
}
