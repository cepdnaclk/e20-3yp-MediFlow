/*#include <Arduino.h>

// === Pin Definitions ===
// L298N Motor Driver Pins
#define MOTOR_IN1 18
#define MOTOR_IN2 19
#define MOTOR_PWM 21 // Must be PWM-capable

// Encoder Pins (must be input-capable and interrupt-capable)
#define ENCODER_A 34
#define ENCODER_B 35

// === Encoder Variables ===
volatile long encoderCount = 0;
bool lastAState = LOW;

// === Interrupt Routine for Encoder ===
void IRAM_ATTR handleEncoderA() {
  bool A = digitalRead(ENCODER_A);
  bool B = digitalRead(ENCODER_B);

  if (A != lastAState) {
    if (A == B)
      encoderCount++;
    else
      encoderCount--;
  }

  lastAState = A;
}

// === Setup ===
void setup() {
  Serial.begin(115200);

  // Motor control pins
  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  pinMode(MOTOR_PWM, OUTPUT);

  // Encoder input pins
  pinMode(ENCODER_A, INPUT);
  pinMode(ENCODER_B, INPUT);

  // Attach interrupt to encoder A pin
  attachInterrupt(digitalPinToInterrupt(ENCODER_A), handleEncoderA, CHANGE);

  // Setup PWM (channel 0, 5 kHz, 8-bit resolution)
  ledcSetup(0, 5000, 8);
  ledcAttachPin(MOTOR_PWM, 0);

  // Start motor in forward direction
  digitalWrite(MOTOR_IN1, HIGH);
  digitalWrite(MOTOR_IN2, LOW);
  ledcWrite(0, 180); // Set speed (0–255)
}

// === Main Loop ===
void loop() {
  Serial.print("Encoder Count: ");
  Serial.println(encoderCount);
  delay(500);
}*/