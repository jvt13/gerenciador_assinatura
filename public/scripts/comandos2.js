var dataURLBase64;
var dataURL_canvas;
var imagemPosicao = { x: 0, y: 0 };
var lastImagePosition = { x: 50, y: 50 };
var eventFirstImage;
var pageNum = 1;
var pdfDoc = null;
var container = null;
var canvas = null;
let hashMap = {};
var page_final = null;
const { rejects } = require("assert");
const { resolve } = require("path");

async function loadFile(event) {
    try {
        var inputFile = event.target;
        var file = inputFile.files[0];
        /*container = document.getElementById('canvas-container');
        canvas = document.getElementById('container_canvas');*/

        if (file.type === 'application/pdf') {
            //loadPDF(file);
            const ret = await tratarURLPage();

            if (ret !== undefined) {
                // Converta o Data URL para um Blob
                const rec_data = hashMap[1];
                var blob = dataURLtoBlob(rec_data);
                const file = blobToFile(blob, "img_teste.jpg");
                loadPDF(file);
            }

        }
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            loadImage(event);
        }
    } catch (error) {
        console.error('Ocorreu um erro:', error);
    }
}

function loadPDF(file) {
    //var inputFile = event.target;
    //var file = inputFile.files[0];

    var canvas = document.getElementById('container_canvas');
    var ctx = canvas.getContext('2d');

    // Obter as dimensões do 'canvas-container'
    var canvasContainer = document.getElementById('canvas-container');
    var containerWidth = canvasContainer.offsetWidth;
    var containerHeight = canvasContainer.offsetHeight;

    var img = new Image();
    img.onload = function () {
        // Atribuir as dimensões ao canvas
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Renderizar a primeira imagem no canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = URL.createObjectURL(file);
    firstImage(file);
    eventFirstImage = event;
}

function loadImage(event) {
    //var inputFile = event.target;
    //var file = inputFile.files[0];

    var canvas = document.getElementById('container_canvas');
    var ctx = canvas.getContext('2d');

    // Obter as dimensões do 'canvas-container'
    var canvasContainer = document.getElementById('canvas-container');
    var containerWidth = canvasContainer.offsetWidth;
    var containerHeight = canvasContainer.offsetHeight;

    var img = new Image();
    img.onload = function () {
        // Atribuir as dimensões ao canvas
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Renderizar a primeira imagem no canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = URL.createObjectURL(file);
    firstImage(event);
    eventFirstImage = event;
}

function firstImage(file) {
    //var input = event.target;
    var canvas = document.getElementById('id_canvas');
    var ctx = canvas.getContext('2d');

    var canvasContainer = document.getElementById('canvas-container');
    var containerWidth = canvasContainer.offsetWidth;
    var containerHeight = canvasContainer.offsetHeight;

    var img = new Image();
    img.onload = function () {
        // Definir o tamanho do canvas com base na imagem
        //canvas.width = img.width;
        //canvas.height = img.height;
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Renderizar a primeira imagem no canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    //console.log('Imagem: ' + input.files[0])
    img.src = URL.createObjectURL(file);

}

function SecondImage(dataURL) {
    dataURL_canvas = dataURL;
    var canvas = document.getElementById('id_canvas');
    var ctx = canvas.getContext('2d');

    // Converta o Data URL para um Blob
    var blob = dataURLtoBlob(dataURL);
    const file = blobToFile(blob, "img_teste.jpg");

    var img2 = new Image();
    img2.onload = function () {
        drawImageAtCurrentPosition(img2, ctx, imagemPosicao.x, imagemPosicao.y);
    };

    img2.src = URL.createObjectURL(file);
}

// Função para desenhar a imagem na posição atual
function drawImageAtCurrentPosition(img, ctx) {
    ctx.drawImage(img, imagemPosicao.x, imagemPosicao.y, 120, 120);
}

function refleshPage() {
    //const container = document.getElementById('canvas-container');
    console.log('Pagina: ' + pageNum + " de " + page_final);
    //console.log(hashMap[pageNum]);
    if (pageNum > page_final) {
        pageNum--;
        return;
    }
    //pageNum++;
    lb_page_cur.innerHTML = pageNum;
    //container.innerHTML = '';
    loadPDF(getFile(hashMap[pageNum]));
    //firstImage(getFile(hashMap[pageNum]));
}

/*Atualiza o canvas com a nova posição */
function refreshCanvas(positionX, positionY) {
    var canvas = document.getElementById('id_canvas');
    var ctx = canvas.getContext('2d');

    // Converta o Data URL para um Blob
    const file = getFile(dataURLBase64)

    // Atualiza a posição da imagem
    imagemPosicao.x = positionX;
    imagemPosicao.y = positionY;

    var img2 = new Image();
    img2.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        firstImage(getFile(hashMap[pageNum]));

        // Desenha a imagem na nova posição
        setTimeout(function () {
            drawImageAtCurrentPosition(img2, ctx);
            var dataURL = canvas.toDataURL();
            let minhaString = (typeof dataURL === 'string') ? dataURL : JSON.stringify(dataURL);
            let stringSemColchetes = minhaString.replace(/[\[\]]/g, '');
            var dataURL = stringSemColchetes.replace(/"/g, '');
            dataURL_canvas = dataURL;

            //atribiu nova imagem
            hashMap[pageNum] = dataURL_canvas;

        }, 500);
    };

    img2.src = URL.createObjectURL(file);
}

function getFile(base64) {
    try {
        var blob = dataURLtoBlob(base64);
        const file = blobToFile(blob, "img_teste.jpg");
        return file;
    } catch (error) {
        console.error(error);

    }
}

function limpaCanvas(id) {
    //var input = event.target;
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

/*Fim */
// Função para converter ArrayBuffer para string base64
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;

    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    var prefix = 'data:image/png;base64,';
    return prefix + btoa(binary);
}

/**Tratar dataUrl de cada imagem do PDF */
async function tratarURLPage() {
    return new Promise((resolve, rejects) => {
        const pdfInput = document.getElementById('inputImage');
        const file = pdfInput.files[0];

        if (file) {
            const fileReader = new FileReader();

            fileReader.onload = async function (e) {
                const arrayBuffer = e.target.result;
                const pdfData = new Uint8Array(arrayBuffer);

                const pdfDocument = await pdfjsLib.getDocument({ data: pdfData }).promise;
                //console.log("Número de pag: "+ pdfDocument.numPages)
                lb_page_cur.innerHTML = 1;
                lb_page_final.innerHTML = pdfDocument.numPages;
                page_final = pdfDocument.numPages;

                for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
                    const pdfPage = await pdfDocument.getPage(pageNumber);
                    const viewport = pdfPage.getViewport({ scale: 1.0 });

                    const canvas = document.createElement('canvas');
                    //var canvas = document.getElementById('id_canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    await pdfPage.render(renderContext).promise;

                    //if (pageNumber === 1) {
                    const dataURL = canvas.toDataURL('image/jpeg');
                    //console.log(`DataURL da página ${pageNumber}:`, dataURL);
                    hashMap[pageNumber] = dataURL;
                    //SecondImage(dataURL)
                    //}
                }

                resolve(hashMap); // Resolva a promessa com o objeto hashMap contendo os dados das páginas
            };

            fileReader.onerror = function (error) {
                rejects(error); // Rejeita a promessa em caso de erro
            };

            fileReader.readAsArrayBuffer(file);
        }
    });
}

/*--------Converter base64 em file---------------------------*/
function dataURLtoBlob(dataURL) {
    var matches = dataURL.match(/^data:(.*?)(;base64)?,(.*)$/);

    if (!matches) {
        throw new Error('Invalid data URL');
    }

    var mime = matches[1];
    var isBase64 = !!matches[2];
    var data = matches[3];

    if (!isBase64) {
        // Se não for base64, decodifique a URL
        data = decodeURIComponent(data);
    }

    var byteCharacters = atob(data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += 512) {
        var slice = byteCharacters.slice(offset, offset + 512);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
}

// Função para converter um blob em um objeto File
function blobToFile(blob, fileName) {
    const file = new File([blob], fileName, { type: blob.type });
    return file;
}

function obterFormatoDaImagem(dataURL) {
    // Extrair a parte do cabeçalho do data URL que contém informações sobre o formato da imagem
    const cabecalho = dataURL.split(',')[0];

    // O cabeçalho geralmente tem o formato "data:image/png;base64" ou similar
    const correspondencia = cabecalho.match(/:(.*?);/);

    if (correspondencia && correspondencia[1]) {
        // O segundo grupo de captura (correspondencia[1]) contém a extensão do formato da imagem
        return correspondencia[1].toLowerCase();
    } else {
        console.error('Formato da imagem não encontrado no data URL.');
        return null;
    }
}

/* Trata movimento da assinatura */
function loadImageFromDataURLASS(dataURL) {
    let minhaString = (typeof dataURL === 'string') ? dataURL : JSON.stringify(dataURL);
    let stringSemColchetes = minhaString.replace(/[\[\]]/g, '');
    var dataURL2 = stringSemColchetes.replace(/"/g, '');
    dataURLBase64 = dataURL2;
    //var txt_base64 = document.getElementById('id_base64');
    //txt_base64.value = 'José'
    //Container para receber a imagem
    var imgContainer = document.createElement('div');
    //var imgContainer = document.getElementById('canvas_assinatura')
    imgContainer.style.border = '1px solid black';
    imgContainer.style.width = '100px';
    imgContainer.style.height = '100px';

    var img = document.createElement('img');
    //var img = document.getElementById('img_assinatura')


    img.src = dataURL;
    img.style.border = '1px solid black';
    /*img.style.width = '20%';
    img.style.height = '10%';*/
    img.style.width = '120px';
    img.style.height = '120px'

    //juntarIMGCanvas();
    SecondImage(dataURLBase64);

    //Adcionar img ao Container
    //imgContainer.appendChild(img);

    var canvas = document.getElementById('canvas-container');
    canvas.appendChild(img);

    var isMouseDown = false;
    var startPosition = { x: 0, y: 0 };
    var endPosition = { x: 0, y: 0 };
    var lastImagePosition = { x: 0, y: 0 }; // You need to declare this variable

    var pos;


    img.addEventListener('mousedown', handleMouseDown);
    img.addEventListener('touchstart', handleTouchStart, { passive: false });  // { passive: false } foi incluido para para o aviso no console, aviso do preventDefault().

    document.addEventListener('mousemove', handleMouseMove,);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    img.addEventListener('mouseup', handleMouseUp);
    img.addEventListener('touchend', handleTouchEnd, { passive: false });


    function handleMouseDown(e) {
        e.preventDefault();
        isMouseDown = true;
        startPosition = { x: e.clientX, y: e.clientY };
    }

    function handleMouseMove(e) {
        if (!isMouseDown) return;

        const deltaX = e.clientX - startPosition.x;
        const deltaY = e.clientY - startPosition.y;

        const rect = canvas.getBoundingClientRect();
        const newLeft = lastImagePosition.x + deltaX;
        const newTop = lastImagePosition.y + deltaY;

        img.style.left = newLeft + 'px';
        img.style.top = newTop + 'px';

        endPosition = { x: e.clientX, y: e.clientY };
    }

    function handleMouseUp(e) {
        e.preventDefault();
        isMouseDown = false;
        lastImagePosition = { x: parseInt(img.style.left), y: parseInt(img.style.top) };
        refreshCanvas(lastImagePosition.x, lastImagePosition.y)
    }

    function handleTouchStart(e) {
        e.preventDefault();
        isMouseDown = true;
        var touch = e.touches[0];
        startPosition = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchMove(e) {
        if (!isMouseDown) return;
        e.preventDefault();
        var touch = e.touches[0];

        const deltaX = touch.clientX - startPosition.x;
        const deltaY = touch.clientY - startPosition.y;

        const rect = canvas.getBoundingClientRect();
        const newLeft = lastImagePosition.x + deltaX;
        const newTop = lastImagePosition.y + deltaY;

        // Obtendo as dimensões reais do "painel" (contêiner da imagem)
        const panelWidth = document.getElementById('painel').offsetWidth;
        const panelHeight = document.getElementById('painel').offsetHeight;

        // Obtendo as dimensões da imagem
        const imageWidth = img.offsetWidth;
        const imageHeight = img.offsetHeight;

        // Calculando as posições máximas permitidas
        const maxLeft = panelWidth - imageWidth;
        const maxTop = panelHeight - imageHeight;

        // Limitando a posição horizontal da imagem
        const limitedLeft = Math.min(Math.max(0, newLeft), maxLeft);

        // Limitando a posição vertical da imagem
        const limitedTop = Math.min(Math.max(0, newTop), maxTop);

        img.style.left = limitedLeft + 'px';
        img.style.top = limitedTop + 'px';

        endPosition = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        isMouseDown = false;
        lastImagePosition = { x: parseInt(img.style.left), y: parseInt(img.style.top) };
        refreshCanvas(lastImagePosition.x, lastImagePosition.y);
    }


}

module.exports = {limpaCanvas}