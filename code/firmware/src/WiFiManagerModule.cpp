#include "WiFiManagerModule.h"

WiFiManagerModule::WiFiManagerModule(int buttonPin) {
    resetButtonPin = buttonPin;
    pressStartTime = 0;
    resetting = false;
}

bool WiFiManagerModule::begin() {
    WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP
    
    Serial.begin(115200);
    pinMode(resetButtonPin, INPUT_PULLUP);
    
    // Check if button is held at startup (optional)
    if (digitalRead(resetButtonPin) == LOW) {
        Serial.println("Button held during boot. Resetting Wi-Fi...");
        resetCredentials();
        delay(1000);
        ESP.restart();
    }

    WiFiManager wm;
    
    // Set timeout for portal (optional)
    wm.setConfigPortalTimeout(180); // 3 minutes timeout
    
    bool res = wm.autoConnect(AP_NAME, AP_PASSWORD);

    if (!res) {
        Serial.println("Failed to connect to WiFi");
        delay(3000);
        ESP.restart();
        return false;
    } else {
        Serial.println("Connected to WiFi!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        return true;
    }
}

void WiFiManagerModule::handleResetButton() {
    if (digitalRead(resetButtonPin) == LOW) {
        if (!resetting) {
            pressStartTime = millis();
            resetting = true;
            Serial.println("Reset button pressed...");
        } else if (millis() - pressStartTime > RESET_HOLD_TIME) {
            Serial.println("Button held >5s, resetting Wi-Fi credentials...");
            resetCredentials();
            delay(1000);
            ESP.restart(); // reboot into setup mode
        }
    } else {
        if (resetting) {
            Serial.println("Reset button released");
        }
        resetting = false; // reset if button released
    }
}

void WiFiManagerModule::resetCredentials() {
    WiFiManager wm;
    wm.resetSettings(); // erase credentials from flash
    Serial.println("WiFi credentials reset");
}

bool WiFiManagerModule::isConnected() {
    return WiFi.status() == WL_CONNECTED;
}

String WiFiManagerModule::getIPAddress() {
    if (isConnected()) {
        return WiFi.localIP().toString();
    }
    return "Not connected";
}
