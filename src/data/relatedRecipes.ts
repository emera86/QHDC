import type { CollectionEntry } from 'astro:content';

type Recipe = CollectionEntry<'recipes'>;
type ScoredRecipe = { recipe: Recipe; score: number };

const collator = new Intl.Collator('es', { sensitivity: 'base' });
const lowSignalIngredients = new Set([
  'agua',
  'aceite',
  'aceite de oliva',
  'aceite suave',
  'aceite vegetal',
  'sal',
  'pimienta',
  'perejil',
  'laurel',
  'nuez moscada',
  'salvia',
  'hierbabuena',
]);

function getIngredientEntries(body: string) {
  const heading = /^##\s+Ingredientes\s*$/im.exec(body);
  if (!heading) return [];

  const sectionStart = heading.index + heading[0].length;
  const section = body.slice(sectionStart).split(/^##\s+/m, 1)[0];
  return [...section.matchAll(/^\s*-\s+(.+)\s*$/gm)].flatMap((match) =>
    match[1].split(/[,;]|\s+y\s+/i),
  );
}

function normalizeIngredient(value: string) {
  let ingredient = value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/^\s*\d+(?:[.,]\d+)?(?:\/\d+)?\s*(?:kg|g|mg|l|ml|cl|dl|litros?|gramos?|mililitros?)?\s*(?:de\s+)?/i, '')
    .replace(/^\s*(?:un|una|unos|unas)\s+/i, '')
    .replace(/^\s*(?:dientes?|hojas?|lomos?|cucharadas?|cucharaditas?|pizcas?|chorritos?|rebanadas?|rodajas?)\s+de\s+/i, '')
    .replace(/\bde muestra\b/g, ' ')
    .replace(/\b(?:pequena|pequeno|madura|maduro|variadas|variados|caliente|asada|asado|cocidas|cocidos|molida|redondo|verde|frescas|frescos)\b/g, ' ')
    .replace(/\bmas un poco para (?:la )?(?:mesa|servir)\b/g, ' ')
    .replace(/\bpara (?:la )?mesa\b|\bpara servir\b/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.-]+|[\s,.-]+$/g, '');

  if (ingredient.endsWith('ces')) ingredient = `${ingredient.slice(0, -3)}z`;
  else if (ingredient.length > 5 && ingredient.endsWith('es')) ingredient = ingredient.slice(0, -2);
  else if (ingredient.length > 4 && ingredient.endsWith('s')) ingredient = ingredient.slice(0, -1);

  return ingredient;
}

function getPrincipalIngredients(recipe: Recipe) {
  return new Set(
    getIngredientEntries(recipe.body)
      .map(normalizeIngredient)
      .filter((ingredient) => ingredient.length > 2 && !lowSignalIngredients.has(ingredient)),
  );
}

/**
 * Similarity uses only explicit tags, categories, and bullet items in the Markdown
 * “Ingredientes” section. Mentioning an ingredient only in preparation is not parsed,
 * so incomplete ingredient lists can lower the score. The schema has no preparation-
 * type field; that proposed point is intentionally omitted rather than inferred.
 */
export function findSimilarRecipes(current: Recipe, recipes: Recipe[], limit = 3) {
  const currentIngredients = getPrincipalIngredients(current);
  const currentTags = new Set(current.data.tags.map((tag) => tag.toLocaleLowerCase('es')));
  const currentCategories = new Set(current.data.categories);

  const unique = new Map<string, ScoredRecipe>();
  for (const recipe of recipes) {
    if (recipe.id === current.id) continue;

    const sharedTags = recipe.data.tags.filter((tag) => currentTags.has(tag.toLocaleLowerCase('es'))).length;
    const sharedIngredients = [...getPrincipalIngredients(recipe)].filter((ingredient) => currentIngredients.has(ingredient)).length;
    const sharesCategory = recipe.data.categories.some((category) => currentCategories.has(category));
    const sharesAuthor = Boolean(current.data.author && recipe.data.author && current.data.author === recipe.data.author);
    const baseScore = sharedTags * 3 + sharedIngredients * 2 + (sharesCategory ? 2 : 0);
    const score = baseScore + (sharesAuthor ? 1 : 0);

    // Author is a tie-breaker only; it cannot make a weak match eligible by itself.
    if (baseScore >= 3 && !unique.has(recipe.id)) unique.set(recipe.id, { recipe, score });
  }

  return [...unique.values()]
    .sort((a, b) => b.score - a.score || collator.compare(a.recipe.data.title, b.recipe.data.title))
    .slice(0, Math.min(3, Math.max(0, limit)))
    .map(({ recipe }) => recipe);
}
