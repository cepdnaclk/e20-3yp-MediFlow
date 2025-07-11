#include <Arduino.h>
#include <DHT.h>
#include "MotorControl.h"
#include "LaserModule.h"
#include "WiFiManagerModule.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "certs/certificates.h"

// WiFi Manager instance
WiFiManagerModule wifiManager;

// AWS IoT Core Configuration
#define AWS_IOT_ENDPOINT "aelh7uratdfcb-ats.iot.us-east-1.amazonaws.com"
#define AWS_IOT_PORT 8883
#define CLIENT_ID "MediFlow_ESP32_1"
#define THING_NAME "Dispenser_A"
#define SUBSCRIBE_TOPIC "mediflow/" THING_NAME "/command"
#define PUBLISH_TOPIC "mediflow/" THING_NAME "/status"
#define PUBLISH_TOPIC_HEALTH "mediflow/" THING_NAME "/health"

// MQTT and WiFiClientSecure setup
WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

// Function prototypes
void connectToAWS();
void messageHandler(char *topic, byte *payload, unsigned int length);

unsigned long lastHealthPublish = 0;

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

int pillCount = 0;
int targetPillCount = 10;
bool wasLaserBlocked = false;
bool dispensing = false; 

// MQTT message callback
void messageHandler(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Incoming message on topic: ");
  Serial.println(topic);

  // Create a null-terminated string from the payload
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';

  Serial.print("Complete Message: ");
  Serial.println(message);

  // Check for dispense command 
  if (strstr(message, "\"command\":\"dispense\"") != NULL || 
      strstr(message, "\"command\": \"dispense\"") != NULL)
  {
    Serial.println("✓ Dispense command detected");
    
    // Extract quantity
    char *quantityStart = strstr(message, "\"quantity\":");
    if (quantityStart)
    {
      quantityStart += 11; // Move past "quantity":
      while (*quantityStart == ' ' || *quantityStart == '\t') {
        quantityStart++;
      }
      targetPillCount = atoi(quantityStart);
      Serial.print("Target pill count set to: ");
      Serial.println(targetPillCount);
    }
    else
    {
      Serial.println("Warning: No quantity specified, using default");
      targetPillCount = 10; // Default value
    }
    
    // Extract medicine information for logging
    char *medicineStart = strstr(message, "\"medicine_name\":\"");
    if (medicineStart) {
      medicineStart += 17; // Move past "medicine_name":"
      char *medicineEnd = strstr(medicineStart, "\"");
      if (medicineEnd) {
        int nameLength = medicineEnd - medicineStart;
        char medicineName[nameLength + 1];
        strncpy(medicineName, medicineStart, nameLength);
        medicineName[nameLength] = '\0';
        Serial.print("Medicine: ");
        Serial.println(medicineName);
      }
    }
    
    // Start dispensing
    pillCount = 0;
    dispensing = true; 
    openGate();
    Serial.println("=== STARTING DISPENSE OPERATION ===");
    Serial.print("Target pills: ");
    Serial.println(targetPillCount);
    
    // Immediate confirmation with prescription ID
    char confirmMsg[256];
    char *prescriptionStart = strstr(message, "\"prescription_id\":\"");
    if (prescriptionStart) {
      prescriptionStart += 19; // Move past "prescription_id":"
      char *prescriptionEnd = strstr(prescriptionStart, "\"");
      if (prescriptionEnd) {
        int idLength = prescriptionEnd - prescriptionStart;
        char prescriptionId[idLength + 1];
        strncpy(prescriptionId, prescriptionStart, idLength);
        prescriptionId[idLength] = '\0';
        
        sprintf(confirmMsg, "{\"status\":\"dispensing_started\",\"targetCount\":%d,\"prescription_id\":\"%s\"}", 
                targetPillCount, prescriptionId);
      } else {
        sprintf(confirmMsg, "{\"status\":\"dispensing_started\",\"targetCount\":%d}", targetPillCount);
      }
    } else {
      sprintf(confirmMsg, "{\"status\":\"dispensing_started\",\"targetCount\":%d}", targetPillCount);
    }
    
    mqttClient.publish(PUBLISH_TOPIC, confirmMsg);
  }
  else
  {
    Serial.println("No dispense command found in message");
    Serial.println("Expected: \"command\":\"dispense\"");
  }
}
// Connect to AWS IoT
void connectToAWS()
{
  // Configure certificates
  wifiClient.setCACert(AWS_CERT_CA);
  wifiClient.setCertificate(AWS_CERT_CRT);
  wifiClient.setPrivateKey(AWS_CERT_PRIVATE);

  // Configure MQTT server and callback
  mqttClient.setServer(AWS_IOT_ENDPOINT, AWS_IOT_PORT);
  mqttClient.setCallback(messageHandler);

  Serial.println("Connecting to AWS IoT...");

  while (!mqttClient.connected())
  {
    const char* lwtMessage = "{\"status\":\"offline\"}";
    if (mqttClient.connect(
        CLIENT_ID,
        PUBLISH_TOPIC_HEALTH,
        0,
        false,
        "{\"status\":\"offline\"}"
      ))
    {
      Serial.println("Connected to AWS IoT");
      // Publish initial status
      char msg[64];
      sprintf(msg, "{\"status\":\"%s\"}", "online");
      mqttClient.publish(PUBLISH_TOPIC_HEALTH, msg);

      // Subscribe to the command topic
      if (mqttClient.subscribe(SUBSCRIBE_TOPIC))
      {
        Serial.print("Subscribed to: ");
        Serial.println(SUBSCRIBE_TOPIC);
      }
      else
      {
        Serial.println("Failed to subscribe");
      }
    }
    else
    {
      Serial.print("Failed to connect to AWS IoT, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void setup()
{
  Serial.begin(115200);
  motorSetup();
  laserSetup();
  servoSetup();
  openGate();
  stopMotor();
  dht.begin();

  // Initialize WiFi Manager
  Serial.println();
  Serial.println("Initializing WiFi Manager...");
  
  if (wifiManager.begin()) {
    Serial.println("WiFi connected successfully");
    Serial.print("IP address: ");
    Serial.println(wifiManager.getIPAddress());
    
    // Connect to AWS IoT
    connectToAWS();
  } else {
    Serial.println("Failed to connect to WiFi");
  }

  delay(2000);
}

void loop()
{
  // Handle WiFi reset button
  wifiManager.handleResetButton();
  
  // Check WiFi and MQTT connections
  if (!mqttClient.connected())
  {
    connectToAWS();
  }
  mqttClient.loop(); // Process incoming messages

  // Check WiFi connection and reconnect if needed
  if (!wifiManager.isConnected())
  {
    Serial.println("WiFi connection lost. Attempting to reconnect...");
    
    // Try to reconnect using WiFiManager
    if (wifiManager.begin()) {
      Serial.println("WiFi reconnected");
      Serial.print("IP address: ");
      Serial.println(wifiManager.getIPAddress());
      
      // Reconnect to AWS after WiFi reconnection
      if (!mqttClient.connected())
      {
        connectToAWS();
      }
    } else {
      Serial.println("Failed to reconnect to WiFi");
    }
  }

  bool isBlocked = isLaserBlocked();

  if (dispensing && wasLaserBlocked && !isBlocked)
  {
    pillCount++;
    Serial.print("Pill count: ");
    Serial.println(pillCount);

    // Publish pill count update to AWS
    char msg[128];
    sprintf(msg, "{\"pillCount\":%d,\"targetCount\":%d}", pillCount, targetPillCount);
    mqttClient.publish(PUBLISH_TOPIC, msg);

    if (pillCount >= targetPillCount)
    {
      stopMotor();
      closeGate();
      Serial.println("Target pill count reached. Motor stopped.");

      // Publish final status
      sprintf(msg, "{\"pillCount\":%d,\"targetCount\":%d,\"status\":\"complete\"}",
              pillCount, targetPillCount);
      mqttClient.publish(PUBLISH_TOPIC, msg);

      dispensing = false; 
    }
  }

  wasLaserBlocked = isBlocked;


  if (dispensing) {
    int motorSpeed = 60;
    setMotorSpeed(motorSpeed);
  } else {
    stopMotor();
  }

  unsigned long currentMillis = millis();
  if (currentMillis - lastHealthPublish >= 30000) {
    float temperature = dht.readTemperature();
    
    // Publish temperature data
    char msg[128];
    if (isnan(temperature)) {
      sprintf(msg, "{\"status\":\"%s\", \"temperature\":null}", "online");
    } else {
      sprintf(msg, "{\"status\":\"%s\", \"temperature\":%.2f}", "online", temperature);
    }
    mqttClient.publish(PUBLISH_TOPIC_HEALTH, msg);
    
    lastHealthPublish = currentMillis;
  }
  delay(100);
}
