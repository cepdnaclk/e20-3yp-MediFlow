#include <Arduino.h>
#include <DHT.h>
#include "MotorControl.h"
#include "LaserModule.h"
#include "WiFiManagerModule.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "certs/certificates.h"
#include <ESP32Servo.h>
#include "turbine.h"

// N20 Motor Driver Pins (using L298N or similar)
const int N20_ENA = 32;    // Enable pin (PWM for speed control)
const int N20_IN1 = 33;    // Direction pin 1
const int N20_IN2 = 2;     // Direction pin 2

// LED Status Indicators
const int WIFI_LED_PIN = 18;    // LED for WiFi connection status
const int IOT_LED_PIN = 19;     // LED for IoT connection status

// N20 Motor control variables
bool n20MotorRunning = false;
int n20MotorSpeed = 150;   // PWM value (0-255)

void setupN20Motor() {
  pinMode(N20_ENA, OUTPUT);
  pinMode(N20_IN1, OUTPUT);
  pinMode(N20_IN2, OUTPUT);
  
  // Initialize motor to stopped state
  digitalWrite(N20_ENA, LOW);
  digitalWrite(N20_IN1, LOW);
  digitalWrite(N20_IN2, LOW);
}

void setupStatusLEDs() {
  pinMode(WIFI_LED_PIN, OUTPUT);
  pinMode(IOT_LED_PIN, OUTPUT);
  
  // Initialize LEDs to OFF state
  digitalWrite(WIFI_LED_PIN, LOW);
  digitalWrite(IOT_LED_PIN, LOW);
  
  Serial.println("Status LEDs initialized");
}

void updateWiFiLED(bool connected) {
  digitalWrite(WIFI_LED_PIN, connected ? HIGH : LOW);
}

void updateIoTLED(bool connected) {
  digitalWrite(IOT_LED_PIN, connected ? HIGH : LOW);
}

void startN20Motor() {
  digitalWrite(N20_IN1, HIGH);
  digitalWrite(N20_IN2, LOW);
  analogWrite(N20_ENA, n20MotorSpeed);
  n20MotorRunning = true;
  Serial.println("N20 Motor started");
}

void stopN20Motor() {
  digitalWrite(N20_ENA, LOW);
  digitalWrite(N20_IN1, LOW);
  digitalWrite(N20_IN2, LOW);
  n20MotorRunning = false;
  Serial.println("N20 Motor stopped");
}

void setN20MotorSpeed(int speed) {
  n20MotorSpeed = constrain(speed, 0, 255);
  if (n20MotorRunning) {
    analogWrite(N20_ENA, n20MotorSpeed);
  }
}

void reverseN20Motor() {
  digitalWrite(N20_IN1, LOW);
  digitalWrite(N20_IN2, HIGH);
  analogWrite(N20_ENA, n20MotorSpeed);
  n20MotorRunning = true;
  Serial.println("N20 Motor reversed");
}

unsigned long previousMillis = 0;
const unsigned long interval = 10; // 10 ms interval

Servo refillServo;
const int SERVO_PIN = 21;  

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

unsigned long lastHealthPublish = 0;

#define DHTPIN 5
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

int pillCount = 0;
int targetPillCount = 10;
bool wasLaserBlocked = false;
bool dispensing = false; 

int turntablePillCount = 10;   // Starting number of pills on the turntable
const int PILL_THRESHOLD = 3;  // Refill when fewer than this remain
const int REFILL_AMOUNT = 10;   // How many pills added per refill
bool refilling = false;         // Flag to prevent overlapping refills

