# ¿Qué hay de comer? · prototipo

Prototipo estático de un recetario familiar construido con Astro y Markdown. Todo el contenido de ejemplo es ficticio. **No se ha iniciado la migración de Blogger y este proyecto no contiene contenido ni fotografías de `Backup Blogger`.**

Las cinco fotografías de muestra están guardadas localmente en `public/images/demo/`. Proceden de Unsplash, no de Blogger, y se incluyen solo como imágenes de demostración. Sus URL de origen y la licencia están documentadas en [`public/images/demo/SOURCES.md`](public/images/demo/SOURCES.md).

## Requisitos

- Node.js 22 o superior.
- pnpm 11.25.0. En Windows, instala Node.js (incluye npm) y, si pnpm no está instalado, ejecuta `npm install --global pnpm@11.25.0`.

## Ejecutar localmente

Desde la carpeta del repositorio:

```bash
cd /path/to/QHDC
pnpm install
pnpm dev
```

Abre <http://localhost:4321/QHDC/>. La base `/QHDC` corresponde al nombre de este repositorio y también se usa en GitHub Pages.

## Comprobar el prototipo

```bash
pnpm build
pnpm test
pnpm preview
```

Las pruebas de Node comprueban las páginas estáticas generadas y sus elementos principales. `pnpm build` valida además la colección de contenido y genera `dist/`. La vista previa local permite revisar el build antes de publicarlo.

En la portada puedes probar el buscador general y el filtro de categorías. El texto «Índice de recetas» abre todas las recetas; la flecha contigua permite abrir el índice filtrado por cualquiera de las once categorías. El índice alfabético también tiene un filtro de categorías. «Nuestra historia» enlaza a «Prólogo de la tía Chonín», «La abuela Bobel: la fundadora» y «Nuestro momento de fama», con contenido pendiente de recuperar fielmente de Blogger. Cada ficha muestra las categorías y etiquetas enlazadas; las fichas con más de una imagen incluyen controles de galería. En una ficha, usa «Imprimir receta» para abrir la impresión del navegador.

## Contenido

Las recetas viven en `src/content/recipes/`, separadas de los componentes visuales. Cada archivo Markdown combina frontmatter validado en `src/content.config.ts` con secciones de ingredientes, preparación y notas opcionales. Los campos que faltan se omiten automáticamente.

## Categorías y etiquetas

`categories` y `tags` tienen funciones separadas. `categories` solo acepta las once categorías cerradas declaradas en `src/data/taxonomy.ts`: Entrantes y aperitivos, Sopas y purés, Verduras y ensaladas, Pastas y arroces, Masas y rebozados, Guisos y legumbres, Pescados y mariscos, Carnes y aves, Salsas y guarniciones, Postres y repostería y Consejos. Una receta puede tener varias categorías justificadas.

`tags` contiene etiquetas temáticas libres y distintas de las categorías. Los índices especiales de muestra son Recorriendo el mundo, Dulces navideños, El rincón del bacalao, Curiosidades y Consejos culinarios. Cada etiqueta presente en las recetas genera su propia página en `/etiquetas/<etiqueta>/`; las etiquetas enlazadas aparecen en las tarjetas y en las fichas. Las descripciones introductorias, opcionales, se pueden añadir en `TAG_DESCRIPTIONS` dentro de `src/data/taxonomy.ts`.

El campo `originalCategories` está reservado para conservar las categorías de origen durante una migración autorizada; `categoryMappingNote` permite anotar el criterio aplicado. No se deben convertir etiquetas originales de Blogger en categorías ni asignar etiquetas cuando el contenido no aporte evidencia. Las etiquetas temáticas asignadas ahora solo sirven para demostrar la estructura con datos ficticios.

Para añadir una receta, crea un Markdown en esa carpeta con `title`, `summary`, `categories` e `images`; `author`, `tags`, tiempos, raciones y dificultad son opcionales. Las imágenes se guardan en `public/images/` y se referencian con rutas como `/images/recetas/nombre/foto.jpg`. El contenido ficticio debe sustituirse solo después de aprobar el diseño y el plan de migración.

## GitHub Pages

`astro.config.mjs` define el sitio como `https://emera86.github.io/QHDC/` con `base: '/QHDC'`. El workflow `.github/workflows/deploy.yml` se ejecuta **solo mediante `workflow_dispatch`**; no se publica automáticamente al hacer push. Para publicar más adelante, activa GitHub Pages con la fuente **GitHub Actions** en la configuración del repositorio y ejecuta manualmente el workflow, únicamente después de autorizar la publicación.

## Límite de esta fase

Este prototipo no importa, transforma ni consulta el respaldo de Blogger. Las recetas y sus textos son inventados. La web no se ha publicado y no se han creado commits.
