console.log("🔥 Backend starting...");
import express from "express";
import cors from "cors";
import {
  CITIES,
  fetchHourlyForecast,
  fetchNext10daysHourlyForecast,
} from "./services/weatherApi.js";
import { parse10DayForecast, parseHourlyForecast } from "./utils/apiParser.js";

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
  const live = await fetchHourlyForecast(city.lat, city.lon);

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

  res.status(503).json({ error: "Weather data unavailable" });
});

// ── SUN & MOON ──
app.get("/api/sunmoon/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const city = CITIES.find((c) => c.id === id);
  if (!city) return res.status(404).json({ error: "City not found" });

  // Generate approximate sun/moon times based on latitude and date
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Approximate sunrise/sunset based on latitude and day of year
  const lat = city.lat;
  const baseHours = 12 + Math.sin((dayOfYear - 81) * Math.PI / 182) * 4;
  const sunriseHour = Math.max(5, Math.min(8, baseHours - 6));
  const sunsetHour = Math.max(16, Math.min(19, baseHours + 6));
  
  const sunrise = String(Math.floor(sunriseHour)).padStart(2, '0') + ':' + String(Math.floor((sunriseHour % 1) * 60)).padStart(2, '0');
  const sunset = String(Math.floor(sunsetHour)).padStart(2, '0') + ':' + String(Math.floor((sunsetHour % 1) * 60)).padStart(2, '0');
  const moonrise = String((Math.floor(sunriseHour) + 6) % 24).padStart(2, '0') + ':' + String(Math.floor((sunriseHour % 1) * 60)).padStart(2, '0');
  const moonset = String((Math.floor(sunsetHour) + 6) % 24).padStart(2, '0') + ':' + String(Math.floor((sunsetHour % 1) * 60)).padStart(2, '0');
  
  res.json({ sunrise, sunset, moonrise, moonset });
});

// ── FORECAST (Hourly & 7-day) ──
app.get("/api/forecast/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const city = CITIES.find((c) => c.id === id);
  if (!city) return res.status(404).json({ error: "City not found" });
  const apiData = await fetchHourlyForecast(city.lat, city.lon);
  const hourly = apiData ? parseHourlyForecast(apiData) : { labels: [], temp: [], wind: [], rain: [], rh: [], cloud: [] };
  const next10days = await fetchNext10daysHourlyForecast(city.lat, city.lon);
  const forecast7 = next10days ? parse10DayForecast(next10days) : [];
  res.json({ hourly, forecast7 });
});

// ── WARNINGS ──
app.get("/api/warnings/:id", (req: any, res: any) => {
  const { id } = req.params;
  if (!CITIES.find((c) => c.id === id)) return res.status(404).json({ error: "City not found" });
  res.json({ nowcast: [], district5day: [] });
});

// ── RAINFALL ──
app.get("/api/rainfall/:state", (_req: any, res: any) => {
  res.json([]);
});

app.listen(5000, () => console.log("🚀 API running on port 5000"));