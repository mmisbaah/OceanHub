import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { appGroups } from '../src/data/appGroups.js';
test('Habitat Rescue is a science game and preserves all existing adventures', async () => {
  const all = appGroups.flatMap(g => g.apps);
  assert.equal(all.length, 17);
  const science = appGroups.find(g => g.id === 'science');
  const game = science.apps.find(([name]) => name === 'Island Habitat Rescue');
  assert.equal(game[2], 'https://habitat.atollingo.com/');
  assert.match(game[1], /Grades 1–6/);
  assert.ok(science.apps.some(app => app[0] === 'Solar System Scavenger Hunt'));
  const component = await readFile(new URL('../src/components/AppIslands.jsx', import.meta.url), 'utf8');
  assert.match(component, /'Island Habitat Rescue': \['games'\]/);
});
