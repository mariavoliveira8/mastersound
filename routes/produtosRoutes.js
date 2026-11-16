const express = require('express');
const router = express.Router();
const BD = require('../db');

// LISTAR PRODUTOS (READ)
router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query('SELECT * FROM produtos ORDER BY id ASC');

        res.render('produtos', {
            produtos: resultado.rows
        });
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro.message);
        res.status(500).send('Erro ao carregar produtos: ' + erro.message);
    }
});

// FORMULÁRIO NOVO PRODUTO
router.get('/novo', async (req, res) => {
    try {
        let categorias = [];
        try {
            const resCat = await BD.query('SELECT * FROM categorias ORDER BY nome ASC');
            categorias = resCat.rows;
        } catch (e) {}

        res.render('produtos-form', {
            produto: null,
            categorias
        });
    } catch (erro) {
        console.error('Erro ao abrir formulário:', erro.message);
        res.status(500).send('Erro ao abrir formulário');
    }
});

// SALVAR NOVO PRODUTO (CREATE)
router.post('/novo', async (req, res) => {
    try {
        const { nome, descricao, modelo, marca, preco, fk_categoria, tipos, imagem } = req.body;

        await BD.query(
            `INSERT INTO produtos (nome, descricao, modelo, marca, preco, fk_categoria, tipos, imagem)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                nome,
                descricao,
                modelo,
                marca,
                preco || 0,
                fk_categoria || null,
                tipos,
                imagem || 'IMG/uploud/logoms.png'
            ]
        );

        res.redirect('/produtos');
    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro.message);
        res.status(500).send('Erro ao cadastrar produto: ' + erro.message);
    }
});

// FORMULÁRIO EDITAR PRODUTO
router.get('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await BD.query('SELECT * FROM produtos WHERE id = $1', [id]);

        let categorias = [];
        try {
            const resCat = await BD.query('SELECT * FROM categorias ORDER BY nome ASC');
            categorias = resCat.rows;
        } catch (e) {}

        res.render('produtos-form', {
            produto: resultado.rows[0],
            categorias
        });
    } catch (erro) {
        console.error('Erro ao buscar produto:', erro.message);
        res.status(500).send('Erro ao buscar produto');
    }
});

// ATUALIZAR PRODUTO (UPDATE)
router.post('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, descricao, modelo, marca, preco, fk_categoria, tipos, imagem } = req.body;

        await BD.query(
            `UPDATE produtos
             SET nome = $1, descricao = $2, modelo = $3, marca = $4, preco = $5, fk_categoria = $6, tipos = $7, imagem = $8
             WHERE id = $9`,
            [
                nome,
                descricao,
                modelo,
                marca,
                preco || 0,
                fk_categoria || null,
                tipos,
                imagem,
                id
            ]
        );

        res.redirect('/produtos');
    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro.message);
        res.status(500).send('Erro ao atualizar produto: ' + erro.message);
    }
});

// EXCLUIR PRODUTO (DELETE)
router.post('/excluir/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await BD.query('DELETE FROM produtos WHERE id = $1', [id]);
        res.redirect('/produtos');
    } catch (erro) {
        console.error('Erro ao excluir produto:', erro.message);
        res.status(500).send('Erro ao excluir produto: ' + erro.message);
    }
});

module.exports = router;