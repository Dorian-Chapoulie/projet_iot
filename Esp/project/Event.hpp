#pragma once

union EventCallbackData
{
    int iValue;
    float fValue;
    ~EventCallbackData() {}
};

struct Event
{
    void (*callback)(EventCallbackData& data) = nullptr;
    std::string id = "";

    Event(std::string& id, void (*callback)(EventCallbackData& data)) {
        id = id;
        callback = callback;
    }
    Event() {}
};
