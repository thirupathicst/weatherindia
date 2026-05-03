import axios from "axios";

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

export const CITIES: City[] = [
  { n: "New Delhi", s: "Delhi", lat: 28.6139, lon: 77.209, id: "42182" },
  { n: "Mumbai", s: "Maharashtra", lat: 19.076, lon: 72.8777, id: "43003" },
  { n: "Chennai", s: "Tamil Nadu", lat: 13.0827, lon: 80.2707, id: "43279" },
  { n: "Kolkata", s: "West Bengal", lat: 22.5726, lon: 88.3639, id: "42809" },
  { n: "Bengaluru", s: "Karnataka", lat: 12.9716, lon: 77.5946, id: "43295" },
  { n: "Hyderabad", s: "Telangana", lat: 17.385, lon: 78.4867, id: "43128" },
  { n: "Jaipur", s: "Rajasthan", lat: 26.9124, lon: 75.7873, id: "42357" },
  { n: "Ahmedabad", s: "Gujarat", lat: 23.0225, lon: 72.5714, id: "42647" },
  { n: "Pune", s: "Maharashtra", lat: 18.5204, lon: 73.8567, id: "43063" },
  { n: "Lucknow", s: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, id: "42591" },
  { n: "Bhopal", s: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, id: "42532" },
  { n: "Patna", s: "Bihar", lat: 25.5941, lon: 85.1376, id: "42724" },
  { n: "Bhubaneswar", s: "Odisha", lat: 20.2961, lon: 85.8245, id: "43057" },
  { n: "Guwahati", s: "Assam", lat: 26.1445, lon: 91.7362, id: "42410" },
  { n: "Kochi", s: "Kerala", lat: 9.9312, lon: 76.2673, id: "43371" },
];

export async function fetchSunMoon(lat: number, lon: number) {
  try {
    const r = await axios.get(
      `https://api.imd.gov.in/api/v1/sunmoon?lat=${lat}&lon=${lon}`
    );
    return r.data.data || r.data;
  } catch {
    return null;
  }
}

export async function fetchCurrentWx(id: string) {
  try {
    const r = await axios.get(
      `https://api.imd.gov.in/api/v1/current_wx?id=${id}`
    );
    return Array.isArray(r.data) ? r.data[0] : r.data;
  } catch {
    return null;
  }
}

// export async function fetchDistrictNowcast(id: number) {
//   try {
//     const r = await axios.get(
//       `https://api.imd.gov.in/api/v1/districtnowcast?id=${id}`
//     );
//     return r.data;
//   } catch {
//     return null;
//   }
// }

// export async function fetchDistrictRainfall(id: number) {
//   try {
//     const r = await axios.get(
//       `https://api.imd.gov.in/api/v1/districtrainfall?id=${id}`
//     );
//     return r.data;
//   } catch {
//     return null;
//   }
// }

// export async function fetchStateRainfall(state: string) {
//   try {
//     const r = await axios.get(
//       `https://api.imd.gov.in/api/v1/staterainfall?id=${state}`
//     );
//     return r.data;
//   } catch {
//     return null;
//   }
// }

export async function fetchHourlyForecast(lat: number, lon: number) {
  try {
    // IMD API endpoint for hourly forecast (1-hour, 1.5-day)
    const r = await axios.get(
      `https://mausamgram.imd.gov.in/test4_mme.php?lat_gfs=${lat}&lon_gfs=${lon}&date=${(new Date().toISOString().split("T")[0] ?? "").replace(/-/g, "")}00_1hr_0p125`
    );
    return r.data;
  } catch {
    return null;
  }
}
