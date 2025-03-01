#ifndef LASERMODULE_H
#define LASERMODULE_H

#include <Arduino.h>

#define LASER_PIN 22
#define LASER_TRANSMITTER_PIN 23

void laserSetup();
bool isLaserBlocked();

#endif 