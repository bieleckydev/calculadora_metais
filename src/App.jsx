import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ShapeSelector from './components/ShapeSelector';
import CalculatorForm from './components/CalculatorForm';
import ResultCard from './components/ResultCard';
import TechnicalDiagram from './components/TechnicalDiagram';
import FooterERP from './components/FooterERP';
import { METALS, INOX_FAMILY, getMetalsByFamily } from './data/metals';
import { SHAPES } from './data/shapes';
import { calculateMetalWeight } from './utils/calculations';


export default function App() {
  const [selectedFamily, setSelectedFamily] = useState(INOX_FAMILY);
  const [selectedMetal, setSelectedMetal] = useState(() => METALS.find(m => m.id === 'aco_inox_304') || METALS[0]);
  const [selectedShape, setSelectedShape] = useState(() => SHAPES.find(s => s.id === 'tubo_redondo') || SHAPES[0]);
  const [activeField, setActiveField] = useState(null);

  // Inputs start completely EMPTY so the user types from scratch
  const [inputs, setInputs] = useState({
    diametro_externo: '',
    parede: '',
    comprimento: ''
  });

  const [quantity, setQuantity] = useState(1);
  const [lossMarginPct, setLossMarginPct] = useState('');

  // Cantoneira de abas desiguais: com o toggle ligado, a aba B é obrigatória
  const [abaDesigual, setAbaDesigual] = useState(false);
  const usesAbaB = selectedShape.id === 'perfil_l_cantoneira' && abaDesigual;

  const handleAbaDesigualChange = (checked) => {
    setAbaDesigual(checked);
    // Desligado: limpa a aba B para o cálculo voltar a usar B = A
    if (!checked) setInputs(prev => ({ ...prev, aba_b: '' }));
  };

  // Ao trocar a família, a liga passa a ser a primeira da nova família,
  // para o cálculo usar a mesma densidade que o select mostra
  const handleSelectFamily = (family) => {
    setSelectedFamily(family);
    const [firstMetal] = getMetalsByFamily(family);
    if (firstMetal) setSelectedMetal(firstMetal);
  };

  // Handle shape change (reset inputs to empty strings)
  const handleSelectShape = (shape) => {
    setSelectedShape(shape);
    setAbaDesigual(false);
    const newInputs = {};
    shape.inputs.forEach(f => {
      newInputs[f.id] = '';
    });
    setInputs(newInputs);
  };

  // Handle dimension input change
  const handleInputChange = (fieldId, value) => {
    setInputs(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Calculation computation
  const results = useMemo(() => {
    return calculateMetalWeight({
      shape: selectedShape,
      inputs,
      densityGcm3: selectedMetal.density,
      quantity,
      lossMarginPct,
      extraFieldIds: usesAbaB ? ['aba_b'] : []
    });
  }, [selectedShape, inputs, selectedMetal, quantity, lossMarginPct, usesAbaB]);

  return (
    <div className="app">
      <Header
        selectedFamily={selectedFamily}
        onSelectFamily={handleSelectFamily}
        selectedMetal={selectedMetal}
        onSelectMetal={setSelectedMetal}
      />

      <main className="app-main">
        {/* Row 1: Geometry selector | Technical diagram */}
        <div className="app-row app-row--top">
          <ShapeSelector
            selectedShape={selectedShape}
            onSelectShape={handleSelectShape}
          />

          <div className="app-aside">
            <TechnicalDiagram
              shapeId={selectedShape.id}
              activeField={activeField}
            />
          </div>
        </div>

        {/* Row 2: Dimension inputs | Weight results */}
        <div className="app-row app-row--bottom">
          <CalculatorForm
            shape={selectedShape}
            inputs={inputs}
            onInputChange={handleInputChange}
            abaDesigual={abaDesigual}
            onAbaDesigualChange={handleAbaDesigualChange}
            quantity={quantity}
            onQuantityChange={setQuantity}
            lossMarginPct={lossMarginPct}
            onLossMarginChange={setLossMarginPct}
            activeField={activeField}
            setActiveField={setActiveField}
            errors={results.errors}
          />

          <div className="app-aside">
            <ResultCard
              results={results}
              selectedMetal={selectedMetal}
              selectedShape={selectedShape}
              inputs={inputs}
            />
          </div>
        </div>
      </main>


      <FooterERP
        isValid={results.isValid}
        totalWeightKg={results.totalWeightKg}
      />
    </div>
  );
}
