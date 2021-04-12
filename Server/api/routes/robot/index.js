const { Router } = require('express');
const { addClient } = require('../../lib/tcp');
const { uploadFirmware } = require('../../services/upload');
const robotService = require('../../services/robot');
const { getClientById } = require('../../lib/websocket');
const { findById } = require('../../lib/tcp');
const EspOTA = require('esp-ota');


const router = Router();

router.get('/list', (req, res) => {
    res.send(robotService.getAll());
});

router.post('/command', async (req, res) => {
    const { jupiterID, socketID } = req.body;
    const robot = robotService.findById(jupiterID);

    if (robot) {
        try {
            const client = addClient(robot.ip, robot.port, socketID, jupiterID);
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (client.isAccepted) {
                        robot.isAvailable = false;
                        resolve();
                    }else {
                        client.connection.destroy();
                        reject();
                    }
                }, 5000);
            });
            res.send(jupiterID);
        } catch (err) {
            res.send({error: true });
        }
    }

});

router.post('/firmware', uploadFirmware, (req, res, next) => {

    if (req.fileValidationError) {
        res.send({ error: true });
    }

    res.send({fileName: req.file.filename});
});

router.post('/flash', async (req, res) => {
    const { socketId, fileName } = req.body;
    const socket = getClientById(socketId).socket;
    const tcpClient = findById(socketId);

    if (!socket || !tcpClient) {
        res.send({error: 'client not found'});
        return;
    }

    const esp = new EspOTA();

    esp.setPassword('2a6d8ad0-9Ef;!&');
    esp.on('state', (state) => {
        socket.emit('ota_state', { state });
    });
    esp.on('progress', (current, total) => {
        socket.emit('ota_progress', { value: Math.round(current / total * 100) });
    });
    esp.uploadFile(`./uploads/${fileName}`, tcpClient.robot.ip, 3232, EspOTA.FLASH)
        .then(() => {
            res.send({});
        })
        .catch((error) => {
            res.send({error});
        });
});

module.exports = router;