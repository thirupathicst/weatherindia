import { useEffect, useState } from 'react';
import type { City } from '../services/weatherApi';
import { fetchForecast } from '../services/weatherApi';
import { wxIcon } from '../utils/weather';

interface ForecastProps {
  city: City;
}

export default function Forecast({ city }: ForecastProps) {
  const [interval, setInterval] = useState('1hr');
  const [hourlyData, setHourlyData] = useState<any>(null);
  const [forecast7, setForecast7] = useState<any[]>([]);

  useEffect(() => {
    loadForecast();
  }, [city, interval]);

  async function loadForecast() {
    const data = await fetchForecast(city.id, interval);
    if (data) {
      setHourlyData(data.hourly);
      setForecast7(data.forecast7 || []);
    }
  }

  return (
    <div style={{ padding: '20px 16px 8px' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Forecast</div>

      {/* Interval Tabs */}
      <div className="interval-tabs">
        <button
          className={`itab ${interval === '1hr' ? 'on' : ''}`}
          onClick={() => setInterval('1hr')}
        >
          1-hr · 1.5d
        </button>
        <button
          className={`itab ${interval === '3hr' ? 'on' : ''}`}
          onClick={() => setInterval('3hr')}
        >
          3-hr · 5d
        </button>
        <button
          className={`itab ${interval === '6hr' ? 'on' : ''}`}
          onClick={() => setInterval('6hr')}
        >
          6-hr · 10d
        </button>
      </div>

      {/* Forecast Data */}
      {hourlyData && (
        <>
          <div className="sec">
            <div className="sec-label">Rainfall (mm)</div>
            <div className="meteo-card">
              <div style={{ padding: '10px', fontSize: '12px', color: 'var(--muted)' }}>
                Rain: {hourlyData.rain.slice(0, 6).join(' mm, ')} mm
              </div>
            </div>
          </div>

          <div className="sec">
            <div className="sec-label">Temperature (°C)</div>
            <div className="meteo-card">
              <div style={{ padding: '10px', fontSize: '12px', color: 'var(--muted)' }}>
                Temp: {hourlyData.temp.slice(0, 6).join(', ')} °C
              </div>
            </div>
          </div>

          <div className="sec">
            <div className="sec-label">Relative Humidity (%)</div>
            <div className="meteo-card">
              <div style={{ padding: '10px', fontSize: '12px', color: 'var(--muted)' }}>
                RH: {hourlyData.rh.slice(0, 6).join('%, ')} %
              </div>
            </div>
          </div>

          <div className="sec">
            <div className="sec-label">Cloud Cover (%)</div>
            <div className="meteo-card">
              <div style={{ padding: '10px', fontSize: '12px', color: 'var(--muted)' }}>
                Cloud: {hourlyData.cloud.slice(0, 6).join('%, ')} %
              </div>
            </div>
          </div>

          <div className="sec">
            <div className="sec-label">Wind Speed (m/s)</div>
            <div className="meteo-card">
              <div style={{ padding: '10px', fontSize: '12px', color: 'var(--muted)' }}>
                Wind: {hourlyData.wind.slice(0, 6).join(', ')} m/s
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="sec">
            <div className="sec-label">7-day overview</div>
            <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--r)', padding: '14px' }}>
              {forecast7.map((day, i) => (
                <div key={i} className="day-row">
                  <div className={`dr-day ${i === 0 ? 'today' : ''}`}>{day.day}</div>
                  <div className="dr-icon">{wxIcon(day.wx)}</div>
                  <div className="dr-desc">{day.wx}</div>
                  <div className="dr-temps">
                    <div className="dr-max">{day.max}°</div>
                    <div className="dr-min">{day.min}°</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!hourlyData && (
        <div className="loader">
          <div className="spin"></div>
          Loading...
        </div>
      )}
    </div>
  );
}
