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
            console.log("deco robot");
            const client = findById(socket.id);
            if (!client) return;
            client.connection.destroy();
            
        });

        socket.on("disconnect", () => {
            console.log("deco");
            clients = clients.filter((sock) => sock !== socket);
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

exports.getClientById = (id) => {
    return clients.find((sock) => sock.id === id);
}