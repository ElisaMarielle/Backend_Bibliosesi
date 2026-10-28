require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const { verificarAutenticacao } = require('./src/middleware/auth');

const sesiRoutes = require('./src/routes/sesi.routes');
const noticiasRoutes = require('./src/routes/noticias.routes');
const feedbacksRoutes = require('./src/routes/feedbacks.routes');
const filaRoutes = require('./src/routes/fila.routes');
const emprestimosRoutes = require('./src/routes/emprestimos.routes');
const livrosRoutes = require('./src/routes/livros.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
app.use('/usuarios', usuariosRoutes);
app.use('/sesi', verificarAutenticacao, sesiRoutes);
app.use('/noticias', verificarAutenticacao, noticiasRoutes);
app.use('/feedbacks', verificarAutenticacao, feedbacksRoutes);
app.use('/fila', verificarAutenticacao, filaRoutes);
app.use('/emprestimos', verificarAutenticacao, emprestimosRoutes);
app.use('/livros', verificarAutenticacao, livrosRoutes);
app.use('/usuarios', verificarAutenticacao, usuariosRoutes);

const authRoutes = require('./src/middleware/auth');
app.use('/auth', authRoutes);


app.use("/", (req, res) => {
    res.status(200).json({ message: "API funcionando!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Algo novo que para subir na Vercel