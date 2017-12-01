const express = require('express');
const adminsController = require('../controllers/admin');
const router = express.Router();
const helper = require('../helper/response');

router.get('/', [adminsController.getAdmins, helper.handleSuccess]);

module.exports = router;
