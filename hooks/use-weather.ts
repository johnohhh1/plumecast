import { useState, useEffect, useCallback } from 'react';

interface WeatherData {
    windSpeed: number; // mph
    windDir: number;   // degrees
    temp: number;      // fahrenheit
    description: string;
    loading: boolean;
    error: string | null;
}

export function useWeather(lat: number | null, lon: number | null) {
    const [data, setData] = useState<WeatherData>({
        windSpeed: 0,
        windDir: 0,
        temp: 0,
        description: '',
        loading: false,
        error: null,
    });

    const fetchWeather = useCallback(async () => {
        if (!lat || !lon) return;

        setData(prev => ({ ...prev, loading: true, error: null }));

        try {
            const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
            if (!res.ok) {
                throw new Error('Failed to fetch weather');
            }

            const json = await res.json();

            setData({
                windSpeed: json.wind.speed,
                windDir: json.wind.deg,
                temp: json.main.temp,
                description: json.weather[0].description,
                loading: false,
                error: null
            });
        } catch (err: any) {
            setData(prev => ({
                ...prev,
                loading: false,
                error: err.message || 'Unknown error'
            }));
        }
    }, [lat, lon]);

    // Fetch when coordinates change
    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    return { ...data, refetch: fetchWeather };
}
