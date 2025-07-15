
#include "MotorControl.h"

Servo gateServo;

void motorSetup() {
  Serial.begin(115200);
  Serial.println("Motor driver setup initialized");
  delay(2000);

  pinMode(RPWM_PIN, OUTPUT);
  pinMode(LPWM_PIN, OUTPUT);
  pinMode(R_EN_PIN, OUTPUT);
  pinMode(L_EN_PIN, OUTPUT);

  digitalWrite(R_EN_PIN, HIGH);
  digitalWrite(L_EN_PIN, HIGH);
}

void setMotorSpeed(int speed) {
  analogWrite(RPWM_PIN, 0);
  analogWrite(LPWM_PIN, speed);
}

void stopMotor() {
  analogWrite(RPWM_PIN, 0);
  analogWrite(LPWM_PIN, 0);
}

// void servoSetup() {
//   gateServo.attach(SERVO_PIN);
//   closeGate();
// }

void openGate() {
  gateServo.write(90); 
}

void closeGate() {
  gateServo.write(0); 
}
