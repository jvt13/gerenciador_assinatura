const sql_users = require('../database/users/users.users/sql_users');
const sql_inf_users = require('../database/users/users.inf_users/sql_inf_users');
const sql_acessos = require('../database/users/users.acessos/sql_acessos');
const util = require('../services/util');
const auth = require('../services/auth');
const conexao = require('../database/conexao')

module.exports = {
    // Função assíncrona para lidar com a rota de login
    index: async (req, res) => {
        const { username, password } = req.body;

        const userAgent = req.headers['user-agent'];
        const browserName = util.getBrowserName(userAgent);

        try {
            // Busca usuários do banco de dados (assegure-se de que sql_users.select está funcionando corretamente)
            //const list = await sql_users.selectAll();

            console.log("User: " + username + " Pass: " + password)
            //const res = await sql_inf_users.selectUser(username);
            const resposta = await conexao.query('SELECT * FROM usuarios WHERE username = $1', [username]);

            if (resposta.rows.length === 0) {
                //alert("Usuário não existe!!!")
                return res.status(200).json({ success: false, message: 'Usuário não existe!' });
                //return;
            }

            console.log("Usuário: "+ resposta.rows[0].id)
            const { salt, hash } = resposta.rows[0];
            // Valida os dados de login
            //const valida = await util.validaLogin(username, password, list, req);
            const valida = auth.verifyPassword(password, salt, hash)

            if (valida) {
                const userAgent = req.headers['user-agent'];
                sql_users.updateAcesso(resposta.rows[0].id, userAgent)
                //sql_acessos.insertAcessos()
                // Se validado, busca informações adicionais do usuário
                //const rec = await sql_inf_users.select(req.session.userid_controle);

                // Define informações globais e na sessão
                req.session.userconect = resposta.rows[0].username;

                //console.log("Usuário " + username + " validado com sucesso.");
                res.status(200).json({ success: true, message: 'OK' });
            } else {
                console.log("Erro na autenticação para o usuário " + username);
                res.status(200).json({ success: false, message: 'Nome de usuário ou senha inválido(s).' });
            }
        } catch (error) {
            console.log("Erro ao processar login:", error);
            res.status(400).json({ success: false, message: 'Erro interno do servidor.' });
        }
    },

    registro: async (req, res) => {
        try {
            console.log("Dados: " + req.body.username + " - E-mail: " + req.body.email)
            const list = await sql_users.selectAll()

            // Verifica se list é um array e se possui registros
            const now_id = Array.isArray(list) ? list.length + 1 : 1; // Se list não for um array, inicia com 1

            const data = new Date();
            const hora = data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();
            const dta = util.dataAtualFormatada();
            const userAgent = req.headers['user-agent'];
            //const navegador = util.detectarNavegador(userAgent);

            const { nome, username, password, email } = req.body;
            const { salt, hash } = auth.hashPassword(password)

            sql_users.insert(nome, username, email, salt, hash, '', '01/12/1992', '2', '', userAgent);
            //sql_acessos.insert(1,dta,hora);
            //sql_inf_users.insert(email, username, now_id);
            //sql_acessos.insert(now_id, dta, hora, navegador);
            res.status(200).json({ success: true, message: 'OK' });
        } catch (error) {
            //console.error("Erro ao processar login:", error);
            res.status(400).json({ success: false, message: 'Erro interno do servidor.' });
        }
    }
}