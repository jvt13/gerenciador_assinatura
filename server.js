const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
const ejs = require('ejs');
const fs = require('fs');
const multer = require('multer');
const util = require('./src/services/util');

const preparaConvert = require('./public/scripts/conversor/main');

const cors = require('cors');

/*BD */
//const con = require('./src/database/conexao');
//con.connectToDB();

/*Rota */
const router = require('./src/routers/router');

const app = express();  //usando para quando não é parte de uma rota
//const app = express.Router();  //aqui já faz parte de uma rota do servidor 'api-jvt'
var porta = process.env.PORT || 5000;

/* Definição de limite de dados de upload.*/
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/*app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));*/

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: util.getTempoConvertido(10) }, resave: false, saveUninitialized: true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/src/views'));

app.use('/', router);
// Usando CORS para todas as rotas e todos os domínios
app.use(cors());

// Ou configurando de forma mais específica:
app.use(cors({
    origin: 'http://localhost:5000', // Ajuste para a URL do seu front end
    methods: ['GET', 'POST'], // Métodos que você quer permitir
    credentials: true // Se você estiver usando cookies/sessões
}));

const diretorioAtual = __dirname;
const pastaRaiz = path.resolve(diretorioAtual);

/*Posts*/
app.post('/juntarIMG_FOR_PDF', async (req, res) => {
    try {
        const dataURLs = Object.values(req.body.dados);
        const dta = new Date()
        const name_file = "contrato_" + dta.getTime() + ".pdf";

        preparaConvert.addImagesToPDF(dataURLs, name_file, 'save');


        console.log('Junção realizado com sucesso!');
        res.status(200).json({ success: true, menssagem: 'Junção realizado com sucesso!', name_file: name_file });
    } catch (error) {
        res.status(400).json({ err: error })
    }
});

/*Iniciando o servidor*/
function startServer() {
    const server = http.createServer(app);

    server.listen(porta)
        .on('listening', () => {
            console.log(`Servidor iniciado na porta ${porta}`);
        })
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`A porta ${porta} está ocupada, tentando a próxima porta.`);
                porta++;
                startServer();
            } else {
                console.error(`Erro ao tentar verificar a porta: ${err.message}`);
            }
        });
}

startServer();
/*app.listen(porta, (err) => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});*/

module.exports = app;