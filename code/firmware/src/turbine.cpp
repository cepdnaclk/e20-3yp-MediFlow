/*#include <Arduino.h>
#include <AccelStepper.h>
#include "turbine.h"

// Remove these lines:
// #define IN1 32
// #define IN2 33
// #define IN3 2
// #define IN4 4
// AccelStepper stepper(AccelStepper::HALF4WIRE, IN1, IN3, IN2, IN4);

void runTurbine(bool runFlag) {
    if (runFlag) {
        if (stepper.distanceToGo() == 0) {
            //stepper.run() ;
            stepper.setMaxSpeed(2000.0);
            stepper.setAcceleration(500.0);
            stepper.moveTo(stepper.currentPosition() + 1000000);
        }
        // Remove stepper.run() from here
    } else {
        stepper.stop();
    }
}*/
