import { useCallback, useEffect, useState, useRef } from 'react';

export interface VoiceHook {
    speak: (text: string, priority?: 'high' | 'low') => void;
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    setVoice: (voice: SpeechSynthesisVoice) => void;
}

export function useVoice(): VoiceHook {
    const synth = useRef<SpeechSynthesis | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    // Initialize synth and load voices
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synth.current = window.speechSynthesis;

            const loadVoices = () => {
                const available = synth.current?.getVoices() || [];
                setVoices(available);

                // Auto-select best English voice if none selected
                if (!selectedVoice && available.length > 0) {
                    // Priority: Google US English -> Microsoft Guy -> Microsoft Zira -> First English -> First available
                    const best = available.find(v => v.name.includes("Google US English"))
                        || available.find(v => v.name.includes("Microsoft Guy Online"))
                        || available.find(v => v.name.includes("Natural"))
                        || available.find(v => v.lang.startsWith("en-US"))
                        || available[0];
                    setSelectedVoice(best);
                }
            };

            loadVoices();

            // Chrome loads voices asynchronously
            if (synth.current?.onvoiceschanged !== undefined) {
                synth.current.onvoiceschanged = loadVoices;
            }
        }
    }, [selectedVoice]);

    const speak = useCallback((text: string, priority: 'high' | 'low' = 'low') => {
        if (!synth.current || !selectedVoice) return;

        // Cancel existing low priority speech if high priority comes in
        if (priority === 'high' && synth.current.speaking) {
            synth.current.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        synth.current.speak(utterance);
    }, [selectedVoice]);

    return { speak, voices, selectedVoice, setVoice: setSelectedVoice };
}
