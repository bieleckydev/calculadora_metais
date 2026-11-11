import React, { useState, useEffect } from 'react';

import { Sliders, AlertTriangle } from 'lucide-react';
import { parseDimensionValue } from '../utils/calculations';

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

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sliders size={18} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            Dimensões <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>· {shape.name}</span>
          </h3>
        </div>
      </div>

      {/* Grid of Dynamic Dimension Inputs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        {shape.inputs.map((field) => {
          const hasError = !!errors[field.id];
          const rawVal = inputs[field.id] !== undefined ? inputs[field.id] : '';
          const isFraction = typeof rawVal === 'string' && (rawVal.includes('/') || rawVal.includes('"'));
          const liveMm = isFraction ? parseDimensionValue(rawVal) : null;

          return (
            <div key={field.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  {field.label}
                </label>
                {isFraction && liveMm > 0 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                    = {liveMm.toFixed(2)} mm
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="0.00 ou 1/2&quot;"
                  value={rawVal}
                  onChange={(e) => onInputChange(field.id, e.target.value)}
                  onFocus={() => setActiveField(field.id)}
                  onBlur={(e) => handleBlur(field.id, e.target.value)}
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderColor: hasError ? 'var(--accent-red)' : (activeField === field.id ? 'var(--accent-copper)' : 'var(--border-color)'),
                    boxShadow: hasError ? '0 0 0 2px rgba(192, 57, 43, 0.25)' : undefined
                  }}
                />
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${hasError ? 'var(--accent-red)' : 'var(--border-color)'}`,
                  borderLeft: 'none',
                  borderTopRightRadius: '12px',
                  borderBottomRightRadius: '12px',
                  padding: '0.75rem 0.85rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  minWidth: '55px',
                  textAlign: 'center'
                }}>
                  mm
                </div>
              </div>

              {/* Inline Guardrail Error Message */}
              {hasError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--accent-red)',
                  fontSize: '0.75rem',
                  marginTop: '0.35rem',
                  fontWeight: 600
                }}>
                  <AlertTriangle size={14} />
                  <span>{errors[field.id]}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Aba Desigual: visível somente para Perfil L / Cantoneira */}
        {shape.id === 'perfil_l_cantoneira' && (
          <>
            {/* Checkbox row — ocupa a largura total */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.7rem',
              padding: '0.6rem 0.85rem',
              background: abaDesigual ? 'rgba(184, 115, 51, 0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${abaDesigual ? 'var(--accent-copper)' : 'var(--border-color)'}`,
              borderRadius: '10px',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
              onClick={() => handleAbaDesigualToggle(!abaDesigual)}
            >
              {/* Custom checkbox */}
              <div style={{
                width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                border: `2px solid ${abaDesigual ? 'var(--accent-copper)' : 'var(--border-color)'}`,
                background: abaDesigual ? 'var(--accent-copper)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}>
                {abaDesigual && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: abaDesigual ? 'var(--accent-copper)' : 'var(--text-secondary)',
                userSelect: 'none',
                transition: 'color 0.15s ease'
              }}>
                Aba Desigual
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>
                {abaDesigual ? '— informe as duas abas separadamente' : '— L simétrico (A = B)'}
              </span>
            </div>

            {/* Campo Aba B — só aparece se abaDesigual estiver ativo */}
            {abaDesigual && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Aba B (mm)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-copper)', fontWeight: 600 }}>campo B</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    id="input-aba-b"
                    placeholder="0.00 ou 1/2&quot;"
                    value={inputs.aba_b !== undefined ? inputs.aba_b : ''}
                    onChange={(e) => onInputChange('aba_b', e.target.value)}
                    onFocus={() => setActiveField('aba_b')}
                    onBlur={(e) => handleBlur('aba_b', e.target.value)}
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      borderColor: activeField === 'aba_b' ? 'var(--accent-copper)' : 'var(--border-color)'
                    }}
                  />
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    borderLeft: 'none',
                    borderTopRightRadius: '12px',
                    borderBottomRightRadius: '12px',
                    padding: '0.75rem 0.85rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    minWidth: '55px',
                    textAlign: 'center'
                  }}>
                    mm
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quantidade */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.83rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.4rem'
          }}>
            Quantidade
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => onQuantityChange(e.target.value)}
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
            />
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderLeft: 'none',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              padding: '0.75rem 0.85rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              minWidth: '65px',
              textAlign: 'center'
            }}>
              peças
            </div>
          </div>
        </div>

        {/* Margem de Perda (%) */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.83rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.4rem'
          }}>
            Margem Perda (%)
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              min="0"
              step="any"
              value={lossMarginPct}
              onChange={(e) => onLossMarginChange(e.target.value)}
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
            />
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderLeft: 'none',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              padding: '0.75rem 0.85rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              minWidth: '55px',
              textAlign: 'center'
            }}>
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
