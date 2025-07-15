/*#include <Arduino.h>
#include <ESP32Servo.h>

// Create a servo object
Servo myServo;

// Define the servo pin
const int servoPin = 21;

void setup() {
  Serial.begin(115200);

  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);

  myServo.setPeriodHertz(50); // Standard 50Hz
  myServo.attach(servoPin, 500, 2400);

  Serial.println("Starting one-time servo test");

  // Move from 0 to 180 degrees
  for (int pos = 0; pos <= 180; pos++) {
    myServo.write(pos);
    Serial.print("Servo position: ");
    Serial.println(pos);
    delay(15);
  }

  delay(2000); // Wait 2 seconds at 180°

  // Move from 180 to 0 degrees
  for (int pos = 180; pos >= 0; pos--) {
    myServo.write(pos);
    Serial.print("Servo position: ");
    Serial.println(pos);
    delay(15);
  }

  Serial.println("Servo test complete");
}

void loop() {
  // Do nothing
}
 */