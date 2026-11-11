import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHAPES } from '../src/data/shapes.js';
import { calculateMetalWeight } from '../src/utils/calculations.js';

const shape = (id) => SHAPES.find(s => s.id === id);
const calc = (id, inputs, extra = {}) =>
  calculateMetalWeight({ shape: shape(id), inputs, densityGcm3: 7.85, ...extra });

test('campo vazio não gera erro físico em outro campo', () => {
  assert.deepEqual(calc('tubo_retangular', { parede: '3' }).errors, {});
  assert.deepEqual(calc('perfil_t', { espessura: '5' }).errors, {});
  assert.deepEqual(calc('perfil_u', { espessura: '4' }).errors, {});
});

test('erro físico aparece assim que os campos comparados estão preenchidos', () => {
  assert.ok(calc('tubo_retangular', { lado_menor: '5', parede: '3' }).errors.parede);
  assert.ok(calc('perfil_t', { mesa: '4', espessura: '5' }).errors.espessura);
  assert.ok(calc('perfil_u', { altura: '6', espessura: '4' }).errors.espessura);
});

test('texto inválido mostra erro no próprio campo', () => {
  const r = calc('barra_redonda_tarugo', { diametro: 'abc', comprimento: '-5' });
  assert.equal(r.isValid, false);
  assert.ok(r.errors.diametro);
  assert.ok(r.errors.comprimento);
});

test('cantoneira com aba desigual exige a aba B', () => {
  const base = { aba: '50', espessura: '5', comprimento: '1000' };
  assert.equal(calc('perfil_l_cantoneira', base).isValid, true);
  assert.equal(calc('perfil_l_cantoneira', { ...base, aba_b: '' }, { extraFieldIds: ['aba_b'] }).isValid, false);
  const curta = calc('perfil_l_cantoneira', { ...base, aba_b: '3' }, { extraFieldIds: ['aba_b'] });
  assert.ok(curta.errors.aba_b);
  assert.equal(curta.errors.espessura, undefined);
});
