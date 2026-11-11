import React from 'react';
import { METALS, MATERIAL_FAMILIES, getMetalsByFamily } from '../data/metals';
import { ChevronDown } from 'lucide-react';
import softcompIcon from '../assets/softcomp_logo.png';

export default function Header({
  selectedFamily,
  onSelectFamily,
  selectedMetal,
  onSelectMetal
}) {
  const familyMetals = getMetalsByFamily(selectedFamily);

  return (
    <header className="app-header">
      <div className="app-header__inner">
        {/* Marca e título */}
        <div className="app-header__brand">
          <div className="app-header__logo">
            <img src={softcompIcon} alt="Softcomp Logo" />
          </div>

          <div>
            <h1 className="app-header__title">Cálculo de Peso Teórico</h1>
            <p className="app-header__subtitle">Módulo de Engenharia e Orçamentos</p>
          </div>
        </div>

        {/* Seleção de material */}
        <div className="app-header__controls">
          <div className="header-field">
            <label className="header-field__label" htmlFor="filtro-familia">Material:</label>
            <div className="select-wrap">
              <select
                id="filtro-familia"
                value={selectedFamily}
                onChange={(e) => onSelectFamily(e.target.value)}
              >
                {MATERIAL_FAMILIES.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <ChevronDown size={14} className="select-wrap__icon" />
            </div>
          </div>

          <div className="header-field">
            <label className="header-field__label" htmlFor="filtro-liga">Liga/Densidade:</label>
            <div className="select-wrap">
              <select
                id="filtro-liga"
                value={selectedMetal.id}
                onChange={(e) => {
                  const m = METALS.find(item => item.id === e.target.value);
                  if (m) onSelectMetal(m);
                }}
              >
                {familyMetals.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} (ρ = {m.density} g/cm³)
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="select-wrap__icon" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
