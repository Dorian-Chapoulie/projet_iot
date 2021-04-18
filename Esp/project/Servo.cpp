 #include "Servo.hpp"
 
ServoHandler::ServoHandler(const byte pin) {
  pinMode(pin, OUTPUT);
  ledcSetup(m_pwmChannel, m_freq, m_resolution);
  ledcAttachPin(pin, m_pwmChannel);
  servo.attach(pin);
  rotate(m_position);
}

ServoHandler::~ServoHandler() {

}

void ServoHandler::rotate(byte position) {
  servo.write(position);
}

void ServoHandler::turnLeft() {
  if (m_position - m_turnStep >= 0) {
     m_position -= m_turnStep;
  }
  servo.write(m_position);
}

void ServoHandler::turnRight() {
  if (m_position + m_turnStep <= 180) {
     m_position += m_turnStep;
  }
  servo.write(m_position);
}
