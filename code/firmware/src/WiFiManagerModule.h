#ifndef WIFIMANAGER_MODULE_H
#define WIFIMANAGER_MODULE_H

/**
 * WiFiManagerModule - A wrapper for WiFiManager library with reset button functionality
 * 
 * Features:
 * - Automatic WiFi connection with captive portal for configuration
 * - Reset button support (hold for 5+ seconds to reset credentials)
 * - Boot-time reset check
 * - Connection status monitoring
 * 
 * Usage:
 * 1. Create instance: WiFiManagerModule wifiManager;
 * 2. In setup(): wifiManager.begin();
 * 3. In loop(): wifiManager.handleResetButton();
 * 
 * Reset Process:
 * - Connect to "MediFlow-Setup" AP with password "12345678"
 * - Navigate to 192.168.4.1 to configure WiFi
 * - Or hold reset button for 5+ seconds to clear saved credentials
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiManager.h>

// Configuration
#define RESET_BUTTON_PIN 14
#define RESET_HOLD_TIME 5000  // 5 seconds
#define AP_NAME "MediFlow-Setup"
#define AP_PASSWORD "12345678"

class WiFiManagerModule {
private:
    unsigned long pressStartTime;
    bool resetting;
    int resetButtonPin;
    
public:
    WiFiManagerModule(int buttonPin = RESET_BUTTON_PIN);
    
    // Initialize WiFi manager and connect
    bool begin();
    
    // Check for reset button press in loop
    void handleResetButton();
    
    // Reset WiFi credentials
    void resetCredentials();
    
    // Check if WiFi is connected
    bool isConnected();
    
    // Get current IP address
    String getIPAddress();
};

#endif
