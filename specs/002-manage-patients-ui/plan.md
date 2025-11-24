# Implementation Plan: Gestión de pacientes en frontend

**Branch**: `002-manage-patients-ui` | **Date**: 2025-11-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-manage-patients-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementar una pantalla principal de gestión de pacientes en Next.js 16 + React 19 que obtiene el listado inicial desde la API remota de usuarios, lo muestra en forma de tarjetas expandibles y permite crear y editar pacientes dentro de la sesión mediante formularios con validación y feedback visual.  
Los datos se cachean en el frontend con React Query, las interacciones clave (expandir tarjetas, abrir/cerrar modales, toasts) se construyen con componentes accesibles (`react-aria-components`) y estilos con Tailwind CSS 4, manteniendo simple la gestión de estado (estado local y caché de React Query, sin Zustand salvo que aparezca una necesidad clara).

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5 + React 19 + Next.js 16 (App Router)  
**Primary Dependencies**: Next.js, React, Tailwind CSS 4, `react-aria-components`, React Query, `date-fns`, `@heroicons/react` (iconos), Zustand (solo si aparece una necesidad clara de estado global avanzado)  
**Storage**: N/A (lectura desde API remota de MockAPI y gestión en memoria durante la sesión; no se requiere persistencia de cambios en servidor)  
**Testing**: Jest + React Testing Library para tests de UI e integración centrados en los flujos principales (listar, ver detalles, crear y editar pacientes)  
**Target Platform**: Aplicación web (Next.js) ejecutándose en entorno Node, consumida en navegadores modernos desktop y mobile  
**Project Type**: Web (SPA/MPA con App Router de Next, una vista principal de pacientes)  
**Performance Goals**: Interacciones clave (expandir tarjeta, abrir/cerrar modal, enviar formulario) percibidas como instantáneas, con respuesta < 1s y animaciones ~200–300 ms como máximo; carga fluida para listados de hasta ~100–200 pacientes  
**Constraints**: Mantener el stack ligero (sin UI kits pesados), minimizar renders innecesarios en listas y tarjetas, evitar estado global complejo salvo necesidad justificada, cumplir con los principios de simplicidad y performance de la constitución  
**Scale/Scope**: Una única pantalla principal de gestión de pacientes con 3 flujos críticos (listar/ver detalles, editar, crear), centrada en la experiencia de demo para un volumen moderado de registros

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. Simplicidad y legibilidad**: Cumplido. El plan se basa en pocos componentes React bien nombrados, hooks específicos de dominio (`usePatients`) y servicios de datos simples, evitando patrones complejos y cualquier uso innecesario de Zustand.
- **II. Calidad estructural y manejo de estado**: Cumplido. La fuente de verdad de pacientes vive en la caché de React Query; las operaciones de edición/creación actualizan solo esa caché y el estado local de formularios, con manejo explícito de loading/error/empty en la lista y formularios.
- **III. Testing moderno y centrado en el usuario**: Cumplido a nivel de plan. Se prevén tests con Jest + React Testing Library para los flujos de listar, ver detalles, crear y editar pacientes, usando queries accesibles (texto visible, roles) y evitando acoplarse a detalles internos.
- **IV. Consistencia visual, UX y accesibilidad**: Cumplido. Se apoya en Tailwind CSS 4 y `react-aria-components` para modales y controles accesibles, con un pequeño set de componentes reutilizables (tarjeta, formulario, layout, toasts) y comportamiento consistente entre crear y editar.
- **V. Performance percibida y eficiencia en renderizado**: Cumplido. React Query evita refetch innecesario, las tarjetas usan keys estables y memoización ligera cuando aporte, y las animaciones se mantienen cortas y no intrusivas; se evita introducir librerías pesadas.

_Post Phase 1 design check_: No se introducen nuevas violaciones; no se requiere justificación en **Complexity Tracking**.

## Project Structure

### Documentation (this feature)

```text
specs/002-manage-patients-ui/
├── plan.md              # Implementation plan (/speckit.plan)
├── spec.md              # Functional specification (/speckit.spec)
├── research.md          # Phase 0: technical decisions & tradeoffs
├── data-model.md        # Phase 1: domain entities & validation
├── quickstart.md        # Phase 1: how to run and work on this feature
├── contracts/           # Phase 1: API contract(s) for patients data
└── tasks.md             # Phase 2: implementation tasks (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                     # Layout raíz de la app (shell visual)
├── page.tsx                       # Página principal de gestión de pacientes
└── patients/
    ├── components/
    │   ├── patient-card.tsx       # Card individual con expandir/colapsar
    │   ├── patient-details.tsx    # Detalle expandido dentro de la card
    │   ├── patient-form.tsx       # Formulario crear/editar paciente (modal)
    │   ├── patients-header.tsx    # Encabezado, filtros simples, acciones
    │   └── toast-container.tsx    # Contenedor de notificaciones (toasts)
    ├── hooks/
    │   └── use-patients.ts        # Hook React Query para listar/gestionar pacientes
    └── types.ts                   # Tipos de dominio (Patient, PatientFormValues, etc.)

lib/
└── api/
    └── patients.ts                # Cliente de la API https://63bedcf7f5cfc0949b634fc8.mockapi.io/users

tests/
└── ui/
    └── patients-page.test.tsx     # Tests de UI/integración para los flujos principales
```

**Structure Decision**: Proyecto Next.js de frontend único, organizado por dominio (`app/patients`) y tipo de pieza (componentes, hooks, tipos, servicios en `lib/api`), con una sola página principal y una capa de tests de UI en `tests/ui`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
