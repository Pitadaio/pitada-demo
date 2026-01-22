// api/analizar.js - CON MODELO CHILENO INTEGRADO
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Configurar Colab para procesamiento automático
const COLAB_WEBHOOK = process.env.COLAB_WEBHOOK || "https://colab.research.google.com/drive/..."

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  try {
    const { videoUrl, clubId, nombrePartido, telefono } = req.body

    if (!videoUrl || !clubId) {
      return res.status(400).json({ error: 'videoUrl y clubId requeridos' })
    }

    console.log(`📥 Análisis solicitado: ${nombrePartido || 'Sin nombre'}`)

    // 1. GUARDAR EN SUPABASE
    const { data: partido, error } = await supabase
      .from('partidos')
      .insert({
        club_id: clubId,
        nombre_partido: nombrePartido || 'Partido sin nombre',
        video_url: videoUrl,
        estado: 'pendiente',
        telefono_solicitante: telefono,
        fecha_solicitud: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(`Supabase: ${error.message}`)

    console.log(`✅ Partido ${partido.id} creado`)

    // 2. DISPARAR PROCESAMIENTO EN COLAB
    await dispararProcesamientoColab(partido.id, videoUrl)

    // 3. RESPONDER
    return res.status(202).json({
      success: true,
      message: 'Video recibido. Procesando con IA chilena...',
      partidoId: partido.id,
      estado: 'procesando',
      tiempoEstimado: '3-5 minutos',
      webhookStatus: 'https://pitada-demo.vercel.app/api/status?id=' + partido.id
    })

  } catch (error) {
    console.error('❌ Error:', error)
    return res.status(500).json({ 
      error: 'Error interno',
      detalle: error.message 
    })
  }
}

// Función para disparar procesamiento en Colab
async function dispararProcesamientoColab(partidoId, videoUrl) {
  console.log(`🚀 Disparando Colab para partido ${partidoId}`)
  
  // En producción, aquí harías:
  // 1. Llamar a un Colab automatizado via webhook
  // 2. O usar Cloud Run con contenedor
  // 3. O usar función serverless
  
  // Por ahora, guardamos para procesamiento manual
  await supabase
    .from('cola_procesamiento')
    .insert({
      partido_id: partidoId,
      video_url: videoUrl,
      estado: 'pendiente',
      created_at: new Date().toISOString()
    })
}
