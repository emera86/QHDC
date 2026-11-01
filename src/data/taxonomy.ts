export const RECIPE_CATEGORIES = [
  'Entrantes y aperitivos',
  'Sopas y purés',
  'Verduras y ensaladas',
  'Pastas y arroces',
  'Masas y rebozados',
  'Guisos y legumbres',
  'Pescados y mariscos',
  'Carnes y aves',
  'Salsas y guarniciones',
  'Postres y repostería',
  'Consejos',
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export const THEMATIC_INDEX_TAGS = [
  'Recorriendo el mundo',
  'Dulces navideños',
  'El rincón del bacalao',
  'Curiosidades',
  'Consejos culinarios',
] as const;

export function slugifyTag(tag: string) {
  return tag
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Las descripciones son opcionales. Se pueden incorporar aquí cuando se apruebe su texto.
export const TAG_DESCRIPTIONS: Record<string, string> = {};
