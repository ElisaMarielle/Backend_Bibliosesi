const express = require("express");
const { verificarAutenticacao, apenasAdm} = require('../middleware/auth')

const router = express.Router();

const { 
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir } = require("../controllers/usuarios.controller");

router.post("/cadastrar", cadastrar);
router.get("/listar", verificarAutenticacao, apenasAdm, listar);
router.get("/buscar/:id", buscar);
router.put("/atualizar/:id", verificarAutenticacao, atualizar);
router.delete("/excluir/:id", verificarAutenticacao, apenasAdm, excluir);

module.exports = router;
