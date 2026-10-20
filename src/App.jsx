import { useEffect, useState } from 'react'
import { api } from './services/api'
import SolicitudCard from './components/SolicitudCard'

function App() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Estados del formulario
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('Media')
  const [mensaje, setMensaje] = useState('')

  // Reto 1: Filtro combinado (Estado y Prioridad)
  const [filtroEstado, setFiltroEstado] = useState('Todas')
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas')

  // Reto 3 (Reto opcional seleccionado): Búsqueda robusta por descripción
  const [busqueda, setBusqueda] = useState('')

  // Carga inicial de solicitudes desde el servicio REST de Spring Boot
  useEffect(() => {
    const controller = new AbortController()

    async function cargar() {
      try {
        setCargando(true)
        setError('')
        const respuesta = await api.get('/solicitudes', {
          signal: controller.signal
        })
        setSolicitudes(respuesta.data)
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') {
          setError('No fue posible consultar las solicitudes.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargar()
    // Cancela la petición pendiente al desmontar el componente
    return () => controller.abort()
  }, [])

  // Agrega una nueva solicitud validando el formulario
  function agregar(e) {
    e.preventDefault()
    if (!titulo.trim()) {
      setMensaje('Escribe una descripción de la solicitud.')
      return
    }
    const nueva = {
      id: crypto.randomUUID(),
      titulo: titulo.trim(),
      prioridad,
      estado: 'Pendiente'
    }
    setSolicitudes(actuales => [...actuales, nueva])
    setTitulo('')
    setMensaje('Solicitud agregada correctamente.')
  }

  // Actualiza la solicitud a 'Resuelta' sin mutar directamente el arreglo original
  function resolverSolicitud(id) {
    setSolicitudes(actuales =>
      actuales.map(s => (s.id === id ? { ...s, estado: 'Resuelta' } : s))
    )
  }

  // Reto 2: Indicadores operativos derivados directamente del estado de solicitudes
  const totalRegistradas = solicitudes.length
  const totalPendientes = solicitudes.filter(s => s.estado === 'Pendiente').length
  const totalEnProceso = solicitudes.filter(s => s.estado === 'En proceso').length
  const totalResueltas = solicitudes.filter(s => s.estado === 'Resuelta').length

  // Reto 1 y Reto 3: Filtrado combinado y búsqueda insensible a mayúsculas/minúsculas y espacios
  const visibles = solicitudes.filter(s => {
    const coincideEstado = filtroEstado === 'Todas' || s.estado === filtroEstado
    const coincidePrioridad =
      filtroPrioridad === 'Todas' || s.prioridad === filtroPrioridad
    const terminoBusqueda = busqueda.trim().toLowerCase()
    const coincideBusqueda =
      !terminoBusqueda || s.titulo.toLowerCase().includes(terminoBusqueda)

    return coincideEstado && coincidePrioridad && coincideBusqueda
  })

  return (
    <main>
      <h1>Sistema de Gestión de Soporte Técnico</h1>

      {/* Estados de carga y error del servicio REST */}
      {cargando && <p role="status">Cargando solicitudes...</p>}
      {error && <p role="alert">{error}</p>}

      {/* Reto 2: Panel de Indicadores Operativos */}
      <section aria-label="Indicadores operativos">
        <h2>Indicadores Operativos</h2>
        <p>Total registradas: {totalRegistradas}</p>
        <p>Pendientes: {totalPendientes}</p>
        <p>En proceso: {totalEnProceso}</p>
        <p>Resueltas: {totalResueltas}</p>
      </section>

      {/* Formulario de registro de solicitudes */}
      <section aria-label="Registro de solicitud">
        <h2>Nueva Solicitud</h2>
        <form onSubmit={agregar}>
          <label htmlFor="titulo">Descripción</label>
          <input
            id="titulo"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
          <label htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            value={prioridad}
            onChange={e => setPrioridad(e.target.value)}
          >
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
          <button type="submit">Registrar</button>
        </form>
        <p role="status">{mensaje}</p>
      </section>

      {/* Reto 1 y Reto 3: Panel de Búsqueda y Filtro Combinado */}
      <section aria-label="Filtros y búsqueda de solicitudes">
        <h2>Filtros y Búsqueda</h2>

        {/* Reto 3: Campo de búsqueda robusta */}
        <label htmlFor="busqueda">Buscar por descripción</label>
        <input
          id="busqueda"
          type="search"
          placeholder="Ej. encender, software..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        {/* Reto 1: Filtros de estado y prioridad */}
        <label htmlFor="filtro-estado">Filtrar por estado</label>
        <select
          id="filtro-estado"
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
        >
          <option>Todas</option>
          <option>Pendiente</option>
          <option>En proceso</option>
          <option>Resuelta</option>
        </select>

        <label htmlFor="filtro-prioridad">Filtrar por prioridad</label>
        <select
          id="filtro-prioridad"
          value={filtroPrioridad}
          onChange={e => setFiltroPrioridad(e.target.value)}
        >
          <option>Todas</option>
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>
      </section>

      {/* Listado dinámico de solicitudes */}
      <section aria-label="Listado de solicitudes">
        <h2>Solicitudes</h2>
        {!cargando && !error && visibles.length === 0 ? (
          <p>No hay solicitudes que coincidan con los criterios de búsqueda y filtros.</p>
        ) : (
          visibles.map(s => (
            <SolicitudCard
              key={s.id}
              {...s}
              onResolver={resolverSolicitud}
            />
          ))
        )}
      </section>
    </main>
  )
}

export default App
