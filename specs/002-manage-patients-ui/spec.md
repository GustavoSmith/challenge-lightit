# Feature Specification: Gestión de pacientes en frontend

**Feature Branch**: `002-manage-patients-ui`  
**Created**: 2025-11-24  
**Status**: Draft  
**Input**: User description: "Crea una app frontend que le permita a usuarios manejar información sobre pacientes. La app debe contar con la funcionalidad de: Obtener un listado de pacientes de una API; Mostrar el listado de pacientes individualmente en cards, en una simple pero innovadora interfaz de usuario; Cada tarjeta de paciente debe incluir un botón o icono que permita a los usuarios ver detalles adicionales (expandir/colapsar); Implementar un modal o un componente similar para editar y agregar información del paciente; Los usuarios deben tener la capacidad de editar los datos existentes de los pacientes y agregar nuevos pacientes a la lista. Esto no requiere persistencia de datos (no se guardan permanentemente en el servidor); Implementar validación de formularios para asegurar la precisión e integridad de los datos del paciente; Proporcionar notificaciones (toast) amigables para el usuario ante modificaciones de datos exitosas o fallidas; Asegurar que la aplicación sea interactiva y responsive, con animaciones fluidas donde sea necesario."

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Consultar listado y detalles de pacientes (Priority: P1)

Personal de salud autorizado abre la aplicación, ve un listado claro de pacientes obtenido desde una fuente de datos remota y puede expandir una tarjeta para revisar los datos completos de un paciente sin abandonar la pantalla principal.

**Why this priority**: Es el flujo base de la aplicación; sin poder ver el listado y los datos clave de cada paciente, el resto de las funcionalidades no aporta valor.

**Independent Test**: Puede probarse cargando la aplicación con datos de prueba y verificando que un usuario sin entrenamiento logra encontrar y expandir la tarjeta de un paciente específico en pocos pasos.

**Acceptance Scenarios**:

1. **Given** que el usuario accede a la pantalla principal, **When** el sistema termina de cargar los datos remotos de pacientes, **Then** se muestra un listado de tarjetas de pacientes con la información básica visible.
2. **Given** que el listado de pacientes está visible, **When** el usuario hace clic en el control de expandir de una tarjeta, **Then** se muestran detalles adicionales del paciente dentro de la misma tarjeta y el usuario puede volver a colapsarla.
3. **Given** que ocurre un error al obtener los datos remotos, **When** la carga inicial falla, **Then** el usuario ve un mensaje de error claro y una acción para reintentar la carga.

---

### User Story 2 - Editar información de un paciente existente (Priority: P2)

Personal de salud selecciona un paciente del listado, abre un formulario en un componente superpuesto (por ejemplo, un modal), actualiza campos como datos de contacto o notas y guarda los cambios, viendo inmediatamente la información actualizada en la tarjeta del paciente.

**Why this priority**: Mantener la información de pacientes al día es crítico para la atención; sin embargo, depende de poder consultar primero el listado.

**Independent Test**: Puede probarse el flujo tomando un paciente de ejemplo, modificando un campo obligatorio y verificando que las validaciones, el guardado y el feedback visual funcionen sin necesidad de implementar otras historias.

**Acceptance Scenarios**:

1. **Given** que el listado de pacientes está visible, **When** el usuario selecciona la acción de editar sobre una tarjeta, **Then** se abre un formulario con los datos actuales del paciente en un modal o componente similar.
2. **Given** que el formulario de edición está abierto y todos los datos ingresados son válidos, **When** el usuario confirma el guardado, **Then** los cambios se reflejan en la tarjeta del paciente en el listado y se muestra una notificación de éxito.
3. **Given** que el formulario de edición está abierto y falta un campo obligatorio o tiene un formato inválido, **When** el usuario intenta guardar, **Then** el sistema muestra mensajes de error claros junto a los campos afectados, no cierra el formulario y no aplica cambios sobre el listado.

---

### User Story 3 - Registrar un nuevo paciente en la sesión actual (Priority: P3)

Personal de salud necesita registrar rápidamente un nuevo paciente durante la sesión; abre el formulario de alta, completa los datos mínimos requeridos, confirma y ve la nueva tarjeta agregada al listado actual de pacientes.

**Why this priority**: Dar de alta pacientes es importante, pero puede considerarse después de tener consolidado el flujo de consulta y edición de información existente.

**Independent Test**: Puede probarse creando un nuevo paciente de prueba desde la pantalla principal y verificando que aparezca en el listado y permanezca disponible mientras dure la sesión actual.

**Acceptance Scenarios**:

1. **Given** que el usuario se encuentra en la pantalla principal, **When** selecciona la opción para agregar un nuevo paciente, **Then** se abre un formulario vacío en un modal o componente equivalente para ingresar datos del nuevo paciente.
2. **Given** que el formulario de alta está completo con datos válidos, **When** el usuario confirma el guardado, **Then** se crea una nueva tarjeta de paciente en el listado, se muestra una notificación de éxito y la app mantiene el nuevo paciente disponible durante la sesión.
3. **Given** que el formulario de alta está abierto, **When** el usuario cancela o cierra el formulario sin guardar, **Then** no se agrega ningún nuevo paciente al listado.

### Edge Cases

