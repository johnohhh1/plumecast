"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface WindCompassProps {
    direction: number; // 0-360 degrees
    speed: number;     // mph
}

export default function WindCompass({ direction, speed }: WindCompassProps) {
    // Speed intensity (0-1 scale for visual effects)
    const intensity = Math.min(speed / 40, 1);

    return (
        <div className="relative w-32 h-32">
            {/* Outer Ring */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(0, 212, 255, 0.1)"
                    strokeWidth="1"
                />

                {/* Tick marks */}
                {[...Array(36)].map((_, i) => {
                    const isMajor = i % 9 === 0;
                    const angle = i * 10;
                    const radians = (angle - 90) * (Math.PI / 180);
                    const innerR = isMajor ? 38 : 42;
                    const outerR = 45;

                    return (
                        <line
                            key={i}
                            x1={50 + innerR * Math.cos(radians)}
                            y1={50 + innerR * Math.sin(radians)}
                            x2={50 + outerR * Math.cos(radians)}
                            y2={50 + outerR * Math.sin(radians)}
                            stroke={isMajor ? 'rgba(0, 212, 255, 0.5)' : 'rgba(0, 212, 255, 0.2)'}
                            strokeWidth={isMajor ? 2 : 1}
                        />
                    );
                })}

                {/* Cardinal direction labels */}
                {['N', 'E', 'S', 'W'].map((dir, i) => {
                    const angle = i * 90;
                    const radians = (angle - 90) * (Math.PI / 180);
                    const r = 32;

                    return (
                        <text
                            key={dir}
                            x={50 + r * Math.cos(radians)}
                            y={50 + r * Math.sin(radians)}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-[#00d4ff]/60 text-[8px] font-['Orbitron']"
                        >
                            {dir}
                        </text>
                    );
                })}

                {/* Inner circle (radar style) */}
                <circle
                    cx="50"
                    cy="50"
                    r="25"
                    fill="none"
                    stroke="rgba(0, 212, 255, 0.1)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                />
                <circle
                    cx="50"
                    cy="50"
                    r="15"
                    fill="none"
                    stroke="rgba(0, 212, 255, 0.1)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                />

                {/* Center point */}
                <circle
                    cx="50"
                    cy="50"
                    r="3"
                    fill="rgba(0, 212, 255, 0.3)"
                />
            </svg>

            {/* Wind Arrow */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: direction }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                style={{ transformOrigin: 'center center' }}
            >
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Arrow body */}
                    <motion.path
                        d="M50 15 L50 60"
                        stroke="#00d4ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                    />

                    {/* Arrow head */}
                    <motion.path
                        d="M50 15 L44 28 L50 24 L56 28 Z"
                        fill="#00d4ff"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    />

                    {/* Glow effect for arrow head */}
                    <defs>
                        <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <path
                        d="M50 15 L44 28 L50 24 L56 28 Z"
                        fill="#00d4ff"
                        filter="url(#arrowGlow)"
                        opacity="0.5"
                    />
                </svg>
            </motion.div>

            {/* Speed indicator (pulsing based on wind speed) */}
            <motion.div
                className="absolute inset-0 rounded-full border border-[#00d4ff]"
                animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: Math.max(0.5, 2 - intensity * 1.5),
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            {/* Speed display */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center mt-8">
                    <span className="font-['JetBrains_Mono'] text-lg text-[#00d4ff] font-bold">
                        {speed}
                    </span>
                    <span className="text-[8px] text-[#00d4ff]/50 ml-0.5">MPH</span>
                </div>
            </div>

            {/* Scanning sweep effect */}
            <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg, rgba(0, 212, 255, 0.15) 30deg, transparent 60deg)`
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                />
            </motion.div>
        </div>
    );
}
