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
  assert.match(html, /class="card-author">Por /);
});

test('history navigation separates its section link from its accessible disclosure', async () => {
  const html = await read('../dist/index.html');
  assert.match(html, /href="\/QHDC\/nuestra-historia\/"[^>]*>Nuestra historia<\/a>/);
  assert.match(html, /<details class="story-menu">\s*<summary><span class="sr-only">Mostrar subartículos de Nuestra historia<\/span><\/summary>/);
  assert.match(html, /href="\/QHDC\/nuestra-historia\/prologo-de-la-tia-chonin\/">Prólogo de la tía Chonín<\/a>/);
  assert.match(html, /href="\/QHDC\/nuestra-historia\/la-abuela-bobel-la-fundadora\/">La abuela Bobel: la fundadora<\/a>/);
  assert.match(html, /href="\/QHDC\/nuestra-historia\/nuestro-momento-de-fama\/">Nuestro momento de fama<\/a>/);

  const landing = await read('../dist/nuestra-historia/index.html');
  assert.match(landing, /Nuestra historia/);
  assert.match(landing, /Contenido pendiente de recuperar/);
  assert.match(landing, /href="\/QHDC\/nuestra-historia\/prologo-de-la-tia-chonin\/"/);
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
  assert.match(html, /class="recipe-categories"/);
  assert.doesNotMatch(html, /aside-categories/);
  assert.match(html, /ETIQUETAS TEMÁTICAS/);
  assert.match(html, /class="meta-icon"[^>]*><svg/);
});

test('similar recipes are relevant, unique, exclude the current recipe, and cap at three', async () => {
  const html = await read('../dist/recetas/croquetas-de-bacalao-de-muestra/index.html');
  const section = html.match(/<section class="related-recipes"[\s\S]*?<\/section>/);
  assert.ok(section, 'a recipe with strong shared tags and ingredients has recommendations');
  const links = [...section[0].matchAll(/class="related-recipe-link" href="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(links.length <= 3);
  assert.equal(new Set(links).size, links.length);
  assert.ok(links.every((href) => !href.includes('croquetas-de-bacalao-de-muestra')));
  assert.ok(links.some((href) => href.includes('bacalao-al-horno-de-muestra')));
  assert.ok(!links.some((href) => href.includes('polvorones-navidenos-de-muestra')), 'author and flour alone are not enough to qualify');
});

test('similar recipes are omitted when the only match is too weak', async () => {
  const html = await read('../dist/recetas/tostadas-de-tomate/index.html');
  assert.doesNotMatch(html, /class="related-recipes"/);
});

test('the homepage author prefix does not leak to thematic index cards', async () => {
  const html = await read('../dist/etiquetas/consejos-culinarios/index.html');
  assert.match(html, /class="card-author">De /);
  assert.doesNotMatch(html, /class="card-author">Por /);
});

test('optional fields without values are omitted from their recipe page', async () => {
  const html = await read('../dist/recetas/tostadas-de-tomate/index.html');
  assert.match(html, /Tostadas de tomate/);
  assert.doesNotMatch(html, /Dificultad/);
  assert.doesNotMatch(html, /Cocción/);
  assert.doesNotMatch(html, /gallery-next/);
});
