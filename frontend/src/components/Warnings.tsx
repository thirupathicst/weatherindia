import { useEffect, useState } from 'react';
import type { City } from '../services/weatherApi';
import { fetchWarnings } from '../services/weatherApi';

interface WarningsProps {
  city: City;
}

const colorMap: Record<number, string> = {
  1: '#7cfc00', // Green
  2: '#d4d400', // Yellow
  3: '#ffa500', // Orange
  4: '#ff4444', // Red
};

export default function Warnings({ city }: WarningsProps) {
  const [warnings, setWarnings] = useState<any[]>([]);
  const [district5day, setDistrict5day] = useState<any[]>([]);

  useEffect(() => {
    loadWarnings();
  }, [city]);

  async function loadWarnings() {
    const data = await fetchWarnings(city.id);
    if (data) {
      setWarnings(data.nowcast || []);
      setDistrict5day(data.district5day || []);
    }
  }

  return (
    <div style={{ padding: '20px 16px 8px' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Warnings</div>
      <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
        District &amp; station nowcast alerts
      </div>

      {/* Active Nowcast */}
      <div className="sec">
        <div className="sec-label">Active nowcast · <span>{city.n}</span></div>
        <div id="nowcastWrap">
          {warnings.length > 0 ? (
            warnings.map((w, i) => (
              <div
                key={i}
                className="warn-card"
                style={{ background: `rgba(0, 0, 0, 0.3)`, borderLeft: `3px solid ${colorMap[w.color]}` }}
              >
                <div className="warn-body">
                  <div className="warn-loc">{w.loc}</div>
                  <div className="warn-msg">{w.msg}</div>
                  <div className="warn-time">{new Date().toLocaleTimeString('en-IN')}</div>
                  <div className="warn-tags">
                    {w.tags.map((tag: string, ti: number) => (
                      <span key={ti} className="wtag" style={{ background: colorMap[w.color] + '33' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>No active warnings</div>
          )}
        </div>
      </div>

      {/* 5-Day District Outlook */}
      <div className="sec">
        <div className="sec-label">5-day district outlook</div>
        <div id="distWrap">
          {district5day.map((dist, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{dist.name}</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {dist.days.map((day: any, di: number) => (
                  <div
                    key={di}
                    style={{
                      flex: 1,
                      height: '20px',
                      borderRadius: '4px',
                      background: day.dot,
                      opacity: 0.7,
                    }}
                    title={`Day ${di + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Severity Guide */}
      <div className="sec">
        <div className="sec-label">Colour severity guide</div>
        <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 'var(--r)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#7cfc00', flexShrink: 0 }}></span>
            Green — No weather
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#d4d400', flexShrink: 0 }}></span>
            Yellow — Watch (light events)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ffa500', flexShrink: 0 }}></span>
            Orange — Warning (moderate)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ff4444', flexShrink: 0 }}></span>
            Red — Severe alert
          </div>
        </div>
      </div>
    </div>
  );
}
