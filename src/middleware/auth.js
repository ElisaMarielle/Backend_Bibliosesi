const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../data/prisma');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Procura o usuário pelo email
        const usuario = await prisma.usuarios.findUnique({
            where: {
                email: email
            }
        });

        // Se não encontrou
        if (!usuario) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos'
            });
        }

        // Compara a senha digitada com o hash do banco
        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        // Se a senha estiver errada
        if (!senhaValida) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                funcao: usuario.funcao
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            token: token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
});


function verificarAutenticacao(req, res, next) {
    const authHeader = req.headers.authorization;

    // Verifica se o token foi enviado
    if (!authHeader) {
        return res.status(401).json({
            mensagem: 'Faça login para acessar esta rota.'
        });
    }

    // Separa "Bearer" do token
    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            mensagem: 'Token não informado corretamente.'
        });
    }

    // Verifica se o token é válido
    jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
        if (erro) {
            return res.status(401).json({
                mensagem: 'Token inválido ou expirado. Faça login novamente.'
            });
        }

        // Disponibiliza os dados do usuário nas rotas protegidas
        req.usuario = usuario;

        next();
    });
}


module.exports = router;
module.exports.verificarAutenticacao = verificarAutenticacao;