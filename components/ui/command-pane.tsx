"use client";

import React, { useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wind,
    Radio,
    Loader2,
    FlaskConical,
    Mic,
    Volume2,
    Send,
    Zap,
    AlertTriangle,
    Skull,
    Thermometer,
    Compass,
    ChevronDown,
    ChevronUp,
    Activity
} from 'lucide-react';
import { CHEMICALS, Chemical } from '@/data/chemicals';
import WindCompass from './wind-compass';

interface CommandPaneProps {
    plumeContext?: any;
    windSpeed: number;
    setWindSpeed: (val: number) => void;
    windDir: number;
    setWindDir: (val: number) => void;
    useLiveWeather: boolean;
    setUseLiveWeather: (val: boolean) => void;
    weatherLoading?: boolean;
    activeChemical: Chemical;
    setActiveChemical: (c: Chemical) => void;
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    setVoice: (v: SpeechSynthesisVoice) => void;
    onTestVoice: () => void;
}

// Hazard level indicator based on vapor density
function getHazardLevel(vaporDensity: number): { level: string; color: string } {
    if (vaporDensity > 2.5) return { level: 'CRITICAL', color: 'text-red-400' };
    if (vaporDensity > 1.5) return { level: 'HIGH', color: 'text-orange-400' };
    if (vaporDensity > 0.8) return { level: 'MODERATE', color: 'text-yellow-400' };
    return { level: 'LOW', color: 'text-green-400' };
}

