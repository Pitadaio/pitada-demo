// api/status.js - Ver estado de análisis
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { id } = req.query
  
  if (!id) {
    return res.status(400).json({ error: 'ID requerido' })
  }

  try {
    const { data: partido, error } = await supabase
      .from('partidos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json({
      id: partido.id,
      estado: partido.estado,
      nombre: partido.nombre_partido,
      creado: partido.fecha_solicitud,
      analizado: partido.fecha_analisis,
      tieneResultados: !!partido.analisis_json,
      duracion: partido.duracion_minutos
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
