const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
const ejs = require('ejs');
const fs = require('fs');

const conversor = require('./converterPDF');


const app = express();
const porta = process.env.PORT || 3000;

/* Definição de limite de dados de upload.*/
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

const diretorioAtual = __dirname;
const pastaRaiz = path.resolve(diretorioAtual);

app.get('/', async (req, res) => {
    const pdfPath = 'img_teste.jpeg';
    const arquivo = pastaRaiz + "\\"+ pdfPath;

    await conversor.conectar(pastaRaiz);
    await conversor.upload(arquivo);
    await conversor.converter();
    await conversor.download();
    res.render('home2');
});

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});