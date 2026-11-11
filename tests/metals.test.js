import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DENSIDADES, METALS_METADATA, METALS } from '../src/data/metals.js';

test('cada material tem densidade e cada densidade tem material', () => {
  const metadataIds = METALS_METADATA.map(m => m.id).sort();
  const densityIds = Object.keys(DENSIDADES).sort();
  assert.deepEqual(metadataIds, densityIds);
});

test('ids sem acento, espaço ou maiúscula', () => {
  for (const { id } of METALS) {
    assert.match(id, /^[a-z0-9_]+$/, id);
  }
});

test('densidades positivas e plausíveis (0,5 a 25 g/cm³)', () => {
  for (const { id, density } of METALS) {
    assert.ok(density >= 0.5 && density <= 25, `${id}: ${density}`);
  }
});
