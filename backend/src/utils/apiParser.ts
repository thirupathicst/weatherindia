// Parse IMD API hourly response format
export interface ApiResponse {
  temp: (number | string)[];
  wspd: (number | string)[];
  wdir: (number | string)[];
  apcp: (number | string)[];
  rh: (number | string)[];
  tcdc: (number | string)[];
  ghi?: (number | string)[];
  gust?: (number | string)[];
  [key: string]: any;
}

function parseValue(val: any): number {
  if (val === "NaN" || val === null || val === undefined) return 0;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

export function parseHourlyForecast(apiData: ApiResponse) {
  const labels: string[] = [];
  const temp: number[] = [];
  const wind: number[] = [];
  const rain: number[] = [];
  const rh: number[] = [];
  const cloud: number[] = [];

  const now = new Date();
  const hours = Math.min(
    apiData.temp?.length || 0,
    36
  );

  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() + i * 3600000);
    labels.push(time.getHours() + ":00");

    temp.push(parseValue(apiData.temp?.[i]));
    wind.push(parseValue(apiData.wspd?.[i]) * 3.6); // Convert m/s to km/h
    rain.push(parseValue(apiData.apcp?.[i]));
    rh.push(parseValue(apiData.rh?.[i]));
    cloud.push(parseValue(apiData.tcdc?.[i]));
  }

  return { labels, temp, wind, rain, rh, cloud };
}

export function generateForecast7Day() {
  const days = ["Today", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const wxList = ["Partly cloudy", "Clear sky", "Thunderstorm", "Light rain", "Cloudy", "Haze", "Sunny"];
  return days.map((d) => ({
    day: d,
    max: Math.round(35 + Math.random() * 5),
    min: Math.round(20 + Math.random() * 5),
    wx: wxList[Math.floor(Math.random() * wxList.length)],
  }));
}
