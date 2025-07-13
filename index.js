const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // autorise tous les domaines
  },
});

app.use(cors());
app.use(express.json());

app.post("/color", (req, res) => {
  const { color } = req.body;
  if (color && ["rouge", "vert", "bleu", "jaune"].includes(color)) {
    // Convertir les couleurs françaises en types de déchets
    let wasteType;
    switch (color) {
      case "rouge":
        wasteType = "residual";
        break;
      case "vert":
        wasteType = "recyclable";
        break;
      case "bleu":
        wasteType = "electronic";
        break;
      case "jaune":
        wasteType = "organic";
        break;
      default:
        wasteType = "residual";
    }
    // Émettre la couleur à tous les clients connectés
    io.emit("waste_detected", { color, wasteType });
    return res.send({ success: true });
  } else {
    return res.status(400).send({ error: "Couleur invalide" });
  }
});


io.on("connection", (socket) => {
  console.log("Un client connecté");

  socket.on("disconnect", () => {
    console.log("Un client déconnecté");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
