const express = require('express');
const { assignSheets, getClientSheets, getAllClients } = require('../controllers/accessController');
const router = express.Router();

router.post('/assign-sheet', assignSheets);
router.get('/client-sheets/:clientId', getClientSheets);
router.get('/all-clients', getAllClients); 

module.exports = router;
