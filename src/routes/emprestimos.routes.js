const express = require("express");
const {verificarAutenticacao, apenasAdm} = require('../middleware/auth');

const router = express.Router();

const {
    cadastrar,
    listar,
    listarPorUsuario,
    buscar,
    atualizar,
    excluir } = require("../controllers/emprestimos.controller");

router.post("/cadastrar", verificarAutenticacao, cadastrar);
router.get("/listar", verificarAutenticacao, apenasAdm, listar);
router.get("/listar/usuario/:usuarioId", verificarAutenticacao, listarPorUsuario);
router.get("/buscar/:id", verificarAutenticacao, buscar);
router.put("/atualizar/:id", verificarAutenticacao, atualizar);
router.delete("/excluir/:id", verificarAutenticacao, apenasAdm, excluir);


module.exports = router;