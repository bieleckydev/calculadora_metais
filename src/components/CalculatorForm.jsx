import React, { useState, useEffect, useId } from 'react';

import { Sliders, AlertTriangle } from 'lucide-react';
import { parseDimensionValue, isImperialInput, isAmbiguousThousands } from '../utils/calculations';

const formatMm = (mm) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(mm);

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
  id,
  ...inputProps
}) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-erro`;
  const groupClass = ['input-group', isActive && 'is-active', error && 'has-error'].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <div className="field__head">
        <label className="field__label" htmlFor={inputId}>{label}</label>
        {hint && <span className="field__hint">{hint}</span>}
      </div>

      <div className={groupClass}>
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          {...inputProps}
        />
        <div className="input-group__unit" aria-hidden="true">{unit}</div>
      </div>

      {error && (
        <div className="field__error" id={errorId} role="alert">
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

  // Ao sair do campo, medida em polegadas (1/2, 1 1/2, 2", 2in) vira mm.
  // 3 casas para não alterar o peso já exibido durante a digitação
  const handleBlur = (fieldId, val) => {
    setActiveField(null);
    if (!isImperialInput(val)) return;

    const convertedMm = parseDimensionValue(val);
    if (convertedMm > 0) {
      onInputChange(fieldId, Number(convertedMm.toFixed(3)).toString());
    }
  };

  // Dica ao lado do rótulo: mostra em mm o que foi entendido quando a
  // entrada está em polegadas ou parece milhar ("1.000" = 1 mm)
  const dimensionHint = (rawVal) => {
    const mm = parseDimensionValue(rawVal);
    if (!(mm > 0)) return null;
    if (isImperialInput(rawVal)) return `= ${formatMm(mm)} mm`;
    if (isAmbiguousThousands(rawVal)) return `= ${formatMm(mm)} mm (ponto é decimal)`;
    return null;
  };

  const dimensionProps = (fieldId) => ({
    type: 'text',
    inputMode: 'decimal',
    autoComplete: 'off',
    value: inputs[fieldId] !== undefined ? inputs[fieldId] : '',
    onChange: (val) => onInputChange(fieldId, val),
    onFocus: () => setActiveField(fieldId),
    onBlur: (e) => handleBlur(fieldId, e.target.value),
    isActive: activeField === fieldId
  });

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">
          <Sliders size={18} />
          Dimensões <span className="panel__title-sub">· {shape.name}</span>
        </h2>
        <p className="panel__help">Em mm. Também aceita polegadas: 1/2, 1 1/2, 2" ou 2in</p>
      </div>

      <div className="field-grid">
        {shape.inputs.map((field) => {
          const rawVal = inputs[field.id] !== undefined ? inputs[field.id] : '';

          return (
            <UnitField
              key={field.id}
              label={field.label}
              unit={field.unit || 'mm'}
              hint={dimensionHint(rawVal)}
              error={errors[field.id]}
              {...dimensionProps(field.id)}
            />
          );
        })}

        {/* ── Aba Desigual: visível somente para Perfil L / Cantoneira */}
        {shape.id === 'perfil_l_cantoneira' && (
          <>
            <label className={`toggle-row${abaDesigual ? ' is-on' : ''}`}>
              <input
                type="checkbox"
                className="sr-only"
                checked={abaDesigual}
                onChange={(e) => handleAbaDesigualToggle(e.target.checked)}
              />
              <div className="toggle-row__box" aria-hidden="true">
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
            </label>

            {abaDesigual && (
              <UnitField
                className="field--appear"
                id="input-aba-b"
                label="Largura da Aba B"
                unit="mm"
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
          inputMode="numeric"
          min="1"
          value={quantity}
          onChange={onQuantityChange}
        />

        <UnitField
          label="Margem de perda"
          unit="%"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={lossMarginPct}
          onChange={onLossMarginChange}
        />
      </div>
    </section>
  );
}
