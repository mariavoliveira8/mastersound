const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3005;

// Conexão com o PostgreSQL
const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'master_sound',
    password: 'admin',
    port: 5432,
});

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));

// Importar rotas do painel administrativo
const produtosRoutes = require('./routes/produtosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

app.use('/produtos', produtosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/usuarios', usuariosRoutes);

// Rota Principal (Landing Page)
app.get('/', async (req, res) => {
    try {
        let produtos = [];
        try {
            const resultado = await db.query('SELECT * FROM produtos ORDER BY id ASC');
            produtos = resultado.rows;
        } catch (dbErr) {
            console.log('Usando produtos padrão (banco vazio ou sem conexão)');
        }

        res.render('landing/index', { produtos });
    } catch (err) {
        console.error('Erro ao renderizar Views/landing/index.ejs:', err);
        res.status(500).send('Erro interno ao carregar a view');
    }
});

// Rota da API de Produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM produtos ORDER BY id ASC');
        res.json(resultado.rows);
    } catch (err) {
        console.error('Erro no PostgreSQL:', err.message);
        res.json([]);
    }
});

// ==========================================
// ROTAS DA ÁREA ADMINISTRATIVA (LOGIN)
// ==========================================

// Abrir tela de login (/admin ou /login)
app.get(['/admin', '/login'], (req, res) => {
    res.render('login', { erro: null });
});

// Validar e-mail e senha no PostgreSQL
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const resultado = await db.query(
            'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
            [email, senha]
        );

        if (resultado.rows.length > 0) {
            const nomeUsuario = encodeURIComponent(resultado.rows[0].nome);
            res.redirect(`/dashboard?nome=${nomeUsuario}`);
        } else {
            res.render('login', { erro: 'E-mail ou senha inválidos!' });
        }
    } catch (err) {
        console.error('Erro ao realizar login:', err.message);
        res.render('login', { erro: 'Erro ao conectar com o banco de dados.' });
    }
});

// Rota do Dashboard após o login
app.get('/dashboard', async (req, res) => {
    try {
        const nome = req.query.nome || 'Administrador';

        let produtos = [];
        let totalCategorias = 0;
        let totalUsuarios = 1;

        try {
            const resProd = await db.query('SELECT * FROM produtos ORDER BY id DESC');
            produtos = resProd.rows;
        } catch (e) {
            console.log('Tabela produtos ainda vazia ou não consultada');
        }

        try {
            const resCat = await db.query('SELECT COUNT(*) FROM categorias');
            totalCategorias = resCat.rows[0].count;
        } catch (e) {
            console.log('Tabela categorias ainda vazia ou não consultada');
        }

        try {
            const resUsers = await db.query('SELECT COUNT(*) FROM usuarios');
            totalUsuarios = resUsers.rows[0].count;
        } catch (e) {
            console.log('Usando contagem padrão de usuários');
        }

        res.render('dashboard', {
            usuario: { nome },
            produtos,
            totalProdutos: produtos.length,
            totalCategorias,
            totalUsuarios
        });
    } catch (err) {
        console.error('Erro ao carregar dashboard:', err.message);
        res.status(500).send('Erro ao carregar o dashboard');
    }
});

// Iniciar Servidor
const server = app.listen(port, () => {
    console.log(`==================================================`);
    console.log(` SERVIDOR ATIVO E RODANDO EM: http://localhost:${port}`);
    console.log(`==================================================`);
});

server.on('error', (err) => {
    console.error('ERRO NO SERVIDOR:', err.message);
});