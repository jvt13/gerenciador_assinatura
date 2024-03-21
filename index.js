const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
const ejs = require('ejs');
const fs = require('fs');
const multer = require('multer');

// Configuração do multer para lidar com uploads
//const upload = multer({ dest: 'uploads/' });

const conversor = require('./public/scripts/converterPDF');
const comandos = require('./public/scripts/comandos');
const preparaConvert = require('./public/scripts/conversor/main')


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

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

const diretorioAtual = __dirname;
const pastaRaiz = path.resolve(diretorioAtual);
//const multer  = require('multer');
//const upload = multer({ dest: 'uploads/' });

app.get('/', async (req, res) => {

    //res.sendFile(pastaRaiz + '/pages/home2.html');
    res.render('home2');
});

app.get('/download', (req, res) => {
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
        console.log('Download realizado do arquivo: '+ name_file);
        // Certifique-se de não enviar nada após o res.download()
    });
    
});

app.post('/tratamento', /*upload.single('arquivo'),*/ async (req, res) => {
    try {
        const dta = new Date();
        const name_file = 'assinatura.pdf';
        const name_diretorio = dta.getTime();
        const rec = req.body;
        const pdfPath = 'dataURL.txt';
        const arquivo = pastaRaiz + "\\" + pdfPath;

        try {
            console.log('passo 1')
            /*const conv_ = await */preparaConvert.converterPDF_IMG(rec.dados, name_diretorio, name_file);
            console.log('passo 2');

            console.log('Conversão e download realizado. ' + name_file)
            res.status(200).json({ success: true, menssagem: 'Conversão e download realizado.', name_file: name_file });
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, error: 'Parâmetros inválidos' });
        }

    } catch (error) {
        console.error(error)
        res.status(400).json({ err: error })
    }
})

app.post('/juntarIMG_FOR_PDF', async (req, res) => {
    try {
        const dataURLs = Object.values(req.body.dados);
        const dta = new Date()
        const name_file = "contrato_" + dta.getTime() + ".pdf";

        preparaConvert.addImagesToPDF(dataURLs, name_file);
        

        console.log('Junção realizado com sucesso!');
        res.status(200).json({ success: true, menssagem: 'Junção realizado com sucesso!', name_file: name_file });
    } catch (error) {
        res.status(400).json({ err: error })
    }
});

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