import React from 'react';

/**
 * Visual Semi-Circle Gauge for Credit Score (300 - 850)
 */
export function CreditScoreGauge({ score = 742, riskLevel = 'Low Risk', size = 220 }) {
  const minScore = 300;
  const maxScore = 850;
  const normalizedScore = Math.min(maxScore, Math.max(minScore, score));
  
  // Percentage from 0 to 1
  const percentage = (normalizedScore - minScore) / (maxScore - minScore);
  
  // Angle in degrees for semi-circle (-90deg to +90deg)
  const needleAngle = -90 + percentage * 180;

  // Score Tier Colors
  let scoreColor = '#10b981'; // Green
  let scoreLabel = 'Excellent';
  
  if (score < 580) {
    scoreColor = '#ef4444'; // Red
    scoreLabel = 'Poor';
  } else if (score < 670) {
    scoreColor = '#f59e0b'; // Amber / Orange
    scoreLabel = 'Fair';
  } else if (score < 740) {
    scoreColor = '#3b82f6'; // Blue
    scoreLabel = 'Good';
  } else {
    scoreColor = '#10b981'; // Emerald
    scoreLabel = 'Excellent';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size * 0.62} viewBox="0 0 200 125" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Color Gradient Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Ticks & Labels */}
        <text x="18" y="118" fontSize="10" fontWeight="600" fill="#64748b">300</text>
        <text x="182" y="118" fontSize="10" fontWeight="600" fill="#64748b" textAnchor="end">850</text>

        {/* Animated Needle */}
        <g transform={`translate(100, 100) rotate(${needleAngle})`}>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-68"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glow)"
            style={{ transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
          <circle cx="0" cy="0" r="7" fill="#0f172a" />
          <circle cx="0" cy="0" r="3" fill="#ffffff" />
        </g>
      </svg>

      {/* Score Text Card Overlay */}
      <div style={{ marginTop: '-15px', textCenter: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {score}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: scoreColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {scoreLabel}
          </span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>
            {riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
}
