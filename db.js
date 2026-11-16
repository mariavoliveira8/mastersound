const { Pool } = require('pg');

const BD = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'master_sound',
    password: 'admin',
    port: 5432,
});

module.exports = BD;