# Respuestas a Preguntas del Taller de React

## Microreto A: JSX vs. JavaScript

### Código de referencia:
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

### ¿Qué partes son JSX y cuáles son JavaScript?

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

## Paso 7: Ejecución y Reactividad Inicial

### Pregunta: ¿Qué hace `npm install` y qué hace `npm run dev`? ¿Por qué el contador cambia sin recargar toda la página?

1. **`npm install`:** Lee el manifiesto `package.json`, resuelve el árbol de dependencias del proyecto, descarga los paquetes correspondientes desde el registro de npm hacia la carpeta local `node_modules` y genera o actualiza el archivo de bloqueo determinista `package-lock.json`.
2. **`npm run dev`:** Ejecuta el servidor de desarrollo configurado en los scripts (en este proyecto, Vite). Compila y sirve los módulos bajo demanda mediante ES Modules nativos en el navegador, habilitando Hot Module Replacement (HMR) para reflejar cambios en caliente sin reiniciar el entorno.
3. **¿Por qué el contador cambia sin recargar toda la página?** React implementa un DOM virtual (Virtual DOM). Cuando el estado cambia mediante su función actualizadora (`setCount`), React compara la nueva estructura con la anterior mediante un algoritmo de reconciliación (diffing) y aplica quirúrgicamente únicamente las mutaciones mínimas necesarias en el nodo real del DOM del navegador, preservando el estado de la página y evitando una recarga completa (full page reload).

---

## Paso 10: Componentes Reutilizables

### Pregunta: ¿Qué ventajas aporta reutilizar un componente frente a repetir bloques JSX?

1. **Mantenibilidad única (Principio DRY):** Si cambia la estructura o diseño de la tarjeta (por ejemplo, agregar una etiqueta `<article>` o cambiar un encabezado), solo se edita en un único archivo (`SolicitudCard.jsx`) y el cambio se refleja en toda la aplicación.
2. **Modularidad y separación de responsabilidades:** El componente padre (`App.jsx`) se encarga de *qué datos mostrar* mientras que el componente hijo (`SolicitudCard.jsx`) se encarga de *cómo renderizarlos*.
3. **Consistencia visual y parametrización:** Mediante `props` (`titulo`, `prioridad`, `estado`) se pueden pasar distintos valores manteniendo siempre el mismo formato y reglas de diseño.
4. **Legibilidad del código:** El árbol de componentes en el componente principal queda limpio, declarativo y fácil de comprender.

---

## Paso 11: Identificadores en Listas y Funciones Actualizadoras

### Pregunta: ¿Por qué el uso de `key` ayuda a React a identificar los elementos de la lista? ¿Cómo calcula `setSolicitudes(actuales => ...)` el nuevo estado a partir del anterior?

1. **Propósito de `key`:** Proporciona una identidad estable y única a cada elemento de la colección a lo largo de los sucesivos renderizados. Permite al algoritmo de reconciliación saber con exactitud qué elementos se agregaron, eliminaron, reordenaron o modificaron, evitando tener que recrear innecesariamente todo el subárbol del DOM o provocar desincronizaciones en el estado interno de los componentes hijos.
2. **Cálculo con función actualizadora (`actuales => ...`):** Dado que las actualizaciones de estado en React pueden encolarse o procesarse de manera asíncrona por lotes (batching), pasar una función de retorno (callback) garantiza que React proporcione el valor más reciente y certero del estado previo (`actuales`). Dentro de la función se construye un nuevo arreglo mediante el operador de propagación (`[...actuales, nueva]`), respetando el principio de inmutabilidad.

---

## Paso 12: Microretos de Lógica

### Microreto B: Botón Resolver y paso de funciones al componente hijo
- **Diseño implementado:** El componente padre (`App.jsx`) es el propietario del estado (`solicitudes`) y define la función `resolverSolicitud(id)`. Esta función se envía como propiedad (`onResolver={resolverSolicitud}`) al componente hijo `SolicitudCard`.
- **Actualización inmutable:** Al ejecutarse el clic, se invoca `onResolver(id)`, y en `App.jsx` se actualiza el estado mediante `map`:
  ```jsx
  setSolicitudes(actuales =>
    actuales.map(s => (s.id === id ? { ...s, estado: 'Resuelta' } : s))
  );
  ```
  Esto retorna un nuevo arreglo con una copia modificada del elemento seleccionado, sin mutar directamente el arreglo original en memoria.

### Microreto C: Contador dinámico de solicitudes pendientes (Estado derivado)
- **Diseño implementado:** Se calcula directamente durante el renderizado a partir del arreglo de solicitudes existente:
  ```jsx
  const totalPendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
  ```
- **¿Por qué no es necesario guardarlo en otro `useState`?**
  1. **Evita redundancia y desincronización:** Si se guardara en un estado independiente, existiría el riesgo de que el contador quede desfasado si se modifica una solicitud sin actualizar manualmente dicho contador.
  2. **Principio de fuente única de verdad (Single Source of Truth):** Toda información que pueda calcularse de manera síncrona y eficiente a partir de un estado existente debe tratarse como **estado derivado**. Esto reduce el código repetitivo, previene re-renderizados innecesarios y garantiza consistencia absoluta.
