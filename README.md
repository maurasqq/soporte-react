# Sistema de Solicitudes de Soporte Técnico (`soporte-react`)

**Integrantes:** Maura Quintanilla · Roger Vargas  
**Asignatura:** Servicios Web · Unidad II: Desarrollo de Servicios Web con Spring Boot  
**Práctica:** Laboratorio 10: React desde cero hasta consumo de APIs  
**Carrera:** Ingeniería en Sistemas de Información · IV Año  
**Fecha:** Octubre 2026  

---

## Descripción del Proyecto

Aplicación web desarrollada con **React** y empaquetada mediante **Vite**, que se integra con un servicio REST construido en **Spring Boot**. El sistema permite la gestión interactiva de solicitudes de soporte técnico (hardware, software y redes), incorporando:
- Componentes modulares y reutilizables (`SolicitudCard`).
- Renderizado declarativo con JSX y propiedades (`props`).
- Gestión reactiva del estado local mediante el hook `useState`.
- Derivación eficiente de estados para contadores y filtros (evitando estados redundantes).
- Consumo asíncrono de APIs REST mediante `Axios` y el hook `useEffect` con cancelación de peticiones (`AbortController`).
- Manejo visual de estados de carga (`cargando`), errores de red (`error`) y listas vacías.
- Resolución de retos: filtro combinado por estado y prioridad, panel de indicadores operativos y búsqueda textual robusta.

---

## Estructura del Proyecto

```text
soporte-react/
├── backend/                               # Servicio REST en Spring Boot
│   ├── pom.xml                            # Configuración Maven (Spring Boot 3.3.4, Java 21)
│   └── src/main/
│       ├── java/com/ejemplo/soporte/
│       │   ├── SoporteApplication.java    # Clase principal de arranque
│       │   └── SolicitudController.java   # Controlador REST con GET /api/solicitudes y CORS
│       └── resources/
│           └── application.properties     # Configuración del puerto 8080
├── src/                                   # Frontend en React
│   ├── components/
│   │   └── SolicitudCard.jsx              # Componente reutilizable para cada solicitud
│   ├── services/
│   │   └── api.js                         # Cliente HTTP configurado con Axios
│   ├── App.jsx                            # Componente principal con estado, filtros y retos
│   ├── index.jsx                          # Punto de entrada de la aplicación React
│   └── index.css                          # Estilos base
├── index.html                             # Plantilla HTML principal
├── package.json                           # Dependencias y scripts de Vite
├── vite.config.js                         # Configuración de Vite (puerto 3000)
├── REFLEXION.md                           # Autoevaluación y respuestas académicas requeridas
└── README.md                              # Documentación general y respuestas del laboratorio
```

---

## Instrucciones de Ejecución

### 1. Requisitos Previos
- **Node.js:** Versión `^20.19.0` o `>=22.12.0` (recomendado Node.js 24 LTS, requerido por Vite 8.3.4) y npm.
- **Java Development Kit (JDK):** Versión 21.
- **Apache Maven:** Versión 3.9+.

### 2. Ejecución del Backend (Spring Boot)
1. Abrir una terminal en la raíz del proyecto.
2. Iniciar el servidor backend con Maven:
   ```bash
   mvn -f backend/pom.xml spring-boot:run
   ```
   *(Si Maven no está en el PATH de Windows, utilizar la ruta completa al binario `mvn.cmd`)*.
3. El servicio iniciará en `http://localhost:8080`.
4. Verificar el endpoint en el navegador o cliente REST:
   - **GET** `http://localhost:8080/api/solicitudes`
   - Retorna:
     ```json
     [
       { "id": 1, "titulo": "Equipo no enciende", "prioridad": "Alta", "estado": "Pendiente" },
       { "id": 2, "titulo": "Instalar software", "prioridad": "Media", "estado": "En proceso" }
     ]
     ```

### 3. Ejecución del Frontend (React + Vite)
1. Abrir una segunda terminal en la raíz del proyecto.
2. Instalar dependencias (si no se ha hecho previamente):
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador la URL indicada por Vite (predeterminada en este proyecto: `http://localhost:3000/`).

---

## Respuestas Académicas a las Preguntas del Laboratorio

### Microreto A: JSX vs. JavaScript

