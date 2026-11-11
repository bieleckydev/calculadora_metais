import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHAPES } from '../src/data/shapes.js';
import { METALS } from '../src/data/metals.js';
import { calculateMetalWeight, generateCommercialDescription } from '../src/utils/calculations.js';

const describe = (id, inputs) => {
  const shape = SHAPES.find(s => s.id === id);
  const metal = METALS.find(m => m.id === 'aco_carbono');
  const results = calculateMetalWeight({ shape, inputs, densityGcm3: metal.density });
  return generateCommercialDescription({ shape, metal, inputs, results });
};

test('tubo retangular identifica a parede', () => {
  const d = describe('tubo_retangular', { lado_maior: '80', lado_menor: '40', parede: '3', comprimento: '6000' });
  assert.match(d, /80,00mm x 40,00mm x Parede 3,00mm x 6\.000,00mm/);
});

test('barra chata e sextavada têm rótulos', () => {
  assert.match(describe('barra_retangular_chata', { largura: '50', espessura: '10', comprimento: '1000' }), /L 50,00mm x e 10,00mm/);
  assert.match(describe('barra_sextavada', { bitola: '30', comprimento: '1000' }), /Sext\. 30,00mm \(entre faces\)/);
});

test('todas as geometrias geram descrição com peso', () => {
  for (const shape of SHAPES) {
    const inputs = Object.fromEntries(shape.inputs.map(f => [f.id, String(f.default)]));
    assert.match(describe(shape.id, inputs), /Peso Est\.: [\d.,]+ kg$/, shape.id);
  }
});
