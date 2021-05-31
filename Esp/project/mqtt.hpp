#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#define SUB_TOPIC_NUMBER 2
#define PUB_TOPIC_NUMBER 3

class MQTTClient {
public:
    static MQTTClient* getInstance();
    static void init(const String& ssid, const String& passwd);
    
    ~MQTTClient();

    void loop() const;
    String camIp = "";

    PubSubClient* m_mqttClient = nullptr;
    const char* m_pubTopics[PUB_TOPIC_NUMBER] = {"robot/jupiter/data", "robot/jupiter/available", "robot/jupiter/sensor"};
private:
    MQTTClient(const String& ssid, const String& passwd);
    void mqttInit(const String& ssid, const String& passwd);
    void mqttSubscrible(const char* topic);
   
    static void mqttMessageHandler(char* topic, byte* message, unsigned int length);
    static MQTTClient* instance;
    
    const char* m_mqttBroker = "broker.hivemq.com";
    const unsigned int m_mqttPort = 1883;
    const char* m_subTopics[SUB_TOPIC_NUMBER] = {"robot/jupiter/isavailable"};

    bool m_isAvailable = true;
    
    WiFiClient wifiClient;
};
