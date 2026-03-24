import { venueConfig } from '../data/config';

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
  description: string;
  icon: string;
}

// WMO weather code descriptions
function getWeatherDescription(code: number): { description: string; icon: string } {
  if (code === 0) return { description: 'Clear sky', icon: '☀' };
  if (code <= 2) return { description: 'Partly cloudy', icon: '⛅' };
  if (code === 3) return { description: 'Overcast', icon: '☁' };
  if (code <= 49) return { description: 'Foggy', icon: '🌫' };
  if (code <= 59) return { description: 'Drizzle', icon: '🌦' };
  if (code <= 69) return { description: 'Rainy', icon: '🌧' };
  if (code <= 79) return { description: 'Snowy', icon: '❄' };
  if (code <= 82) return { description: 'Rain showers', icon: '🌧' };
  if (code <= 86) return { description: 'Snow showers', icon: '❄' };
  if (code <= 99) return { description: 'Thunderstorm', icon: '⛈' };
  return { description: 'Unknown', icon: '?' };
}

export async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const { lat, lng } = venueConfig.location;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,is_day&timezone=Australia%2FAdelaide`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const current = data.current;

    const { description, icon } = getWeatherDescription(current.weather_code);

    return {
      temperature: Math.round(current.temperature_2m),
      weatherCode: current.weather_code,
      windSpeed: Math.round(current.wind_speed_10m),
      isDay: current.is_day === 1,
      description,
      icon,
    };
  } catch {
    return null;
  }
}