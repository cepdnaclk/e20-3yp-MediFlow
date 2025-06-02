#include <Arduino.h>
#include <DHT.h>
#include "MotorControl.h"
#include "LaserModule.h"

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Global variables
int pillCount = 0;
const int targetPillCount = 7;  // Hardcoded target count
bool wasLaserBlocked = false;
bool dispensing = true;  // Start dispensing immediately
unsigned long lastTempCheck = 0;
const long tempCheckInterval = 300000;  // Check temperature every 30 seconds

void setup() {
  Serial.begin(115200);
  Serial.println("Starting hardware test...");
  
  motorSetup();
  laserSetup();
  servoSetup();
  dht.begin();
  
  openGate();
  stopMotor();
  
  Serial.println("Target pill count: 7");
  Serial.println("Beginning dispensing...");
}

void loop() {
  bool isBlocked = isLaserBlocked();

  if (dispensing && wasLaserBlocked && !isBlocked) {
    pillCount++;
    Serial.print("Pill count: ");
    Serial.println(pillCount);

    if (pillCount >= targetPillCount) {
      stopMotor();
      delay(200);  
      closeGate();
      Serial.println("Target pill count reached. Motor stopped.");
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


  unsigned long currentMillis = millis();
  if (currentMillis - lastTempCheck >= tempCheckInterval) {
    float temperature = dht.readTemperature();
    if (!isnan(temperature)) {
      Serial.print("Temperature: ");
      Serial.print(temperature);
      Serial.println("°C");
    } else {
      Serial.println("Failed to read temperature!");
    }
    lastTempCheck = currentMillis;
  }

  delay(100);  
}