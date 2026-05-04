// API services calling backend endpoints
export interface CurrentWeather {
  temp: number;
  max: number;
  min: number;
  hum: number;
  wind: number;
  windDeg: number;
  rain24: number;
  pressure: number;
  cloud: number;
  dew: number;
  wx: string;
}

export interface City {
  n: string;
  s: string;
  lat: number;
  lon: number;
  id: string;
}

export interface SunMoonData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
}

export async function fetchCities(): Promise<City[]> {
  try {
    const r = await fetch('/api/cities');
    if (!r.ok) return [];
    return await r.json();
  } catch {
    return [];
  }
}

export async function fetchCurrentWeather(id: string): Promise<CurrentWeather | null> {
  try {
    const r = await fetch(`/api/current/${id}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function fetchSunMoon(id: string): Promise<SunMoonData | null> {
  try {
    const r = await fetch(`/api/sunmoon/${id}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function fetchForecast(id: string, interval: string = '1hr'): Promise<any> {
  try {
    const r = await fetch(`/api/forecast/${id}?interval=${interval}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function fetchWarnings(id: string): Promise<any> {
  try {
    const r = await fetch(`/api/warnings/${id}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function fetchRainfall(state: string): Promise<any> {
  try {
    const r = await fetch(`/api/rainfall/${state}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
