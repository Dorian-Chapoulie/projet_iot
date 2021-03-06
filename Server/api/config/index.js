const config = {
    MQTT: {
        brokerURL: 'http://broker.hivemq.com',
        subTopicId: {
            DATA: 0,
            AVAILABLE: 1,
            SENSOR: 2,
        },
        subTopics: [
            'robot/jupiter/9cd41330-c246-11eb-',
            'robot/jupiter/af6cf55c-c246-11eb-',
            'robot/jupiter/b5498d0a-c246-11eb-'
        ],
        pubTopics: {
            ROBOT_IS_AVAILABLE: 'robot/jupiter/db1499f8-c246-11eb-',
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