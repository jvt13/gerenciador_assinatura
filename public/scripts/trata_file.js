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

module.exports = { dataURLtoBlob, blobToFile }