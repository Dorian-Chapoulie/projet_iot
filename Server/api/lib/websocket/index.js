const { config } = require('../../config');
const { findById } = require('../tcp');

process.on('SIGINT', () => {
    console.log('Arret du serveur');
    process.exit();
});

exports.initSocketProvider = (socketIO) => {
    socketIO.on("connection", (socket) => {
        console.log("NEW CLIENT: ", socket.id);

        socket.on("disconnect", () => {
            console.log("deco");
        });

        socket.on("instruction", (key) => {
            const client = findById(socket.id);
            if (!client) return;
            switch(key.toLowerCase()) {
                case 'z': 
                    client.sendMessage(config.TCP.PROTOCOL.MOTOR.DIRECTION.FORWARD);
                break;
                case 's':
                    client.sendMessage(config.TCP.PROTOCOL.MOTOR.DIRECTION.BACKWARD);
                break;
                case 'q':
                    client.sendMessage(config.TCP.PROTOCOL.DIRECTION.LEFT);
                break;
                case 'd':
                    client.sendMessage(config.TCP.PROTOCOL.DIRECTION.RIGHT);
                break;
                case ' ': //SPACE
                    client.sendMessage(config.TCP.PROTOCOL.MOTOR.DIRECTION.STOP);
                break;
                case 'shift':
                    client.sendMessage(config.TCP.PROTOCOL.MOTOR.SPEED.INCREASE);
                break;
                case 'control':
                    client.sendMessage(config.TCP.PROTOCOL.MOTOR.SPEED.DECREASE);
                break;
            }

            //io.sockets.in(game.id).emit('playerposition', { id, x, y, direction });
            // socket.emit('playerlist', { playerList });  
        });

    });
};