#### Código de referencia:
```jsx
function App() {
  return (
    <main>
      <h1>Sistema de Soporte Técnico</h1>
      <h2>Sistemas y Redes</h2>
      <p>Bienvenido al sistema de solicitudes.</p>
      <ul>
        <li>Hardware</li>
        <li>Software</li>
        <li>Redes</li>
      </ul>
      <button onClick={() => alert('Consultando disponibilidad...')}>
        Verificar estado
      </button>
    </main>
  );
}

export default App;
```

#### ¿Qué partes son JSX y cuáles son JavaScript?
1. **JavaScript:**
   - La definición de la función (`function App() { ... }`).
   - Las palabras reservadas del lenguaje (`return`, `export default`).
   - La función flecha pasada al manejador de eventos: `() => alert(...)`.
   - La llamada a la API nativa del navegador: `alert(...)`.
2. **JSX:**
   - La sintaxis de etiquetas que emula HTML dentro del `return`: `<main>`, `<h1>`, `<h2>`, `<p>`, `<ul>`, `<li>`, `<button>`.
   - El atributo de evento en camelCase: `onClick`.
   - Las llaves `{ ... }` utilizadas en `onClick={...}` son el delimitador de JSX que permite evaluar expresiones de JavaScript dentro del marcado.

---

### Paso 7: Ejecución y Reactividad Inicial

#### ¿Qué hace `npm install` y qué hace `npm run dev`? ¿Por qué el contador cambia sin recargar toda la página?
1. **`npm install`:** Lee el manifiesto `package.json`, resuelve el árbol de dependencias, descarga los paquetes desde el registro oficial hacia la carpeta local `node_modules` y genera/actualiza el archivo de bloqueo `package-lock.json` para garantizar compilaciones reproducibles.
2. **`npm run dev`:** Levanta el servidor de desarrollo de Vite. Este sirve los módulos mediante ESM nativo en el navegador y proporciona Hot Module Replacement (HMR), aplicando cambios de código en caliente de manera instantánea.
3. **¿Por qué el contador cambia sin recargar la página?** React implementa un DOM virtual (Virtual DOM). Al modificar el estado con su función actualizadora (`setCount`), React compara la nueva representación con la anterior mediante un algoritmo de reconciliación (*diffing*) y actualiza únicamente el nodo de texto específico en el DOM real del navegador, sin reiniciar el documento HTML ni perder el estado general.

---

### Paso 10: Componentes Reutilizables