export default function CommandPane({
    plumeContext,
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
}: CommandPaneProps) {

    const [expandedSection, setExpandedSection] = useState<string | null>('chemical');
    const [showAllChemicals, setShowAllChemicals] = useState(false);

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        body: { data: { plumeContext } },
        initialMessages: [
            {
                id: '1',
                role: 'assistant',
                content: 'TACTICAL COMMAND ONLINE. All systems nominal. Awaiting incident coordinates and chemical identification.'
            }
        ]
    } as any) as any;

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const hazard = getHazardLevel(activeChemical.vaporDensity);
    const displayedChemicals = showAllChemicals ? CHEMICALS : CHEMICALS.slice(0, 4);

    return (
        <aside className="fixed top-4 bottom-4 z-50 flex flex-col gap-3 w-[420px]" style={{ right: '16px' }}>

            {/* ═══════════════════════════════════════════════════════════
                HEADER: STATUS BAR
            ═══════════════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="tactical-panel p-4"
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Zap className="w-6 h-6 text-[#00ff41]" />
                            <div className="absolute inset-0 blur-sm">
                                <Zap className="w-6 h-6 text-[#00ff41] opacity-50" />
                            </div>
                        </div>
                        <div>
                            <h1 className="font-['Orbitron'] font-bold text-[#00ff41] tracking-[0.2em] text-sm glow-green">
                                PLUMECAST
                            </h1>
                            <p className="text-[9px] text-[#00ff41]/50 tracking-[0.3em] font-['JetBrains_Mono']">
                                TACTICAL COMMAND v2.0
                            </p>
                        </div>
                    </div>

                    {/* Live Status */}
                    <div className="flex items-center gap-3">
                        {plumeContext?.isLive && (
                            <div className="status-live text-[10px] font-['Orbitron'] tracking-widest text-[#00ff41]">
                                LIVE
                            </div>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-[#00ff41]/20 rounded">
                            <Activity className="w-3 h-3 text-[#00ff41]" />
                            <span className="text-[10px] font-['JetBrains_Mono'] text-[#00ff41]/80">
                                {plumeContext?.incidentLoc ? 'TRACKING' : 'STANDBY'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Telemetry Strip */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                    <TelemetryCell
                        label="WIND"
                        value={`${windSpeed}`}
                        unit="MPH"
                        icon={<Wind className="w-3 h-3" />}
                    />
                    <TelemetryCell
                        label="HEADING"
                        value={`${windDir}°`}
                        unit={getCardinalDirection(windDir)}
                        icon={<Compass className="w-3 h-3" />}
                    />
                    <TelemetryCell
                        label="THREAT"
                        value={hazard.level}
                        className={hazard.color}
                        icon={<AlertTriangle className="w-3 h-3" />}
                    />
                </div>
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════
                MAIN PANEL: CHAT + CONTROLS
            ═══════════════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="tactical-panel flex-1 flex flex-col overflow-hidden"
            >
                {/* AI Commander Chat */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="px-4 py-3 border-b border-[#00ff41]/10 flex items-center gap-2">
                        <Radio className="w-4 h-4 text-[#00d4ff]" />
                        <span className="font-['Orbitron'] text-[11px] tracking-[0.15em] text-[#00d4ff]">
                            AI COMMANDER
                        </span>
                        <div className="flex-1" />
                        <div className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <AnimatePresence>
                            {messages.map((m: any, i: number) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[90%] p-3 text-sm leading-relaxed font-['Rajdhani'] ${m.role === 'user'
                                        ? 'bg-white/10 border border-white/20 rounded-lg text-white'
                                        : 'bg-cyan-900/30 border border-cyan-500/30 rounded-lg text-cyan-100'
                                        }`}>
                                        {m.role === 'assistant' && (
                                            <p className="text-[9px] text-[#00d4ff] font-['Orbitron'] mb-2 tracking-[0.2em] flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-[#00d4ff]" />
                                                ADVISOR
                                            </p>
                                        )}
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 border-t border-[#00ff41]/10 flex gap-2">
                        <input
                            className="input-tactical flex-1 text-sm"
                            value={input}
                            placeholder="Request tactical guidance..."
                            onChange={handleInputChange}
                        />
                        <button
                            type="submit"
                            className="btn-tactical btn-tactical-primary px-3"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════
                CONTROLS PANEL
            ═══════════════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="tactical-panel max-h-[45%] overflow-y-auto"
            >
                <div className="divide-y divide-[#00ff41]/10">

                    {/* CHEMICAL SECTION */}
                    <CollapsibleSection
                        title="HAZMAT IDENTIFICATION"
                        icon={<FlaskConical className="w-4 h-4" />}
                        color="purple"
                        isOpen={expandedSection === 'chemical'}
                        onToggle={() => toggleSection('chemical')}
                    >
                        <div className="space-y-3">
                            {/* Active Chemical Display */}
                            <div className="p-3 bg-black/60 border border-[#00ff41]/50 rounded relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff41]" />
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Skull className="w-4 h-4 text-[#00ff41]" />
                                            <span className="font-['Orbitron'] text-[#00ff41] font-bold text-sm">
                                                {activeChemical.name.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-[#00ff41]/80 mt-1 font-['Rajdhani']">
                                            {activeChemical.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-[#00ff41]/70 font-['JetBrains_Mono']">
                                            ERG
                                        </span>
                                        <p className="font-['Orbitron'] text-[#00ff41] text-lg font-bold">
                                            {activeChemical.ergGuide}
                                        </p>
                                    </div>
                                </div>

                                {/* Chemical Stats */}
                                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#00ff41]/40">
                                    <ChemicalStat label="VAPOR DENSITY" value={activeChemical.vaporDensity.toFixed(2)} />
                                    <ChemicalStat label="DISPERSION" value={`${activeChemical.dispersionFactor}x`} />
                                    <ChemicalStat label="EVAC MULT" value={`${activeChemical.evacMultiplier}x`} />
                                </div>
                            </div>

                            {/* Chemical Grid */}
                            <div className="grid grid-cols-2 gap-2 stagger-children">
                                {displayedChemicals.map(chem => (
                                    <button
                                        key={chem.id}
                                        onClick={() => setActiveChemical(chem)}
                                        className={`chemical-card text-left ${activeChemical.id === chem.id ? 'chemical-card-active' : ''
                                            }`}
                                    >
                                        <div className="font-['Rajdhani'] font-bold text-white text-sm">
                                            {chem.name}
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10px] font-['JetBrains_Mono'] text-purple-200">
                                                ERG {chem.ergGuide}
                                            </span>
                                            <span className={`text-[10px] font-['JetBrains_Mono'] font-bold ${getHazardLevel(chem.vaporDensity).color}`}>
                                                {getHazardLevel(chem.vaporDensity).level}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {CHEMICALS.length > 4 && (
                                <button
                                    onClick={() => setShowAllChemicals(!showAllChemicals)}
                                    className="w-full text-center text-[10px] text-purple-300/80 hover:text-purple-200 py-1 transition-colors font-['Rajdhani'] tracking-wider"
                                >
                                    {showAllChemicals ? '▲ SHOW LESS' : `▼ SHOW ALL (${CHEMICALS.length})`}
                                </button>
                            )}
                        </div>
                    </CollapsibleSection>

                    {/* ATMOSPHERE SECTION */}
                    <CollapsibleSection
                        title="ATMOSPHERIC CONDITIONS"
                        icon={<Wind className="w-4 h-4" />}
                        color="cyan"
                        isOpen={expandedSection === 'atmosphere'}
                        onToggle={() => toggleSection('atmosphere')}
                    >
                        <div className="space-y-4">
                            {/* Live Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-white/70 font-['Rajdhani'] tracking-wider">
                                    DATA SOURCE
                                </span>
                                <button
                                    onClick={() => setUseLiveWeather(!useLiveWeather)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-['Orbitron'] tracking-wider transition-all ${useLiveWeather
                                        ? 'bg-[#00ff41]/10 border border-[#00ff41]/40 text-[#00ff41]'
                                        : 'bg-white/5 border border-white/20 text-white/60'
                                        }`}
                                >
                                    {weatherLoading ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Radio className="w-3 h-3" />
                                    )}
                                    {useLiveWeather ? 'LIVE SYNC' : 'MANUAL'}
                                </button>
                            </div>

                            {/* Wind Compass */}
                            <div className="flex justify-center py-2">
                                <WindCompass direction={windDir} speed={windSpeed} />
                            </div>

                            {/* Sliders */}
                            <div className={`space-y-4 transition-opacity ${useLiveWeather ? 'opacity-40 pointer-events-none' : ''}`}>
                                <SliderControl
                                    label="WIND VELOCITY"
                                    value={windSpeed}
                                    onChange={setWindSpeed}
                                    min={0}
                                    max={50}
                                    unit="MPH"
                                />
                                <SliderControl
                                    label="WIND HEADING"
                                    value={windDir}
                                    onChange={setWindDir}
                                    min={0}
                                    max={360}
                                    unit="°"
                                />
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* VOICE SECTION */}
                    <CollapsibleSection
                        title="TACTICAL VOICE"
                        icon={<Mic className="w-4 h-4" />}
                        color="amber"
                        isOpen={expandedSection === 'voice'}
                        onToggle={() => toggleSection('voice')}
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <select
                                    className="flex-1 bg-black/40 border border-[#ff6b00]/30 rounded px-3 py-2 text-[11px] text-white/80 font-['Rajdhani'] outline-none focus:border-[#ff6b00]/60 transition-colors"
                                    value={selectedVoice?.name || ''}
                                    onChange={(e) => {
                                        const voice = voices.find(v => v.name === e.target.value);
                                        if (voice) setVoice(voice);
                                    }}
                                >
                                    {voices.map(v => (
                                        <option key={v.name} value={v.name}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={onTestVoice}
                                    className="btn-tactical px-3 py-2 border-[#ff6b00]/40 text-[#ff6b00] hover:bg-[#ff6b00]/10"
                                >
                                    <Volume2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </CollapsibleSection>

                </div>
            </motion.div>

        </aside>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function TelemetryCell({
    label,
    value,
    unit,
    icon,
    className = ''
}: {
    label: string;
    value: string;
    unit?: string;
    icon: React.ReactNode;
    className?: string;
}) {
    return (
        <div className="bg-black/30 border border-[#00ff41]/10 rounded p-2">
            <div className="flex items-center gap-1 text-[#00ff41]/50 mb-1">
                {icon}
                <span className="text-[8px] font-['Orbitron'] tracking-[0.15em]">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`font-['JetBrains_Mono'] text-lg font-medium ${className || 'text-[#00ff41]'}`}>
                    {value}
                </span>
                {unit && (
                    <span className="text-[9px] text-white/40 font-['Rajdhani']">{unit}</span>
                )}
            </div>
        </div>
    );
}

function CollapsibleSection({
    title,
    icon,
    color,
    isOpen,
    onToggle,
    children
}: {
    title: string;
    icon: React.ReactNode;
    color: 'purple' | 'cyan' | 'amber';
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    const colors = {
        purple: 'text-purple-400',
        cyan: 'text-[#00d4ff]',
        amber: 'text-[#ff6b00]'
    };

    return (
        <div>
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
                <div className={`flex items-center gap-2 ${colors[color]}`}>
                    {icon}
                    <span className="font-['Orbitron'] text-[10px] tracking-[0.15em]">{title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-white/30" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SliderControl({
    label,
    value,
    onChange,
    min,
    max,
    unit
}: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    unit: string;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#00d4ff]/80 font-['Orbitron'] tracking-wider">
                    {label}
                </span>
                <span className="font-['JetBrains_Mono'] text-[#00d4ff] text-sm">
                    {value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="slider-tactical slider-tactical-cyan w-full"
            />
        </div>
    );
}

function ChemicalStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-center">
            <p className="text-[9px] text-[#00ff41]/70 font-['Orbitron'] tracking-wider">{label}</p>
            <p className="font-['JetBrains_Mono'] text-[#00ff41] text-sm mt-0.5 font-medium">{value}</p>
        </div>
    );
}

function getCardinalDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}
