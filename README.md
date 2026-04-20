# Test 01 — Tablero de trabajos

**Mini tablero de empleos con Next.js App Router**

- Node 25.9.0
- TypeScript 5
- NextJS 16.2.2

Decidi optar por esta prueba, como reto personal. Hace tiempo que no uso NextJS, quería combinarlo con las herramientas de IA actuales, para verificar, cuanto tiempo me tomaba adaptarme nuevamente. También, por la parte personal, disfruto mucho del proceso, de crear aplicaciones React, y poder ver en vivo, como se materializa cada cambio en código en el navegador (el famoso hot reload). Entonces NextJS, al ser un framework, que incluye muchas utilidades, para crear aplicaciones React, se me hizo más atractivo.

Utilice VSCode en conjunción con Copilot. Esto debido a que, es un modelo gratuito y no conlleva un gran tiempo en su aprovisionamiento/configuración. Honestamente, no fue la experiencia más grata (viniendo de usar Claude Code), pero fue altamente funcional.
Para una mejor experiencia de desarrollo, y pensando, en una fácil replicación del entorno (pensando esto, como si ya estuviera trabajando con un equipo), incorpore algunas amenidades:

- Biome
- EditorConfig
- AGENTS.md

Biome es un linter, fixer y formateador, del ecosistema JavaScript. Tiene soporte para JSON, CSS, JSX, y otras tecnologias, también soporta incluir conjuntos de reglas existentes (como ESLint). Es altamente configurable y personalizable (via el archivo biome.json). Con esto, se adopta un estilo marcado para el proyecto. Como cereza del pastel, Biome está escrito en Rust, por lo cual, es casi instantaneo el aplicar las reglas a la base de código.
Está incluido como dependencia de desarrollo en el package.json.

EditorConfig, es un estandar, para marcar reglas básicas, en distintos editores. Como el tipo de identación, eliminar espacios finales, agregar salto de linea final, etc...

AGENTS.md, un estandar, para los agentes programaticos. Permite definir reglas o contexto. Con esto, se puede evitar, el estar definiendo el estilo de tu proyecto constantemente, entre otros extras.

Gracias a estas 3 herramientas, el uso de un agente IA para código fue más ameno, resultando en un uso de NextJS más agil. Si bien, no es parte del alcance de este proyecto. Quiero documentar, el como pensé el entorno de desarrollo.

## Funcionamiento

Esta aplicación de NextJS, muestra un tablero de posiciones de trabajo. Describiendo:

- Titulo de la posición
- Compañia
- Ubicación
- Modalidad
- Salario
- Descripción
- Etiquetas

Se puede realizar filtrado por:

- Titulo de la posición
- Compañia
- Ubicación
- Modalidad

Seleccionando una posición en especifico, se puede acceder a una descripción más detallada de esta. "Permitiendo" mandar una solicitud de aplicación (sin lógica implementada en servidor).

## Decisiones técnicas (desarrollo)

Como se comentó. Se utilizó Biome, EditorConfig y AGENTS.md.

Opté Biome, por su gran y sencilla personalización. Como por su increible velocidad, al estar programado en Rust.

EditorConfig y AGENTS.md, son estandares y muy fáciles de entender/implementar.

## Decisiones técnicas (código)

NextJS es un framework para React. Define una estructura muy marcada de estructura para un proyecto, buscando una fácil interacción servidor-cliente. Por lo cual, me apegue estrictamente a esto, sin ir en contra de la esencia del framework.

Aprovechando las caracteristicas de servidor de NextJS (Server components y SSR). Opté por cargar una unica vez, el listado JSON de las posiciones de trabajo, para todo el tiempo de vida de la aplicación. De esta forma, evitando leer el archivo, en cada render de una página.
Para evitar hardcodear la ruta/nombre del archivo, la configuración se hace via variable de entorno. Con esto, se puede crear una capa "repositorio".
Esta capa define las operaciones que se necesitan, para la lógica de nuestra página de listado/mostrar. Para fines de esta prueba, al leerlo desde un archivo JSON, la implementación es un "Iterable repository", el cual, recibe por parametro el array de objetos, para construir la instancia.
Con esto, podemos importarlo, en la página donde se necesite. Evitando incluir lógica que no le compete a una página o componente React, por ejemplo, loǵica de filtrado o paginación.

Como componentes reutilizables, tenemos una barra de busqueda y un selector con busqueda. Estos se utilizan en la página de listado. Para la lógica de filtrado.

Finalmente, se puede seleccionar una posición deseada, para ver con más detalle sus datos. Si bien incluí un formulario para aplicar, este no es funcional.

Ambas paginas, soportan path/query params. Permitiendo guardar/compartir el link, y replicar la consulta realizada. En caso de intentar acceder a una posición por id no existente. Se mostrara una pagína de recurso no encontrado.

Decidí usar la libreria Zod, para validación de Schemas. Es bastante rápido y optimo su algoritmo de parseo, se integra perfectamente con el tipado de TypeScript, y permite crear tipos (TypeScript) derivadas de tus schemas, para evitar duplicar definiciones.

