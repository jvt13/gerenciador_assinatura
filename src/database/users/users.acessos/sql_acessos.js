const pool = require('../../conexao'); // Certifique-se de que o caminho está correto

// Função para executar SELECT
async function selectAcessos() {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = 'SELECT * FROM public.acessos;';
        const res = await client.query(query); // Usa 'client.query'
        return res.rows;
    } catch (error) {
        console.error('Erro ao executar SELECT:', error);
    } finally {
        client.release(); // Libera a conexão
    }
}

// Função para executar INSERT
async function insertAcessos(id_controle, data, hora, navegador) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = `
            INSERT INTO public.acessos (id_controle, data, hora, navegador) 
            VALUES ($1, $2, $3, $4);
        `;
        const values = [id_controle, data, hora, navegador];
        await client.query(query, values); // Usa 'client.query'
        console.log('Registro inserido com sucesso!');
    } catch (error) {
        console.error('Erro ao executar INSERT:', error);
    } finally {
        client.release(); // Libera a conexão
    }
}

// Função para executar UPDATE
async function updateAcessos(id, novosDados) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const { id_controle, data, hora, navegador } = novosDados;
        const query = `
            UPDATE public.acessos 
            SET id_controle = $1, data = $2, hora = $3, navegador = $4 
            WHERE id = $5;
        `;
        const values = [id_controle, data, hora, navegador, id];
        await client.query(query, values); // Usa 'client.query'
        console.log('Registro atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao executar UPDATE:', error);
    } finally {
        client.release(); // Libera a conexão
    }
}

// Função para executar DELETE
async function deleteAcessos(id) {
    const client = await pool.connect(); // Conecta ao pool
    try {
        const query = 'DELETE FROM public.acessos WHERE id = $1;';
        await client.query(query, [id]); // Usa 'client.query'
        console.log('Registro deletado com sucesso!');
    } catch (error) {
        console.error('Erro ao executar DELETE:', error);
    } finally {
        client.release(); // Libera a conexão
    }
}

// Exporta as funções do módulo
module.exports = {
    selectAcessos,
    insertAcessos,
    updateAcessos,
    deleteAcessos,
};