// MQTT message callback
void messageHandler(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Incoming message on topic: ");
  Serial.println(topic);

  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';

  Serial.print("Complete Message: ");
  Serial.println(message);

  if (strstr(message, "\"command\":\"dispense\"") != NULL || 
      strstr(message, "\"command\": \"dispense\"") != NULL)
  {
    Serial.println("✓ Dispense command detected");
    
    char *quantityStart = strstr(message, "\"quantity\":");
    if (quantityStart)
    {
      quantityStart += 11;
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
      targetPillCount = 10;
    }
    
    char *medicineStart = strstr(message, "\"medicine_name\":\"");
    if (medicineStart) {
      medicineStart += 17;
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
    
    pillCount = 0;
    dispensing = true; 
    openGate();
    Serial.println("=== STARTING DISPENSE OPERATION ===");
    Serial.print("Target pills: ");
    Serial.println(targetPillCount);
    
    char confirmMsg[256];
    char *prescriptionStart = strstr(message, "\"prescription_id\":\"");
    if (prescriptionStart) {
      prescriptionStart += 19;
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
  wifiClient.setCACert(AWS_CERT_CA);
  wifiClient.setCertificate(AWS_CERT_CRT);
  wifiClient.setPrivateKey(AWS_CERT_PRIVATE);

  mqttClient.setServer(AWS_IOT_ENDPOINT, AWS_IOT_PORT);
  mqttClient.setCallback(messageHandler);

  Serial.println("Connecting to AWS IoT...");

  while (!mqttClient.connected())
  {
    if (mqttClient.connect(
        CLIENT_ID,
        PUBLISH_TOPIC_HEALTH,
        0,
        false,
        "{\"status\":\"offline\"}"
      ))
    {
      Serial.println("Connected to AWS IoT");
      updateIoTLED(true); // Turn on IoT LED when connected
      char msg[64];
      sprintf(msg, "{\"status\":\"%s\"}", "online");
      mqttClient.publish(PUBLISH_TOPIC_HEALTH, msg);

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
      updateIoTLED(false); // Turn off IoT LED when disconnected
      Serial.print("Failed to connect to AWS IoT, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void triggerRefill() {
  Serial.println("Triggering refill...");
  refilling = true;

  refillServo.write(180);
  Serial.println("Servo to 180°");
  delay(1000);

  refillServo.write(0);
  Serial.println("Servo to 0°");
  delay(500);

  turntablePillCount += REFILL_AMOUNT;
  Serial.print("Turntable refilled: ");
  Serial.println(turntablePillCount);
  refilling = false;
}

void setup()
{
  Serial.begin(115200);
  motorSetup();
  laserSetup();
  stopMotor();
  dht.begin();

  // Setup N20 motor instead of stepper
  setupN20Motor();
  
  // Setup status LEDs
  setupStatusLEDs();

  refillServo.attach(SERVO_PIN);
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  refillServo.setPeriodHertz(50);
  refillServo.attach(SERVO_PIN, 500, 2400);

  Serial.println();
  Serial.println("Initializing WiFi Manager...");
  
  if (wifiManager.begin()) {
    Serial.println("WiFi connected successfully");
    updateWiFiLED(true); // Turn on WiFi LED when connected
    Serial.print("IP address: ");
    Serial.println(wifiManager.getIPAddress());
    connectToAWS();
  } else {
    Serial.println("Failed to connect to WiFi");
    updateWiFiLED(false); // Turn off WiFi LED when disconnected
  }

  delay(2000);
}

void loop() {
  unsigned long currentMillis = millis();

  // === STEP 1: N20 Motor control ===
  // N20 motor runs continuously during dispensing, no auto-stop needed

  // === STEP 2: WiFi Reset Handling ===
  wifiManager.handleResetButton();

  // === STEP 3: MQTT & AWS IoT Reconnection ===
  if (!mqttClient.connected()) {
    updateIoTLED(false); // Turn off IoT LED when disconnected
    connectToAWS();
  }
  mqttClient.loop();

  if (!wifiManager.isConnected()) {
    updateWiFiLED(false); // Turn off WiFi LED when disconnected
    Serial.println("WiFi connection lost. Attempting to reconnect...");
    if (wifiManager.begin()) {
      Serial.println("WiFi reconnected");
      updateWiFiLED(true); // Turn on WiFi LED when reconnected
      if (!mqttClient.connected()) {
        connectToAWS();
      }
    } else {
      Serial.println("Failed to reconnect to WiFi");
      updateWiFiLED(false); // Keep WiFi LED off if reconnection fails
    }
  }

  // === STEP 4: Pill Counting via Laser Detection ===
  bool isBlocked = isLaserBlocked();

  if (dispensing && wasLaserBlocked && !isBlocked) {
    pillCount++;
    turntablePillCount--;

    Serial.print("Pill count: ");
    Serial.println(pillCount);

    char msg[128];
    sprintf(msg, "{\"pillCount\":%d,\"targetCount\":%d}", pillCount, targetPillCount);
    mqttClient.publish(PUBLISH_TOPIC, msg);

    if (pillCount >= targetPillCount) {
      stopMotor();
      stopN20Motor(); // Stop N20 motor instead of stepper
      closeGate();
      Serial.println("Target pill count reached.");

      sprintf(msg, "{\"pillCount\":%d,\"targetCount\":%d,\"status\":\"complete\"}",
              pillCount, targetPillCount);
      mqttClient.publish(PUBLISH_TOPIC, msg);

      dispensing = false;
    }
  }

  // === STEP 5: Refill Logic ===
  if (turntablePillCount < PILL_THRESHOLD && !refilling) {
    triggerRefill();
  }

  // === STEP 6: Store Laser State for Next Loop ===
  wasLaserBlocked = isBlocked;

  // === STEP 7: DC Motor Control (timed interval) ===
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    if (dispensing) {
      setMotorSpeed(60);
      if (!n20MotorRunning) {
        startN20Motor(); // Start N20 motor with DC motor
      }
    } else {
      stopMotor();
      if (n20MotorRunning) {
        stopN20Motor(); // Stop N20 motor with DC motor
      }
    }
  }

  // === STEP 8: Run Turbine Pump (non-blocking) ===
  //runTurbine(true);

  // === STEP 9: Periodic Health Reporting ===
  if (currentMillis - lastHealthPublish >= 30000) {
    float temperature = dht.readTemperature();
    char msg[128];
    if (isnan(temperature)) {
      sprintf(msg, "{\"status\":\"%s\", \"temperature\":null}", "online");
    } else {
      sprintf(msg, "{\"status\":\"%s\", \"temperature\":%.2f}", "online", temperature);
    }
    mqttClient.publish(PUBLISH_TOPIC_HEALTH, msg);
    lastHealthPublish = currentMillis;
  }

  static bool lastDispensing = false;
  if (dispensing != lastDispensing) {
    Serial.print("Dispensing state changed to: ");
    Serial.println(dispensing ? "TRUE" : "FALSE");
    lastDispensing = dispensing;
  }
}