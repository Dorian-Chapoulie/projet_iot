 #include "Motor.hpp"
 
Motor::Motor(const byte motor1Pin1, const byte motor1Pin2, const byte enablePin) {
  m_motor1Pin1 = motor1Pin1;
  m_motor1Pin2 = motor1Pin2;
  init(enablePin);
}

Motor::~Motor() {

}

void Motor::init(const byte enablePin) {
  pinMode(m_motor1Pin1, OUTPUT);
  pinMode(m_motor1Pin2, OUTPUT);
  pinMode(enablePin, OUTPUT);  
  ledcSetup(m_pwmChannel, m_freq, m_resolution);
  ledcAttachPin(enablePin, m_pwmChannel);
  ledcWrite(m_pwmChannel, m_speed);
}

void Motor::forward() {
  digitalWrite(m_motor1Pin1, LOW);
  digitalWrite(m_motor1Pin2, HIGH);
}
void Motor::backward(){
  digitalWrite(m_motor1Pin1, HIGH);
  digitalWrite(m_motor1Pin2, LOW);
}
void Motor::stop() {
  digitalWrite(m_motor1Pin1, LOW);
  digitalWrite(m_motor1Pin2, LOW);
}
void Motor::increaseSpeed(){
  if (m_speed + m_speedStep <= 255) {
    m_speed += m_speedStep;
  }
  ledcWrite(m_pwmChannel, m_speed);
}
void Motor::decreaseSpeed(){
  if (m_speed - m_speedStep >= 0) {
    m_speed -= m_speedStep;
  }
  ledcWrite(m_pwmChannel, m_speed);
}
