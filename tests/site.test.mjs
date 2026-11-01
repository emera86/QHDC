import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('build emits the home page with search and category filtering', async () => {
  const html = await read('../dist/index.html');
  assert.match(html, /id="recipe-search"/);
  assert.match(html, /id="category-filter"/);
  assert.match(html, /Receta de muestra/i);
  assert.match(html, /href="\/QHDC\/indice\/"/);
  assert.match(html, /src="\/QHDC\/images\/demo\/plato-vegetal\.jpg"/);
  assert.match(html, /data-search="[^"]*lentejas/i, 'search index includes recipe body text');
  assert.match(html, /data-categories="Pastas y arroces"/);
});

test('build emits Spanish alphabetical index and every sample recipe', async () => {
  const html = await read('../dist/indice/index.html');
  assert.match(html, /id="index-heading"/);
  assert.match(html, /Índice de <em>recetas\.<\/em>/);
  assert.match(html, /Bizcocho de naranja/);
  assert.match(html, /Lentejas de la casa/);
  assert.match(html, /Tostadas de tomate/);
  assert.match(html, /Naranjas con miel/);
  assert.match(html, /Ñoquis de calabaza/);
  assert.ok(html.indexOf('id="letra-N"') < html.indexOf('id="letra-Ñ"'), 'N must precede Ñ in Spanish order');
  assert.match(html, /href="\/QHDC\/recetas\/arroz-meloso-de-setas\/"/);
});

test('recipe pages include a gallery and printable recipe content', async () => {
  const html = await read('../dist/recetas/arroz-meloso-de-setas/index.html');
  assert.match(html, /Fotografía anterior/);
  assert.match(html, /Fotografía siguiente/);
  assert.match(html, /Imprimir receta/);
  assert.match(html, /Notas y consejos/);
});

test('optional fields without values are omitted from their recipe page', async () => {
  const html = await read('../dist/recetas/tostadas-de-tomate/index.html');
  assert.match(html, /Tostadas de tomate/);
  assert.doesNotMatch(html, /Dificultad/);
  assert.doesNotMatch(html, /Cocción/);
  assert.doesNotMatch(html, /gallery-next/);
});
