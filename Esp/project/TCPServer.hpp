#include <Arduino.h>
#include <WiFi.h>
#include "EventManager.hpp"

class TCPServer {
public:
    static TCPServer* getInstance();
    static void init(unsigned int port, const String& ssid, const String& passwd);
    static void loop(void* params);
    
    ~TCPServer();

    bool getIsAvailable() const;
    unsigned int getPort() const;
    
private:
    TCPServer(unsigned int port, const String& ssid, const String& passwd);

    unsigned int m_port;
    const unsigned int m_timeout = 1000 * 60 * 5;
    bool m_listen = true;
    bool isAvailable = true;

    static TCPServer* m_instance;
    
    WiFiServer* server = nullptr;
    TaskHandle_t Task1;
    EventManager* eventManager = EventManager::getInstance();
};
