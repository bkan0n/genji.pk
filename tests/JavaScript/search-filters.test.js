import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  normalizeMapNames,
  serializeSearchFilters,
  toggleMapName,
} from '../../resources/js/utils/search-filters.js';

test('a legacy single-map selection becomes a one-element list', () => {
  assert.deepEqual(normalizeMapNames('Hanamura'), ['Hanamura']);
});

test('map selections are trimmed and deduplicated without changing their spelling', () => {
  assert.deepEqual(normalizeMapNames([' Hanamura ', 'hanamura', '', 'Eichenwalde']), [
    'Hanamura',
    'Eichenwalde',
  ]);
});

test('cleared map selections stay empty', () => {
  for (const value of [undefined, null, '', [], [' ', '']]) {
    assert.deepEqual(normalizeMapNames(value), []);
  }
});

test('map names preserve punctuation and translated text', () => {
  const names = ["King's Row", 'Watchpoint: Gibraltar', '漓江塔'];
  assert.deepEqual(normalizeMapNames(names), names);
});

test('multiple map names use bracketed keys so Laravel retains every selection', () => {
  const query = new URLSearchParams(
    serializeSearchFilters({
      map_name: ['Hanamura', 'Eichenwalde'],
      difficulty_exact: 'Hard',
      page_number: 2,
    })
  );
  assert.deepEqual(query.getAll('map_name[]'), ['Hanamura', 'Eichenwalde']);
  assert.equal(query.has('map_name'), false);
  assert.equal(query.get('difficulty_exact'), 'Hard');
  assert.equal(query.get('page_number'), '2');
});

test('choosing a new map adds it without replacing previous selections', () => {
  assert.deepEqual(toggleMapName(['Hanamura'], ' Eichenwalde '), ['Hanamura', 'Eichenwalde']);
});

test('choosing a selected map removes only that map, ignoring case', () => {
  assert.deepEqual(toggleMapName(['Hanamura', 'Eichenwalde'], 'hanamura'), ['Eichenwalde']);
  assert.deepEqual(toggleMapName(['Hanamura'], 'Hanamura'), []);
});

test('other multi-select filters retain every value alongside map names', () => {
  const filters = {
    map_name: ['Hanamura', 'Eichenwalde'],
    mechanics: ['Dash', 'Bhop'],
    restrictions: ['Wall Climb', 'Double Jump'],
    tags: ['Other', 'XP Based'],
  };
  const query = new URLSearchParams(serializeSearchFilters(filters));
  for (const [key, values] of Object.entries(filters)) {
    assert.deepEqual(query.getAll(`${key}[]`), values);
  }
});

test('request encoding preserves punctuation and translated map names', () => {
  const names = ["King's Row", 'Watchpoint: Gibraltar', '漓江塔'];
  const query = new URLSearchParams(serializeSearchFilters({ map_name: names }));
  assert.deepEqual(query.getAll('map_name[]'), names);
});

test('empty filters are omitted while false and numeric values are preserved', () => {
  const query = new URLSearchParams(
    serializeSearchFilters({
      map_name: [],
      mechanics: [null, '', 'Dash'],
      code: '',
      user_id: undefined,
      category: null,
      archived: false,
      minimum_quality: 0,
    })
  );
  assert.deepEqual(
    [...query.entries()],
    [
      ['mechanics[]', 'Dash'],
      ['archived', 'false'],
      ['minimum_quality', '0'],
    ]
  );
});