- Qué ocurre cuando la fuente de datos no devuelve ningún paciente (lista vacía).
- Qué ocurre cuando la carga de pacientes falla por un error de red o del servicio remoto.
- Cómo se comporta la interfaz cuando hay un volumen alto de pacientes (por ejemplo, más de 100) en pantallas pequeñas.
- Qué pasa si el usuario intenta guardar un formulario con campos requeridos vacíos o formatos inválidos (por ejemplo, email o teléfono con formato incorrecto).
- Qué sucede si el usuario cierra el modal o recarga la página mientras hay cambios sin guardar (los cambios solo viven en la sesión actual y se pierden al recargar).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema DEBE obtener automáticamente un listado de pacientes desde una fuente de datos remota al ingresar a la pantalla principal.
- **FR-002**: El sistema DEBE mostrar el listado de pacientes como tarjetas individuales, presentando al menos nombre completo, identificador del paciente, edad (o fecha de nacimiento) y un estado o resumen general.
- **FR-003**: Los usuarios DEBEN poder expandir y colapsar cada tarjeta para ver u ocultar detalles adicionales del paciente sin navegar a otra pantalla.
- **FR-004**: El sistema DEBE ofrecer una interfaz de edición para pacientes existentes mediante un componente superpuesto (por ejemplo, modal o panel lateral) que permita modificar los campos configurados.
- **FR-005**: El sistema DEBE permitir crear nuevos pacientes mediante un formulario accesible desde la misma pantalla de listado.
- **FR-006**: Las validaciones de formulario DEBEN asegurar que los campos obligatorios (por ejemplo, nombre completo, documento de identificación y al menos un dato de contacto) estén presentes y en formatos coherentes (por ejemplo, correo electrónico y teléfono válidos).
- **FR-007**: Cuando existan errores de validación, el sistema DEBE mostrar mensajes claros e indicar visualmente los campos problemáticos, impidiendo el guardado hasta que se corrijan.
- **FR-008**: Los cambios realizados (altas y ediciones) DEBEN reflejarse inmediatamente en el listado de pacientes y mantenerse mientras dure la sesión actual del usuario, aun cuando no se persistan en el servidor.
- **FR-009**: El sistema DEBE mostrar notificaciones tipo toast ante operaciones exitosas (creación y edición) y ante fallos relevantes (por ejemplo, error al obtener datos remotos o al aplicar cambios localmente), con mensajes comprensibles para usuarios no técnicos.
- **FR-010**: La interfaz DEBE ser responsive y usable en dispositivos móviles, tablet y escritorio, adaptando la distribución de las tarjetas y los formularios a cada tamaño de pantalla.
- **FR-011**: Las interacciones clave (expandir/cerrar tarjetas, abrir/cerrar modales, mostrar/ocultar notificaciones) DEBEN contar con animaciones fluidas que no superen aproximadamente los 300 ms y no obstaculicen la lectura ni la interacción.
- **FR-012**: El sistema DEBE manejar estados de carga y ausencia de datos (por ejemplo, indicadores de "cargando" y mensajes de "no hay pacientes para mostrar") de forma clara para el usuario.

### Key Entities _(include if feature involves data)_

- **Paciente**: Representa a una persona atendida en la clínica, con atributos de identificación, datos de contacto y contexto clínico resumido que se muestran y editan desde la aplicación de frontend (por ejemplo, nombre completo, documento, fecha de nacimiento, datos de contacto, notas o diagnóstico breve).
- **Listado de pacientes de la sesión**: Colección de pacientes visibles en la pantalla principal, compuesta por los pacientes obtenidos desde la fuente remota al iniciar la vista más los pacientes agregados localmente durante la sesión; no se garantiza su persistencia una vez cerrada o recargada la aplicación.
- **Notificación de interfaz (toast)**: Mensaje breve y no intrusivo que informa al usuario sobre el resultado de una acción (éxito o fallo) y desaparece automáticamente tras un corto periodo de tiempo.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Al menos el 90% de los usuarios de prueba puede localizar y consultar los detalles de un paciente específico en menos de 15 segundos desde que se carga la pantalla principal.
- **SC-002**: Al menos el 95% de los intentos de guardado de formularios con datos válidos (alta o edición) se completa exitosamente en el primer intento, mostrando una notificación de éxito.
- **SC-003**: El 100% de los envíos de formularios con datos inválidos muestran mensajes de error claros y evitan que se registren cambios inconsistentes en el listado de pacientes de la sesión.
- **SC-004**: En dispositivos de referencia (móvil, tablet y escritorio), las operaciones de expandir/cerrar detalles, abrir/cerrar formularios y mostrar notificaciones se perciben como instantáneas, con tiempos de respuesta menores a 1 segundo y animaciones no superiores a aproximadamente 300 ms.

## Supuestos y dependencias

- La funcionalidad está pensada para personal de salud autorizado; la autenticación y la gestión de permisos se resuelven fuera del alcance de esta feature.
- Se asume la existencia de una fuente remota que entrega un conjunto de pacientes de ejemplo; no se gestionan requerimientos especiales de seguridad o cumplimiento más allá de lo que ya aplique al sistema global.
- No se requiere persistir en el servidor los cambios realizados desde esta interfaz; basta con que los datos editados y los nuevos pacientes se mantengan coherentes mientras dure la sesión actual de la aplicación.
- Para esta feature se considera un único tipo de usuario con permisos completos para consultar, editar y agregar pacientes en la interfaz.
- Se asume que la aplicación se ejecuta en entornos modernos donde el diseño responsive y las animaciones básicas de interfaz funcionan de manera fluida.
