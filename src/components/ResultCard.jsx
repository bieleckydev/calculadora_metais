import React, { useState, useRef, useEffect } from 'react';
import { formatWeight, generateCommercialDescription } from '../utils/calculations';
import { Copy, Check } from 'lucide-react';

export default function ResultCard({
  results,
  selectedMetal,
  selectedShape,
  inputs
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

  const copyClass = ['icon-btn', copied === 'ok' && 'is-ok', copied === 'error' && 'is-error'].filter(Boolean).join(' ');

  return (
    <div className="result">
      {/* Peso */}
      <section className="panel" aria-label="Resultado do cálculo">
        <span className="result__label">Peso unitário</span>
        <div className="result__unit-weight num">
          {isValid ? formatWeight(weightKg) : '—'} <span className="result__suffix">kg/pç</span>
        </div>

        <div className="result__divider" />

        <span className="result__label" id="peso-total-label">Peso total bruto</span>
        <div className="result__total num" aria-live="polite" aria-atomic="true" aria-labelledby="peso-total-label">
          {isValid ? formatWeight(totalWeightKg) : '—'} <span className="result__suffix">kg</span>
        </div>
      </section>

      {/* Descrição comercial */}
      <div className="desc-box">
        <p className="desc-box__text">{commercialDesc}</p>

        <button
          type="button"
          className={copyClass}
          onClick={handleCopyDesc}
          disabled={!isValid}
          title={copied === 'error' ? 'Não foi possível copiar' : 'Copiar descrição comercial'}
          aria-label={copied === 'ok' ? 'Descrição copiada' : 'Copiar descrição comercial'}
        >
          {copied === 'ok' ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}
