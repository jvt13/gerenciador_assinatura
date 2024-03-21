const dow = require('./comandos2');

async function downloadIMG() {
    try {
        const dataURLs = Object.values(hashMap);

        const response = await fetch('/juntarIMG_FOR_PDF', {
            method: 'POST',
            /*body: formData*/
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dados: dataURLs })
        });

        const { success, menssagem, name_file, error } = await response.json();

        if (success) {
            setTimeout(function () {
                downloadFilePDF(name_file);
            }, 1000);

            document.getElementById('inputImage').value = '';
            document.getElementById('lb_page_cur').textContent = '0';
            document.getElementById('lb_page_final').textContent = '0';
            // Apagar todas as chaves do HashMap
            Object.keys(hashMap).forEach(key => delete hashMap[key]);

            //Limpar canvas
            var canvas = document.getElementById('container_canvas');
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var canvas = document.getElementById('id_canvas');
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //return menssagem;
        } else {
            alert("Erro no retorno da requisição: " + error)
            console.error(error);
        }
    } catch (error) {
        console.error(error);

    }
}

function downloadFilePDF(name_file) {
    const encodedFileName = encodeURIComponent(name_file);
    //console.log('/download?filename=' + encodedFileName);
    window.location.href = '/download?filename=' + encodedFileName;
}