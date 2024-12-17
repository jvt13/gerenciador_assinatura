const crypto = require('crypto');
const comandos = require('../../public/scripts/assinatura_doc/comandos');
const zlib = require('zlib');

function encrypt(key, data) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');

    console.log("Criptografia concluida!");
    return crypted;
}

function decrypt(key, data) {
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    console.log("Descriptografia concluida!");
    return decrypted;
}

function getTempoConvertido(tempo) {
    try {
        const minuto = 60000;
        const ret = tempo * minuto;
        return ret;
    } catch (error) {
        console.log(error);
    }
}

async function validaLogin(user, pass, listUsers, req) {

    try {
        for (var i = 0; i < listUsers.length; i++) {

            if (user === listUsers[i].user_ && pass === listUsers[i].pass) {
                //global.userid = listUsers[i]._id;
                req.session.userid = listUsers[i]._id;
                req.session.userid_controle = listUsers[i].id_controle;
                //global.userid_controle = listUsers[i].id_controle;
                return true;
            }
        }
    } catch (error) {
        console.error(error)
    }

    return false;
}

function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString().padStart(2, '0'),
        mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
}

function formatDataBR(dta) {
    const date = new Date(dta);
    var formatedDate = date.toLocaleDateString({
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    //console.log(formatedDate)
    return formatedDate;
}

/// Função para calcular e formatar o tamanho do arquivo
function formatarTamanhoArquivo(dataURL) {
    // Extrair a parte do base64 do dataURL
    var base64Part = dataURL.split(',')[1];

    // Calcular o tamanho da string base64 (em bytes)
    var tamanhoBytes = Math.ceil((base64Part.length * 3) / 4);

    // Definir os sufixos de unidade
    var unidades = ['bytes', 'KB', 'MB', 'GB', 'TB'];

    // Converter o tamanho para a unidade apropriada
    var tamanhoFormatado = tamanhoBytes;
    var indiceUnidade = 0;
    while (tamanhoFormatado >= 1024 && indiceUnidade < unidades.length - 1) {
        tamanhoFormatado /= 1024;
        indiceUnidade++;
    }

    // Arredondar o tamanho formatado para duas casas decimais
    tamanhoFormatado = Math.round(tamanhoFormatado * 100) / 100;

    // Retornar o tamanho formatado com a unidade correspondente
    return tamanhoFormatado + ' ' + unidades[indiceUnidade];
}

// Função para converter dataURL para Blob (ou Buffer, dependendo do ambiente)
function dataURLtoBlob(dataURL) {
    // Implemente a função de acordo com o ambiente em que está executando o código
    // No navegador, use o método Blob
    // No Node.js, use o método Buffer
    // Aqui, estou usando o método Blob para ambientes de navegador
    var arr = dataURL.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}

function detectarNavegador(userAgent) {

    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
        return "Google Chrome";
    } else if (userAgent.includes("Edg")) {
        return "Microsoft Edge";
    } else if (userAgent.includes("Firefox")) {
        return "Mozilla Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        return "Apple Safari";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
        return "Opera";
    } else {
        return "Navegador desconhecido";
    }
}

function compressData(data) {
    return zlib.gzipSync(data).toString('base64');
}

function decompressData(data) {
    return zlib.gunzipSync(Buffer.from(data, 'base64')).toString();
}

// Uso:
//const originalData = 'data:text/plain;base64,aGVsbG8gd29ybGQ=';
//const compressedData = compressData(originalData);

function getBrowserName(userAgent) {
    //const userAgent = navigator.userAgent;

    if (userAgent.includes("Firefox")) {
        return "Firefox";
    } else if (userAgent.includes("Edg")) {
        return "Microsoft Edge";
    } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
        return "Chrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        return "Safari";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
        return "Opera";
    } else if (userAgent.includes("Trident")) {
        return "Internet Explorer";
    } else {
        return "Navegador desconhecido";
    }
}

module.exports = { validaLogin, dataAtualFormatada, formatDataBR, detectarNavegador, encrypt, decrypt, getTempoConvertido, formatarTamanhoArquivo, compressData, decompressData, getBrowserName }