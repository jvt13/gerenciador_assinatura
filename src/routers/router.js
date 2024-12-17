const express = require('express');
const router = express.Router();
const homeController = require('../controllers/contr_home');
const contr_login = require('../controllers/contr_login');
const contr_doc = require('../controllers/contr_doc');

/*Rotas get Home */
router.get('/', homeController.home);
router.get('/trata_documento', homeController.trata_documento);
router.get('/download', homeController.download);

/*Rotas get Users */
router.post('/insert-user', contr_login.registro)

/*Rotas post Users */
router.post('/login', contr_login.index);

/*Rotas post Trata documento */
router.post('/save-doc', contr_doc.save);

module.exports = router;