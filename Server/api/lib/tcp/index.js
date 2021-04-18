const net = require('net');

let clients = [];

const addClient = (ip, port, socket, robotID, socketID) => {
	const client = new net.Socket();

	clients.push({
		id: socketID,
		connection: client,
		robot: {
			ip,
			port,
		},
		isAccepted: false,
		sendMessage: (message) => {
			client.write(`${message};`);
		},
		socket,
	});

	setInterval(() => {
		client.write(';');
	}, 1000);
	
	client.connect(port, ip, () => {
		console.log('[TCP] Connected');
	});

	client.on('data', (data) => {
		if (data.toString() === robotID) {
			findById(socketID).isAccepted = true;
		}
		console.log('[TCP] Received: ' + data);
	});

	client.on('close', () => {
		client.destroy();
		clients = clients.filter((c) => c.id !== socketID);
		console.log('[TCP] Connection closed');
	});

	client.on('error', (error) => {
		socket.emit('robot_disconnected', { error });
		client.destroy();
		clients = clients.filter((c) => c.id !== socketID);
	});

	return findById(socketID);
}

const findById = (id) => {
	return clients.find((client) => client.id === id);
}

module.exports.findById = findById;
module.exports.addClient = addClient;