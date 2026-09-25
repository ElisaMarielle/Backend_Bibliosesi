const express = require("express");

const router = express.Router();

const {
    cadastrar,
    listar,
    listarPorUsuario,
    buscar,
    atualizar,
    excluir } = require("../controllers/emprestimos.controller");

router.post("/cadastrar", cadastrar);
router.get("/listar", listar);
router.get("/listar/usuario/:usuarioId", listarPorUsuario);
router.get("/buscar/:id", buscar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id",excluir);


module.exports = router;