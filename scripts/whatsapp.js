// whatsapp.js

export async function enviarMensajeWhatsApp({ mensaje, destinatario }) {
    const token = 'EAAUGl1HX7KsBOzVsivcvKOI0f0aIXiEBKd9ldT0zjRpX8UFnZCxHVIPxmUSNUdoZCH4ug93SbunGtLChTdototKkLqfkPkrlif6vXFjmcpZADS0hymugWZA3YlAduRVycUCNF0UOAoS7jgJsjB7CGv7VJP4n6avReI4ZA8F5YGSKOf8Db9yVbR2lqEN138eIRZAUyXRdZBZCSU44d9oXAMqKnZAAZD'; // ⚠️ Dura 24h (sólo para pruebas)
    const phoneNumberId = '690685430789757'; // lo encuentras en tu panel de Meta
  
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
  
    const body = {
      messaging_product: 'whatsapp',
      to: destinatario,
      type: 'text',
      text: { body: mensaje }
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Error de WhatsApp API:", data);
        alert(`Error al enviar: ${data.error?.message}`);
        return;
      }
  
      console.log("Mensaje enviado con éxito:", data);
      alert("Mensaje de alerta enviado por WhatsApp");
    } catch (err) {
      console.error("Error al conectar con la API:", err);
      alert("Error al enviar el mensaje.");
    }
  }
  