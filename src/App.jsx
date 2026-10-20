import { useEffect, useState } from 'react'
import { api } from './services/api'
import SolicitudCard from './components/SolicitudCard'

function App() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Estados del formulario y filtros locales
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('Media')
  const [filtro, setFiltro] = useState('Todas')
  const [mensaje, setMensaje] = useState('')

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

  // Contador de pendientes como estado derivado
  const totalPendientes = solicitudes.filter(s => s.estado === 'Pendiente').length

  // Filtra las solicitudes según el estado seleccionado
  const visibles = solicitudes.filter(s =>
    filtro === 'Todas' || s.estado === filtro
  )

  return (
    <main>
      <h1>Sistema de Gestión de Soporte</h1>

      {/* Estados de carga y error del servicio REST */}
      {cargando && <p role="status">Cargando solicitudes...</p>}
      {error && <p role="alert">{error}</p>}

      {/* Métricas y resumen */}
      <section aria-label="Resumen de solicitudes">
        <p>Total registradas: {solicitudes.length}</p>
        <p>Solicitudes pendientes: {totalPendientes}</p>
      </section>

      {/* Formulario de registro */}
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

      {/* Filtro por estado */}
      <label htmlFor="filtro">Filtrar por estado</label>
      <select
        id="filtro"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      >
        <option>Todas</option>
        <option>Pendiente</option>
        <option>En proceso</option>
        <option>Resuelta</option>
      </select>

      {/* Listado de solicitudes */}
      {!cargando && !error && visibles.length === 0 ? (
        <p>No hay solicitudes que coincidan con el filtro.</p>
      ) : (
        visibles.map(s => (
          <SolicitudCard
            key={s.id}
            {...s}
            onResolver={resolverSolicitud}
          />
        ))
      )}
    </main>
  )
}

export default App
