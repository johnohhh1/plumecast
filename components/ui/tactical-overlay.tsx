"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Crosshair, Target, Clock } from 'lucide-react';
import { Chemical } from '@/data/chemicals';

interface TacticalOverlayProps {
    incidentLoc: { lat: number; lon: number } | null;
    activeChemical: Chemical;
    windSpeed: number;
    windDir: number;
}

export default function TacticalOverlay({
    incidentLoc,
    activeChemical,
    windSpeed,
    windDir
}: TacticalOverlayProps) {
    const [time, setTime] = React.useState<Date | null>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        setTime(new Date());
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Top-Left: Coordinate Display */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="fixed top-4 left-4 z-40"
            >
                <div className="tactical-panel p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Crosshair className="w-4 h-4 text-[#00ff41]" />
                        <span className="font-['Orbitron'] text-[10px] text-[#00ff41] tracking-[0.15em]">
                            INCIDENT COORDS
                        </span>
                    </div>
                    {incidentLoc ? (
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] text-[#00ff41]/50 font-['Orbitron'] w-8">LAT</span>
                                <span className="font-['JetBrains_Mono'] text-[#00ff41] text-sm">
                                    {incidentLoc.lat.toFixed(6)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] text-[#00ff41]/50 font-['Orbitron'] w-8">LON</span>
                                <span className="font-['JetBrains_Mono'] text-[#00ff41] text-sm">
                                    {incidentLoc.lon.toFixed(6)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[11px] text-white/40 font-['Rajdhani']">
                            Right-click map to set location
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Top-Left Below: Active Threat */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="fixed top-[120px] left-4 z-40"
            >
                <div className="tactical-panel p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className="font-['Orbitron'] text-[10px] text-purple-400 tracking-[0.15em]">
                            ACTIVE THREAT
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <span className="font-['Orbitron'] text-white text-sm">
                            {activeChemical.name.toUpperCase()}
                        </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-purple-500/20">
                        <span className="text-[9px] text-purple-400/60 font-['JetBrains_Mono']">
                            ERG GUIDE #{activeChemical.ergGuide}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Bottom-Left: Timestamp */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-4 left-4 z-40"
            >
                <div className="tactical-panel px-4 py-2">
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#00ff41]/50" />
                        {mounted && time ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="font-['JetBrains_Mono'] text-[#00ff41] text-sm tracking-wider">
                                        {time.toLocaleTimeString('en-US', { hour12: false })}
                                    </span>
                                    <span className="text-[9px] text-[#00ff41]/40 font-['Orbitron']">
                                        LOCAL
                                    </span>
                                </div>
                                <div className="w-px h-4 bg-[#00ff41]/20" />
                                <span className="font-['JetBrains_Mono'] text-white/60 text-xs">
                                    {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </>
                        ) : (
                            <span className="font-['JetBrains_Mono'] text-[#00ff41]/50 text-sm">--:--:--</span>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Crosshair Overlay (Center) */}
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-30">
                <div className="relative w-16 h-16 opacity-30">
                    {/* Horizontal line */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-[#00ff41]/50" />
                    {/* Vertical line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#00ff41]/50" />
                    {/* Center circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#00ff41]/50" />
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#00ff41]/50" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#00ff41]/50" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#00ff41]/50" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#00ff41]/50" />
                </div>
            </div>

            {/* Scale Bar (Bottom Center) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
            >
                <div className="flex items-center gap-2">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#00ff41]/50 to-transparent" />
                    <span className="text-[9px] text-[#00ff41]/40 font-['JetBrains_Mono']">
                        SCALE VARIES
                    </span>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#00ff41]/50 to-transparent" />
                </div>
            </motion.div>
        </>
    );
}
