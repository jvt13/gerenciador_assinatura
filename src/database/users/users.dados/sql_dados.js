const client = require('../../conexao'); // Importa a conexão com o PostgreSQL
const tab_users = require('../table'); // Supondo que este arquivo contenha informações sobre as tabelas

async function selectAll() {
    try {
        const query = 'SELECT * FROM acessos'; // Query para selecionar todos os registros da tabela acessos
        const ret = await client.query(query);

        if (ret.rows.length > 0) {
            return ret.rows; // Retorna todos os registros encontrados
        }
    } catch (error) {
        console.log(error); // Registra o erro
    }
    return 0; // Retorna 0 se não encontrar registros
}

async function select(id) {
    try {
        const filter = id; // id a ser filtrado
        const query = 'SELECT * FROM acessos WHERE id_controle = $1'; // Query para buscar registro na tabela acessos
        const ret = await client.query(query, [filter]);

        if (ret.rows.length === 0) {
            return null; // Retorna null se não encontrar o registro
        }
        return ret.rows; // Retorna o registro encontrado
    } catch (error) {
        console.log(error); // Registra o erro
    }
    return null; // Retorna null em caso de erro
}

async function insert(id_controle, dta, hora, tipo_arquivo, dataURL) {
    try {
        const query = 'INSERT INTO acessos (id_controle, data, hora, tipo_arquivo, arquivo) VALUES ($1, $2, $3, $4, $5) RETURNING *'; // Query para inserir novo registro na tabela acessos
        const values = [id_controle, dta, hora, tipo_arquivo, dataURL];
        const ret = await client.query(query, values);

        return ret.rows[0]; // Retorna o registro inserido
    } catch (error) {
        console.log(error); // Registra o erro
    }
    return null; // Retorna null em caso de erro
}

async function update(id) {
    try {
        const dta = new Date(); // Exemplo de como obter a data atual
        const filter = id; // id a ser filtrado
        const query = 'UPDATE acessos SET data = $1 WHERE id_controle = $2 RETURNING *'; // Query para atualizar registro na tabela acessos
        const values = [dta, filter];
        const ret = await client.query(query, values);

        if (ret.rows.length > 0) {
            console.log("Update realizado com sucesso!");
            return ret.rows[0]; // Retorna o registro atualizado
        }
    } catch (error) {
        console.log(error); // Registra o erro
    }
    return null; // Retorna null em caso de erro
}

async function delet(id) {
    try {
        const query = 'DELETE FROM acessos WHERE id_controle = $1'; // Query para deletar registro da tabela acessos
        const values = [id];
        await client.query(query, values);
        console.log("Registro deletado com sucesso!");
    } catch (error) {
        console.log(error); // Registra o erro
    }
}

module.exports = { selectAll, select, insert, update, delet };