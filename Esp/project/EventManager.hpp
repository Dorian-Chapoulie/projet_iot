#pragma once
#include <Arduino.h>
#include <string>
#include "Event.hpp"

class EventManager {

public:
    static EventManager* getInstance();

    void setEventListener(std::string&& id, void (*callback)(EventCallbackData& data));
    void trigerEvent(std::string&& id, EventCallbackData data) const;

    void checkEvent(String& protocol) const;

private:
    static EventManager* instance;
    const int EVENT_NUMBER = 12;

    EventManager();
    ~EventManager();

    Event* events = nullptr;
};
