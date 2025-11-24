<!--
Sync Impact Report
- Version change: (none) → 1.0.0
- Modified principles: Defined 5 project-specific principles (simplicidad, calidad, testing moderno, UX consistente, performance)
- Added sections: "Estándares Técnicos del Proyecto", "Flujo de Desarrollo y Calidad"
- Removed sections: None
- Templates requiring updates (✅ updated / ⚠ pending):
  - ✅ .specify/templates/plan-template.md (aligned with Constitution v1.0.0, no change required)
  - ✅ .specify/templates/spec-template.md (aligned with Constitution v1.0.0, no change required)
  - ✅ .specify/templates/tasks-template.md (aligned with Constitution v1.0.0, no change required)
  - ✅ .specify/templates/checklist-template.md (aligned with Constitution v1.0.0, no change required)
  - ✅ .specify/templates/agent-file-template.md (aligned with Constitution v1.0.0, no change required)
- Follow-up TODOs: None
-->

# Frontend - Patient Data Management Constitution

## Core Principles

### I. Simplicidad y legibilidad del código

El código MUST ser simple, directo y fácil de leer incluso para alguien nuevo en el proyecto.

- Componentes y utilidades MUST tener una única responsabilidad clara y un tamaño manejable.
- Se prefieren soluciones explícitas sobre patrones complejos o "clever code".
- TypeScript MUST usarse con tipado estricto; el uso de `any` solo se permite si está aislado y justificado en el PR.
- La duplicación de código solo se elimina cuando la abstracción resultante sigue siendo evidente para el dominio de pacientes.

**Rationale**: Un código simple y legible reduce bugs, acelera el onboarding y facilita cambios rápidos durante el challenge.

### II. Calidad estructural y manejo de estado orientado al dominio

La estructura del proyecto MUST reflejar el dominio de gestión de pacientes y mantener el estado predecible.

- La información de pacientes tiene una fuente de verdad clara y no se muta de forma implícita.
- El acceso a la API se concentra en servicios tipados, no en llamadas `fetch` dispersas por la UI.
- El estado global solo se introduce si resuelve un problema concreto del dominio; por defecto se prefiere estado local en componentes y hooks.
- Loading, error y estados vacíos MUST estar modelados explícitamente en componentes de lista, tarjetas y formularios.

**Rationale**: Un modelo de datos y estado claro es crítico para mantener la coherencia cuando se editan y crean pacientes.

### III. Testing moderno y centrado en el usuario

Las rutas críticas de usuario MUST estar cubiertas por tests automatizados siguiendo estándares modernos.

- El stack recomendado es Vitest/Jest + React Testing Library; alternativas se permiten solo si mantienen el mismo nivel de ergonomía y adopción.
- Cada flujo principal (listar pacientes, ver detalle, crear y editar) MUST tener al menos un test que cubra el comportamiento end-to-end a nivel de UI o integración.
- Los tests se escriben en términos de comportamiento del usuario (texto visible, roles de accesibilidad, acciones reales), no de detalles internos de implementación.
- Los bugs encontrados en UI o lógica MUST ir acompañados de un test que falle antes del fix.

**Rationale**: Tests cercanos al usuario protegen la experiencia sin acoplarse a detalles internos y permiten refactors seguros.

### IV. Consistencia visual, UX y accesibilidad

La interfaz MUST ser consistente, accesible y agradable de usar en desktop y mobile.

- Colores, tipografía, espaciados y radios se definen como un pequeño sistema de diseño reutilizable; no se mezclan estilos ad-hoc sin justificar.
- Componentes como tarjetas, botones, inputs, modales y layouts se implementan como piezas reutilizables, no se reescriben en cada pantalla.
- Se aprovechan primitivas accesibles (p.ej. `react-aria-components`) y se respetan roles, labels y foco del teclado.
- Cambios en la UI que afecten al usuario (form states, validaciones, feedback) MUST ser consistentes entre crear y editar pacientes.

**Rationale**: Una UX coherente y accesible transmite profesionalismo, reduce errores del usuario y hace que la demo del challenge sea sólida.

### V. Performance percibida y eficiencia en renderizado

La aplicación MUST sentirse fluida, evitando renders y trabajo innecesario.

