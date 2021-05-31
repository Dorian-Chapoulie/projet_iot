#include "TCPServer.hpp"
#include "Event.hpp"

TCPServer* TCPServer::m_instance = nullptr;
TCPServer* TCPServer::getInstance() { return TCPServer::m_instance; }

TCPServer::TCPServer(unsigned int port, const String& ssid, const String& passwd) {
    m_port = port;
    server = new WiFiServer(port);
    
    WiFi.begin(ssid.c_str(), passwd.c_str());
    
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
    }
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
      client.write(WiFi.macAddress().c_str());

      if (!_this->isAvailable){
          client.stop();
      }

      _this->isAvailable = false;
      String currentLine = "";
      
      while (client.connected() /*&& currentTime - previousTime <= _this->m_timeout*/) {
        currentTime = millis();
        if (client.available()) {
          char c = client.read();
          if (c == ';') {         
            _this->eventManager->checkEvent(currentLine);    
            currentLine = "";
          } else {
            currentLine += c;
          }
          
        }
      }

      client.stop();
      _this->isAvailable = true;
    }
  }
}

bool TCPServer::getIsAvailable() const {
  return isAvailable;
}

unsigned int TCPServer::getPort() const {
  return m_port;
}
