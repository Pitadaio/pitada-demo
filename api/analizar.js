// api/analizar.js - Endpoint para análisis de videos
export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { videoUrl, clubId, nombrePartido } = req.body;

    // Validar datos básicos
    if (!videoUrl || !clubId) {
      return res.status(400).json({ 
        error: 'Faltan datos: videoUrl y clubId son requeridos' 
      });
    }

    // Simular análisis (en producción aquí iría la IA)
    const analisisSimulado = {
      metadata: {
        videoUrl,
        clubId,
        nombrePartido: nombrePartido || 'Partido sin nombre',
        fechaAnalisis: new Date().toISOString()
      },
      estadisticas: {
        jugadoresPromedio: 22.5,
        posesionEquipoA: 58,
        posesionEquipoB: 42,
        tirosAlArco: 12,
        corners: 7,
        faltas: 15
      },
      recomendaciones: [
        "Mejorar presión en medio campo",
        "Aprovechar laterales para desborde",
        "Reforzar marca en jugador #10 rival"
      ]
    };

    // Respuesta exitosa
   return res.status(200)
  .setHeader('Content-Type', 'application/json; charset=utf-8')
  .json({
      success: true,
      message: 'Análisis generado correctamente',
      analisisId: `analisis_${Date.now()}`,
      datos: analisisSimulado,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en análisis:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: error.message 
    });
  }
}
