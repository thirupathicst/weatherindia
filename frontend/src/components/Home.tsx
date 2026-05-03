import { useEffect, useState } from 'react';
import { type City, fetchCurrentWeather, fetchSunMoon } from '../services/weatherApi';
import { wxIcon, windDirStr, windDescribe } from '../utils/weather';

interface HomeProps {
  city: City;
  onRefresh: () => void;
}

export default function Home({ city, onRefresh }: HomeProps) {
  const [current, setCurrent] = useState<any>(null);
  const [sunMoon, setSunMoon] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('–');

    useEffect(() => {
        loadData();
    }, [city]);

  async function loadData() {
    const d = await fetchCurrentWeather(city.id);
    if (d) {
      setCurrent(d);
    }
    setLastUpdated(new Date().toLocaleTimeString('en-IN'));

    // Fetch sun/moon
    const sm = await fetchSunMoon(city.lat, city.lon);
    setSunMoon(sm);
  }

  return (
    <div className="hero">
      <div className="hero-glow"></div>

      {/* City Header */}
      <div className="city-row">
        <div>
          <div className="city-name">{city.n}</div>
          <div className="city-state">
            {city.s} · India
          </div>
        </div>
        <div className="live-pill">
          <span className="pulse"></span>Live
        </div>
      </div>

      {/* Temperature Display */}
      {current && (
        <>
          <div className="temp-block">
            <div>
              <span className="temp-num">{current.temp}</span>
              <span className="temp-unit">°C</span>
            </div>
            <div className="wx-side">
              <div className="wx-emoji">{wxIcon(current.wx)}</div>
              <div className="wx-desc">{current.wx || 'Loading...'}</div>
            </div>
          </div>

          {/* Meta Pills */}
          <div className="meta-pills">
            <div className="mpill">
              <span>High</span>
              <span>{current.max}°</span>
            </div>
            <div className="mpill">
              <span>Low</span>
              <span>{current.min}°</span>
            </div>
            <div className="mpill">
              <span>Humidity</span>
              <span>{current.hum}%</span>
            </div>
            <div className="mpill">
              <span>Wind</span>
              <span>{current.wind} km/h</span>
            </div>
            <div className="mpill">
              <span>Rain 24h</span>
              <span>{current.rain24}mm</span>
            </div>
          </div>

          {/* Current Conditions */}
          <div className="sec">
            <div className="sec-label">Current conditions</div>
            <div className="sgrid">
              <div className="scard">
                <div className="scard-lab">Pressure</div>
                <div className="scard-val">
                  {current.pressure}
                  <small>hPa</small>
                </div>
              </div>
              <div className="scard">
                <div className="scard-lab">Visibility</div>
                <div className="scard-val">–</div>
              </div>
              <div className="scard">
                <div className="scard-lab">Cloud cover</div>
                <div className="scard-val">
                  {current.cloud}
                  <small>%</small>
                </div>
              </div>
              <div className="scard">
                <div className="scard-lab">Dew point</div>
                <div className="scard-val">
                  {current.dew}
                  <small>°C</small>
                </div>
              </div>
            </div>
          </div>

          {/* Wind */}
          <div className="sec">
            <div className="sec-label">Wind</div>
            <div className="wind-card">
              <div className="compass">
                <div className="compass-labels">
                  <span className="cl" style={{ top: '3px', left: '50%', transform: 'translateX(-50%)' }}>
                    N
                  </span>
                  <span className="cl" style={{ bottom: '3px', left: '50%', transform: 'translateX(-50%)' }}>
                    S
                  </span>
                  <span className="cl" style={{ left: '3px', top: '50%', transform: 'translateY(-50%)' }}>
                    W
                  </span>
                  <span className="cl" style={{ right: '3px', top: '50%', transform: 'translateY(-50%)' }}>
                    E
                  </span>
                </div>
                <div
                  className="compass-arrow"
                  style={{ transform: `rotate(${current.windDeg}deg)` }}
                >
                  ↑
                </div>
              </div>
              <div className="wind-info">
                <div className="wind-val">
                  {current.wind}
                  <span className="wind-unit"> km/h</span>
                </div>
                <div className="wind-dir-text">{windDirStr(current.windDeg)}</div>
                <div className="wind-desc">{windDescribe(current.wind)}</div>
              </div>
            </div>
          </div>

          {/* Sun & Moon */}
          {sunMoon && (
            <div className="sec">
              <div className="sec-label">Sun & Moon</div>
              <div className="sunmoon-grid">
                <div className="sm-card">
                  <div className="sm-icon">🌅</div>
                  <div className="sm-time">{sunMoon.sunrise || '–'}</div>
                  <div className="sm-label">Sunrise</div>
                </div>
                <div className="sm-card">
                  <div className="sm-icon">🌇</div>
                  <div className="sm-time">{sunMoon.sunset || '–'}</div>
                  <div className="sm-label">Sunset</div>
                </div>
                <div className="sm-card">
                  <div className="sm-icon">🌙</div>
                  <div className="sm-time">{sunMoon.moonrise || '–'}</div>
                  <div className="sm-label">Moonrise</div>
                </div>
                <div className="sm-card">
                  <div className="sm-icon">🌑</div>
                  <div className="sm-time">{sunMoon.moonset || '–'}</div>
                  <div className="sm-label">Moonset</div>
                </div>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="sec">
            <button className="refresh-btn" onClick={onRefresh}>
              ↻ &nbsp;Refresh data
            </button>
            <div className="ts">Last updated: {lastUpdated}</div>
            <div className="disclaimer">
              Data sourced from MausamGram (mausamgram.imd.gov.in) &amp; IMD Open APIs.
              <br />
              Forecast valid for 12×12 km area.
            </div>
          </div>
        </>
      )}

      {!current && (
        <div className="loader">
          <div className="spin"></div>
          Loading...
        </div>
      )}
    </div>
  );
}
