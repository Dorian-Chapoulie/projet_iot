#include <Arduino.h>
#include <ESP32Servo.h>

class ServoHandler {
public:
    ServoHandler(const byte pin);
    ~ServoHandler();

    void rotate(byte position);
    void turnLeft();
    void turnRight();

private:
    const unsigned int m_freq = 30000;
    const unsigned int m_resolution = 8;
    const unsigned int m_pwmChannel = 1;
    const byte m_turnStep = 10;

    byte m_position = 90;
    Servo servo;
};
