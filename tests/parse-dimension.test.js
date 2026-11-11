import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDimensionValue, isImperialInput, isAmbiguousThousands } from '../src/utils/calculations.js';

const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `esperado ${expected}, obtido ${actual}`);

test('números em mm com ponto ou vírgula', () => {
  close(parseDimensionValue('12.7'), 12.7);
  close(parseDimensionValue('12,7'), 12.7);
  close(parseDimensionValue('50'), 50);
  close(parseDimensionValue('6000mm'), 6000);
  close(parseDimensionValue(' 6000 mm '), 6000);
});

test('milhar só é aceito junto com decimal', () => {
  close(parseDimensionValue('1.250,5'), 1250.5);
  close(parseDimensionValue('1,250.5'), 1250.5);
  close(parseDimensionValue('1.000'), 1); // ponto sozinho é decimal
  assert.ok(isAmbiguousThousands('1.000'));
  assert.ok(!isAmbiguousThousands('12.7'));
});

test('frações de polegada', () => {
  close(parseDimensionValue('1/2'), 12.7);
  close(parseDimensionValue('1 1/2'), 38.1);
  close(parseDimensionValue('1-1/2'), 38.1);
  close(parseDimensionValue('1/2"'), 12.7);
  close(parseDimensionValue('1/2in'), 12.7);
  close(parseDimensionValue('1 1/2"'), 38.1);
});

test('polegadas com unidade', () => {
  close(parseDimensionValue('2"'), 50.8);
  close(parseDimensionValue('2in'), 50.8);
  close(parseDimensionValue('2 pol'), 50.8);
  close(parseDimensionValue('1,5"'), 38.1);
  assert.ok(isImperialInput('3/8'));
  assert.ok(isImperialInput('2in'));
  assert.ok(!isImperialInput('6000mm'));
  assert.ok(!isImperialInput('12.7'));
});

test('vazio é 0 e texto inválido é NaN', () => {
  assert.equal(parseDimensionValue(''), 0);
  assert.equal(parseDimensionValue('   '), 0);
  for (const bad of ['abc', '-500', '1 000', '1e400', '12abc', '1/0', 'in', '1..2']) {
    assert.ok(Number.isNaN(parseDimensionValue(bad)), `"${bad}" deveria ser inválido`);
  }
});
