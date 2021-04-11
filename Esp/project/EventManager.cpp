#include "EventManager.hpp"

EventManager* EventManager::instance = nullptr;

EventManager* EventManager::getInstance() {
    if (EventManager::instance == nullptr) {
        EventManager::instance = new EventManager();
    }
    return EventManager::instance;
}

void EventManager::setEventListener(std::string&& id, void(*callback)(EventCallbackData& data))
{
    for (int i = 0; i < EVENT_NUMBER; i++) {
        if (events[i].id.length() == 0) {
            events[i].id = id;
            events[i].callback = callback;
            break;
        }
    }
}

void EventManager::checkEvent(String& protocol) const {
  switch (protocol[2]) {
    case 'D':
      if(protocol[4] == 'D') { //I-D-D
        trigerEvent("turn_r", EventCallbackData());
      } else if(protocol[4] == 'Q') { //I-D-Q
       trigerEvent("turn_l", EventCallbackData());
      }
    break;
    case 'M':
      if(protocol[4] == 'A') { // I-M-A
        trigerEvent("speed_i", EventCallbackData());
      } else if(protocol[4] == 'B') { //I-M-B
        trigerEvent("speed_d", EventCallbackData());
      } else if(protocol[4] == 'Z') { //I-M-Z
        trigerEvent("forward", EventCallbackData());
      }else if(protocol[4] == 'S') { //I-M-S
        trigerEvent("backward", EventCallbackData());
      }else if(protocol[4] == 'C') { //I-M-C
        trigerEvent("stop", EventCallbackData());
      }
    break;
    case 'C':
    break;
  }
                
}

void EventManager::trigerEvent(std::string&& id, EventCallbackData data) const
{
    for (int i = 0; i < EVENT_NUMBER; i++) {
        if (events[i].id == id && events[i].callback != nullptr) {
            events[i].callback(data);
            break;
        }
    }
}

EventManager::EventManager() {
    events = new Event[EVENT_NUMBER]();
}

EventManager::~EventManager() {
    delete EventManager::instance;
}
