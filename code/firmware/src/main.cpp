#include <Arduino.h>
#include <DHT.h>
#include "MotorControl.h"
#include "LaserModule.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "certs/certificates.h"

const char *ssid = "";
const char *password = "";

// AWS IoT Core Configuration
#define AWS_IOT_ENDPOINT "aelh7uratdfcb-ats.iot.eu-north-1.amazonaws.com"
#define AWS_IOT_PORT 8883
#define CLIENT_ID "MediFlow_ESP32_1"
#define SUBSCRIBE_TOPIC "mediflow/dispenser/1/command"
#define PUBLISH_TOPIC "mediflow/dispenser/1/status"

// MQTT and WiFiClientSecure setup
WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

// Function prototypes
void connectToAWS();
void messageHandler(char *topic, byte *payload, unsigned int length);

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

  Serial.print("Message: ");
  Serial.println(message);

  // Extract quantity for target pill count
  char *quantityStart = strstr(message, "\"quantity\":");
  if (quantityStart)
  {
    quantityStart += 11; // Move past "quantity":
    targetPillCount = atoi(quantityStart);
    Serial.print("Target pill count set to: ");
    Serial.println(targetPillCount);
  }

  // Process commands here
  char *actionStart = strstr(message, "\"action\":\"");
  if (actionStart)
  {
    actionStart += 10; // Move past "action":" 
    if (strncmp(actionStart, "dispense\"", 9) == 0)
    {
      // Reset pill count for new dispense operation
      pillCount = 0;
      dispensing = true; 
      Serial.println("Starting new dispense operation");
    }
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
    if (mqttClient.connect(CLIENT_ID))
    {
      Serial.println("Connected to AWS IoT");

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

  // Connect to WiFi
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Connect to AWS IoT
  connectToAWS();

  delay(2000);
}

void loop()
{
  // Check WiFi and MQTT connections
  if (!mqttClient.connected())
  {
    connectToAWS();
  }
  mqttClient.loop(); // Process incoming messages

  // Check WiFi connection and reconnect if needed
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("WiFi connection lost. Reconnecting...");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
      delay(500);
      Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi reconnected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    // Reconnect to AWS after WiFi reconnection
    if (!mqttClient.connected())
    {
      connectToAWS();
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
      delay(10000);
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
    int motorSpeed = 90;
    setMotorSpeed(motorSpeed);
  } else {
    stopMotor();
  }

  float temperature = dht.readTemperature();
  if (!isnan(temperature))
  {
    char temperatureStr[10];
    dtostrf(temperature, 1, 2, temperatureStr);

    // Publish temperature data
    char msg[128];
    sprintf(msg, "{\"temperature\":%.2f}", temperature);
    mqttClient.publish(PUBLISH_TOPIC "/temperature", msg);
  }

  delay(100);
}