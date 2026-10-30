const prisma = require("../data/prisma");
const DIAS_PRAZO = 14;
const incluir = { livro: true, usuario: { select: { id: true, nome: true, email: true, rm: true, funcao: true } } };

const cadastrar = async (req, res) => {
    try {
        const usuarioId = Number(req.body.usuarioId);
        const livroId = Number(req.body.livroId);

        if (!usuarioId || !livroId) {
            return res.status(400).json({
                mensagem: "Usuário e livro são obrigatórios."
            });
        }

        const usuario = await prisma.usuarios.findUnique({
            where: { id: usuarioId }
        });

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        const livro = await prisma.livros.findUnique({
            where: { id: livroId }
        });

        if (!livro) {
            return res.status(404).json({
                mensagem: "Livro não encontrado."
            });
        }

        const inicio = new Date();
        const prazo = new Date(inicio);
        prazo.setDate(prazo.getDate() + DIAS_PRAZO);

        const emprestimo = await prisma.emprestimos.create({
            data: {
                usuarioId,
                livroId,
                data_emprestimo: inicio,
                data_devolucao: prazo,
                devolvido: false
            },
            include: incluir
        });

        return res.status(201).json(emprestimo);

    } catch (error) {
        console.error("Erro ao cadastrar empréstimo:", error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar empréstimo.",
            erro: error.message
        });
    }
};


// LISTAR TODOS OS EMPRÉSTIMOS
const listar = async (req, res) => {
    try {
        const emprestimos = await prisma.emprestimos.findMany({
            include: {
                livro: true,
                usuario: true
            },
            orderBy: {
                data_emprestimo: "desc"
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
        const atual = await prisma.emprestimos.findUnique({ where: { id } });
        if (!atual) return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        if (req.usuario.funcao !== "ADM" && atual.usuarioId !== req.usuario.id)
            return res.status(403).json({ mensagem: "Acesso não autorizado." });

        const dados = {};
        // Somente ADM pode alterar o prazo; o aluno pode apenas registrar a devolução.
        if (req.body.data_devolucao !== undefined && req.usuario.funcao === "ADM") {
            const data = new Date(req.body.data_devolucao);
            if (Number.isNaN(data.getTime())) return res.status(400).json({ mensagem: "Data de devolução inválida." });
            dados.data_devolucao = data;
        }
        if (req.body.data_devolucao !== undefined && req.usuario.funcao !== "ADM") {
            return res.status(403).json({ mensagem: "Somente um administrador pode alterar o prazo." });
        }
        // Apenas o ADM pode alterar usuário/livro ou reabrir um empréstimo.
        if (req.usuario.funcao === "ADM") {
            if (req.body.usuarioId !== undefined) dados.usuarioId = Number(req.body.usuarioId);
            if (req.body.livroId !== undefined) dados.livroId = Number(req.body.livroId);
            if (req.body.data_emprestimo !== undefined) dados.data_emprestimo = new Date(req.body.data_emprestimo);
            if (req.body.devolvido !== undefined) dados.devolvido = Boolean(req.body.devolvido);
        }
        if (req.body.devolvido === true) dados.devolvido = true;

        const emprestimo = await prisma.emprestimos.update({ where: { id }, data: dados, include: incluir });
        return res.status(200).json(emprestimo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao atualizar empréstimo.", erro: error.message });
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


const listarPorUsuario = async (req, res) => {
    try {
        const usuarioId = Number(req.params.usuarioId);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            return res.status(400).json({
                mensagem: "ID do usuário inválido."
            });
        }

        const emprestimos = await prisma.emprestimos.findMany({
            where: {
                usuarioId: usuarioId
            },
            include: {
                livro: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        rm: true,
                        funcao: true
                    }
                }
            },
            orderBy: {
                data_emprestimo: "desc"
            }
        });

        return res.status(200).json(emprestimos);

    } catch (error) {
        console.error("Erro ao listar empréstimos do usuário:", error);

        return res.status(500).json({
            mensagem: "Erro ao listar empréstimos.",
            erro: error.message
        });
    }
};


module.exports = {
    cadastrar,
    listar,
    listarPorUsuario,
    buscar,
    atualizar,
    excluir
};