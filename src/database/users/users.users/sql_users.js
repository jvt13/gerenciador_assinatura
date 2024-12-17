const pool = require('../../conexao');  // Certifique-se de que o caminho está correto

// Função para selecionar todos os registros
async function selectAll() {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = 'SELECT * FROM usuarios';
        const ret = await client.query(query); // Usa 'client.query'

        if (ret.rows.length > 0) {
            return ret.rows;  // Retorna todos os registros
        }
    } catch (error) {
        console.log("Erro ao selecionar todos os registros:", error);
    } finally {
        client.release(); // Libera a conexão
    }
    return 0;
}

// Função para selecionar um registro por id
async function select(id) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = 'SELECT * FROM usuarios WHERE id_controle = $1';
        const values = [id];
        const ret = await client.query(query, values); // Usa 'client.query'

        if (ret.rows.length > 0) {
            return ret.rows[0];  // Retorna o registro encontrado
        }
    } catch (error) {
        console.log("Erro ao selecionar o registro:", error);
    } finally {
        client.release(); // Libera a conexão
    }
    return 0;
}

// Função para inserir um novo registro
async function insert(nome_completo, username, email, salt, hash, telefone, data_nascimento, cpf, endereco, user_agent) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = `
            INSERT INTO usuarios 
            (nome_completo, username, email, salt, hash, telefone, data_nascimento, cpf, endereco, user_agent) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`;
        const values = [nome_completo, username, email, salt, hash, telefone, data_nascimento, cpf, endereco, user_agent];
        const ret = await client.query(query, values); // Usa 'client.query'

        if (ret.rows.length > 0) {
            console.log("Usuário inserido com sucesso:", ret.rows[0]);
            return ret.rows[0]; // Retorna o registro do usuário inserido
        }
    } catch (error) {
        console.error("Erro ao inserir usuário:", error);
        return null; // Retorna null em caso de erro
    } finally {
        client.release(); // Libera a conexão
    }
}

// Função para atualizar um registro
async function update(id, newUser, newPass) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = 'UPDATE usuarios SET "user_" = $1, pass = $2 WHERE id = $3 RETURNING *';
        const values = [newUser, newPass, id];
        const ret = await client.query(query, values); // Usa 'client.query'

        if (ret.rows.length > 0) {
            console.log("Update realizado com sucesso!");
            return ret.rows[0]; // Retorna o registro atualizado
        }
    } catch (error) {
        console.log("Erro ao atualizar o registro:", error);
    } finally {
        client.release(); // Libera a conexão
    }
    return 0;
}

async function updateAcesso(id, user_agent) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = 'UPDATE usuarios SET "user_agent" = $2, "ultimo_login" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
        const values = [id, user_agent];
        const ret = await client.query(query, values); // Usa 'client.query'

        if (ret.rows.length > 0) {
            console.log("Update realizado com sucesso!");
            return ret.rows[0]; // Retorna o registro atualizado
        }
    } catch (error) {
        console.log("Erro ao atualizar o registro:", error);
    } finally {
        client.release(); // Libera a conexão
    }
    return 0;
}
// Função para deletar um registro
async function delet(id) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = 'DELETE FROM usuarios WHERE id = $1';
        const values = [id];
        await client.query(query, values); // Usa 'client.query'
        console.log("Registro deletado com sucesso!");
    } catch (error) {
        console.log("Erro ao deletar o registro:", error);
    } finally {
        client.release(); // Libera a conexão
    }
}

module.exports = { selectAll, select, insert, update, delet, updateAcesso};
