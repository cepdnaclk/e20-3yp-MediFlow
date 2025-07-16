/*#include <Arduino.h>
#include <AccelStepper.h>

// ULN2003 Motor Driver Pins
#define IN1 32
#define IN2 33
#define IN3 2
#define IN4 4

// AccelStepper: 4 = 4 wire full-step
AccelStepper stepper(AccelStepper::HALF4WIRE, IN1, IN3, IN2, IN4);

void setup() {
  Serial.begin(115200);
  // Set as high as your stepper and driver can handle reliably
  stepper.setMaxSpeed(2000.0);      // Increase if your hardware allows
  stepper.setAcceleration(500.0);   // Increase if your hardware allows
  stepper.moveTo(1000000);          // Large number for continuous rotation
}

void loop() {
  stepper.run();
}
  */