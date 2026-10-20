// Componente reutilizable para representar una tarjeta de solicitud
export default function SolicitudCard({ id, titulo, prioridad, estado, onResolver }) {
  return (
    <article>
      <h3>{titulo}</h3>
      <p>Prioridad: {prioridad}</p>
      <p>Estado: {estado}</p>
      {/* Botón para resolver la solicitud sin mutación directa del estado padre */}
      {estado !== 'Resuelta' && onResolver && (
        <button type="button" onClick={() => onResolver(id)}>
          Resolver
        </button>
      )}
    </article>
  )
}