#### ¿Qué ventajas aporta reutilizar un componente frente a repetir bloques JSX?
1. **Principio DRY (Don't Repeat Yourself) y mantenibilidad:** Cualquier mejora estructural o cambio de diseño en la tarjeta se realiza exclusivamente en `SolicitudCard.jsx`, propagándose de inmediato a todos los lugares donde se use.
2. **Separación de responsabilidades:** `App.jsx` actúa como orquestador de datos y lógica de negocio, mientras que `SolicitudCard.jsx` se limita a la presentación del elemento individual.
3. **Consistencia visual y parametrización:** Mediante `props` (`id`, `titulo`, `prioridad`, `estado`, `onResolver`) se alimenta el componente con diversos valores garantizando un estándar visual uniforme.
4. **Claridad del árbol de componentes:** El código en el componente principal resulta declarativo, compacto y fácil de auditar.

---

### Paso 11: Identificadores en Listas y Funciones Actualizadoras

#### ¿Por qué el uso de `key` ayuda a React a identificar los elementos de la lista? ¿Cómo calcula `setSolicitudes(actuales => ...)` el nuevo estado a partir del anterior?
1. **Propósito de `key`:** La propiedad `key` asigna un identificador único y estable a cada nodo de una colección iterable. Permite al motor de reconciliación de React rastrear con precisión qué elementos fueron añadidos, modificados, reordenados o eliminados entre renderizados, impidiendo recreaciones completas del subárbol DOM y evitando fallos de estado en componentes con inputs o animaciones.
2. **Cálculo con función actualizadora (`actuales => ...`):** Dado que React agrupa y procesa las actualizaciones de estado en lotes (*batching*) asíncronos, invocar la función con una expresión callback garantiza trabajar sobre el valor más reciente del estado (`actuales`). Dentro de ella se genera una nueva referencia mediante inmutabilidad (`[...actuales, nueva]`), preservando la integridad de los datos.

---

### Paso 12: Microretos de Lógica

#### Microreto B: Botón Resolver y paso de funciones al componente hijo
- **Diseño implementado:** `App.jsx` posee el estado de la lista y define la función `resolverSolicitud(id)`. Dicha función se transfiere mediante props (`onResolver={resolverSolicitud}`) hacia `SolicitudCard`.
- **Actualización inmutable:** Al hacer clic en el botón "Resolver", se dispara `onResolver(id)`. En `App.jsx`, se aplica un `map` que retorna una copia del objeto con el nuevo estado sin alterar la colección original:
  ```jsx
  setSolicitudes(actuales =>
    actuales.map(s => (s.id === id ? { ...s, estado: 'Resuelta' } : s))
  );
  ```

#### Microreto C: Contador dinámico de pendientes (Estado derivado)
- **Diseño implementado:** Se calcula directamente durante el renderizado a partir del arreglo `solicitudes`:
  ```jsx
  const totalPendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
  ```
- **¿Por qué no es necesario guardarlo en otro `useState`?**
  1. **Evita inconsistencias de sincronización:** Si se mantuviera en un estado independiente, existiría el riesgo de desfasar el valor ante cualquier adición, edición o resolución de solicitudes.
  2. **Principio de fuente única de verdad (*Single Source of Truth*):** Cualquier dato que pueda derivarse de forma síncrona y eficiente a partir de un estado existente debe calcularse en tiempo de renderizado. Esto reduce código innecesario, previene renders redundantes y garantiza consistencia total.

---

## Justificación de Decisiones de Diseño — Fase 5 (Retos)

### Reto 1 · Filtro Combinado (Obligatorio)
- **Decisión:** Se implementaron dos controles `<select>` independientes: uno para el estado (`filtroEstado`: Todas, Pendiente, En proceso, Resuelta) y otro para la prioridad (`filtroPrioridad`: Todas, Alta, Media, Baja).
- **Lógica:** El filtrado se realiza evaluando la conjunción lógica (`&&`) de ambas condiciones sobre cada elemento:
  ```jsx
  const coincideEstado = filtroEstado === 'Todas' || s.estado === filtroEstado;
  const coincidePrioridad = filtroPrioridad === 'Todas' || s.prioridad === filtroPrioridad;
  return coincideEstado && coincidePrioridad;
  ```
- **Beneficio:** Permite al operador consultar combinaciones precisas, como por ejemplo solicitudes con estado "Pendiente" y prioridad "Alta".

### Reto 2 · Indicadores Operativos (Obligatorio)
- **Decisión:** Se diseñó un panel de métricas operativas al inicio de la aplicación que expone cuatro indicadores:
  1. Total registradas (`solicitudes.length`).
  2. Solicitudes pendientes (`filter(s => s.estado === 'Pendiente').length`).
  3. Solicitudes en proceso (`filter(s => s.estado === 'En proceso').length`).
  4. Solicitudes resueltas (`filter(s => s.estado === 'Resuelta').length`).
- **Lógica:** Todos los indicadores son estados derivados, calculados al vuelo sin generar estados auxiliares superfluos en `useState`.
- **Beneficio:** Brinda visibilidad inmediata del estado de la mesa de soporte técnico.

### Reto 3 · Búsqueda Robusta (Reto Opcional Seleccionado)
- **Decisión:** Se añadió un campo de entrada tipo búsqueda (`<input type="search" id="busqueda">`) que permite filtrar solicitudes por palabras clave en su título o descripción.
- **Robustez:**
  1. **Insensibilidad a mayúsculas y minúsculas:** Se normaliza el texto mediante `.toLowerCase()`.
  2. **Tolerancia a espacios en blanco:** Se eliminan espacios periféricos accidentales mediante `.trim()`.
  3. **Integración con los filtros combinados:** La búsqueda se combina transparentemente con los filtros de estado y prioridad mediante conjunción (`coincideEstado && coincidePrioridad && coincideBusqueda`).
- **Beneficio:** Proporciona una experiencia de usuario rápida y fluida para localizar incidencias específicas sin sobrecargar la arquitectura con llamadas innecesarias al backend.

---

## Autoevaluación y Reflexión Final

Las respuestas detalladas a las preguntas finales de la guía sobre:
1. Diferencias entre componentes, props y estados.
2. Idoneidad de `useEffect` para consultas externas.
3. Responsabilidades de React vs. Spring Boot.
4. Diagnóstico de errores de CORS, 404 y caída de servidor.
5. Mejoras de cara a un despliegue en producción.

Se encuentran completamente desarrolladas en el archivo independiente **[REFLEXION.md](REFLEXION.md)**, preservado como requisito explícito de entrega académica.
