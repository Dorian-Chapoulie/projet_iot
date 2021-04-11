#include "TCPServer.hpp"
#include "Event.hpp"

TCPServer* TCPServer::m_instance = nullptr;
TCPServer* TCPServer::getInstance() { return TCPServer::m_instance; }

TCPServer::TCPServer(unsigned int port, const String& ssid, const String& passwd) {
    m_port = port;
    server = new WiFiServer(port);
    
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid.c_str(), passwd.c_str());
    
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("WiFi connected.");
    Serial.println(WiFi.localIP());
    server->begin();

    xTaskCreatePinnedToCore(
      TCPServer::loop,
      "Task TCPServer loop",
      10000,       /* Stack size of task */
      this,        /* parameter of the task */
      1,           /* priority of the task (1 - 24)*/
      &Task1,      /* Task handle to keep track of created task */
      1 //CORE (1 or 0)
    );
    
}

TCPServer::~TCPServer()
{
  server->stop();
}


void TCPServer::init(unsigned int port, const String& ssid, const String& passwd) {
  TCPServer::m_instance = new TCPServer(port, ssid, passwd);
}

void TCPServer::loop(void* params) {
  TCPServer* _this = ((TCPServer*)params);
  while(_this->m_listen) {
    WiFiClient client = _this->server->available();
    unsigned long currentTime = millis();
    unsigned long previousTime = 0;

    if (client) {
      currentTime = millis();
      previousTime = currentTime;
      Serial.println("New Client.");
      client.write(WiFi.macAddress().c_str());

      _this->isAvailable = false;
      EventCallbackData data;
      data.iValue = 0;
      EventManager::getInstance()->trigerEvent("isavailable", data);
      
      String currentLine = "";
      
      while (client.connected() && currentTime - previousTime <= _this->m_timeout) {
        currentTime = millis();
        if (client.available()) {
          char c = client.read();
          if (c == ';') {
            Serial.println(currentLine);
            
            _this->eventManager->checkEvent(currentLine);
            
            currentLine = "";
          } else {
            currentLine += c;
          }
          
        }
      }
     
      client.stop();
      _this->isAvailable = true;
      data.iValue = 1;
      EventManager::getInstance()->trigerEvent("isavailable", data);
      Serial.println("Client disconnected.");
      Serial.println("");
    }
  }
}

bool TCPServer::getIsAvailable() const {
  return isAvailable;
}

unsigned int TCPServer::getPort() const {
  return m_port;
}
