import { useEffect, useState } from 'react';
import { fetchRainfall } from '../services/weatherApi';

interface RainfallProps {
}

export default function Rainfall({}: RainfallProps) {
  const [selectedState, setSelectedState] = useState('maharashtra');
  const [rainfallData, setRainfallData] = useState<any[]>([]);

  useEffect(() => {
    loadRainfall();
  }, [selectedState]);

  async function loadRainfall() {
    const data = await fetchRainfall(selectedState);
    if (data) {
      setRainfallData(data);
    }
  }

  return (
    <div style={{ padding: '20px 16px 8px' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Rainfall</div>
      <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>State &amp; district statistics</div>

      {/* State Select */}
      <div className="sec">
        <div className="sec-label">Select state</div>
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="maharashtra">Maharashtra</option>
          <option value="kerala">Kerala</option>
          <option value="rajasthan">Rajasthan</option>
          <option value="delhi">Delhi</option>
          <option value="gujarat">Gujarat</option>
          <option value="karnataka">Karnataka</option>
          <option value="tamil_nadu">Tamil Nadu</option>
          <option value="west_bengal">West Bengal</option>
          <option value="uttar_pradesh">Uttar Pradesh</option>
          <option value="madhya_pradesh">Madhya Pradesh</option>
          <option value="odisha">Odisha</option>
          <option value="assam">Assam</option>
        </select>

        {/* Rainfall Items */}
        <div id="rainfallWrap">
          {rainfallData.map((item, i) => (
            <div key={i} className="rain-item">
              <div className="rain-head">
                <div>{item.n}</div>
                <div className="rain-cat" style={{ background: item.col + '33', color: item.col }}>
                  {item.cat}
                </div>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>
                Actual: {item.actual}mm | Normal: {item.normal}mm | Departure: {item.dep}
              </div>
              <div className="rain-bg">
                <div className="rain-fill" style={{ width: `${item.pct}%`, background: item.col }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Departure Chart */}
      <div className="sec">
        <div className="sec-label">Rainfall departure chart</div>
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--r)', padding: '14px', textAlign: 'center', color: 'var(--muted)' }}>
          Chart placeholder - Use Chart.js integration
        </div>
      </div>

      {/* Category Key */}
      <div className="sec">
        <div className="sec-label">Category key</div>
        <div
          style={{
            background: 'var(--card)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--r)',
            padding: '14px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            fontSize: '11px',
          }}
        >
          <div>
            <span style={{ color: '#4ade80', fontFamily: 'JetBrains Mono, monospace' }}>LE</span> Large Excess (≥60%)
          </div>
          <div>
            <span style={{ color: '#86efac', fontFamily: 'JetBrains Mono, monospace' }}>E</span> Excess (20–59%)
          </div>
          <div>
            <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>N</span> Normal (±19%)
          </div>
          <div>
            <span style={{ color: 'var(--warn)', fontFamily: 'JetBrains Mono, monospace' }}>D</span> Deficient (−59–−20%)
          </div>
          <div>
            <span style={{ color: '#f97316', fontFamily: 'JetBrains Mono, monospace' }}>LD</span> Large Deficient (−99%)
          </div>
          <div>
            <span style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>NR</span> No Rain
          </div>
        </div>
      </div>
    </div>
  );
}
