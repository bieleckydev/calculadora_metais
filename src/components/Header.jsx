import React from 'react';
import { METALS } from '../data/metals';
import { ChevronDown } from 'lucide-react';
import softcompIcon from '../assets/softcomp_logo.png';

export default function Header({
  selectedFamily,
  onSelectFamily,
  selectedMetal,
  onSelectMetal
}) {
  // Extract families
  const families = ['Aço Inox', 'Metais Ferrosos e Aços', 'Ligas de Alumínio', 'Ligas de Cobre', 'Outros Metais Industriais', 'Plásticos e Polímeros Técnicos'];

  // Filter metals in the active family
  const familyMetals = METALS.filter(m => m.category === selectedFamily || (selectedFamily === 'Aço Inox' && m.category === 'Metais Ferrosos e Aços' && m.id.includes('inox')));

  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-surface)',
      padding: '0.85rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        {/* Title & Brand Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Softcomp Icon Logo */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            padding: '0.35rem 0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={softcompIcon}
              alt="Softcomp Logo"
              style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
                Cálculo de Peso Teórico
              </h1>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Módulo de Engenharia e Orçamentos
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Material Family Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Material:</span>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedFamily}
                onChange={(e) => onSelectFamily(e.target.value)}
                style={{
                  padding: '0.45rem 2rem 0.45rem 0.85rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  appearance: 'none'
                }}
              >
                {families.map(f => (
                  <option key={f} value={f} style={{ background: 'var(--bg-dark)', color: '#fff' }}>{f}</option>
                ))}
              </select>
              <ChevronDown size={14} color="var(--text-muted)" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Sub-Material / Liga Dropdown with Density Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Liga/Densidade:</span>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedMetal.id}
                onChange={(e) => {
                  const m = METALS.find(item => item.id === e.target.value);
                  if (m) onSelectMetal(m);
                }}
                style={{
                  padding: '0.45rem 2rem 0.45rem 0.85rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  appearance: 'none'
                }}
              >
                {familyMetals.map(m => (
                  <option key={m.id} value={m.id} style={{ background: 'var(--bg-dark)', color: '#fff' }}>
                    {m.name} (ρ = {m.density} g/cm³)
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color="var(--text-muted)" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
