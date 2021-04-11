#include <PubSubClient.h>
#include "TCPServer.hpp"
#include "Motor.hpp"
#include "Servo.hpp"
#include "mqtt.hpp"
#include "EventManager.hpp"
#include "Event.hpp"

const String ssid = "Crisnice";
const String password = "@Louise98etDorian06etCaline60M4Is%#n";


TCPServer* server = TCPServer::getInstance();

Motor* motor = nullptr;
ServoHandler* servo = nullptr;
MQTTClient* mqttClient = nullptr;
EventManager* eventManager = nullptr;


int servoPin = 22;
int motor1Pin1 = 33;
int motor1Pin2 = 32;
int enable1Pin = 14;


void setup() {
  Serial.begin(9600);
  
  TCPServer::init(25565, ssid, password);
  MQTTClient::init(ssid, password);

  mqttClient = MQTTClient::getInstance();
  eventManager = EventManager::getInstance();

  motor = new Motor(motor1Pin1, motor1Pin2, enable1Pin);
  servo = new ServoHandler(servoPin);

  /* ------- SENS ------*/
  eventManager->setEventListener("turn_r", [](EventCallbackData& d){
    servo->turnRight();
  });
  eventManager->setEventListener("turn_l", [](EventCallbackData& d){
    servo->turnLeft();
  });
  
  /* ------- VITESSE ------*/
  eventManager->setEventListener("speed_i", [](EventCallbackData& d){
    motor->increaseSpeed();
  });
  eventManager->setEventListener("speed_d", [](EventCallbackData& d){
    motor->decreaseSpeed();
  });

  /* ------- DIRECTION ------*/
  eventManager->setEventListener("forward", [](EventCallbackData& d){
    motor->forward();
  });
  eventManager->setEventListener("backward", [](EventCallbackData& d){
    motor->backward();
  });
  eventManager->setEventListener("stop", [](EventCallbackData& d){
    motor->stop();
  });
}

void loop() {
  mqttClient->loop();
  delay(1000);
}
