const client = require('../../conexao'); // Importa a conexão com o PostgreSQL

async function selectAll() {
    try {
        const query = 'SELECT * FROM inf_users';  // Query para selecionar todos os registros
        const ret = await client.query(query);

        if (ret.rows.length > 0) {
            return ret.rows;  // Retorna todos os registros
        }
    } catch (error) {
        console.log(error);
    }
    return 0;  // Retorna 0 se nenhum registro encontrado
}

async function select(id) {
    try {
        const query = 'SELECT * FROM inf_users WHERE id_controle = $1'; // Query para filtrar por id_controle
        const values = [id];
        const ret = await client.query(query, values);

        if (ret.rows.length === 0) {
            return null;  // Retorna null se não encontrar registros
        }

        return ret.rows;  // Retorna os registros encontrados
    } catch (error) {
        console.log(error);
    }
    return null;  // Retorna null em caso de erro
}

async function selectUser(username) {
    try {
        const query = 'SELECT * FROM usuarios WHERE username = $1'; // Query para filtrar por id_controle
        const values = [username];
        const ret = await client.query(query, values);

        if (ret.rows.length === 0) {
            return null;  // Retorna null se não encontrar registros
        }

        return ret.rows;  // Retorna os registros encontrados
    } catch (error) {
        console.log(error);
    }
    return null;  // Retorna null em caso de erro
}

async function insert(email, nome, id_controle) {
    try {
        const query = 'INSERT INTO inf_users (email, nome, id_controle) VALUES ($1, $2, $3) RETURNING *';  // Query para inserir novo registro
        const values = [email, nome, id_controle];
        const ret = await client.query(query, values);

        return ret.rows[0];  // Retorna o registro inserido
    } catch (error) {
        console.log(error);
    }
    return null;  // Retorna null em caso de erro
}

async function update(id_controle, email, nome) {
    try {
        const query = 'UPDATE inf_users SET email = $1, nome = $2 WHERE id_controle = $3 RETURNING *'; // Query para atualizar registro
        const values = [email, nome, id_controle];
        const ret = await client.query(query, values);

        if (ret.rows.length > 0) {
            console.log("Update realizado com sucesso!");
            return ret.rows[0];  // Retorna o registro atualizado
        }
    } catch (error) {
        console.log(error);
    }
    return null;  // Retorna null em caso de erro
}

async function delet(id_controle) {
    try {
        const query = 'DELETE FROM inf_users WHERE id_controle = $1'; // Query para deletar registro
        const values = [id_controle];
        await client.query(query, values);
        console.log("Registro deletado com sucesso!");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { selectAll, select, selectUser, insert, update, delet };