const client = require('../../conexao'); // Importa a conexão com o PostgreSQL
const tab_users = require('./table'); // Supondo que este arquivo contenha informações sobre a tabela

async function select() {
    try {
        const query = 'SELECT * FROM inf_users'; // Query para selecionar todos os registros da tabela inf_users
        const ret = await client.query(query);

        if (ret.rows.length > 0) {
            return ret.rows; // Retorna todos os registros encontrados
        }
    } catch (error) {
        console.log(error); // Registra o erro
    }
    return 0; // Retorna 0 se não encontrar registros
}

async function insert(user, pass, id_controle) {
    try {
        const query = 'INSERT INTO users (user, pass, id_controle) VALUES ($1, $2, $3) RETURNING *'; // Query para inserir novo registro na tabela users
        const values = [user, pass, id_controle];
        const ret = await client.query(query, values);

        return ret.rows[0]; // Retorna o registro inserido
    } catch (error) {
        console.log(error); // Registra o erro
    }
    return null; // Retorna null em caso de erro
}

async function update(id) {
    try {
        const query = 'UPDATE users SET user = $1, pass = $2 WHERE id_controle = $3 RETURNING *'; // Query para atualizar registro na tabela users
        const values = ['novo_user', 'nova_senha', id]; // Substitua 'novo_user' e 'nova_senha' pelos valores adequados
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
        const query = 'DELETE FROM users WHERE id_controle = $1'; // Query para deletar registro da tabela users
        const values = [id];
        await client.query(query, values);
        console.log("Registro deletado com sucesso!");
    } catch (error) {
        console.log(error); // Registra o erro
    }
}

module.exports = { select, insert, update, delet };
