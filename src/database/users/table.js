const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var table = null;

table = new Schema({
    id: String,
    user: String,
    pass: String,
    id_controle: String
}, { collection: 'users' });

var user = mongoose.model("users", table);

table = new Schema({
    id: String,
    id_controle: Number,
    nome: String,
    email: String
}, { collection: 'inf_users' });

var inf_users = mongoose.model("inf_users", table);

table = new Schema({
    id: String,
    id_controle: String,
    data: String,
    hora: String,
    navegador: String
}, { collection: 'acessos' });

var acessos = mongoose.model("acessos", table);

table = new Schema({
    id: String,
    id_controle: String,
    data: String,
    hora: String,
    navegador: String
}, { collection: 'historico' });

var historico = mongoose.model("historico", table);

table = new Schema({
    id: String,
    id_controle: String,
    data: String,
    hora: String,
    navegador: String
}, { collection: 'dados' });

var dados = mongoose.model("dados", table);

table = new Schema({
    id_controle: String,
    data: String,
    hora: String,
    dataURL: String
}, { collection: 'documentos' });

var documentos = mongoose.model("documentos", table);


module.exports = {user, inf_users, acessos, dados, documentos}