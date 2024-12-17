const pool = require('../conexao'); // Importa o pool de conexões com o PostgreSQL

// Função para selecionar todos os registros
async function selectAll() {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = `SELECT *, TO_CHAR(data_envio, 'DD/MM/YYYY HH24:MI:SS') as data_envio FROM documentos`; 
        const ret = await client.query(query); // Usa 'client.query'

        if (ret.rows.length > 0) {
            return ret.rows; // Retorna todos os registros encontrados
        }
    } catch (error) {
        console.log(error);
    } finally {
        client.release(); // Libera a conexão
    }
    return 0; // Retorna 0 se não encontrar registros
}

// Função para selecionar registros por ID
async function select(id) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = `
            SELECT id, usuario_id, nome_arquivo, caminho_arquivo, tipo_mime, tamanho, 
            TO_CHAR(data_envio, 'DD/MM/YYYY HH24:MI:SS') as data_envio, status 
            FROM documentos 
            WHERE usuario_id = $1
        `;
        const values = [id];
        const resultado = await client.query(query, values); // Usa 'client.query'

        if (resultado.rows.length > 0) {
            return resultado.rows; // Retorna o(s) registro(s) encontrado(s)
        } else {
            return []; // Retorna uma lista vazia se não encontrar registros
        }
    } catch (error) {
        throw error; // Lança erro em caso de falha
    } finally {
        client.release(); // Libera a conexão
    }
}

// Função para inserir um novo registro
async function insert(usuario_id, nome_arquivo, caminho_arquivo, tipo_mime, tamanho, data, data_url) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = `
            INSERT INTO documentos (usuario_id, nome_arquivo, caminho_arquivo, tipo_mime, tamanho, data_envio, dataurl) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`;
        const values = [usuario_id, nome_arquivo, caminho_arquivo, tipo_mime, tamanho, data, data_url];
        const ret = await client.query(query, values); // Usa 'client.query'

        return true; // Indica sucesso
    } catch (error) {
        console.log(error); // Registra o erro
        return false; // Retorna false em caso de erro
    } finally {
        client.release(); // Libera a conexão
    }
}

// Função para atualizar um registro
async function update(id, usuario_id, nome_arquivo, caminho_arquivo, tipo_mime, tamanho, status) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = `
            UPDATE documentos 
            SET usuario_id = $1, nome_arquivo = $2, caminho_arquivo = $3, tipo_mime = $4, tamanho = $5, status = $6 
            WHERE id = $7 
            RETURNING *`;
        const values = [usuario_id, nome_arquivo, caminho_arquivo, tipo_mime, tamanho, status, id];
        const ret = await client.query(query, values); // Usa 'client.query'

        if (ret.rows.length > 0) {
            console.log("Update realizado com sucesso!");
            return ret.rows[0]; // Retorna o registro atualizado
        }
    } catch (error) {
        console.log(error); // Registra o erro
    } finally {
        client.release(); // Libera a conexão
    }
    return null; // Retorna null em caso de erro
}

// Função para deletar um registro
async function delet(id) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = 'DELETE FROM documentos WHERE id = $1';
        const values = [id];
        await client.query(query, values); // Usa 'client.query'
        console.log("Registro deletado com sucesso!");
    } catch (error) {
        console.log(error); // Registra o erro
    } finally {
        client.release(); // Libera a conexão
    }
}

module.exports = { select, selectAll, insert, update, delet };
