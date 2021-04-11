const fs = require('fs');
const { Router } = require('express');
const { addClient } = require('../../lib/tcp');
const robotService = require('../../services/robot');

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

router.post('/firmware', async (req, res) => {
    console.log(req);
    fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });
    res.send({});
});


module.exports = router;