const express = require('express');
const router = express.Router();
const BD = require('../db');

// LISTAR USUÁRIOS (READ)
router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query('SELECT * FROM usuarios ORDER BY id ASC');
        res.render('usuarios', { usuarios: resultado.rows });
    } catch (erro) {
        console.error('Erro ao listar usuários:', erro);
        res.status(500).send('Erro ao carregar usuários.');
    }
});

// FORMULÁRIO NOVO USUÁRIO
router.get('/novo', (req, res) => {
    res.render('usuarios-form', { usuario: null });
});

// SALVAR NOVO USUÁRIO (CREATE)
router.post('/novo', async (req, res) => {
    try {
        const { nome, email, cpf, data_nascimento, senha } = req.body;
        await BD.query(
            'INSERT INTO usuarios (nome, email, cpf, data_nascimento, senha) VALUES ($1, $2, $3, $4, $5)',
            [nome, email, cpf, data_nascimento, senha]
        );
        res.redirect('/usuarios');
    } catch (erro) {
        console.error('Erro ao cadastrar usuário:', erro);
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

// FORMULÁRIO EDITAR USUÁRIO
router.get('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await BD.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        res.render('usuarios-form', { usuario: resultado.rows[0] });
    } catch (erro) {
        console.error('Erro ao buscar usuário:', erro);
        res.status(500).send('Erro ao carregar usuário.');
    }
});

// ATUALIZAR USUÁRIO (UPDATE)
router.post('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, email, cpf, data_nascimento, senha } = req.body;
        await BD.query(
            'UPDATE usuarios SET nome = $1, email = $2, cpf = $3, data_nascimento = $4, senha = $5 WHERE id = $6',
            [nome, email, cpf, data_nascimento, senha, id]
        );
        res.redirect('/usuarios');
    } catch (erro) {
        console.error('Erro ao atualizar usuário:', erro);
        res.status(500).send('Erro ao atualizar usuário.');
    }
});

// EXCLUIR USUÁRIO (DELETE)
router.post('/excluir/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await BD.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.redirect('/usuarios');
    } catch (erro) {
        console.error('Erro ao excluir usuário:', erro);
        res.status(500).send('Erro ao excluir usuário.');
    }
});

module.exports = router;