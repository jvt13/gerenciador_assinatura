const imgToPDF = require('./app');
const fs = require('fs');
//const path = require('path');

//app.set('views', path.join(__dirname, '/pages'));


/*const diretorioAtual = __dirname;
const pastaRaiz = path.resolve(diretorioAtual);*/
var dataURL;

const pdfPath = 'dataURL.txt';
//const arquivo = pastaRaiz + "\\" + pdfPath;

const arquivo = './' + pdfPath;

function preparaFiles() {
    fs.readFile(arquivo, 'utf8', (err, dados) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
        } else {

            // Aqui você pode fazer o que quiser com os dados, como atribuir a uma variável
            dataURL = dados;
            console.log('Dados lido');

            converterPDF_IMG(dataURL);
        }
    });
}

async function converterPDF_IMG(dataURL, name_diretorio, name_file) {
    const arquivo = name_file;
    
    const pages = [ // path to the image
        dataURL // base64
    ]

    const stream = imgToPDF(pages, imgToPDF.sizes.A4);

    stream.on('error', (error) => {
        console.error('Erro durante a conversão de imagens para PDF:', error);
    });

    const writeStream = await fs.createWriteStream('./public/uploads/' + name_file);

    writeStream.on('finish', () => {
        console.log('Conversão concluída com sucesso.');
    });

    writeStream.on('error', (error) => {
        console.error('Erro ao escrever o arquivo PDF:', error);
        // Trate o erro conforme necessário, por exemplo, exclua o arquivo inacabado.
        fs.unlink(name_file, (unlinkError) => {
            if (unlinkError) {
                console.error('Erro ao excluir o arquivo inacabado:', unlinkError);
            }
        });
    });

    stream.pipe(writeStream);
    /*imgToPDF(pages, imgToPDF.sizes.A4)
        .pipe(fs.createWriteStream(arquivo))*/
}

module.exports = { preparaFiles, converterPDF_IMG }