const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

// Schema do contador
const visitSchema = new mongoose.Schema({
  count: { type: Number, default: 10000 }
});

const Visit = mongoose.model("Visit", visitSchema);

// Rota GET - retorna o contador
app.get("/visits", async (req, res) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) visit = await Visit.create({ count: 10000 });
    res.json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota POST - incrementa o contador
app.post("/visits", async (req, res) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) visit = await Visit.create({ count: 10000 });
    visit.count += 1;
    await visit.save();
    res.json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
