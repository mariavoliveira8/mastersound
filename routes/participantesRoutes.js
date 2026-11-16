const express = require('express');
const router = express.Router();
const BD = require('../db'); // Ajuste o caminho do seu arquivo de banco de dados se necessário

// READ - Leitura / Listagem
router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query(
            'select * from participantes order by id asc'
        );

        res.render('participantes/index', {
            participantes: resultado.rows
        });
    } catch (erro) {
        console.log('erro: ' + erro);
        res.status(500).send("Erro ao buscar participantes.");
    }
});

// CREATE - Formulário de cadastro
router.get('/novo', (req, res) => {
    try {
        res.render('participantes/novo');
    } catch (erro) {
        console.log('erro: ' + erro);
    }
});

// CREATE - Salvar novo participante
router.post('/novo', async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        await BD.query(
            `insert into participantes (nome, email, telefone) values ($1, $2, $3)`,
            [nome, email, telefone]
        );

        res.redirect('/participantes');
    } catch (erro) {
        console.log('erro: ' + erro);
        res.status(500).send("Erro ao cadastrar participante.");
    }
});

// UPDATE - Formulário de edição
router.get('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await BD.query(
            `select * from participantes where id = $1`,
            [id]
        );

        res.render('participantes/editar', {
            participante: resultado.rows[0]
        });
    } catch (erro) {
        console.log('erro: ' + erro);
        res.status(500).send("Erro ao carregar participante.");
    }
});

// UPDATE - Salvar alterações
router.post('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, email, telefone } = req.body;

        await BD.query(
            `update participantes set nome = $1, email = $2, telefone = $3 where id = $4`,
            [nome, email, telefone, id]
        );

        res.redirect('/participantes');
    } catch (erro) {
        console.error(erro);
        res.status(500).send("Erro ao atualizar participante.");
    }
});

// DELETE - Excluir participante
router.post('/excluir/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await BD.query(
            `delete from participantes where id = $1`,
            [id]
        );

        res.redirect('/participantes');
    } catch (erro) {
        console.log('erro: ' + erro);
        res.status(500).send("Erro ao excluir participante.");
    }
});

module.exports = router;