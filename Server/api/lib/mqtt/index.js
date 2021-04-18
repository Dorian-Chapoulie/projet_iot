const mqtt = require('mqtt');
const { config } = require('../../config');
const robotService = require('../../services/robot');

let client;

const MQTT_init = () => {
	const brokerURL = config.MQTT.brokerURL;
	client = mqtt.connect(brokerURL);
	const topics = config.MQTT.subTopics;

	client.on('connect', () => {
        console.log(`[MQTT] client connected to: '${brokerURL}'`);
        topics.forEach((topic) => {
            client.subscribe(topic, (err) => {
                if (!err) {
                    console.log(`[MQTT] client subscribed to: '${topic}'`);
                }
            });
        });

		setInterval(() => {
			sendMessage(config.MQTT.pubTopics.ROBOT_IS_AVAILABLE, {});
		}, 5000);

		setInterval(() => {
			robotService.clearList();
		}, 10000);
	});

	client.on('message', (top, mess) => {
		const topic = top.toString();
		const data = JSON.parse(mess.toString());
		switch(topic) {
			case config.MQTT.subTopics[config.MQTT.subTopicId.DATA]:
				robotService.addNewRobot({ ...data, isAvailable: true });
				break;
			case config.MQTT.subTopics[config.MQTT.subTopicId.AVAILABLE]:
				let robot = robotService.findById(data.jupiterID);
				if (robot) {
					robotService.updateRobot(data);
				} else {
					robotService.addNewRobot(data);
				}
				break;
			default: break;
		}
		//console.log(`[${topic}]: `, data);
	});

}

const sendMessage = (topic, message) => {
    client.publish(topic, JSON.stringify(message));
}

module.exports.MQTT_init = MQTT_init;
module.exports.sendMessage = sendMessage;