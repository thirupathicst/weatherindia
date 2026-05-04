import { useEffect, useState, useRef } from 'react';
import type { City } from '../services/weatherApi';
import { fetchForecast } from '../services/weatherApi';
import { wxIcon } from '../utils/weather';
import Chart from 'chart.js/auto';

interface ForecastProps {
  city: City;
}

interface ChartInstance {
  [key: string]: Chart | null;
}

export default function Forecast({ city }: ForecastProps) {
  const [interval, setInterval] = useState('1hr');
  const [hourlyData, setHourlyData] = useState<any>(null);
  const [forecast7, setForecast7] = useState<any[]>([]);
  const chartsRef = useRef<ChartInstance>({});

  useEffect(() => {
    loadForecast();
  }, [city, interval]);

  useEffect(() => {
    if (hourlyData) {
      renderCharts();
    }
  }, [hourlyData]);

  async function loadForecast() {
    const data = await fetchForecast(city.id, interval);
    if (data) {
      setHourlyData(data.hourly);
      setForecast7(data.forecast7 || []);
    }
  }

  function renderCharts() {
    if (!hourlyData) return;

    const chartConfig = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: 'rgba(223,242,255,0.4)', font: { size: 9 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          ticks: { color: 'rgba(223,242,255,0.4)', font: { size: 9 } },
          grid: { color: 'rgba(255,255,255,0.06)' },
        },
      },
    };

    const makeChart = (
      id: string,
      type: 'line' | 'bar',
      labels: string[],
      data: number[],
      color: string,
      fill: boolean = false
    ) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas) return;

      // Destroy existing chart
      if (chartsRef.current[id]) {
        chartsRef.current[id]?.destroy();
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      chartsRef.current[id] = new Chart(ctx, {
        type,
        data: {
          labels,
          datasets: [
            {
              data,
              borderColor: color,
              backgroundColor: fill ? color + '33' : 'transparent',
              pointBackgroundColor: color,
              pointRadius: type === 'bar' ? 0 : 2,
              borderWidth: 2,
              fill,
              tension: 0.4,
            },
          ],
        },
        options: {
          ...chartConfig,
          plugins: {
            ...chartConfig.plugins,
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  let label = '';
                  if (id === 'c-rain') label = `${context.parsed.y} mm`;
                  else if (id === 'c-temp') label = `${context.parsed.y} °C`;
                  else if (id === 'c-rh') label = `${context.parsed.y} %`;
                  else if (id === 'c-cloud') label = `${context.parsed.y} %`;
                  else if (id === 'c-wind') label = `${context.parsed.y} m/s`;
                  return label;
                },
              },
            },
          },
        },
      });
    };

    // Render all charts
    makeChart('c-rain', 'bar', hourlyData.labels, hourlyData.rain, '#00b4ff', true);
    makeChart('c-temp', 'line', hourlyData.labels, hourlyData.temp, '#ff6b6b', true);
    makeChart('c-rh', 'line', hourlyData.labels, hourlyData.rh, '#00ffb4', true);
    makeChart('c-cloud', 'line', hourlyData.labels, hourlyData.cloud, '#a78bfa', true);
    makeChart('c-wind', 'line', hourlyData.labels, hourlyData.wind, '#ffb830', false);
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

      {/* Chart Content */}
      {hourlyData ? (
        <>
          {/* Rainfall Chart */}
          <div style={{ padding: '0 16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(223,242,255,0.28)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
              Rainfall (mm)
            </div>
            <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '14px', marginBottom: '10px' }}>
              <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                <canvas id="c-rain" role="img" aria-label="Rainfall forecast chart"></canvas>
              </div>
            </div>
          </div>

          {/* Temperature Chart */}
          <div style={{ padding: '0 16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(223,242,255,0.28)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
              Temperature (°C)
            </div>
            <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '14px', marginBottom: '10px' }}>
              <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                <canvas id="c-temp" role="img" aria-label="Temperature forecast chart"></canvas>
              </div>
            </div>
          </div>

          {/* Humidity Chart */}
          <div style={{ padding: '0 16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(223,242,255,0.28)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
              Relative Humidity (%)
            </div>
            <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '14px', marginBottom: '10px' }}>
              <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                <canvas id="c-rh" role="img" aria-label="Humidity forecast chart"></canvas>
              </div>
            </div>
          </div>

          {/* Cloud Cover Chart */}
          <div style={{ padding: '0 16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(223,242,255,0.28)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
              Cloud Cover (%)
            </div>
            <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '14px', marginBottom: '10px' }}>
              <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                <canvas id="c-cloud" role="img" aria-label="Cloud cover forecast chart"></canvas>
              </div>
            </div>
          </div>

          {/* Wind Speed Chart */}
          <div style={{ padding: '0 16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(223,242,255,0.28)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
              Wind Speed (m/s)
            </div>
            <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '14px', marginBottom: '10px' }}>
              <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                <canvas id="c-wind" role="img" aria-label="Wind speed forecast chart"></canvas>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div style={{ padding: '0 16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(223,242,255,0.28)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
              7-day overview
            </div>
            <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '14px' }}>
              {forecast7.map((day, i) => (
                <div key={i} className="day-row">
                  <div className={`dr-day ${i === 0 ? 'today' : ''}`}>
                    {day.day}<br /><span style={{ fontSize: '10px', color: 'var(--muted)' }}>{day.date}</span>
                  </div>
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
      ) : (
        <div className="loader" style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div className="spin"></div>
          Loading...
        </div>
      )}
    </div>
  );
}
