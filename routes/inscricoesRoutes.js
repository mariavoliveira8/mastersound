const express = require('express');
const router = express.Router();
const DB = require('../db');

router.get('/', async (req, res) => {

    try {

        const resultado = await BD.query(`
            select
                i.id,
                i.data_inscricao,
                i.status,
                i.presente,
                p.nome as particpante,
                e.titulo as evento
            from inscricoes i
            inner join participantes p
            on i.participante_id = p.id
            inner join eventos e
            on i.evento_id = e.id
            order by i.id;`);

        res.render('incricoes/index',
            { inscricoes: resultado.rows }
        );

    } catch (erro) {
        console.log('Erro: ' + erro)
    }
});

//CREATE
router.get('/novo', async (req, res) => {

    try {

            const participantes = await BD. query(`
                    select * from participantes
                    order by nome
                `);

            const eventos = await BD. query(`
                    select * from eventos
                    order by titulo`);

            res.render('incricoes/novo',
                {participantes: participantes,
                eventos: eventos
                }
            );

    } catch (erro) {
        console.log('Erro: ' + erro)
    }
});

 router.post('/novo', async (req, res) => {
    const {
        participante_id,
        evento_id,
        status
    } = req.body;
   
    await BD.query(`
        inset into inscricoes
        (
        participante_id,
        evento_id,
        status
        )values ($1, $2, $3)
        `,
    [participante_id,
        evento_id,
        status
    ])

    res.redirect('/inscricao');
});
module.exports = router;

/*
router.xxxx('', async (req, res) => {
    try {
       
    } catch (erro) {
        console.log('Erro: ' + erro)
    }
});

*/

module.exports = router;