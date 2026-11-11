import React, { useState, useRef, useEffect } from 'react';
import { formatNumber, generateCommercialDescription } from '../utils/calculations';
import { Copy, Check } from 'lucide-react';

export default function ResultCard({
  results,
  selectedMetal,
  selectedShape,
  inputs,
  activeField
}) {
  const [copied, setCopied] = useState(false);

  const { weightKg, totalWeightKg, isValid } = results;

  // Commercial description text
  const commercialDesc = generateCommercialDescription({
    shape: selectedShape,
    metal: selectedMetal,
    inputs,
    results
  });

  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  // Clipboard pode falhar (iframe sem permissão, HTTP); usa fallback com textarea
  const writeClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      return ok;
    }
  };

  const handleCopyDesc = async () => {
    if (!isValid) return;
    const ok = await writeClipboard(commercialDesc);
    clearTimeout(copyTimer.current);
    setCopied(ok ? 'ok' : 'error');
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Primary Weight Display Card */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PESO UNITÁRIO
          </span>
        </div>

        {/* Unit Weight */}
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
          {isValid ? formatNumber(weightKg, 2) : '--.--'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>kg/pç</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', margin: '1.25rem 0 1rem 0' }} />

        {/* Total Weight */}
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          PESO TOTAL BRUTO
        </span>
        <div style={{ fontSize: '3.2rem', fontWeight: 800, color: 'var(--accent-copper)', fontFamily: 'var(--font-display)', lineHeight: 1.1, marginTop: '0.2rem' }}>
          {isValid ? formatNumber(totalWeightKg, 2) : '--.--'} <span style={{ fontSize: '1.3rem', color: 'var(--text-muted)', fontWeight: 600 }}>kg</span>
        </div>
      </div>

      {/* Commercial Summary Box */}
      <div style={{
        background: 'var(--bg-dark)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontFamily: 'monospace', lineHeight: 1.4 }}>
          {commercialDesc}
        </div>

        <button
          type="button"
          onClick={handleCopyDesc}
          disabled={!isValid}
          title={copied === 'error' ? 'Não foi possível copiar' : 'Copiar descrição comercial'}
          aria-label={copied === 'ok' ? 'Descrição copiada' : 'Copiar descrição comercial'}
          style={{
            background: copied === 'ok' ? 'rgba(61, 139, 110, 0.2)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${copied === 'ok' ? 'var(--accent-emerald)' : copied === 'error' ? 'var(--accent-red)' : 'var(--border-color)'}`,
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: isValid ? 'pointer' : 'not-allowed',
            opacity: isValid ? 1 : 0.4,
            color: copied === 'ok' ? 'var(--accent-emerald)' : 'var(--text-primary)',
            transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
            flexShrink: 0
          }}
        >
          {copied === 'ok' ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}
