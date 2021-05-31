 #include "Servo.hpp"

unsigned int ServoHandler::m_pwmChannel = 1;
ServoHandler::ServoHandler(const byte pin) {
  pinMode(pin, OUTPUT);
  ledcSetup(m_pwmChannel++, m_freq, m_resolution);
  ledcAttachPin(pin, m_pwmChannel);
  servo.attach(pin);
  //rotate(m_position);
}

ServoHandler::~ServoHandler() {

}

void ServoHandler::rotate(byte position) {
  servo.write(position);
}

void ServoHandler::turnLeft() {
  if (m_position - m_turnStep >= 60) {
     m_position -= m_turnStep;
  }
  servo.write(m_position);
}

void ServoHandler::turnRight() {
  if (m_position + m_turnStep <= 130) {
     m_position += m_turnStep;
  }
  servo.write(m_position);
}
