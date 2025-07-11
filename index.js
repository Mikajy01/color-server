const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // autorise tous les domaines
  }
});

app.use(cors());
app.use(express.json());

app.post('/color', (req, res) => {
  const { color } = req.body;
  if (color && ['rouge', 'vert', 'bleu', 'jaune'].includes(color)) {
    io.emit('color_detected', color);
    return res.send({ success: true });
  } else {
    return res.status(400).send({ error: 'Couleur invalide' });
  }
});

io.on('connection', (socket) => {
  console.log('Un client connecté');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
