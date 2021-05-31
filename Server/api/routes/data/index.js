const { Router } = require('express');
const { addClient } = require('../../lib/tcp');
const { uploadFirmware } = require('../../services/upload');
const robotService = require('../../services/robot');
const { getClientById } = require('../../lib/websocket');
const { findById } = require('../../lib/tcp');
const EspOTA = require('esp-ota');
const mongoService = require('../../lib/mongo');

const router = Router();

router.get('/', async (req, res) => {
    const data = await mongoService.getData();
    res.send(data);
});

module.exports = router;