#include <PubSubClient.h>
#include <ArduinoOTA.h>
#include <OneWire.h>
#include <DallasTemperature.h>


#include "TCPServer.hpp"
#include "Motor.hpp"
#include "Servo.hpp"
#include "mqtt.hpp"
#include "EventManager.hpp"
#include "Event.hpp"
#define RXD2 16
#define TXD2 17

const String ssid = "Gaëllepue";
const String password = "dorian06";

TCPServer* server = TCPServer::getInstance();

Motor* motor = nullptr;
ServoHandler* servo = nullptr;
ServoHandler* servoCamHonrizon = nullptr;
ServoHandler* servoCamVertical = nullptr;
MQTTClient* mqttClient = nullptr;
EventManager* eventManager = nullptr;

const int oneWireBus = 13;     
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

int servoPin = 22;
int servoCamHonrizonPin = 21;
int servoCamVerticalPin = 19;
int motor1Pin1 = 33;
int motor1Pin2 = 32;
int enable1Pin = 14;

String get_WifiData() {
  int numNetworks = WiFi.scanNetworks();
  String payloadWifi = "{ \"jupiterID\": \"";
  payloadWifi += WiFi.macAddress().c_str();
  payloadWifi += "\",";
  for (int i = 0; i < numNetworks; i++) {
    payloadWifi += '"' + WiFi.BSSIDstr(i) + '"' + ":" + '"'+WiFi.RSSI(i)+'"'+ ",\n";
  }
 
  return payloadWifi;
}


void setup() {
  Serial.begin(9600);
  WiFi.mode(WIFI_STA);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  sensors.begin();
  
  TCPServer::init(25565, ssid, password);
  MQTTClient::init(ssid, password);

  mqttClient = MQTTClient::getInstance();
  eventManager = EventManager::getInstance();

  motor = new Motor(motor1Pin1, motor1Pin2, enable1Pin);
  servo = new ServoHandler(servoPin);
  servoCamHonrizon = new ServoHandler(servoCamHonrizonPin);
  servoCamVertical = new ServoHandler(servoCamVerticalPin);

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
  
  /* ------- CAM HONRIZONTAL ------*/
  eventManager->setEventListener("turn_cam_r", [](EventCallbackData& d){
    servoCamHonrizon->turnRight();
  });
  eventManager->setEventListener("turn_cam_d", [](EventCallbackData& d){
    servoCamHonrizon->turnLeft();
  });
  
  /* ------- CAM VERTICAL ------*/
  eventManager->setEventListener("turn_cam_u", [](EventCallbackData& d){
    servoCamVertical->turnRight();
  });
  eventManager->setEventListener("turn_cam_b", [](EventCallbackData& d){
    servoCamVertical->turnLeft();
  });
  
  ArduinoOTA.setPassword("2a6d8ad0-9Ef;!&");
  ArduinoOTA.begin();
}

String command;
String payload;
int sendData = 0;
EventCallbackData data;

void loop() {
  mqttClient->loop();
  ArduinoOTA.handle();
   while (Serial2.available() /*&& mqttClient->camIp.length() <= 0*/) {
    command = Serial2.readStringUntil('\n');
    mqttClient->camIp = command.substring(0, command.length() - 1);
  }

  if (sendData >= 60) {
    sensors.requestTemperatures(); 
    float temperatureC = sensors.getTempCByIndex(0);
    payload = get_WifiData();
    payload += "\"temp\":\"" + String(temperatureC) + "\"}";
    char data[payload.length() + 1];
    payload.toCharArray(data, (payload.length() + 1));
    MQTTClient::getInstance()->m_mqttClient->publish(MQTTClient::getInstance()->m_pubTopics[2], data);
    sendData = 0;
  }

  data.iValue = TCPServer::getInstance()->getIsAvailable() ? 1 : 0;
  eventManager->trigerEvent("isavailable", data);
 
  sendData++;
  delay(500);
}
