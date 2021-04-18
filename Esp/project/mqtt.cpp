#include "mqtt.hpp"
#include "Event.hpp"
#include "EventManager.hpp"
#include "TCPServer.hpp"

MQTTClient* MQTTClient::instance = nullptr;

void MQTTClient::init(const String& ssid, const String& passwd) {
   MQTTClient::instance = new MQTTClient(ssid, passwd);
}

MQTTClient* MQTTClient::getInstance() { return MQTTClient::instance; }

MQTTClient::MQTTClient(const String& ssid, const String& passwd) {
  mqttInit(ssid, passwd);
}

MQTTClient::~MQTTClient(){
}


void MQTTClient::mqttInit(const String& ssid, const String& passwd) {
  m_mqttClient = new PubSubClient(wifiClient);

  WiFi.begin(ssid.c_str(), passwd.c_str());
  while(WiFi.status() != WL_CONNECTED){
    delay(1000);
  }
  m_mqttClient->setServer(m_mqttBroker, m_mqttPort);
  m_mqttClient->setCallback(MQTTClient::mqttMessageHandler);
  
  for(byte i = 0; i < SUB_TOPIC_NUMBER; i++) {
     mqttSubscrible(m_subTopics[i]);
  }

  EventManager::getInstance()->setEventListener("isavailable", [](EventCallbackData& d){
    String payload;
    payload = "{\"jupiterID\": \"";
    payload += WiFi.macAddress().c_str();   
    payload += "\", \"isAvailable\": \"" ;
    payload += d.iValue ? "true" : "false"; 
    payload += "\", \"firmware\": ";
    payload += "\"1.0\","; 
    payload += "\"ip\": \"";
    payload += WiFi.localIP().toString();
    payload += "\", \"port\": \"";
    payload += TCPServer::getInstance()->getPort();
    payload += "\", \"battery\": \"5.123\"  }";
    char data[payload.length() + 1];
    payload.toCharArray(data, (payload.length() + 1));
    MQTTClient::getInstance()->m_mqttClient->publish(MQTTClient::getInstance()->m_pubTopics[1], data);
 });
}

void MQTTClient::mqttMessageHandler(char* topic, byte* message, unsigned int length) {

  String messageTemp;
  for(int i = 0 ; i < length ; i++) {
    messageTemp += (char) message[i];
  }

  if (String(topic) == MQTTClient::getInstance()->m_subTopics[0]) {
    EventCallbackData data;
    data.iValue = TCPServer::getInstance()->getIsAvailable();
    EventManager::getInstance()->trigerEvent("isavailable", data);
  }
  
}

void MQTTClient::mqttSubscrible(const char* topic) {
  while(!m_mqttClient->connected()) { 
    if(m_mqttClient->connect(WiFi.macAddress().c_str())) {
      m_mqttClient->subscribe(topic);
    } else {
      delay(5*1000);
    }
  }
}

void MQTTClient::loop() const {
  m_mqttClient->loop(); 
}

void MQTTClient::mqttSendData(const char* message) {
  /*payload = "{\"who\": \"";
  payload += whoami;   
  payload += "\", \"value\": " ;
  payload += "13"; 
  payload += "}";
  payload.toCharArray(data, (payload.length() + 1)); // Convert String payload to a char array

  //Serial.println(data);
  client.publish(TOPIC_PUB, data); */
}
