import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHAPES } from '../src/data/shapes.js';
import { calculateMetalWeight } from '../src/utils/calculations.js';

const shape = (id) => SHAPES.find(s => s.id === id);
const close = (actual, expected, tol = 1e-3) =>
  assert.ok(Math.abs(actual - expected) <= tol, `esperado ${expected}, obtido ${actual}`);

// Peso de 1 m de aço carbono (ρ = 7,85) em kg, conferido com as constantes
// usadas em catálogos de fabricantes (kg/m com medidas em mm)
const steel = (id, inputs) => calculateMetalWeight({
  shape: shape(id),
  inputs: { comprimento: '1000', ...inputs },
  densityGcm3: 7.85
});

test('barra redonda: 0,006165 × D² kg/m', () => {
  close(steel('barra_redonda_tarugo', { diametro: '50' }).weightKg, 0.0061654 * 50 * 50);
});

test('barra quadrada: 0,00785 × A² kg/m', () => {
  close(steel('barra_quadrada', { lado: '40' }).weightKg, 0.00785 * 40 * 40);
});

test('barra sextavada: 0,0068 × S² kg/m', () => {
  close(steel('barra_sextavada', { bitola: '30' }).weightKg, 0.0067983 * 30 * 30);
});

test('chapa: 7,85 kg/m² por mm de espessura', () => {
  close(steel('chapa_bloco_retalho', { espessura: '10', largura: '1000' }).weightKg, 78.5);
});

test('tubo redondo: 0,02466 × e × (D − e) kg/m', () => {
  close(steel('tubo_redondo', { diametro_externo: '60', parede: '5' }).weightKg, 0.024662 * 5 * 55);
});

test('tubo redondo e bucha dão o mesmo peso para a mesma seção', () => {
  const tubo = steel('tubo_redondo', { diametro_externo: '80', parede: '15' }).weightKg;
  const bucha = steel('bucha_tubo_mecanico', { diametro_externo: '80', diametro_interno: '50' }).weightKg;
  close(tubo, bucha, 1e-9);
});

test('tubo quadrado = área externa − área interna', () => {
  const w = steel('tubo_quadrado', { lado: '50', parede: '3' }).weightKg;
  close(w, (50 * 50 - 44 * 44) * 7.85 / 1000);
});

test('tubo retangular = área externa − área interna', () => {
  const w = steel('tubo_retangular', { lado_maior: '80', lado_menor: '40', parede: '3' }).weightKg;
  close(w, (80 * 40 - 74 * 34) * 7.85 / 1000);
});

test('cantoneira simétrica e de abas desiguais', () => {
  close(steel('perfil_l_cantoneira', { aba: '50', espessura: '5' }).weightKg, 5 * 95 * 7.85 / 1000);
  close(steel('perfil_l_cantoneira', { aba: '50', aba_b: '30', espessura: '5' }).weightKg, 5 * 75 * 7.85 / 1000);
});

test('perfil T, U e viga I/H', () => {
  close(steel('perfil_t', { mesa: '50', altura: '50', espessura: '5' }).weightKg, (50 * 5 + 45 * 5) * 7.85 / 1000);
  close(steel('perfil_u', { altura: '80', aba: '40', espessura: '4' }).weightKg, (80 * 4 + 2 * 36 * 4) * 7.85 / 1000);
  close(steel('perfil_i_h', { altura: '150', largura_aba: '75', espessura_alma: '5', espessura_aba: '7' }).weightKg,
    (2 * 75 * 7 + 136 * 5) * 7.85 / 1000);
});

test('peso total aplica quantidade e margem de perda', () => {
  const r = calculateMetalWeight({
    shape: shape('barra_quadrada'),
    inputs: { lado: '10', comprimento: '1000' },
    densityGcm3: 7.85,
    quantity: 3,
    lossMarginPct: '10'
  });
  close(r.totalWeightKg, 0.785 * 3 * 1.1);
});
