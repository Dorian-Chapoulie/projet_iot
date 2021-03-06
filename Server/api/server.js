const express = require('express');
const cors = require('cors');

const { MQTT_init } = require('./lib/mqtt');
const { initSocketProvider } = require('./lib/websocket');
const mongoService = require('./lib/mongo');
const { config } = require('./config/index');

const app = express();
const socketIOHttpServer = require('http').createServer(app);

const io = require("socket.io")(socketIOHttpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
});
initSocketProvider(io);


const robot = require('./routes/robot');
const data = require('./routes/data');
mongoService.init();

const port = process.env.PORT || 3001;
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(express.static(__dirname + '/public'));

app.use('/robot', robot);
app.use('/data', data);

app.listen(port, () => {
    console.log(`[Server] running at http://localhost:${port}`);
	  MQTT_init();
});
socketIOHttpServer.listen(config.WSOCKET.PORT);
console.log(`[WSocket] running at http://localhost:${config.WSOCKET.PORT}`);