- Se minimizan dependencias externas; no se usan design systems pesados (MaterialUI, shadcn, etc.), se priorizan primitivas ligeras.
- Listas y tarjetas de pacientes se optimizan para evitar renders redundantes (keys estables, memoización cuando aporte valor).
- Los fetch y transformaciones de datos se realizan de forma eficiente; no se repiten llamadas de red evitables.
- Interacciones típicas (abrir detalle, abrir/cerrar modal, enviar formulario) SHOULD responder en <200ms en entornos de desarrollo razonables.

**Rationale**: Una UI rápida mejora la percepción de calidad y evita que el coste del challenge se vaya en microoptimizar código complejo.

## Estándares Técnicos del Proyecto

Esta sección define restricciones técnicas y convenciones para mantener coherencia en todo el repositorio.

- **Stack principal**: Next.js (App Router), React, TypeScript, Tailwind CSS 4 y `react-aria-components` para primitivas accesibles.
- **UI libraries**: No se permiten librerías de componentes completas (MaterialUI, shadcn, etc.); solo primitivas ligeras o utilidades específicas.
- **Estructura**: El código se organiza por dominio (p.ej. `patients`) y por tipo de pieza (componentes de UI reutilizables, vistas/páginas, servicios de datos).
- **Estilos**: Se prefieren utilidades de Tailwind y un pequeño set de componentes estilizados; se evita CSS complejo y difícil de mantener.
- **Forms y validaciones**: Formularios de pacientes MUST tener validaciones claras en el cliente con mensajes amigables; campos obligatorios y formatos (como email) se validan siempre.
- **Acceso a datos**: Llamadas a la API de usuarios/pacientes se encapsulan en funciones de servicio tipadas y con manejo de errores uniforme.
- **Tooling**: ESLint, Prettier y TypeScript son obligatorios; los scripts de lint y build MUST permanecer verdes antes de mergear a la rama principal.

## Flujo de Desarrollo y Calidad

El flujo de trabajo MUST favorecer entregas pequeñas, revisables y directamente conectadas a la experiencia del usuario.

- Cada nueva capacidad de la UI se describe primero en términos de historias de usuario y estados principales (loading, éxito, error, vacío).
- Se priorizan PRs pequeños y enfocados en un conjunto claro de historias o tareas; PRs grandes requieren justificación explícita.
- Toda PR que modifique UI MUST incluir captura de pantalla o pequeña descripción visual de los cambios relevantes.
- Antes de implementar features significativas se recomienda usar `/speckit.spec` y `/speckit.plan`, completando el apartado de "Constitution Check" con cualquier violación y su justificación.
- La revisión de código MUST verificar: cumplimiento de principios de simplicidad, manejo claro de estado, tests relevantes y consistencia visual.

**Rationale**: Un flujo disciplinado pero ligero permite avanzar rápido sin sacrificar la calidad ni la claridad del código en un contexto de challenge.

## Governance

Esta constitución define las reglas de calidad, UX y performance que rigen el proyecto y tiene prioridad sobre prácticas previas informales.

- **Ámbito**: Aplica a todo el código dentro de este repositorio, incluyendo nuevas features, refactors y experimentos.
- **Cumplimiento en PRs**: Toda revisión de código MUST verificar explícitamente el alineamiento con los principios de esta constitución.
- **Proceso de enmienda**:
  - Cualquier cambio a este archivo se realiza mediante PR dedicada que explique el motivo de la enmienda.
  - Cada cambio debe incluir actualización de la línea de versión según SemVer (MAJOR.MINOR.PATCH).
  - Cambios incompatibles o eliminación/redefinición de principios → bump MAJOR.
  - Nuevos principios o ampliaciones materiales de secciones → bump MINOR.
  - Aclaraciones, matices o correcciones editoriales sin cambio de significado → bump PATCH.
- **Revisión periódica**: La constitución SHOULD revisarse al menos una vez por milestone importante (p.ej. antes de presentar el challenge) para asegurar que sigue siendo útil y no obstruye la entrega.
- **Guía de ejecución**: Para dudas prácticas sobre cómo aplicar estos principios en el día a día, usar `README.md` y la documentación generada por las plantillas de `.specify/` como guía viva.

**Version**: 1.0.0 | **Ratified**: 2025-11-24 | **Last Amended**: 2025-11-24
