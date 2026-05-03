// Weather utilities and helpers
export const WX: Record<string, string> = {
  clear: '☀️',
  sunny: '☀️',
  fair: '🌤',
  'partly cloudy': '⛅',
  cloudy: '☁️',
  overcast: '☁️',
  rain: '🌧',
  drizzle: '🌦',
  thunderstorm: '⛈',
  storm: '🌩',
  snow: '❄️',
  fog: '🌫',
  mist: '🌁',
  haze: '😶‍🌫️',
  dust: '🌪️',
  default: '🌤',
};

export function wxIcon(t: string | undefined): string {
  if (!t) return WX.default;
  const f = t.toLowerCase();
  for (const [k, v] of Object.entries(WX)) {
    if (f.includes(k)) return v;
  }
  return WX.default;
}

export const WIND_DIR = ['Calm', 'N-NE', 'NE', 'E-NE', 'E', 'E-SE', 'SE', 'S-SE', 'S', 'S-SW', 'SW', 'W-SW', 'W', 'W-NW', 'NW', 'N-NW', 'N'];

export function windDirStr(deg: number | undefined): string {
  if (deg === undefined || deg === null) return '–';
  const i = Math.round(deg / 22.5) % 16;
  return WIND_DIR[i] || '–';
}

export function windDescribe(spd: number): string {
  if (spd < 5) return 'Calm';
  if (spd < 20) return 'Light breeze';
  if (spd < 40) return 'Moderate wind';
  if (spd < 60) return 'Strong wind';
  return 'Gale';
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
