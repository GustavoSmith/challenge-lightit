# Challenge Lightit - Gestión de Pacientes

Aplicación frontend para gestionar información de pacientes, construida con Next.js 16, React 19, Tailwind CSS 4 y React Aria Components.

## Características

- **Listado de pacientes**: Visualización de pacientes en tarjetas con información básica
- **Detalles expandibles**: Cada tarjeta puede expandirse para mostrar información completa
- **Edición de pacientes**: Formulario modal para editar información de pacientes existentes
- **Creación de pacientes**: Formulario para agregar nuevos pacientes a la lista
- **Validación de formularios**: Validación en cliente con mensajes de error claros
- **Notificaciones toast**: Feedback visual para operaciones exitosas y errores
- **Diseño responsive**: Optimizado para dispositivos móviles, tablets y escritorio
- **Modo oscuro**: Soporte para tema claro y oscuro

## Getting Started

### Prerequisitos

- Node.js 18+
- pnpm (recomendado) o npm/yarn

### Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### Estructura del Proyecto

```
app/
├── layout.tsx              # Layout raíz con React Query Provider
├── page.tsx                # Página principal de gestión de pacientes
└── patients/
    ├── components/          # Componentes de UI
    │   ├── patient-card.tsx
    │   ├── patient-details.tsx
    │   ├── patient-form.tsx
    │   ├── patients-header.tsx
    │   └── toast-container.tsx
    ├── hooks/
    │   └── use-patients.ts # Hook React Query para gestión de pacientes
    └── types.ts            # Tipos TypeScript

lib/
└── api/
    └── patients.ts         # Cliente de API para obtener pacientes

tests/
└── ui/                     # Tests de UI (pendiente)
```

### API

La aplicación consume datos de la API de MockAPI:

- **Endpoint**: `https://63bedcf7f5cfc0949b634fc8.mockapi.io/users`
- **Nota**: Los cambios (crear/editar) se mantienen solo en la sesión actual y no se persisten en el servidor

## Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linting
pnpm lint
```

## Stack Tecnológico

- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Estilos utility-first
- **React Aria Components** - Componentes accesibles
- **React Query (@tanstack/react-query)** - Gestión de estado del servidor y caché
- **date-fns** - Formateo de fechas
- **Heroicons** - Iconos SVG
