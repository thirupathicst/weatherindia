console.log("🔥 Backend starting...");
import express from "express";
import cors from "cors";
import {
  CITIES,
  fetchHourlyForecast,
  fetchCurrentWx,
  fetchSunMoon,
} from "./services/weatherApi.js";
import {
  parseHourlyForecast,
  generateForecast7Day,
} from "./utils/apiParser.js";

const app = express();
app.use(cors());

app.use((req: any, res: any, next: any) => {
  console.log("🔥 HIT:", req.url);
  next();
});

// ── CITIES ──
app.get("/api/cities", (req: any, res: any) => {
  res.json(CITIES);
});

// ── CURRENT WEATHER ──
app.get("/api/current/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const city = CITIES.find((c) => c.id === id);
  if (!city) return res.status(404).json({ error: "City not found" });
  const live = await fetchCurrentWx(id);

  // Map IMD API fields → frontend CurrentWeather shape
  if (live) {
    const data = {
      temp: parseFloat(live.temp ?? live.TEMP ?? live.dry_bulb_temp) || 0,
      max: parseFloat(live.max_temp ?? live.MAX_TEMP ?? live.temp) || 0,
      min: parseFloat(live.min_temp ?? live.MIN_TEMP ?? live.temp) || 0,
      hum: parseFloat(live.rh ?? live.RH ?? live.humidity) || 0,
      wind: Math.round((parseFloat(live.wind_speed ?? live.WIND_SPEED ?? 0)) * 3.6),
      windDeg: parseFloat(live.wind_dir ?? live.WIND_DIR ?? 0) || 0,
      rain24: parseFloat(live.rain24h ?? live.rainfall ?? 0) || 0,
      pressure: parseFloat(live.slp ?? live.SLP ?? live.pressure ?? 1013) || 1013,
      cloud: parseFloat(live.cloud_cover ?? live.CLOUD ?? 0) || 0,
      dew: parseFloat(live.dew_point ?? live.DEW ?? 0) || 0,
      wx: live.weather_desc ?? live.wx ?? live.WX ?? "Clear sky",
    };
    return res.json(data);
  }

  // Fallback mock data when API unavailable
  const lat = city.lat;
  const baseT = Math.round(38 - Math.abs(lat - 15) * 0.8);
  res.json({
    temp: baseT, max: baseT + 3, min: baseT - 6,
    hum: 55, wind: 14, windDeg: 210, rain24: 0,
    pressure: 1008, cloud: 20, dew: baseT - 10,
    wx: "Partly cloudy",
  });
});

// ── SUN & MOON ──
app.get("/api/sunmoon/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const city = CITIES.find((c) => c.id === id);
  if (!city) return res.status(404).json({ error: "City not found" });

  const sm = await fetchSunMoon(city.lat, city.lon);
  if (sm) return res.json(sm);

  // Fallback approximate times (IST)
  res.json({ sunrise: "06:05", sunset: "18:45", moonrise: "19:30", moonset: "06:20" });
});

// ── FORECAST (Hourly & 7-day) ──
app.get("/api/forecast/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const city = CITIES.find((c) => c.id === id);
  if (!city) return res.status(404).json({ error: "City not found" });
    const apiData = await fetchHourlyForecast(18.1958, 79.7079);
console.log("Fetching current weather for 18.1958, 79.7079");

  const hourly = apiData ? parseHourlyForecast(apiData) : { labels: [], temp: [], wind: [], rain: [], humidity: [], cloud: [] };
  const forecast7 = generateForecast7Day();

  res.json({ hourly, forecast7 });
});

// ── WARNINGS ──
app.get("/api/warnings/:id", (req: any, res: any) => {
  const { id } = req.params;
  const city = CITIES.find((c) => c.id === id);
  if (!city) return res.status(404).json({ error: "City not found" });

  const nowcast = [
    { color: 2, msg: "Light rain expected.", tags: ["Light Rain"], loc: city.n, time: new Date().toISOString() },
  ];
  const district5day = [{ name: city.n, days: [{ c: 1, dot: "#7cfc00" }, { c: 1, dot: "#7cfc00" }, { c: 2, dot: "#d4d400" }] }];

  res.json({ nowcast, district5day });
});

// ── RAINFALL ──
app.get("/api/rainfall/:state", (req: any, res: any) => {
  const { state } = req.params;
  const cats = ["N", "E", "LD"];
  const pcts: Record<string, number> = { LE: 75, E: 50, N: 35, D: 20, LD: 10, NR: 0 };
  const catColors: Record<string, string> = { LE: "#4ade80", E: "#86efac", N: "#00b4ff", D: "#ffb830", LD: "#f97316", NR: "#6b7280" };

  const rainfall = ["Division A", "Division B", "Division C"].map((n, i) => {
    const cat = cats[i] ?? "N";
    return {
      n,
      cat,
      pct: pcts[cat] ?? 25,
      col: catColors[cat] ?? "#6b7280",
      actual: (Math.random() * 5).toFixed(1),
      normal: (Math.random() * 6 + 1).toFixed(1),
      dep: "+" + Math.floor(Math.random() * 30) + "%",
    };
  });

  res.json(rainfall);
});

app.listen(5000, () => console.log("🚀 API running on port 5000"));