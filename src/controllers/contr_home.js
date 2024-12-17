const sql_docs = require('../database/dados/sql_docs');
const configBD = require('../database/config');
  
module.exports = {
    login: (req, res) => {
        res.render('login');
    },

    home: async (req, res) => {
        
        await configBD.criarBancoDeDados()
            .then(() => console.log('Processo concluído.'))
            .catch((err) => console.error('Erro ao executar:', err));

        if (req.session.userconect != null) {
            const userconect = req.session.userconect;

            try {
                const list = await sql_docs.select(req.session.userid_controle);
                //console.log('Arquivo: '+ list[0].nome_arq+ " "+ Object.keys(list).length)

                // Define tamanhoDocumento como 0 se documento for nulo ou não for um objeto
                const tamanhoDocumento = list && typeof list === 'object' ? Object.keys(list).length : 0;

                // Renderiza a página com o tamanho do documento
                res.render('home', { userconect: userconect, list: list, size: tamanhoDocumento });
            } catch (error) {
                console.error('Erro ao buscar documento:', error);
                // Em caso de erro, você pode também definir tamanhoDocumento como 0
                res.render('home', { userconect: userconect, list: null, size: 0 });
            }
            //res.render('view_doc');
        } else
            res.render('login');
    },

    trata_documento: (req, res) => {
        res.render('trata_documento');
    },

    download: (req, res) => {
        const name_file = decodeURIComponent(req.query.filename);
        //console.log('Nome do Arquivo: ' + name_file);

        //const patch_arquivo = path.join(__dirname, 'public', 'uploads', name_file);
        const patch_arquivo = './public/uploads/' + name_file;
        //console.log('Arquivo: ' + patch_arquivo)
        res.download(patch_arquivo, (erro) => {
            if (erro) {
                // Lida com erros aqui
                console.error(erro);
                res.status(500).send('Erro ao baixar o arquivo.');
            }
            console.log('Download realizado do arquivo: ' + name_file);
            // Certifique-se de não enviar nada após o res.download()
        });
    }

}