## Qué haría con más tiempo

Lo que más me causa inconformidad, es no completar los puntos extra. Los finalizaria.

Aplicaria mejoras a mis decisiones tecnicas. Definiria modulos (TypeScript), más adecuados, para cada entidad. Me refiero a una mejor separación, por ejemplo, los schemas y types, no tiene mucho sentido que esten en el mismo paquete "lib" que el repositorio o errores.

Desconozco, que tan personalizable es NextJS, cuando se ejecuta el servidor. Veo que existen archivos "next.config.ts". Me llama la atención, investigar si es posible, trasladar aquí la orquestación de, leer las variables de entorno y crear el repositorio. Normalmente, en la mayoria de frameworks, se suele tener una lógica de configuración y recursos globales (bases de datos, por ejemplo), siendo pasados o inyectados a los servicios que lo requieran. Entonces, si esto fuese posible, para mí sería una gran mejora, para evitar tener que estar importando constantemente (en miras de crear una verdadera aplicación de NextJS productiva).

Agregaria un flujo de empaquetado/construcción de la aplicación NextJS, con Docker.
También, incluiria un Makefile, para orquestar/agrupar varios comandos, con alias más sencillos de recordar. De momento no lo hice, porque solo hay 2 comandos repetitivos para ejecutar: `npm run dev` y `npx @biomejs/biome check --write`.

Implementaria una forma mucho más sencilla de aprovisionar las herramientas de desarrollo (NodeJS). Es muy común que en desarrollos, se difiera en las versiones de las dependencias que contiene el sistema. Por ejemplo, yo uso Ubuntu, tal vez mi NodeJS difiera respecto a otro colaborador, estar moviendose entre versiones de este, puede ser engorroso. Existen administradores de versiones para subsanar esto. Por lo que optaria por incluir [asdf](https://asdf-vm.com/) o [Nix](https://nixos.org/), o por lo menos [nvm](https://github.com/nvm-sh/nvm).

Finalmente, de lado de lado de Backend, reemplazaria que la fuente de datos sea un JSON. Para una aplicación productiva, escogeria una base de datos por documentos, como MongoDB, encaja perfectamente, con los tipos de consultas a realizar, y aún más (como filtrar por tags). De igual forma, el guardar las aplicaciones para participantes (el endpoint `/api/apply`), encaja muy bien con esta base de datos, y la relación que crea con cada posición de trabajo.
Como extra, a cada posición de trabajo creada en la BD, le agregaria un campo de fecha de termino, y un campo de soft deleted. De esta forma, se soporta la lógica, de retirar publicaciones ya no activas.

Si se buscara crear una busqueda compleja por texto (buscar en base al titulo, compañia o palabras contenidas en la descripción), agregaria tambien una capa de ElasticSearch, o una base de datos vectorial, como Neo4j.

---

## Requerimientos base (obligatorios)

- [x] **Página principal con listado de vacantes** — título, empresa, ubicación, modalidad y salario
- [x] **Filtros funcionales** por modalidad (remoto / presencial / híbrido) y por ubicación
- [x] **Buscador por texto** que filtre en tiempo real por título o empresa
- [x] **Página de detalle de vacante** con ruta dinámica `/jobs/[id]`
- [x] **Formulario de aplicación** en la página de detalle (nombre, email, mensaje) con validación básica
- [x] **Error states** visibles al usuario
- [x] **README** con instrucciones para correr el proyecto y decisiones técnicas tomadas

## Extras para ir más allá (opcionales)

- [x] Persistir los filtros activos en la URL (query params) para compartir una búsqueda
- [ ] Marcar vacantes como favoritas con persistencia en `localStorage`
- [ ] Endpoint `POST /api/apply` que reciba la aplicación y la guarde en archivo o base de datos
- [x] Paginación o scroll infinito en el listado
- [ ] Ordenar vacantes por fecha, salario u otros criterios
- [ ] Deploy en Vercel con URL pública
- [ ] Unit tests para al menos 2 componentes o funciones

## Antes de iniciar

Este proyecto está construido con TypeScript y NodeJS, utilizando el framework NextJS.

Para instalar las dependencia de forma inmediata:

```bash
npm install
```

## ¿Cómo ejecutar la aplicación? (modo desarrollo)

Cargar las variables de entorno:

```bash
set -o allexport; source .env.local; set +o allexport
```

Iniciar servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Variables de entorno

| Nombre              | Valor por defecto | Descripcion                                                                                      |
|---------------------|-------------------|--------------------------------------------------------------------------------------------------|
| JOB_BOARD_JOBS_FILE | lib/jobs.json     | Especifica la ruta del archivo JSON, conteniendo la fuente de datos para el listado de trabajos. |

## Estilo de código

Este proyecto utiliza [Biome](https://biomejs.dev/) como, linter, formateador y fixer de: código, JSON y CSS. Puedes personalizar las reglas en `biome.json`.

Para aplicar las reglas en toda la base de código:

```bash
npx @biomejs/biome check --write
```
