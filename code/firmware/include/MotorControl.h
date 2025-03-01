#ifndef MOTORCONTROL_H
#define MOTORCONTROL_H

#include <Arduino.h>

#define RPWM_PIN 25
#define LPWM_PIN 26
#define R_EN_PIN 27
#define L_EN_PIN 14

void motorSetup();
void setMotorSpeed(int speed);

#endif 