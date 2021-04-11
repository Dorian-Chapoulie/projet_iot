const config = {
    MQTT: {
        brokerURL: 'http://broker.hivemq.com',
        subTopicId: {
            DATA: 0,
            AVAILABLE: 1,
        },
        subTopics: [
            'robot/jupiter/data',
            'robot/jupiter/available',
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
                RIGHT: 'I-D-D;',
                LEFT: 'I-D-Q;',
            },
            MOTOR: {
                SPEED: {
                    INCREASE: 'I-M-A;',
                    DECREASE: 'I-M-B;',
                },
                DIRECTION: {
                    FORWARD: 'I-M-Z;',
                    BACKWARD: 'I-M-S;',
                    STOP: 'I-M-C;',
                },
            }
        }
    }
};

module.exports.config = config;