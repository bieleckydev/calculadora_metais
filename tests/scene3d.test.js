import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHAPES } from '../src/data/shapes.js';
import {
  buildSection, buildModel, projectScene, resolveValues, signedArea, DEFAULT_VIEW, SECTION_VIEW
} from '../src/utils/scene3d.js';

const shape = (id) => SHAPES.find(s => s.id === id);
const defaults = (s) => Object.fromEntries(s.inputs.map(f => [f.id, Number(f.default)]));
const sectionArea = (section) => section.parts.reduce((sum, p) =>
  sum + Math.abs(signedArea(p.outer)) - (p.holes || []).reduce((h, loop) => h + Math.abs(signedArea(loop)), 0), 0);
const viewport = { cx: 180, cy: 110, scale: 80 };

test('área da seção desenhada bate com a fórmula de peso', () => {
  for (const s of SHAPES.filter(s => s.id !== 'bobina')) {
    const v = defaults(s);
    const formulaArea = s.calculateVolumeMm3(v) / v.comprimento;
    const drawnArea = sectionArea(buildSection(s.id, v));
    // Círculos são polígonos de 40 lados: tolerância de 1%
    assert.ok(Math.abs(drawnArea - formulaArea) / formulaArea < 0.01, `${s.id}: ${drawnArea} × ${formulaArea}`);
  }
});

test('cantoneira de abas desiguais usa a aba B', () => {
  const v = { aba: 50, aba_b: 30, espessura: 5, comprimento: 1000 };
  assert.equal(sectionArea(buildSection('perfil_l_cantoneira', v)), 5 * (50 + 30 - 5));
});

test('todas as geometrias geram malha normalizada e cota para cada campo', () => {
  for (const s of SHAPES) {
    const model = buildModel(s, {});
    assert.ok(model.faces.length > 0, s.id);
    const coords = model.faces.flatMap(f => f.loops.flat(2));
    assert.ok(coords.every(Number.isFinite), `${s.id}: coordenada inválida`);
    const radius = Math.max(...model.faces.flatMap(f => f.loops.flat().map(p => Math.hypot(...p))));
    assert.ok(Math.abs(radius - 1) < 1e-9, `${s.id}: raio ${radius}`);

    const dimFields = new Set(model.dims.flatMap(d => d.fields));
    for (const f of s.inputs) assert.ok(dimFields.has(f.id), `${s.id}: sem cota para ${f.id}`);
  }
});

test('usa as medidas digitadas e mostra o valor na cota', () => {
  const model = buildModel(shape('tubo_redondo'), { diametro_externo: '1/2"', parede: '2', comprimento: '' });
  const labels = model.dims.map(d => d.label);
  assert.ok(labels.includes('Dext 12,7'));
  assert.ok(labels.includes('e 2'));
  assert.ok(labels.includes('C'), 'campo vazio mostra só o símbolo');
});

test('medidas impossíveis voltam para o desenho padrão', () => {
  const { values, provided } = resolveValues(shape('tubo_redondo'), { diametro_externo: '10', parede: '8' });
  assert.equal(values.diametro_externo, 60);
  assert.deepEqual(provided, {});
});

test('vista de seção mostra só a face frontal', () => {
  const { polys } = projectScene(buildModel(shape('barra_quadrada'), {}), SECTION_VIEW, viewport);
  assert.equal(polys.length, 1);
  assert.ok(polys[0].cap);
});

test('vista isométrica descarta as faces de costas e ordena do fundo para a frente', () => {
  const model = buildModel(shape('tubo_redondo'), {});
  const { polys, dims } = projectScene(model, DEFAULT_VIEW, viewport);
  assert.ok(polys.length > 0 && polys.length < model.faces.length);
  for (let i = 1; i < polys.length; i++) assert.ok(polys[i - 1].depth <= polys[i].depth);
  assert.ok(dims.every(d => [d.x1, d.y1, d.x2, d.y2].every(Number.isFinite)));
});

test('projeção é rápida o bastante para 60 fps', () => {
  const model = buildModel(shape('tubo_redondo'), {});
  const start = performance.now();
  for (let i = 0; i < 1000; i++) projectScene(model, { yaw: i, pitch: 20, zoom: 1 }, viewport);
  const perFrame = (performance.now() - start) / 1000;
  assert.ok(perFrame < 2, `${perFrame.toFixed(3)} ms por quadro`);
});
