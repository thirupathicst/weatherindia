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
  max_temp?: (number | string)[];
  min_temp?: (number | string)[];
  [key: string]: any;
}

function parseValue(val: any): number | null {
  if (val === "NaN" || val === null || val === undefined) return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
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
  
  // Start from 6:30 AM
  now.setDate(now.getDate() - 1);
  now.setHours(6, 30, 0, 0);

  let dataPointCount = 0; // Counter for valid data points added

  for (let i = 0; i < hours; i++) {
    const tempVal = parseValue(apiData.temp?.[i]);
    
    // Skip this data point if temp is NaN
    if (tempVal === null) {
      continue;
    }

    // Calculate time based on number of valid data points added
    const time = new Date(now.getTime() + dataPointCount * 3600000);
    const hours_val = time.getHours();
    const mins_val = time.getMinutes();
    labels.push(hours_val + ":" + (mins_val < 10 ? "0" + mins_val : mins_val));

    temp.push(tempVal);
    
    const windVal = parseValue(apiData.wspd?.[i]);
    wind.push((windVal ?? 0) * 3.6); // Convert m/s to km/h
    
    const rainVal = parseValue(apiData.apcp?.[i]);
    rain.push(rainVal ?? 0);
    
    const rhVal = parseValue(apiData.rh?.[i]);
    rh.push(rhVal ?? 0);
    
    const cloudVal = parseValue(apiData.tcdc?.[i]);
    cloud.push(cloudVal ?? 0);
    
    dataPointCount++; // Increment only when we add valid data
  }

  return { labels, temp, wind, rain, rh, cloud };
}


export function parseTodayHourlyForecast(apiData: ApiResponse) {
  const labels: string[] = [];
  const temp: number[] = [];
}

export function parse10DayForecast(apiData: ApiResponse) {
  const forecast: Array<{
    day: string;
    date: string;
    min: number;
    max: number;
    wx: string;
  }> = [];

  const tempArray = apiData.temp || [];

  const now = new Date();
  now.setDate(now.getDate() - 1); // Yesterday
  now.setHours(11, 30, 0, 0); // Start from 11:30 AM

  // Group temperatures by day with day name
  const dayTemps: { [key: string]: { temps: number[]; dayName: string; dateKey: string } } = {};
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Process all 36 data points
  for (let i = 0; i < tempArray.length && i < 36; i++) {
    const tempVal = parseValue(tempArray[i]);

    // Skip NaN values
    if (tempVal === null) {
      continue;
    }

    // Calculate time based on 6-hour intervals
    const time = new Date(now.getTime() + i * 6 * 3600000);
    const dateKey: string = time.toISOString().split('T')[0]!; // YYYY-MM-DD
    const dayName = dayNames[time.getDay()];

    if (!dayTemps[dateKey]) {
      dayTemps[dateKey] = { temps: [], dayName: dayName || "", dateKey };
    }
    dayTemps[dateKey]?.temps.push(tempVal);
  }

  // Convert grouped temps to forecast array (one entry per day)
  const sortedDates: string[] = Object.keys(dayTemps).sort();
  for (const dateKey of sortedDates) {
    const dayData = dayTemps[dateKey as keyof typeof dayTemps];
    if (!dayData) continue;
    
    const { temps, dayName, dateKey: date } = dayData;
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    forecast.push({
      day: dayName || "",
      date: date,
      min: Math.round(minTemp),
      max: Math.round(maxTemp),
      wx: 'Partly cloudy',
    });
  }

  return forecast;
}
