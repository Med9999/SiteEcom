// MOHSSINE AIT BOUKDIR - MOHAMMED ALOUT

const express = require('express');
const router = express.Router();
const { getFacture , getItems , getOneItem,addFacture} = require('../controllers/itemController')


router.get('/', getItems)

router.get('/items', getItems)

router.get('/items/:id', getOneItem)

router.get('/facture/:id', getFacture)

router.post('/facture/:id', addFacture);

module.exports = router;