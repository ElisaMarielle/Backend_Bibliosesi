
const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        const { usuarioId, livroId, comentario, nota } = req.body;

        if (!usuarioId || !livroId || typeof comentario !== "string" || !comentario.trim()) {
            return res.status(400).json({
                mensagem: "Usuário, livro e comentário são obrigatórios."
            });
        }

        const usuario = await prisma.usuarios.findUnique({
            where: { id: Number(usuarioId) }
        });

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        const livro = await prisma.livros.findUnique({
            where: { id: Number(livroId) }
        });

        if (!livro) {
            return res.status(404).json({
                mensagem: "Livro não encontrado."
            });
        }

        const feedback = await prisma.feedbacks.create({
            data: {
                comentario: comentario.trim(),
                nota: Number.isInteger(Number(nota)) && Number(nota) >= 1 && Number(nota) <= 5
                    ? Number(nota)
                    : null,
                data: new Date(),
                usuarioId: Number(usuarioId),
                livroId: Number(livroId)
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        fotoPerfil: true
                    }
                }
            }
        });

        return res.status(201).json(feedback);

    } catch (error) {
        console.error("Erro ao cadastrar feedback:", error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar feedback."
        });
    }
};

const listar = async (req, res) => {
    try {
        const filtro = {};

        if (req.query.livroId) {
            const livroId = Number(req.query.livroId);

            if (!Number.isInteger(livroId) || livroId <= 0) {
                return res.status(400).json({
                    mensagem: "ID do livro inválido."
                });
            }

            filtro.livroId = livroId;
        }

        const lista = await prisma.feedbacks.findMany({
            where: filtro,
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        fotoPerfil: true
                    }
                }
            },
            orderBy: {
                data: "desc"
            }
        });

        return res.status(200).json(lista);

    } catch (error) {
        console.error("Erro ao listar feedbacks:", error);

        return res.status(500).json({
            mensagem: "Erro ao listar feedbacks."
        });
    }
};

const buscar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const feedback = await prisma.feedbacks.findUnique({
            where: { id },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        fotoPerfil: true
                    }
                }
            }
        });

        if (!feedback) {
            return res.status(404).json({
                mensagem: "Feedback não encontrado."
            });
        }

        return res.status(200).json(feedback);

    } catch (error) {
        console.error("Erro ao buscar feedback:", error);

        return res.status(500).json({
            mensagem: "Erro ao buscar feedback."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { comentario } = req.body;

        if (!comentario || !comentario.trim()) {
            return res.status(400).json({
                mensagem: "O comentário não pode ficar vazio."
            });
        }

        const feedback = await prisma.feedbacks.update({
            where: { id: Number(id) },
            data: {
                comentario: comentario.trim()
            }
        });

        return res.status(200).json(feedback);

    } catch (error) {
        console.error("Erro ao atualizar feedback:", error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar feedback."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const feedback = await prisma.feedbacks.delete({
            where: { id: Number(req.params.id) }
        });

        return res.status(200).json(feedback);

    } catch (error) {
        console.error("Erro ao excluir feedback:", error);

        return res.status(500).json({
            mensagem: "Erro ao excluir feedback."
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
