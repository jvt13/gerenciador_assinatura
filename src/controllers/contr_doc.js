const sql_documents = require('../database/dados/sql_docs');
const sql_users = require('../database/users/users.users/sql_users');
const util = require('../services/util');
const preparaConvert = require('../../public/scripts/conversor/main');

module.exports = {
    save: async (req, res) => {
        try {
            const data = new Date();
            const dta = util.dataAtualFormatada();
            const hora = data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();

            const dataURLs = Object.values(req.body.dados);
            console.log(dataURLs.length);

            const name_file = "contrato_" + data.getTime() + ".pdf";
            const dataURL = await preparaConvert.addImagesToPDF(dataURLs, name_file, 'data');

            //const list = await sql_users.select(req.session.id_controle);
            //const now_id = list.length + 1;

            const size = util.formatarTamanhoArquivo(dataURL);
            //const calc = size / 1024;
            //console.log("Size: "+ size);

            const id_controle = req.session.userid_controle;

            if(id_controle === undefined){
                res.status(200).json({ success: false, message: 'Sessão do usuário finalizou! Dados não salvo.' });
                return;
            }

            const TIMESTAMP = dta + " "+ hora;
            const data_convertido = util.compressData(dataURL);
            const ret = sql_documents.insert(id_controle, name_file,'','', size,TIMESTAMP, data_convertido);

            if(ret){
                res.status(200).json({ success: true, message: 'OK' });
            }


           // if(ret){
                //console.log("retorno: " + ret);
            //}
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, message: 'Erro interno do servidor.' });
        }
    }
}