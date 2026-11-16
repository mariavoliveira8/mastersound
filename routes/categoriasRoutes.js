const express = require('express');
const router = express.Router();
const BD = require('../db');

// LISTAR CATEGORIAS (READ)
router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query('SELECT * FROM categorias ORDER BY id ASC');
        res.render('categorias', { categorias: resultado.rows });
    } catch (erro) {
        console.error('Erro ao listar categorias:', erro);
        res.status(500).send('Erro ao carregar categorias.');
    }
});

// FORMULÁRIO NOVA CATEGORIA
router.get('/novo', (req, res) => {
    res.render('categorias-form', { categoria: null });
});

// SALVAR NOVA CATEGORIA (CREATE)
router.post('/novo', async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        await BD.query(
            'INSERT INTO categorias (nome, descricao) VALUES ($1, $2)',
            [nome, descricao]
        );
        res.redirect('/categorias');
    } catch (erro) {
        console.error('Erro ao cadastrar categoria:', erro);
        res.status(500).send('Erro ao cadastrar categoria.');
    }
});

// FORMULÁRIO EDITAR CATEGORIA
router.get('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await BD.query('SELECT * FROM categorias WHERE id = $1', [id]);
        res.render('categorias-form', { categoria: resultado.rows[0] });
    } catch (erro) {
        console.error('Erro ao buscar categoria:', erro);
        res.status(500).send('Erro ao carregar categoria.');
    }
});

// ATUALIZAR CATEGORIA (UPDATE)
router.post('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, descricao } = req.body;
        await BD.query(
            'UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3',
            [nome, descricao, id]
        );
        res.redirect('/categorias');
    } catch (erro) {
        console.error('Erro ao atualizar categoria:', erro);
        res.status(500).send('Erro ao atualizar a categoria.');
    }
});

// EXCLUIR CATEGORIA (DELETE)
router.post('/excluir/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await BD.query('DELETE FROM categorias WHERE id = $1', [id]);
        res.redirect('/categorias');
    } catch (erro) {
        console.error('Erro ao excluir categoria:', erro);
        res.status(500).send('Erro ao excluir categoria.');
    }
});

module.exports = router;