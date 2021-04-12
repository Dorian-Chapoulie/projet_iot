const net = require('net');
let clients = [];

const addClient = (ip, port, socketID, robotID) => {
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
		}
	});
	
	client.connect(port, ip, () => {
		console.log('[TCP] Connected');
		//client.write('Hello, server! Love, Client;');
		//client.destroy();
	});

	client.on('data', (data) => {
		if (data.toString() === robotID) {
			findById(socketID).isAccepted = true;
		}
		console.log('[TCP] Received: ' + data);
	});

	client.on('close', () => {
		console.log('[TCP] Connection closed');
	});

	client.on('error',function(error){
		console.log('Error : ');
	});

	return findById(socketID);
}

const findById = (id) => {
	return clients.find((client) => client.id === id);
}

module.exports.findById = findById;
module.exports.addClient = addClient;