/*#include <Arduino.h>

// Define the GPIO pins connected to the laser sensor
#define LASER_RECEIVER_PIN 22
#define LASER_TRANSMITTER_PIN 23

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  Serial.println("Laser module test initialized");

  // Set the laser receiver pin as input
  pinMode(LASER_RECEIVER_PIN, INPUT);
  // Set the laser transmitter pin as output
  pinMode(LASER_TRANSMITTER_PIN, OUTPUT);
  // Turn on the laser transmitter
  digitalWrite(LASER_TRANSMITTER_PIN, HIGH);
}

void loop() {
  // Read the laser receiver input
  int laserValue = digitalRead(LASER_RECEIVER_PIN);

  // Check if the laser beam is blocked
  if (laserValue == HIGH) {
    Serial.println("Laser beam blocked");
  } else {
    Serial.println("Laser beam not blocked");
  }

  // Add a small delay to avoid flooding the serial monitor
  delay(50);
}*/
  