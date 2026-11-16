const express = require('express');
const router = express.Router();
const BD = require('../db');

//read - leitura
router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query(
            `select 
                e.*,
                c.nome as categoria_nome,
                u.nome as organizador_nome
             from eventos e
             inner join categorias c on e.categoria_id = c.id
             inner join usuarios u on e.organizador_id = u.id
             order by e.id asc`
        );

        res.render('eventos/index', {
            eventos: resultado.rows
        });
    }
    catch (erro) {
        console.log('erro: ' + erro);
    }
});

//create
router.get('/novo', async (req, res) => {
    try {
        const categorias = await BD.query('select id, nome from categorias');
        const usuarios = await BD.query('select id, nome from usuarios');

        res.render('eventos/novo', {
            categorias: categorias.rows,
            usuarios: usuarios.rows
        });
    }
    catch (erro) {
        console.log('erro: ' + erro);
    }
});

router.post('/novo', async (req, res) => {
    try {
        const { 
            titulo, 
            descricao, 
            data_evento, 
            horario, 
            local, 
            quantidade_vagas, 
            imagem_url, 
            categoria_id, 
            organizador_id 
        } = req.body;
        
        await BD.query(
            `insert into eventos 
            (titulo, descricao, data_evento, horario, local, quantidade_vagas, imagem_url, categoria_id, organizador_id) 
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [titulo, descricao, data_evento, horario, local, quantidade_vagas, imagem_url, categoria_id, organizador_id]
        );

        res.redirect('/eventos');
    }
    catch (erro) {
        console.log('erro: ' + erro);
    }
});

//update
router.get('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await BD.query(
            `select * from eventos where id = $1`, 
            [id]
        );
        const categorias = await BD.query('select id, nome from categorias');
        const usuarios = await BD.query('select id, nome from usuarios');

        res.render('eventos/editar', {
            evento: resultado.rows[0],
            categorias: categorias.rows,
            usuarios: usuarios.rows
        });
    } catch (erro) {
        console.log('erro: ' + erro);
    }
});

router.post('/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { 
            titulo, 
            descricao, 
            data_evento, 
            horario, 
            local, 
            quantidade_vagas, 
            imagem_url, 
            categoria_id, 
            organizador_id 
        } = req.body;

        await BD.query(
            `update eventos set 
                titulo = $1, 
                descricao = $2, 
                data_evento = $3, 
                horario = $4, 
                local = $5, 
                quantidade_vagas = $6, 
                imagem_url = $7, 
                categoria_id = $8, 
                organizador_id = $9 
             where id = $10`,
            [titulo, descricao, data_evento, horario, local, quantidade_vagas, imagem_url, categoria_id, organizador_id, id]
        );

        res.redirect('/eventos');
    } catch (erro) {
        console.log('erro: ' + erro);
    }
});

//delete
router.post('/excluir/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await BD.query(
            `delete from eventos where id = $1`,
            [id]
        );

        res.redirect('/eventos');
    } catch (erro) {
        console.log('erro: ' + erro);
    }
});

module.exports = router;