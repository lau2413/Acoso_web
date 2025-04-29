const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const corsOptions = {
    origin: 'https://https://lau2413.github.io/Acoso_web/', // tu frontend en GitHub Pages
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
  };
  app.use(cors(corsOptions));
  
app.use(bodyParser.json());

const accountSid = 'ACc38625a993719beb95e6ac9154570709';
const authToken = '5001c19902f678ba32ea5ed40143edda';
const client = twilio(accountSid, authToken);

app.post('/send-alert', (req, res) => {
  client.messages
    .create({
      body: '🚨 ¡Esta es una alerta de prueba!',
      from: '+13163892927',
      to: '+573197697334'
    })
    .then(message => res.json({ sid: message.sid }))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.listen(3000, () => {
  console.log('Servidor escuchando en puerto 3000');
});

