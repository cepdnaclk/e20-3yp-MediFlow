/*#include <Arduino.h>
#include <ESP32Servo.h>

// Create a servo object
Servo myServo;

// Define the servo pin (you can use any PWM-capable pin)
const int servoPin = 21;

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);
  
  // Allow allocation of all timers for servo library
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  
  // Attach the servo to the pin with min/max pulse width
  // Standard 9g servo: 500-2400 microseconds pulse width
  myServo.setPeriodHertz(50);    // Standard 50Hz servo
  myServo.attach(servoPin, 500, 2400);
  
  Serial.println("9G Servo Motor Test Started");
  Serial.println("The servo will sweep from 0 to 180 degrees and back");
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (int pos = 0; pos <= 180; pos++) {
    myServo.write(pos);
    Serial.print("Servo position: ");
    Serial.println(pos);
    delay(15); // Wait 15ms for the servo to reach the position
  }
  
  delay(500); // Pause at 180 degrees
  
  // Sweep from 180 to 0 degrees
  for (int pos = 180; pos >= 0; pos--) {
    myServo.write(pos);
    Serial.print("Servo position: ");
    Serial.println(pos);
    delay(15); // Wait 15ms for the servo to reach the position
  }
  
  delay(500); // Pause at 0 degrees
}
*/