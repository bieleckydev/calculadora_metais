import React, { useState } from 'react';
import { METALS } from '../data/metals';
import { Database, Info, Search, Filter } from 'lucide-react';

export default function MetalSelector({ selectedMetal, onSelectMetal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', ...new Set(METALS.map(m => m.category))];

  const filteredMetals = METALS.filter(metal => {
    const matchesCategory = selectedCategory === 'Todos' || metal.category === selectedCategory;
    const matchesSearch = metal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          metal.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Database size={20} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>1. Seleção do Material / Liga</h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {METALS.length} Materiais Cadastrados (g/cm³)
        </span>
      </div>

      {/* Filter and Search Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.2rem'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar material (ex: 304, 6061, teflon)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.3rem', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Filter size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ paddingLeft: '2.3rem', fontSize: '0.88rem' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Materials */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '0.75rem',
        maxHeight: '340px',
        overflowY: 'auto',
        paddingRight: '4px',
        marginBottom: '1rem'
      }}>
        {filteredMetals.map((metal) => {
          const isSelected = selectedMetal.id === metal.id;
          return (
            <button
              key={metal.id}
              onClick={() => onSelectMetal(metal)}
              style={{
                background: isSelected ? 'rgba(184, 115, 51, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: isSelected ? '1.5px solid var(--accent-copper)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.85rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: metal.color || 'var(--text-muted)',
                  letterSpacing: '0.04em'
                }}>
                  {metal.category}
                </span>
                <h4 style={{ fontSize: '0.86rem', color: isSelected ? '#fff' : 'var(--text-primary)', marginTop: '2px', lineHeight: 1.3 }}>
                  {metal.name}
                </h4>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                color: isSelected ? 'var(--accent-copper)' : 'var(--text-secondary)',
                fontWeight: 700
              }}>
                <span>{metal.density.toFixed(2)} g/cm³</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedMetal && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          borderLeft: `3px solid ${selectedMetal.color || 'var(--accent-cyan)'}`
        }}>
          <Info size={18} color="var(--accent-copper)" style={{ flexShrink: 0 }} />
          <span>{selectedMetal.description} — <strong>Densidade ({selectedMetal.id}): {selectedMetal.density} g/cm³</strong></span>
        </div>
      )}
    </div>
  );
}
