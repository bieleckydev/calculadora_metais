import React, { useState } from 'react';
import { SHAPES } from '../data/shapes';
import { LayoutGrid } from 'lucide-react';

/**
 * Renderizador de Ícones Vetoriais das Seções Transversais de Geometria
 */
function GeometryVectorIcon({ shapeId, isSelected }) {
  const stroke = isSelected ? 'var(--accent-copper)' : 'var(--text-muted)';

  switch (shapeId) {
    case 'chapa_bloco_retalho':
      return (
        <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
          <rect x="3" y="4" width="28" height="16" rx="2" stroke={stroke} strokeWidth="2.5" />
        </svg>
      );
    case 'bobina':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="12" stroke={stroke} strokeWidth="2.2" />
          <circle cx="16" cy="16" r="5" stroke={stroke} strokeWidth="2" />
          <path d="M 16,4 L 27,4" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'barra_redonda_tarugo':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="11" stroke={stroke} strokeWidth="2.5" />
        </svg>
      );
    case 'barra_quadrada':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <rect x="5" y="5" width="20" height="20" rx="2" stroke={stroke} strokeWidth="2.5" />
        </svg>
      );
    case 'barra_retangular_chata':
      return (
        <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
          <rect x="3" y="5" width="28" height="12" rx="2" stroke={stroke} strokeWidth="2.5" />
        </svg>
      );
    case 'barra_sextavada':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <polygon points="15,3 25,9 25,21 15,27 5,21 5,9" stroke={stroke} strokeWidth="2.2" />
        </svg>
      );
    case 'tubo_redondo':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="12" stroke={stroke} strokeWidth="2.5" />
          <circle cx="15" cy="15" r="6" stroke={stroke} strokeWidth="2" strokeDasharray="2 1" />
        </svg>
      );
    case 'bucha_tubo_mecanico':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="13" stroke={stroke} strokeWidth="2.5" />
          <circle cx="15" cy="15" r="7" stroke={stroke} strokeWidth="2.5" fill="none" />
        </svg>
      );
    case 'tubo_quadrado':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <rect x="4" y="4" width="22" height="22" rx="2" stroke={stroke} strokeWidth="2.5" />
          <rect x="9" y="9" width="12" height="12" rx="1" stroke={stroke} strokeWidth="1.8" strokeDasharray="2 1" />
        </svg>
      );
    case 'tubo_retangular':
      return (
        <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
          <rect x="3" y="4" width="28" height="14" rx="2" stroke={stroke} strokeWidth="2.5" />
          <rect x="8" y="7" width="18" height="8" rx="1" stroke={stroke} strokeWidth="1.8" strokeDasharray="2 1" />
        </svg>
      );
    case 'perfil_l_cantoneira':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M 6,5 L 6,24 L 25,24" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'perfil_t':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M 5,6 L 25,6 M 15,6 L 15,25" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'perfil_u':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M 6,6 L 6,24 L 24,24 L 24,6" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'perfil_i_h':
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M 5,5 L 25,5 M 15,5 L 15,25 M 5,25 L 25,25" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <rect x="4" y="4" width="22" height="22" rx="3" stroke={stroke} strokeWidth="2" />
        </svg>
      );
  }
}

export default function ShapeSelector({ selectedShape, onSelectShape }) {
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const categories = [
    { id: 'todos', label: 'Todas (14)' },
    { id: 'barra', label: 'Barras (4)' },
    { id: 'tubo', label: 'Tubos / Buchas (4)' },
    { id: 'perfil', label: 'Perfis (4)' },
    { id: 'chapa', label: 'Chapas / Bobinas (2)' }
  ];

  const filteredShapes = SHAPES.filter(s => 
    selectedCategory === 'todos' || s.categoria === selectedCategory
  );

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <LayoutGrid size={18} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            Geometria do perfil
          </h3>
        </div>

        {/* Quick Category Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? 'var(--accent-copper)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedCategory === cat.id ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, color 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of ALL 14 Shape Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
        gap: '0.85rem'
      }}>
        {filteredShapes.map((shape) => {
          const isSelected = selectedShape.id === shape.id;

          // Display labels
          let label = shape.name.split('/')[0].trim();
          if (shape.id === 'bobina') label = 'Bobina / Fita';
          if (shape.id === 'barra_redonda_tarugo') label = 'Redonda';
          if (shape.id === 'barra_quadrada') label = 'Quadrada';
          if (shape.id === 'barra_retangular_chata') label = 'Barra Chata';
          if (shape.id === 'barra_sextavada') label = 'Sextavada';
          if (shape.id === 'tubo_redondo') label = 'Tubo Red.';
          if (shape.id === 'bucha_tubo_mecanico') label = 'Bucha / Tubo';
          if (shape.id === 'tubo_quadrado') label = 'Tubo Quad.';
          if (shape.id === 'tubo_retangular') label = 'Tubo Ret.';
          if (shape.id === 'perfil_l_cantoneira') label = 'Cantoneira L';
          if (shape.id === 'perfil_t') label = 'Perfil T';
          if (shape.id === 'perfil_u') label = 'Perfil U';
          if (shape.id === 'perfil_i_h') label = 'Viga I / H';

          return (
            <button
              key={shape.id}
              onClick={() => onSelectShape(shape)}
              style={{
                background: isSelected ? 'rgba(184, 115, 51, 0.10)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isSelected ? 'var(--accent-copper)' : 'var(--border-color)'}`,
                borderRadius: '12px',
                padding: '1rem 0.65rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                position: 'relative',
                boxShadow: isSelected ? 'inset 0 0 0 1px var(--accent-copper)' : 'none'
              }}
            >
              <GeometryVectorIcon shapeId={shape.id} isSelected={isSelected} />

              <span style={{
                fontSize: '0.82rem',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                textAlign: 'center',
                lineHeight: 1.2
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
