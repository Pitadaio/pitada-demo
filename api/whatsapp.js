// api/whatsapp.js - Webhook para WhatsApp
export default async function handler(req, res) {
  // Verificar método
  if (req.method === 'GET') {
    // Verificación de webhook (Meta lo requiere)
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Token que configurarás en Meta Dashboard
    const VERIFY_TOKEN = 'pitada_token_2026';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado por WhatsApp');
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Token inválido');
    }
  }

  // Manejar mensajes entrantes (POST)
  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      // WhatsApp envía datos en este formato
      if (data.object === 'whatsapp_business_account') {
        const entry = data.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        
        if (value?.messages) {
          const message = value.messages[0];
          
          // Procesar según tipo
          if (message.type === 'text') {
            await handleTextMessage(message);
          } else if (message.type === 'video') {
            await handleVideoMessage(message);
          } else if (message.type === 'image') {
            // WhatsApp a veces envía videos como imagen
            await handleVideoMessage(message);
          }
        }
      }

      // WhatsApp requiere respuesta 200 rápido
      return res.status(200).send('EVENT_RECEIVED');

    } catch (error) {
      console.error('Error procesando webhook:', error);
      return res.status(500).send('Error interno');
    }
  }

  // Método no soportado
  return res.status(405).send('Método no permitido');
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

async function handleTextMessage(message) {
  console.log('📝 Mensaje texto recibido:', message.text.body);
  
  // Aquí iría lógica para comandos tipo "analizar último partido"
  // Por ahora solo registro
}

async function handleVideoMessage(message) {
  console.log('🎥 Video recibido de:', message.from);
  
  // En producción, aquí descargarías el video de WhatsApp
  // y lo procesarías con tu IA
  
  // Por ahora simulamos
  const videoUrl = message.video?.link || message.image?.link;
  
  if (videoUrl) {
    console.log('✅ Video para analizar:', videoUrl);
    
    // Simular análisis llamando a nuestra API interna
    const analisis = await simularAnalisis(videoUrl, message.from);
    
    // Aquí enviaríamos respuesta por WhatsApp
    console.log('📊 Análisis simulado:', analisis);
  }
}

async function simularAnalisis(videoUrl, fromNumber) {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    id: `analisis_${Date.now()}`,
    videoUrl,
    telefono: fromNumber,
    estadisticas: {
      jugadoresDetectados: 22,
      posesionLocal: 62,
      posesionVisitante: 38,
      tiros: 14,
      corners: 6,
      faltas: 18
    },
    recomendaciones: [
      'Equipo mantiene buena posesión (62%)',
      'Aumentar efectividad en último tercio',
      'Laterales participan poco en ataque'
    ]
  };
}
