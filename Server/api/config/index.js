const config = {
    MQTT: {
        brokerURL: 'http://broker.hivemq.com',
        subTopicId: {
            DATA: 0,
            AVAILABLE: 1,
            SENSOR: 2,
        },
        subTopics: [
            'robot/jupiter/data',
            'robot/jupiter/available',
            'robot/jupiter/sensor'
        ],
        pubTopics: {
            ROBOT_IS_AVAILABLE: 'robot/jupiter/isavailable',
        },
    },
    WSOCKET: {
        PORT: 3002,
    },
    TCP: {
        PROTOCOL: {
            DIRECTION: {
                RIGHT: 'I-D-D',
                LEFT: 'I-D-Q',
            },
            MOTOR: {
                SPEED: {
                    INCREASE: 'I-M-A',
                    DECREASE: 'I-M-B',
                },
                DIRECTION: {
                    FORWARD: 'I-M-Z',
                    BACKWARD: 'I-M-S',
                    STOP: 'I-M-C',
                },
            },
            CAM: {
                RIGHT: 'I-C-R',
                LEFT: 'I-C-D',
                UP: 'I-C-U',
                DOWN: 'I-C-B',
            },
        }
    }
};

module.exports.config = config;