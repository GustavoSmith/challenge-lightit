---
description: "Task list for implementing the patients management UI feature"
---

# Tasks: Gestión de pacientes en frontend

**Input**: Design documents from `specs/002-manage-patients-ui/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories); research.md, data-model.md, contracts/ (opcional)

**Tests**: Esta feature REQUIERE tests de UI centrados en el usuario para los flujos principales (listar, ver detalle, crear y editar pacientes), alineado con la constitución del proyecto.

**Organization**: Las tareas se agrupan por user story para permitir implementación y testing independientes de cada historia.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias entre tareas)
- **[Story]**: Historia de usuario a la que pertenece la tarea (US1, US2, US3)
- Todas las descripciones DEBEN incluir al menos una ruta de archivo clara

## Path Conventions

- Proyecto Next.js de frontend único (App Router)
- Código principal de la feature: `app/page.tsx`, `app/patients/**`, `lib/api/**`
- Tests de UI: `tests/ui/**`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Asegurar estructura mínima de carpetas y dependencias del stack definido.

- [x] T001 Crear estructura de carpetas para la feature según el plan en `app/patients/`, `app/patients/components/`, `app/patients/hooks/`, `lib/api/` y `tests/ui/`.
- [x] T002 [P] Añadir dependencias de runtime requeridas (`@tanstack/react-query`, `date-fns`, `@heroicons/react`) en `package.json` e instalarlas con `pnpm install`.
- [x] T003 [P] Ajustar estilos globales de Tailwind en `app/globals.css` para soportar el layout de la pantalla de pacientes (fondos, tipografía base, colores claros/oscuros coherentes).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura de datos y estado compartida por todas las historias de usuario.

**⚠️ CRITICAL**: Ningún trabajo de user stories debe comenzar hasta completar esta fase.

- [x] T004 Definir tipos de dominio `Patient` y `PatientFormValues` con sus campos principales (id, nombre completo, documento, fecha de nacimiento/edad, contacto, notas, avatar, timestamps) en `app/patients/types.ts`.
- [x] T005 Implementar cliente de API para la URL `https://63bedcf7f5cfc0949b634fc8.mockapi.io/users` en `lib/api/patients.ts`, mapeando la respuesta remota a `Patient` y generando un avatar de `https://picsum.photos` cuando el campo `avatar` de la API sea inválido o esté roto.
- [x] T006 Configurar `QueryClient` y `QueryClientProvider` de React Query envolviendo la app en `app/layout.tsx`, asegurando que todas las páginas y componentes puedan usar hooks de React Query.
- [x] T007 Implementar hook `usePatients` en `app/patients/hooks/use-patients.ts` usando React Query para:
  - obtener el listado inicial de pacientes desde `lib/api/patients.ts`
  - exponer estado de loading/error/empty
  - preparar mutaciones para actualizar y crear pacientes (a completar en US2/US3).
- [x] T008 Crear componente `ToastContainer` mínimo en `app/patients/components/toast-container.tsx` que permita mostrar una cola simple de notificaciones de éxito/error controladas desde la página principal.

**Checkpoint**: Tipos de dominio, cliente de API, provider de React Query, hook base `usePatients` y contenedor de toasts creados; se puede empezar con User Story 1.

---

## Phase 3: User Story 1 - Consultar listado y detalles de pacientes (Priority: P1) 🎯 MVP

**Goal**: Mostrar un listado de pacientes obtenido desde la API remota en forma de tarjetas, con posibilidad de expandir/cerrar cada tarjeta para ver detalles adicionales, incluyendo estados de carga, error y lista vacía.

**Independent Test**: Un usuario sin contexto previo abre la app, ve el listado de pacientes (o el estado vacío), puede expandir la tarjeta de un paciente para ver sus detalles y entiende claramente qué ocurre si hay un error de red.

### Tests for User Story 1

- [ ] T010 [US1] Añadir tests de UI para el flujo de listar pacientes, mostrar estados de loading/error/vacío y expandir/colapsar tarjetas en `tests/ui/patients-page.test.tsx`.

### Implementation for User Story 1

- [x] T011 [US1] Reemplazar el contenido actual de la home en `app/page.tsx` por la pantalla principal de pacientes, renderizando un header, la lista de tarjetas y conectando el hook `usePatients`.
- [x] T012 [P] [US1] Implementar componente `PatientsHeader` con título, descripción breve y botón de "Agregar paciente" (sin funcionalidad de abrir modal aún) en `app/patients/components/patients-header.tsx`.
- [x] T013 [P] [US1] Implementar componente `PatientCard` en `app/patients/components/patient-card.tsx` que muestre información básica del paciente (nombre, identificador, edad/resumen) en modo colapsado, recibiendo un `Patient` por props.
- [x] T014 [P] [US1] Implementar componente `PatientDetails` en `app/patients/components/patient-details.tsx` para el contenido expandido de la tarjeta (datos de contacto, notas/resumen clínico, timestamps formateados con `date-fns`).
- [x] T015 [US1] Integrar lógica de expandir/colapsar tarjetas (estado local o controlado por key de paciente) y estados de loading/error/vacío en `app/page.tsx`, usando `usePatients` y mostrando errores graves también mediante `ToastContainer`.

**Checkpoint**: User Story 1 completamente funcional y testeable de forma independiente; la página ya sirve como MVP básico de consulta de pacientes.

---

## Phase 4: User Story 2 - Editar información de un paciente existente (Priority: P2)

**Goal**: Permitir que el usuario abra un formulario sobre una tarjeta de paciente, edite campos clave (por ejemplo, contacto y notas) y guarde los cambios viendo feedback inmediato en la UI.

**Independent Test**: Partiendo de la pantalla de pacientes funcionando (US1), el usuario puede editar un paciente concreto desde su tarjeta, recibe errores claros si la validación falla y ve los cambios reflejados al guardar, sin necesidad de implementar aún el alta de nuevos pacientes.

### Tests for User Story 2

- [ ] T016 [US2] Añadir tests de UI para el flujo de edición (abrir formulario desde una tarjeta, validar errores de campos requeridos/formato, guardar y ver la tarjeta actualizada) en `tests/ui/patients-page.test.tsx`.

### Implementation for User Story 2

- [x] T017 [P] [US2] Implementar componente `PatientForm` en `app/patients/components/patient-form.tsx` usando `react-aria-components` para el modal/dialog accesible, con campos controlados tipados (`PatientFormValues`) y validación básica en cliente (requeridos, email/teléfono usando utilidades de `date-fns` solo donde aplique a fechas).
- [x] T018 [US2] Añadir botón/icono de "Editar" en `PatientCard` y conectar la apertura del modal `PatientForm` en modo edición (prefill de datos del paciente) en `app/patients/components/patient-card.tsx`.
- [x] T019 [US2] Completar mutación `updatePatient` dentro de `usePatients` en `app/patients/hooks/use-patients.ts`, aplicando actualización optimista sobre la caché de React Query para reflejar cambios inmediatamente en el listado.
- [x] T020 [US2] Integrar `ToastContainer` para mostrar notificaciones de éxito y error al editar pacientes en `app/page.tsx` (o componente de alto nivel equivalente), asegurando mensajes claros para usuarios no técnicos.

**Checkpoint**: User Stories 1 y 2 funcionales y testeables de forma independiente; la edición de pacientes está operativa con validación y feedback visual.

---

## Phase 5: User Story 3 - Registrar un nuevo paciente en la sesión actual (Priority: P3)

**Goal**: Permitir dar de alta un nuevo paciente desde la misma pantalla, usando un formulario similar al de edición, agregando la nueva tarjeta al listado actual sin recargar la página ni depender de persistencia permanente.

**Independent Test**: Partiendo de las historias 1 y 2, el usuario puede abrir el formulario desde el botón de header, completar los campos mínimos, guardar y ver la nueva tarjeta insertada en el listado, con feedback de éxito y preservando el resto de la UI.

### Tests for User Story 3

- [ ] T021 [US3] Añadir tests de UI para el flujo de alta (abrir formulario desde `PatientsHeader`, validar errores, guardar y ver la nueva tarjeta en el listado) en `tests/ui/patients-page.test.tsx`.

### Implementation for User Story 3

- [x] T022 [P] [US3] Extender `PatientForm` en `app/patients/components/patient-form.tsx` para soportar modo creación (valores iniciales vacíos, textos y acciones diferenciadas de la edición).
- [x] T023 [US3] Conectar el botón de "Agregar paciente" en `PatientsHeader` con la apertura de `PatientForm` en modo creación en `app/patients/components/patients-header.tsx`.
- [x] T024 [US3] Implementar mutación `createPatient` en `usePatients` en `app/patients/hooks/use-patients.ts`, insertando el nuevo `Patient` en la caché de React Query y generando avatar de `picsum.photos` cuando sea necesario.
- [x] T025 [US3] Reutilizar `ToastContainer` para mostrar notificaciones de éxito/error en el alta de pacientes desde `app/page.tsx`, manteniendo mensajes y estilos consistentes con la edición.

**Checkpoint**: Las tres historias de usuario (listar/detalle, editar, crear) funcionan y se testean de forma independiente, con validaciones y toasts coherentes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras transversales que afectan a varias historias de usuario.

- [x] T026 [P] Redactar o actualizar `specs/002-manage-patients-ui/quickstart.md` y `README.md` con instrucciones breves para correr la app, ubicar la pantalla de pacientes y ejecutar los tests.
- [x] T027 Revisar accesibilidad y consistencia visual en `app/page.tsx` y `app/patients/components/*` (foco de teclado, roles ARIA básicos, contraste, estados hover/active/disabled coherentes).
- [x] T028 [P] Optimizar performance percibida en la lista de pacientes aplicando memoización ligera y claves estables en `app/patients/components/patient-card.tsx` y revisando el uso de `usePatients` en `app/page.tsx`.
- [ ] T029 [P] Añadir tests adicionales de UI para casos borde (lista vacía, error de red, muchos pacientes) en `tests/ui/patients-page.test.tsx`.
- [x] T030 Ejecutar validación final (lint, build y tests) desde la raíz del proyecto (`pnpm lint`, `pnpm build`, `pnpm test` si aplica) y ajustar cualquier issue restante.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias previas; puede empezar inmediatamente.
- **Foundational (Phase 2)**: Depende de Setup; BLOQUEA todas las user stories.
- **User Stories (Phase 3–5)**: Todas dependen de completar la fase Foundational.
  - Las historias pueden implementarse en paralelo si hay capacidad, pero se recomienda seguir el orden P1 → P2 → P3.
- **Polish (Phase 6)**: Depende de que las historias de usuario objetivo estén completas.

### User Story Dependencies

- **User Story 1 (P1)**: Puede empezar tras finalizar la fase Foundational (Phase 2); no depende de otras historias.
- **User Story 2 (P2)**: Puede empezar tras Foundational; reutiliza componentes de US1 pero debe ser testeable de forma independiente (lista ya implementada).
- **User Story 3 (P3)**: Puede empezar tras Foundational; se apoya en los componentes y hooks de US1/US2 pero su flujo de alta debe poder probarse de forma aislada.

### Within Each User Story

- Los tests se escriben antes de la implementación y deben FALLAR inicialmente.
- Infraestructura compartida (tipos, hooks, API) se usa antes de componentes de UI.
- Componentes de UI se completan antes de integrar estados de toasts y casos borde.
- La historia debe estar funcional y testeada antes de avanzar a la siguiente prioridad.

### Parallel Opportunities

- T002 y T003 pueden ejecutarse en paralelo al crear la estructura de carpetas (T001).
- Dentro de US1, las tareas T012, T013 y T014 pueden abordarse en paralelo (archivos distintos).
- Extender `PatientForm` (T022) puede trabajarse en paralelo con la integración de botón de header (T023) en US3.
- Las tareas de la fase de Polish marcadas con [P] pueden ejecutarse en paralelo una vez que las historias principales estén completas.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup).
2. Completar Phase 2 (Foundational).
3. Implementar y testear Phase 3 (User Story 1).
4. **STOP y VALIDAR**: Verificar que la pantalla de listado/detalle funciona, está testeada y lista para demo.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. Añadir US1 → testear de forma independiente → demo/validación como MVP.
3. Añadir US2 → testear edición de pacientes → demo incremental.
4. Añadir US3 → testear alta de pacientes → demo final.
5. Aplicar Phase 6 para pulir accesibilidad, performance y documentación.

### Parallel Team Strategy

Con varios desarrolladores:

1. Todo el equipo completa Setup + Foundational en conjunto.
2. Al terminar Foundational:
   - Dev A: US1 (listado y detalles).
   - Dev B: US2 (edición).
   - Dev C: US3 (alta).
3. Integrar cambios y ejecutar los tests compartidos en `tests/ui/patients-page.test.tsx`.

---

## Notes

- Las tareas marcadas con [P] deben modificar archivos distintos para evitar conflictos.
- Las etiquetas [US1]/[US2]/[US3] permiten rastrear qué tareas pertenecen a cada historia.
- Cada historia debe poder probarse de forma independiente usando solo la pantalla principal de pacientes.
- Se recomienda hacer commits pequeños después de completar cada tarea o grupo lógico de tareas.
- Priorizar siempre simplicidad, legibilidad y performance percibida al implementar estas tareas.
