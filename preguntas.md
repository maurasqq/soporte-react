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

## Paso 10: Componentes Reutilizables

### Pregunta: ¿Qué ventajas aporta reutilizar un componente frente a repetir bloques JSX?

1. **Mantenibilidad única (Principio DRY):** Si cambia la estructura o diseño de la tarjeta (por ejemplo, agregar una etiqueta `<article>` o cambiar un encabezado), solo se edita en un único archivo (`SolicitudCard.jsx`) y el cambio se refleja en toda la aplicación.
2. **Modularidad y separación de responsabilidades:** El componente padre (`App.jsx`) se encarga de *qué datos mostrar* mientras que el componente hijo (`SolicitudCard.jsx`) se encarga de *cómo renderizarlos*.
3. **Consistencia visual y parametrización:** Mediante `props` (`titulo`, `prioridad`, `estado`) se pueden pasar distintos valores manteniendo siempre el mismo formato y reglas de diseño.
4. **Legibilidad del código:** El árbol de componentes en el componente principal queda limpio, declarativo y fácil de comprender.
