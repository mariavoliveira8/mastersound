const DB = require("./db");

async function testeConexao(){
    try {  
        const resultado = await DB.query(
            'select now()');

        console.log('conexão bem sucedida!!');
        console.log(resultado.rows);
      }
    catch (erro){   
        console.log('erro ao conectar:',
            erro.message);
     }
    finally {  
        await DB.end();
      }

}
testeConexao();
