const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const item = await prisma.livros.create({
            data
        });
        return res.status(201).json(item);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar livro"
        });
    }
};

const listar = async (req, res) => {
    try {
        const lista = await prisma.livros.findMany({
            include: {
                emprestimos: true
            }
        });
        return res.status(200).json(lista);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao listar livros"
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.livros.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                emprestimos: true
            }
        });
        if (!item) {
            return res.status(404).json({
                mensagem: "Livro não encontrado"
            });
        }
        return res.status(200).json(item);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao buscar livro"
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;
        const item = await prisma.livros.update({
            where: {
                id: Number(id)
            },
            data: dados
        });
        return res.status(200).json(item);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao atualizar livro"
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.livros.delete({
            where: {
                id: Number(id)
            }
        });
        return res.status(200).json(item);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao excluir livro"
        });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};