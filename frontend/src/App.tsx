import { useState, useEffect } from 'react';
import './mausam.css';
import { type City, fetchCities } from './services/weatherApi';
import Home from './components/Home';
import Forecast from './components/Forecast';
import Warnings from './components/Warnings';
import Rainfall from './components/Rainfall';

type PageType = 'home' | 'forecast' | 'warnings' | 'rainfall' | 'apis';

function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchCities().then((data) => {
      if (data.length) {
        setCities(data);
        setCurrentCity(data[0]);
      }
    });
  }, []);

  const filteredCities = searchQuery
    ? cities.filter((city) =>
        city.n.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.s.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cities;

  function selectCity(city: City) {
    setCurrentCity(city);
    setSearchOpen(false);
    setSearchQuery('');
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleRefresh() {
    showToast('Data refreshed');
  }

  function geoLocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Find nearest city
          if (!cities.length) return;
          let nearest = cities[0];
          let minDist = Infinity;
          cities.forEach((city) => {
            const dist = Math.sqrt(
              Math.pow(city.lat - latitude, 2) + Math.pow(city.lon - longitude, 2)
            );
            if (dist < minDist) {
              minDist = dist;
              nearest = city;
            }
          });
          selectCity(nearest);
          showToast(`Located: ${nearest.n}`);
        },
        () => showToast('Geolocation denied')
      );
    }
  }

  return (
    <div className="app-wrap">
      {/* TOPBAR */}
      <div className="topbar">
        <div className="logo">
          <div className="logo-icon">🌦</div>
          <div>
            <div className="logo-text">
              Mausam<span>Gram</span>
            </div>
            <div className="logo-sub">IMD · India</div>
          </div>
        </div>
        <button className="search-pill" onClick={() => setSearchOpen(!searchOpen)}>
          🔍 Search city
        </button>
      </div>

      {/* SEARCH PANEL */}
      <div className={`search-panel ${searchOpen ? 'open' : ''}`}>
        <div className="s-header">
          <input
            className="s-input"
            placeholder="City name, pincode, or coordinates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="s-close" onClick={() => setSearchOpen(false)}>
            ✕
          </button>
        </div>
        <button className="geo-btn" onClick={geoLocate}>
          📍 Use my current location
        </button>

        {!searchQuery && (
          <>
            <div className="s-label">Quick select</div>
            <div className="city-grid">
              {cities.slice(0, 6).map((city) => (
                <button
                  key={city.id}
                  className="city-btn"
                  onClick={() => selectCity(city)}
                >
                  <div className="cn">{city.n}</div>
                  <div className="cs">{city.s}</div>
                  <div className="ct">{city.lat.toFixed(2)}, {city.lon.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {searchQuery && (
          <>
            <div className="s-label">All cities</div>
            <div className="city-grid">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  className="city-btn"
                  onClick={() => selectCity(city)}
                >
                  <div className="cn">{city.n}</div>
                  <div className="cs">{city.s}</div>
                  <div className="ct">{city.lat.toFixed(2)}, {city.lon.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* TOAST */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>

      {/* PAGES */}
      <div className={`page ${currentPage === 'home' ? 'on' : ''}`}>
        {currentCity && <Home city={currentCity} onRefresh={handleRefresh} />}
      </div>

      <div className={`page ${currentPage === 'forecast' ? 'on' : ''}`}>
        {currentCity && <Forecast city={currentCity} />}
      </div>

      <div className={`page ${currentPage === 'warnings' ? 'on' : ''}`}>
        {currentCity && <Warnings city={currentCity} />}
      </div>

      <div className={`page ${currentPage === 'rainfall' ? 'on' : ''}`}>
        <Rainfall />
      </div>

     
      {/* BOTTOM NAV */}
      <div className="bnav">
        <button
          className={`ntab ${currentPage === 'home' ? 'on' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          <span className="ni">🌤</span>Weather
        </button>
        <button
          className={`ntab ${currentPage === 'forecast' ? 'on' : ''}`}
          onClick={() => setCurrentPage('forecast')}
        >
          <span className="ni">📊</span>Forecast
        </button>
        <button
          className={`ntab ${currentPage === 'warnings' ? 'on' : ''}`}
          onClick={() => setCurrentPage('warnings')}
        >
          <span className="ni">⚠️</span>Warnings
        </button>
        <button
          className={`ntab ${currentPage === 'rainfall' ? 'on' : ''}`}
          onClick={() => setCurrentPage('rainfall')}
        >
          <span className="ni">🌧</span>Rainfall
        </button>
        {/* <button
          className={`ntab ${currentPage === 'apis' ? 'on' : ''}`}
          onClick={() => setCurrentPage('apis')}
        >
          <span className="ni">📡</span>APIs
        </button> */}
      </div>
    </div>
  );
}

export default App;
