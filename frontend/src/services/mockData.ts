// Mock data generators for realistic weather data
// Mock data generators for realistic weather data
import type { CurrentWeather, City } from './weatherApi';

export function getRandInRange(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

export function baseTemp(lat: number): number {
  return Math.max(15, 38 - Math.abs(lat - 15) * 0.8);
}

export function genCurrent(city: City): CurrentWeather {
  const bt = baseTemp(city.lat);
  const t = Math.round(bt + getRandInRange(-3, 3));
  const wxList = ['Partly cloudy', 'Clear sky', 'Haze', 'Cloudy', 'Light rain'];
  const wx = wxList[Math.floor(Math.random() * wxList.length)];
  const wdeg = Math.floor(Math.random() * (360 / 22.5)) * 22.5;
  return {
    temp: t,
    max: t + Math.round(getRandInRange(1, 4)),
    min: t - Math.round(getRandInRange(4, 8)),
    hum: Math.round(getRandInRange(40, 85)),
    wind: Math.round(getRandInRange(5, 30)),
    windDeg: wdeg,
    rain24: Math.round(getRandInRange(0, 15) * 10) / 10,
    pressure: Math.round(getRandInRange(1000, 1015)),
    cloud: Math.round(getRandInRange(10, 70)),
    dew: Math.round(t - getRandInRange(8, 18)),
    wx,
  };
}

export function genHourly(hours: number, city: City) {
  const bt = baseTemp(city.lat);
  const labels: string[] = [];
  const rain: number[] = [];
  const temp: number[] = [];
  const rh: number[] = [];
  const cloud: number[] = [];
  const wind: number[] = [];

  const now = new Date();
  for (let i = 0; i < hours; i++) {
    const h = new Date(now.getTime() + i * 3600000);
    const hr = h.getHours();
    labels.push(hr + ':00');
    rain.push(Math.max(0, Math.round(getRandInRange(-1, 8) * 10) / 10));
    const diurnal = hr >= 14 && hr <= 17 ? 4 : hr >= 0 && hr <= 6 ? -4 : 0;
    temp.push(Math.round(bt + diurnal + getRandInRange(-2, 2)));
    rh.push(Math.round(getRandInRange(40, 90)));
    cloud.push(Math.round(getRandInRange(10, 80)));
    wind.push(Math.round(getRandInRange(1, 10) * 10) / 10);
  }
  return { labels, rain, temp, rh, cloud, wind };
}

export function genForecast7(city: City) {
  const bt = baseTemp(city.lat);
  const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const wxList = ['Partly cloudy', 'Clear sky', 'Thunderstorm', 'Light rain', 'Cloudy', 'Haze', 'Sunny'];
  return days.map((d) => ({
    day: d,
    max: Math.round(bt + getRandInRange(-2, 4)),
    min: Math.round(bt - getRandInRange(4, 9)),
    wx: wxList[Math.floor(Math.random() * wxList.length)],
  }));
}

export function genWarnings(city: City) {
  const types = [
    {
      color: 2,
      msg: 'Light rain expected. Keep umbrella handy.',
      tags: ['Light Rain', '5mm/hr'],
      loc: city.n,
    },
    {
      color: 3,
      msg: 'Moderate thunderstorm likely. Wind gusts up to 55 kmph. Stay indoors during lightning.',
      tags: ['Thunderstorm', '55 kmph'],
      loc: 'District ' + city.s,
    },
    {
      color: 4,
      msg: 'Severe heavy rain alert. Flash flood possible in low-lying areas. Do not venture out.',
      tags: ['Heavy Rain', 'Flash Flood', '15mm/hr'],
      loc: 'Coastal ' + city.s,
    },
    {
      color: 1,
      msg: 'No significant weather activity expected for the next 3 hours.',
      tags: ['All Clear'],
      loc: city.n + ' Rural',
    },
  ];
  return types.slice(0, Math.floor(Math.random() * 2) + 2);
}

export function genDistrict5day(city: City) {
  const colorCodes = [1, 1, 2, 3, 2];
  const colorDot = { 1: '#7cfc00', 2: '#d4d400', 3: '#ffa500', 4: '#ff4444' };
  const districtNames = [city.n, 'District B', 'District C', 'District D', 'District E'];
  return districtNames.map((d) => ({
    name: d,
    days: colorCodes.map((c, i) => ({
      c,
      dot: colorDot[Math.max(1, Math.min(4, c + Math.floor(Math.random() * 2) - 1)) as keyof typeof colorDot] || '#7cfc00',
    })),
  }));
}

export function genRainfall(state: string) {
  const cats = ['N', 'E', 'LD', 'NR', 'D', 'N', 'E', 'N', 'LE', 'D'];
  const pcts: Record<string, number> = { LE: 75, E: 50, N: 35, D: 20, LD: 10, NR: 0, ND: 5 };
  const catColors: Record<string, string> = {
    LE: '#4ade80',
    E: '#86efac',
    N: '#00b4ff',
    D: '#ffb830',
    LD: '#f97316',
    NR: '#6b7280',
    ND: '#374151',
  };
  const names = ['Division A', 'Division B', 'Division C', 'Division D', 'Division E', 'Division F', 'Division G', 'Division H'];
  return names.map((n, i) => {
    const cat = cats[i % cats.length];
    return {
      n,
      cat,
      pct: pcts[cat] || 25,
      col: catColors[cat] || '#6b7280',
      actual: (Math.random() * 5).toFixed(1),
      normal: (Math.random() * 6 + 1).toFixed(1),
      dep:
        cat === 'NR'
          ? '-100%'
          : cat === 'LE'
            ? '+' + Math.floor(Math.random() * 40 + 60) + '%'
            : cat === 'E'
              ? '+' + Math.floor(Math.random() * 39 + 20) + '%'
              : cat === 'D'
                ? '-' + Math.floor(Math.random() * 39 + 20) + '%'
                : '+' + Math.floor(Math.random() * 19) + '%',
    };
  });
}
