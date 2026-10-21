const prisma = require("../data/prisma");
const bcrypt = require('bcrypt');

const cadastrar = async (req, res) => {
    const data = req.body;

    data.senha = await bcrypt.hash(data.senha, 10);

    const item = await prisma.usuarios.create({
        data
    });

    const { senha, ...usuario } = item;

    res.json(usuario).status(201).end();
};

const listar = async (req, res) => {
    const lista = await prisma.usuarios.findMany({
        select: { id: true, nome: true, email: true, rm: true, funcao: true, fotoPerfil: true }
    });

    return res.status(200).json(lista);
};

const buscar = async (req, res) => {
    const { id } = req.params;
    
    const item = await prisma.usuarios.findUnique({
        where: { id: Number(id) },
        select: {
            id: true, nome: true, email: true, rm: true, funcao: true,
            fotoPerfil: true
        }
    });

    if (!item) return res.status(404).json({ mensagem: "Usuário não encontrado." });
    return res.status(200).json(item);
};

const atualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: "ID do usuário inválido." });
        }

        const permitidos = ["nome", "email", "rm", "funcao", "fotoPerfil"];
        const data = Object.fromEntries(
            Object.entries(req.body || {}).filter(([chave]) => permitidos.includes(chave))
        );

        if (typeof data.fotoPerfil === "string" && data.fotoPerfil.length > 2_500_000) {
            return res.status(413).json({ mensagem: "A foto é muito grande. Escolha uma imagem menor." });
        }

        const item = await prisma.usuarios.update({
            where: { id },
            data,
            select: {
                id: true, nome: true, email: true, rm: true, funcao: true,
                fotoPerfil: true
            }
        });

        return res.status(200).json(item);
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({ mensagem: "Erro ao atualizar usuário." });
    }
};

const excluir = async (req, res) => {
    const { id } = req.params;
    
    const item = await prisma.usuarios.delete({
        where: { id : Number(id) }
    });

    res.json(item).status(200).end();
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
}
