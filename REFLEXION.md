# Reflexión Académica y Autoevaluación

**Estudiantes:** Maura Quintanilla · Roger Vargas (Ingeniería en Sistemas de Información - IV Año)  
**Asignatura:** Servicios Web · Unidad II: Desarrollo de Servicios Web con Spring Boot  
**Práctica:** Laboratorio 10: React desde cero hasta consumo de APIs  
**Proyecto:** Sistema de Solicitudes de Soporte Técnico (`soporte-react`)

---

## 1. ¿Qué diferencia existe entre componente, prop y estado?

- **Componente:** Es la unidad estructural y funcional básica en React. Se define como una función de JavaScript que encapsula lógica y estructura visual (JSX), retornando la descripción de la interfaz de usuario. En este laboratorio, `SolicitudCard` y `App` son componentes modulares e independientes.
- **Prop (Propiedad):** Son los datos de entrada inmutables que un componente padre transfiere a un componente hijo (comunicación unidireccional o descendente). El componente receptor no debe modificar sus props (son de solo lectura). Por ejemplo, `App` pasa `titulo`, `prioridad`, `estado` y el callback `onResolver` a `SolicitudCard`.
- **Estado (`useState`):** Es la memoria interna y dinámica administrada por el propio componente. A diferencia de las props, el estado es mutable mediante su función actualizadora específica (`setSolicitudes`, `setTitulo`, etc.). Cuando el estado cambia, React programa un nuevo renderizado del componente y sus hijos para reflejar las modificaciones en la interfaz.

---

## 2. ¿Por qué `useEffect` es adecuado para iniciar una consulta externa?

El renderizado de componentes en React debe ser una función pura: no debe provocar efectos secundarios (*side effects*) como peticiones HTTP, suscripciones o mutaciones directas del DOM durante el cálculo del JSX.

`useEffect` es el hook idóneo por las siguientes razones:

1. **Momento de ejecución controlado:** Se ejecuta de forma asíncrona inmediatamente después de que el componente ha sido montado y renderizado en el DOM, evitando bloquear la primera pintura visual (*First Meaningful Paint*).
2. **Control de dependencias:** Mediante su arreglo de dependencias vacío (`[]`), garantiza que la petición HTTP hacia el backend se dispare una única vez durante el ciclo de vida del componente, evitando bucles infinitos de consultas que ocurrirían si la petición estuviese en el cuerpo directo de la función.
3. **Mecanismo de limpieza (*cleanup function*) y `AbortController`:** Permite retornar una función de limpieza que cancela peticiones en vuelo mediante `controller.abort()`, mitigando fugas de memoria y condiciones de carrera (*race conditions*) si el componente se desmonta antes de recibir la respuesta.

### Relación con `React.StrictMode`:
En entorno de desarrollo, `React.StrictMode` ejecuta deliberadamente un ciclo adicional de montaje, desmontaje y remontaje de los componentes (`mount -> unmount -> mount`). Este comportamiento tiene como propósito estresar el código para detectar efectos secundarios no controlados o fugas de memoria. 
Al realizar una petición asíncrona con `useEffect`, el primer ciclo monta el efecto, pero el desmontaje inmediato ejecuta la función de limpieza abortando la primera petición en red (`ERR_CANCELED`). El segundo ciclo ejecuta la petición que finalmente resuelve y actualiza el estado. Contar con `AbortController` asegura que la respuesta del primer ciclo abortado sea ignorada limpiamente y no intente actualizar el estado de un componente desmontado, evitando confusiones con duplicaciones reales de registros en la base de datos o en el servidor.

---

## 3. ¿Qué responsabilidades corresponden a React y cuáles a Spring Boot?

En una arquitectura desacoplada cliente-servidor:

- **React (Capa de Presentación / Frontend SPA):**
  - Renderizado declarativo y reactivo de la interfaz de usuario.
  - Captura y manejo de eventos del usuario (clic en botones, digitación en inputs, selección en desplegables).
  - Gestión del estado local de la interfaz (filtros activos, texto de búsqueda, formulario en edición).
  - Feedback visual inmediato (indicadores de carga `cargando`, mensajes de error amigables `error`, conteo dinámico derivado).
  - Consumo asíncrono de APIs REST mediante Axios.

- **Spring Boot (Capa de Negocio y Persistencia / Backend REST API):**
  - Exposición de endpoints HTTP normalizados (`/api/solicitudes`) bajo el estándar REST.
  - Centralización de reglas de negocio y validaciones del lado del servidor.
  - Orquestación y persistencia de datos (en base de datos o almacenamiento en memoria).
  - Seguridad, autenticación, autorización y control de acceso.
  - Definición de políticas de intercambio de recursos de origen cruzado (CORS) para autorizar orígenes frontend legítimos.

---

## 4. ¿Cómo distinguirías un error de CORS, un 404 y una caída del servidor?

Al diagnosticar fallas de comunicación HTTP desde el navegador o herramientas como DevTools/Axios:

| Tipo de Error | Código HTTP / Mensaje | Comportamiento en Consola y Red (DevTools) | Causa Raíz Principal |
| :--- | :--- | :--- | :--- |
| **Error de CORS** | Sin código HTTP (o status cancelado / preflight 403) | Aparece en rojo en la consola: *"Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource."* En la pestaña Network, el preflight `OPTIONS` falla o la respuesta carece de los encabezados CORS permitidos. | El backend está activo pero no incluye el origen del frontend (`http://localhost:3000` o `5173`) en su anotación `@CrossOrigin` o configuración de seguridad. |
| **Error 404 Not Found** | `404 Not Found` | En la pestaña Network se completa el ciclo HTTP con código 404. La respuesta suele incluir un cuerpo JSON con detalles de la ruta inexistente (`error: Not Found`, `path: /api/invalido`). | La URL o endpoint invocado no coincide exactamente con ninguna ruta mapeada en los controladores (`@RequestMapping` / `@GetMapping`) de Spring Boot. |
| **Caída del Servidor (Connection Refused)** | `ERR_CONNECTION_REFUSED` / `ECONNREFUSED` | No hay respuesta HTTP ni código de estado del servidor. La pestaña Network muestra `(failed) net::ERR_CONNECTION_REFUSED`. Axios lanza un error con código `ERR_NETWORK`. | El proceso de Spring Boot está detenido, el puerto `8080` no está escuchando o el firewall bloqueó el enlace local. |

---

## 5. ¿Qué mejorarías antes de publicar el sistema para usuarios reales?

Para transformar este prototipo académico en un sistema apto para entornos de producción comercial, implementaría:

1. **Persistencia real en Base de Datos:** Sustituir la colección en memoria por Spring Data JPA vinculado a un motor transaccional como PostgreSQL o MySQL, asegurando persistencia permanente y concurrencia segura.
2. **Sincronización bidireccional completa (CRUD REST):**
   - Implementar endpoints `POST /api/solicitudes` para registrar tickets en el servidor.
   - Implementar `PATCH /api/solicitudes/{id}/estado` para persistir la resolución de solicitudes.
   - Implementar `DELETE` para bajas lógicas o físicas.
3. **Seguridad y Control de Identidad:** Integrar Spring Security con JSON Web Tokens (JWT) o OAuth2/OIDC, protegiendo las rutas tanto en el backend como en el enrutamiento frontend.
4. **Validación robusta en ambas capas:** Validación de esquemas con Jakarta Bean Validation (`@NotNull`, `@Size`, `@NotBlank`) en Java y validación con feedback visual accesible en el cliente.
5. **Manejo resiliente de red y paginación:** Incorporar reintentos exponenciales ante caídas transitorias, paginación en el servidor (`Pageable`), ordenamiento por fecha y diseño visual adaptativo (responsive design).
