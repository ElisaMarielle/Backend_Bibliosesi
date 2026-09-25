const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        const {usuarioId, livroId, data_emprestimo, data_devolucao} = req.body;
        if (!usuarioId || !livroId || !data_emprestimo || !data_devolucao) {
            return res.status(400).json({
                mensagem: "Todos os campos são obrigatórios."
            });
        }
        const usuario = await prisma.usuarios.findUnique({
            where: {
                id: Number(usuarioId)
            }
        });
        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }
        const livro = await prisma.livros.findUnique({
            where: {
                id: Number(livroId)
            }
        });
        if (!livro) {
            return res.status(404).json({
                mensagem: "Livro não encontrado."
            });
        }
        const agora = new Date();
        const emprestimoAtivo = await prisma.emprestimos.findFirst({
            where: {
                livroId: Number(livroId),
                data_devolucao: {
                    gt: agora
                }
            }
        });
        if (emprestimoAtivo) {
            return res.status(409).json({
                mensagem: "Este livro já está emprestado."
            });
        }
        const novoEmprestimo = await prisma.emprestimos.create({
            data: {
                usuarioId: Number(usuarioId),
                livroId: Number(livroId),
                data_emprestimo: new Date(data_emprestimo),
                data_devolucao: new Date(data_devolucao)
            },
            include: {
                livro: true,
                usuario: true
            }
        });
        return res.status(201).json(novoEmprestimo);
    } catch (error) {
        console.error("Erro ao cadastrar empréstimo:", error);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar empréstimo.",
            erro: error.message
        });
    }
};

// listar emprestimos
const listar = async (req, res) => {
    try {
        const emprestimos = await prisma.emprestimos.findMany({
            include: {
                livro: true,
                usuario: true
            },
            orderBy: {
                id: "desc"
            }
        });
        return res.status(200).json(emprestimos);
    } catch (error) {
        console.error("Erro ao listar empréstimos:", error);
        return res.status(500).json({
            mensagem: "Erro ao listar empréstimos.",
            erro: error.message
        });
    }
};

const buscar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({
                mensagem: "ID do empréstimo inválido."
            });
        }
        const emprestimo = await prisma.emprestimos.findUnique({
            where: {
                id: id
            },
            include: {
                livro: true,
                usuario: true
            }
        });
        if (!emprestimo) {
            return res.status(404).json({
                mensagem: "Empréstimo não encontrado."
            });
        }
        return res.status(200).json(emprestimo);
    } catch (error) {
        console.error("Erro ao buscar empréstimo:", error);
        return res.status(500).json({
            mensagem: "Erro ao buscar empréstimo.",
            erro: error.message
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({
                mensagem: "ID do empréstimo inválido."
            });
        }
        const dados = {};
        if (req.body.usuarioId !== undefined) {
            dados.usuarioId = Number(req.body.usuarioId);
        }
        if (req.body.livroId !== undefined) {
            dados.livroId = Number(req.body.livroId);
        }
        if (req.body.data_emprestimo !== undefined) {
            dados.data_emprestimo = new Date(req.body.data_emprestimo);
        }
        if (req.body.data_devolucao !== undefined) {
            dados.data_devolucao = new Date(req.body.data_devolucao);
        }
        const emprestimo = await prisma.emprestimos.update({
            where: {
                id: id
            },
            data: dados,
            include: {
                livro: true,
                usuario: true
            }
        });
        return res.status(200).json(emprestimo);
    } catch (error) {
        console.error("Erro ao atualizar empréstimo:", error);
        return res.status(500).json({
            mensagem: "Erro ao atualizar empréstimo.",
            erro: error.message
        });
    }
};

const excluir = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({
                mensagem: "ID do empréstimo inválido."
            });
        }
        await prisma.emprestimos.delete({
            where: {
                id: id
            }
        });
        return res.status(200).json({
            mensagem: "Empréstimo excluído com sucesso."
        });
    } catch (error) {
        console.error("Erro ao excluir empréstimo:", error);
        return res.status(500).json({
            mensagem: "Erro ao excluir empréstimo.",
            erro: error.message
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