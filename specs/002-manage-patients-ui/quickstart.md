# Quickstart: Gestión de Pacientes

## Ejecutar la aplicación

```bash
# Instalar dependencias (si aún no están instaladas)
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Flujos principales

### 1. Ver listado de pacientes

1. Al abrir la aplicación, se carga automáticamente el listado de pacientes desde la API
2. Los pacientes se muestran en tarjetas con información básica (nombre, ID, email)
3. Estados posibles:
   - **Loading**: Spinner de carga mientras se obtienen los datos
   - **Error**: Mensaje de error con botón para reintentar
   - **Vacío**: Mensaje indicando que no hay pacientes
   - **Éxito**: Grid de tarjetas con los pacientes

### 2. Ver detalles de un paciente

1. Haz clic en el icono de chevron (▼/▲) en cualquier tarjeta de paciente
2. Se expande la tarjeta mostrando:
   - Información de contacto (email, teléfono)
   - Fechas de creación y actualización formateadas

### 3. Editar un paciente

1. Haz clic en el icono de lápiz (✏️) en una tarjeta de paciente
2. Se abre un modal con el formulario prellenado con los datos del paciente
3. Modifica los campos deseados:
   - **Nombre completo** (obligatorio)
   - **Correo electrónico** (obligatorio, validado)
   - **Teléfono** (opcional, validado)
   - **Notas** (opcional)
4. Haz clic en "Guardar cambios"
5. Verás una notificación de éxito y los cambios se reflejan inmediatamente en la tarjeta

### 4. Crear un nuevo paciente

1. Haz clic en el botón "Agregar paciente" en el header
2. Se abre un modal con el formulario vacío
3. Completa los campos requeridos:
   - **Nombre completo** (obligatorio)
   - **Correo electrónico** (obligatorio, validado)
   - **Teléfono** (opcional, validado)
   - **Notas** (opcional)
4. Haz clic en "Crear paciente"
5. Verás una notificación de éxito y la nueva tarjeta aparece en el listado

## Validaciones

- **Nombre**: Campo obligatorio, no puede estar vacío
- **Email**: Campo obligatorio, debe tener formato válido (ej: usuario@dominio.com)
- **Teléfono**: Opcional, si se proporciona debe tener al menos 8 dígitos y formato válido

## Notificaciones

- **Éxito**: Notificación verde cuando se crea o edita un paciente correctamente
- **Error**: Notificación roja cuando ocurre un error (validación, red, etc.)
- Las notificaciones se auto-descartan después de 5 segundos o pueden cerrarse manualmente

## Ejecutar tests

```bash
# Los tests están pendientes de implementación
# Una vez implementados, ejecutar con:
pnpm test
```

## Notas importantes

- Los cambios realizados (crear/editar pacientes) **no se persisten en el servidor**
- Los datos solo se mantienen durante la sesión actual del navegador
- Al recargar la página, los cambios locales se pierden y se vuelven a cargar los datos originales de la API
- Los avatares se generan automáticamente usando `picsum.photos` si el campo `avatar` de la API está roto o es inválido
