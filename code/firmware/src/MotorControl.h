#ifndef MOTORCONTROL_H
#define MOTORCONTROL_H

#include <Arduino.h>
#include <ESP32Servo.h>

#define RPWM_PIN 25
#define LPWM_PIN 26
#define R_EN_PIN 27
#define L_EN_PIN 14

#define SERVO_PIN 5
void stopMotor();
void motorSetup();
void setMotorSpeed(int speed);
void stopMotor();
void servoSetup();
void openGate();
void closeGate();

#endif 