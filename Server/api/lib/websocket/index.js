const { config } = require('../../config');
const { findById } = require('../tcp');

let clients = [];

process.on('SIGINT', () => {
    console.log('Arret du serveur');
    process.exit();
});

exports.initSocketProvider = (socketIO) => {
    socketIO.on("connection", (socket) => {
        console.log("NEW CLIENT: ", socket.id);

        clients.push({ socket, id: socket.id });

        socket.on("robot_disconnect", () => {
            const client = findById(socket.id);
            if (!client) return;
            client.connection.destroy();
        });

        socket.on("disconnect", () => {
            const client = findById(socket.id);
            if (client) client.connection.destroy();
            clients = clients.filter((sock) => sock !== socket);
        });

        socket.on("instruction", (key) => {
            const client = findById(socket.id);
            if (!client) { 
                socket.emit('robot_not_connected');
                return;
            }
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
                case 'arrowup':
                    client.sendMessage(config.TCP.PROTOCOL.CAM.UP);
                break;
                case 'arrowdown':
                    client.sendMessage(config.TCP.PROTOCOL.CAM.DOWN);
                break;
                case 'arrowleft':
                    client.sendMessage(config.TCP.PROTOCOL.CAM.LEFT);
                break;
                case 'arrowright':
                    client.sendMessage(config.TCP.PROTOCOL.CAM.RIGHT);
                break;
            }

            //io.sockets.in(game.id).emit('playerposition', { id, x, y, direction });
            // socket.emit('playerlist', { playerList });  
        });

    });
};

const getClientById = (id) => {
    return clients.find((sock) => sock.id === id);
};

module.exports.getClientById = getClientById;