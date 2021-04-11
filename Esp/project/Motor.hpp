#include <Arduino.h>

class Motor {
public:
    Motor(const byte motor1Pin1, const byte motor1Pin2, const byte enablePin);
    ~Motor();

    void forward();
    void backward();
    void stop();
    void increaseSpeed();
    void decreaseSpeed();
    
private:
    void init(const byte enablePin);
    
    const unsigned int m_freq = 30000;
    const unsigned int m_pwmChannel = 2;
    const unsigned int m_resolution = 8;
    const byte m_speedStep = 10;

    byte m_speed = 200;
    byte m_motor1Pin1;
    byte m_motor1Pin2;
};
