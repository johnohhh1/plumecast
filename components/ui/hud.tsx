"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, Radio, Zap, Menu, AlertOctagon, Send } from 'lucide-react';
import { useChat } from '@ai-sdk/react';

export default function HUD({ plumeContext }: { plumeContext?: any }) {
    const { messages, input, handleInputChange, handleSubmit, append } = useChat({
        body: { data: { plumeContext } },
        initialMessages: [
            { id: '1', role: 'assistant', content: 'System Ready. Awaiting inputs.' }
        ]
    } as any) as any;

    // Auto-trigger advice when high risk is detected (Simulated "Push" notification)
    useEffect(() => {
        if (plumeContext?.riskLevel === 'high') {
            // In a real app, we wouldn't double-trigger, but for local demo:
            // append({ role: 'user', content: 'Situation Report!' }); 
            // (Commented out to avoid infinite loops in demo)
        }
    }, [plumeContext?.riskLevel]);

    return (
        <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-4 mix-blend-normal">

            {/* Top Bar: Telemetry */}
            <div className="flex justify-between items-center pointer-events-auto">
                <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-zinc-700 text-white shadow-lg">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold tracking-wider">PLUMECAST™</span>
                    <span className="text-xs bg-cyan-900 text-cyan-200 px-1 rounded ml-1">LIVE</span>
                </div>

                <div className="flex gap-2">
                    {/* Live Indicator */}
                    {plumeContext?.isLive && (
                        <div className="flex items-center gap-2 bg-green-900/40 backdrop-blur-md px-3 py-2 rounded-lg border border-green-700 text-white">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-green-300 font-mono">LIVE FEED</span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-zinc-700 text-white">
                        <Wind className="w-4 h-4 text-zinc-400" />
                        <div className="flex flex-col leading-none">
                            <span className="text-xs text-zinc-400">WIND</span>
                            <span className="font-mono font-bold">
                                {plumeContext ? `${plumeContext.windSpeed} mph` : '--'}
                            </span>
                            {plumeContext?.weatherDesc && (
                                <span className="text-[10px] text-zinc-500 capitalize">{plumeContext.weatherDesc}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Sidebar Chat */}
            <div className="flex-1 flex overflow-hidden">
                <div className="mt-4 w-96 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-xl flex flex-col shadow-2xl pointer-events-auto">
                    <div className="flex items-center justify-between border-b border-zinc-700/50 p-4">
                        <h3 className="font-bold text-zinc-100 uppercase text-sm tracking-widest flex items-center gap-2">
                            <Radio className="w-4 h-4 text-green-500" />
                            AI Commander
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m: any) => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user'
                                    ? 'bg-zinc-800 text-zinc-200'
                                    : 'bg-cyan-950/50 border border-cyan-900 text-cyan-100'
                                    }`}>
                                    {m.role === 'assistant' && (
                                        <p className="text-xs text-cyan-500 font-bold mb-1 uppercase">Advisor</p>
                                    )}
                                    {m.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-700/50 flex gap-2">
                        <input
                            className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                            value={input}
                            placeholder="Ask for protocols..."
                            onChange={handleInputChange}
                        />
                        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
