const fs = require("fs");
// load the module
var GroupDocs = require('groupdocs-conversion-cloud');
var appSid;
var appKey;
var myStorage;
var config;
var pasta_raiz;

function dados() {
    // get your appSid and appKey at https://dashboard.groupdocs.cloud (free registration is required).
    appSid = "3bc3b7e2-dfb7-4aa2-af13-2a1bbf2da607";
    appKey = "590f46e19fee06ea7d020e1a6198a13e";

    myStorage = "Teste";
    config = new GroupDocs.Configuration(appSid, appKey);
}

async function conectar(pasta) {
    dados();
    config.apiBaseUrl = "https://api.groupdocs.cloud";
    console.log("conectado na API.")
    pasta_raiz = pasta
}

async function upload(caminho) {
    // abra o arquivo no IOStream da unidade do sistema.
    //var resourcesFolder = 'E:\\Web\\gerenciador_contratos\\temp.pdf';
    var resourcesFolder = caminho;
    // ler arquivo
    fs.readFile(resourcesFolder, (err, fileStream) => {
        // construir FileApi
        var fileApi = GroupDocs.FileApi.fromConfig(config);
        // criar solicitação de upload de arquivo
        var request = new GroupDocs.UploadFileRequest("sample-file.jpeg", fileStream, myStorage);
        // subir arquivo
        fileApi.uploadFile(request)
            .then(function (response) {
                console.log("Expected response type is FilesUploadResult: " + response.uploaded.length);
            })
            .catch(function (error) {
                console.log("Error: " + error.message);
            });
    });
}

async function converter() {
    // Como converter PDF para o formato JPEG usando a API REST no Node.js
    const convert = async () => {
        const convertApi = GroupDocs.ConvertApi.fromKeys(appSid, appKey);

        const settings = new GroupDocs.ConvertSettings();
        settings.storageName = myStorage;
        settings.filePath = "sample-file.jpeg";
        settings.format = "pdf";
        settings.outputPath = "nodejs-testing/sample-file.pdf";

        try {
            // Criar solicitação de conversão de documento
            const request = new GroupDocs.ConvertDocumentRequest(settings);
            await convertApi.convertDocument(request);
        }
        catch (err) {
            throw err;
        }
    }

    convert()
        .then(() => {
            console.log("Successfully converted PDF to PNG file format.");
        })
        .catch((err) => {
            console.log("Error occurred while converting the PDF document:", err);
        });
}

async function download() {
    var data = new Date();

    // construa FileApi para baixar o arquivo convertido
    var fileApi = GroupDocs.FileApi.fromConfig(config);
    // criar solicitação de download de arquivo
    let request = new GroupDocs.DownloadFileRequest("nodejs-testing/sample-file.pdf", myStorage);
    // arquivo de download e tipo de resposta Stream
    fileApi.downloadFile(request)
        .then(function (response) {
            // salve o arquivo no diretório do sistema
            fs.writeFile(pasta_raiz+"\\assinatura-"+ data.getTime() +".pdf", response, "binary", function (err) { });
            console.log("Expected response type is Stream: " + response.length);
        })
        .catch(function (error) {
            console.log("Error Download: " + error.message);
        });
}

module.exports = {conectar, upload, converter, download}