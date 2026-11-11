import React, { useState, useEffect } from 'react';

import { Sliders, AlertTriangle } from 'lucide-react';
import { parseDimensionValue } from '../utils/calculations';

/**
 * Campo numérico com unidade fixa à direita (mm, peças, %)
 */
function UnitField({
  label,
  unit,
  value,
  onChange,
  onFocus,
  onBlur,
  isActive = false,
  error,
  hint,
  className = '',
  ...inputProps
}) {
  const groupClass = ['input-group', isActive && 'is-active', error && 'has-error'].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <div className="field__head">
        <label className="field__label">{label}</label>
        {hint && <span className="field__hint">{hint}</span>}
      </div>

      <div className={groupClass}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          {...inputProps}
        />
        <div className="input-group__unit">{unit}</div>
      </div>

      {error && (
        <div className="field__error">
          <AlertTriangle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default function CalculatorForm({
  shape,
  inputs,
  onInputChange,
  quantity,
  onQuantityChange,
  lossMarginPct,
  onLossMarginChange,
  activeField,
  setActiveField,
  errors = {}
}) {
  // ── Estado local: aba desigual para Perfil L / Cantoneira
  const [abaDesigual, setAbaDesigual] = useState(false);
  const shapeId = shape?.id;

  // Reseta quando o shape muda (saímos do Perfil L)
  useEffect(() => {
    if (shapeId !== 'perfil_l_cantoneira') {
      setAbaDesigual(false);
    } else if (!abaDesigual) {
      // Garante que aba_b seja limpa ao entrar no shape sem o toggle ativo
      onInputChange('aba_b', '');
    }
  }, [shapeId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!shape) return null;

  const handleAbaDesigualToggle = (checked) => {
    setAbaDesigual(checked);
    if (!checked) {
      // Desmarcou: limpa aba_b para que o cálculo use aba simétrica (B = A)
      onInputChange('aba_b', '');
    }
  };

  // Helper for input blur conversion & feedback
  const handleBlur = (fieldId, val) => {
    setActiveField(null);
    if (!val || typeof val !== 'string') return;

    // Se digitou fração em polegadas (ex: 1/2 ou 1 1/2) ou com aspas (ex: 2"), auto-converte para mm ao sair do campo
    if (val.includes('/') || val.includes('"') || val.toLowerCase().includes('in')) {
      const convertedMm = parseDimensionValue(val);
      if (convertedMm > 0) {
        onInputChange(fieldId, Number(convertedMm.toFixed(2)).toString());
      }
    }
  };

  const dimensionProps = (fieldId) => ({
    type: 'text',
    placeholder: '0.00 ou 1/2"',
    value: inputs[fieldId] !== undefined ? inputs[fieldId] : '',
    onChange: (val) => onInputChange(fieldId, val),
    onFocus: () => setActiveField(fieldId),
    onBlur: (e) => handleBlur(fieldId, e.target.value),
    isActive: activeField === fieldId
  });

  return (
    <section className="panel">
      <div className="panel__head">
        <h3 className="panel__title">
          <Sliders size={18} />
          Dimensões <span className="panel__title-sub">· {shape.name}</span>
        </h3>
      </div>

      <div className="field-grid">
        {shape.inputs.map((field) => {
          const rawVal = inputs[field.id] !== undefined ? inputs[field.id] : '';
          const isFraction = typeof rawVal === 'string' && (rawVal.includes('/') || rawVal.includes('"'));
          const liveMm = isFraction ? parseDimensionValue(rawVal) : null;

          return (
            <UnitField
              key={field.id}
              label={field.label}
              unit="mm"
              hint={isFraction && liveMm > 0 ? `= ${liveMm.toFixed(2)} mm` : null}
              error={errors[field.id]}
              {...dimensionProps(field.id)}
            />
          );
        })}

        {/* ── Aba Desigual: visível somente para Perfil L / Cantoneira */}
        {shape.id === 'perfil_l_cantoneira' && (
          <>
            <div
              className={`toggle-row${abaDesigual ? ' is-on' : ''}`}
              onClick={() => handleAbaDesigualToggle(!abaDesigual)}
            >
              <div className="toggle-row__box">
                {abaDesigual && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="toggle-row__label">Aba Desigual</span>
              <span className="toggle-row__note">
                {abaDesigual ? '— informe as duas abas separadamente' : '— L simétrico (A = B)'}
              </span>
            </div>

            {abaDesigual && (
              <UnitField
                className="field--appear"
                id="input-aba-b"
                label="Aba B (mm)"
                unit="mm"
                hint="campo B"
                error={errors.aba_b}
                {...dimensionProps('aba_b')}
              />
            )}
          </>
        )}

        <UnitField
          label="Quantidade"
          unit="peças"
          type="number"
          min="1"
          value={quantity}
          onChange={onQuantityChange}
        />

        <UnitField
          label="Margem Perda (%)"
          unit="%"
          type="number"
          min="0"
          step="any"
          value={lossMarginPct}
          onChange={onLossMarginChange}
        />
      </div>
    </section>
  );
}
