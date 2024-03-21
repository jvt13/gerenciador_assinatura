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

async function tratarURLPage() {
    const pdfInput = document.getElementById('inputImage');
    const file = pdfInput.files[0];

    if (file) {
        const fileReader = new FileReader();

        fileReader.onload = async function (e) {
            const arrayBuffer = e.target.result;
            const pdfData = new Uint8Array(arrayBuffer);

            const pdfDocument = await pdfjsLib.getDocument({ data: pdfData }).promise;

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
                    SecondImage(dataURL)
                //}
            }

        };

        fileReader.readAsArrayBuffer(file);
    }
}

function loadFile(event) {
    var inputFile = event.target;
    var file = inputFile.files[0];
    container = document.getElementById('canvas-container');
    canvas = document.getElementById('container_canvas');

    if (file.type === 'application/pdf') {
        loadPDF(file);
        tratarURLPage();
    }
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
        loadImage(event);
    }
}

function loadPDF(file) {
    //tratarURLPage();
    var reader = new FileReader();

    reader.onload = function (event) {
        //var pdfData = event.target.result;
        var arrayBuffer = event.target.result;
        var base64String = arrayBufferToBase64(arrayBuffer);
        const pdfData = new Uint8Array(this.result);

        pdfjsLib.getDocument({ data: pdfData }).promise.then(function (pdf) {
            pdfDoc = pdf;
            lb_page_cur.innerHTML = 1;
            lb_page_final.innerHTML = pdfDoc.numPages;
            renderPagePDF(pageNum);
        });

    }
    reader.readAsArrayBuffer(file);
}

function renderPagePDF(pageNum) {
    // Renderiza a primeira página do PDF
    pdfDoc.getPage(pageNum).then(function (page) {
        var containerRect = container.getBoundingClientRect();
        var viewport = page.getViewport({ scale: 1.0 });

        // Calcula o scale para ajustar às dimensões do contêiner
        var scale = Math.min(containerRect.width / viewport.width, containerRect.height / viewport.height);

        viewport = page.getViewport({ scale: scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        container.innerHTML = '';
        container.appendChild(canvas);

        var context = canvas.getContext('2d');
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext);
    });
}

function refleshPage() {
    //const container = document.getElementById('canvas-container');
    console.log('Pagina: ' + pageNum + " de " + pdfDoc.numPages);
    //console.log(hashMap[pageNum]);
    if (pageNum > pdfDoc.numPages) {
        pageNum--;
        return;
    }
    //pageNum++;
    lb_page_cur.innerHTML = pageNum;
    container.innerHTML = '';
    renderPagePDF(pageNum);
}

function firstImage(event) {
    var input = event.target;
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

    console.log('Imagem: ' + input.files[0])
    img.src = URL.createObjectURL(input.files[0]);

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

function refreshCanvas(positionX, positionY) {
    var canvas = document.getElementById('id_canvas');
    var ctx = canvas.getContext('2d');

    // Converta o Data URL para um Blob
    var blob = dataURLtoBlob(dataURLBase64);
    const file = blobToFile(blob, "img_teste.jpg");

    // Atualiza a posição da imagem
    imagemPosicao.x = positionX;
    imagemPosicao.y = positionY;

    var img2 = new Image();
    img2.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        firstImage(eventFirstImage);

        // Desenha a imagem na nova posição
        setTimeout(function () {
            drawImageAtCurrentPosition(img2, ctx);
            var dataURL = canvas.toDataURL();
            let minhaString = (typeof dataURL === 'string') ? dataURL : JSON.stringify(dataURL);
            let stringSemColchetes = minhaString.replace(/[\[\]]/g, '');
            var dataURL = stringSemColchetes.replace(/"/g, '');
            dataURL_canvas = dataURL;

        }, 500);
    };

    img2.src = URL.createObjectURL(file);
}
// Função para desenhar a imagem na posição atual
function drawImageAtCurrentPosition(img, ctx) {
    ctx.drawImage(img, imagemPosicao.x, imagemPosicao.y, 120, 120);
}

// Função para limpar a área ocupada pela imagem anterior
function clearImageArea(img, ctx) {
    ctx.clearRect(lastImagePosition.x, lastImagePosition.y, 200, 200);
}

async function downloadIMG() {
    try {
        var blob = dataURLtoBlob(dataURL_canvas);
        const file = blobToFile(blob, "img_teste.jpg");
        const formData = new FormData();
        formData.append('arquivo', file);

        const response = await fetch('/tratamento', {
            method: 'POST',
            /*body: formData*/
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dados: dataURL_canvas })
        });

        const { success, menssagem, name_file, error } = await response.json();

        if (success) {
            console.log('Retorno: ' + menssagem);
            console.log('DataURL: ' + name_file);
            setTimeout(function () {
                downloadFilePDF(name_file);
            }, 1000);

            //return menssagem;
        } else {
            console.error(error);
        }
    } catch (error) {
        console.error(error);

    }
}

function downloadFilePDF(name_file) {
    const encodedFileName = encodeURIComponent(name_file);
    console.log('/download?filename=' + encodedFileName);
    window.location.href = '/download?filename=' + encodedFileName;
}


function loadImage(event) {
    var inputFile = event.target;
    var file = inputFile.files[0];

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
    //SecondImage(dataURLBase64);

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

function getPositionInParent(elem, parent) {
    var position = { x: 0, y: 0, wid: 0, hei: 0 };

    while (elem && elem !== parent) {
        position.x += elem.offsetLeft;
        position.y += elem.offsetTop;
        position.wid += elem.offsetWidth;
        position.hei += elem.offsetHeight;

        elem = elem.offsetParent;
    }

    return position;
}



function getPosition(elem) {
    var position = { x: 0, y: 0, wid: 0, hei: 0 };
    while (elem) {
        position.x += elem.offsetLeft;
        position.y += elem.offsetTop;
        position.wid += elem.offsetWidth;
        position.hei += elem.offsetHeight;
        elem = elem.offsetParent;
    }
    return position;
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

module.exports = { obterFormatoDaImagem, dataURLtoBlob, blobToFile }