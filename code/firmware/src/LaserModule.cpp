#include "LaserModule.h"

void laserSetup() {
  pinMode(LASER_PIN, INPUT);
 
  pinMode(LASER_TRANSMITTER_PIN, OUTPUT);
  digitalWrite(LASER_TRANSMITTER_PIN, HIGH);
}

bool isLaserBlocked() {
  int laserValue = digitalRead(LASER_PIN);
  return (laserValue == HIGH);
}