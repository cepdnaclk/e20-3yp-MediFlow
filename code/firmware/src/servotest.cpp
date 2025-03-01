/*#include <Arduino.h>
#include <ESP32Servo.h>

#define SERVO_PIN 5

Servo gateServo;

void setup() {
  Serial.begin(115200);
  Serial.println("Servo test initialized");

  gateServo.attach(SERVO_PIN);
}

void loop() {
  // Open the gate by setting the servo position
  Serial.println("Opening gate");
  gateServo.write(90); 
  delay(2000); // Wait for 2 seconds

  // Close the gate by setting the servo position
  Serial.println("Closing gate");
  gateServo.write(0); 
  delay(2000); // Wait for 2 seconds
}
  */