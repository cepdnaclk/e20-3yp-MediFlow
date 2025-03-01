#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <DHT.h>
#include "MotorControl.h"
#include "LaserModule.h"
#include <SPIFFS.h>

const char* ssid = "";
const char* password = "";

const char* mqtt_server = "aelh7uratdfcb-ats.iot.eu-north-1.amazonaws.com"; 
const int mqtt_port = 8883;
const char* mqtt_user = "";
const char* mqtt_password = "";

const char* pill_count_topic = "pillCounter/pillCount";
const char* target_reached_topic = "pillCounter/targetReached";
const char* target_pill_count_topic = "pillCounter/targetPillCount";
const char* temperature_topic = "sensor/temperature";

WiFiClientSecure espClient;
PubSubClient client(espClient);


#define DHTPIN 4 
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

int pillCount = 0;
int targetPillCount = 10; 
bool wasLaserBlocked = false; 

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (String(topic) == target_pill_count_topic) {
    targetPillCount = message.toInt();
    Serial.print("New target pill count: ");
    Serial.println(targetPillCount);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqtt_user, mqtt_password)) {
      Serial.println("connected");
      client.subscribe(target_pill_count_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  if (!SPIFFS.begin(true)) {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  File ca = SPIFFS.open("/ca.pem", "r");
  if (!ca) {
    Serial.println("Failed to open CA certificate");
    return;
  }
  String ca_str = ca.readString();
  espClient.setCACert(ca_str.c_str());
  ca.close();

  File cert = SPIFFS.open("/client.crt", "r");
  if (!cert) {
    Serial.println("Failed to open client certificate");
    return;
  }
  String cert_str = cert.readString();
  espClient.setCertificate(cert_str.c_str());
  cert.close();

  File key = SPIFFS.open("/client.key", "r");
  if (!key) {
    Serial.println("Failed to open client key");
    return;
  }
  String key_str = key.readString();
  espClient.setPrivateKey(key_str.c_str());
  key.close();

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  motorSetup();
  laserSetup();
  servoSetup();
  openGate();
  stopMotor();

  dht.begin();

  delay(2000);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  bool isBlocked = isLaserBlocked();

  if (wasLaserBlocked && !isBlocked) {
    pillCount++;
    Serial.print("Pill count: ");
    Serial.println(pillCount);

    char pillCountStr[10];
    itoa(pillCount, pillCountStr, 10);
    client.publish(pill_count_topic, pillCountStr);

    if (pillCount >= targetPillCount) {
      stopMotor();
      closeGate();
      Serial.println("Target pill count reached. Motor stopped.");
      client.publish(target_reached_topic, "Target pill count reached. Motor stopped.");
      while (true); 
    }
  }

  
  wasLaserBlocked = isBlocked;

  
  int motorSpeed = 70; 
  setMotorSpeed(motorSpeed);

  float temperature = dht.readTemperature();
  if (!isnan(temperature)) {
    char temperatureStr[10];
    dtostrf(temperature, 1, 2, temperatureStr);
    client.publish(temperature_topic, temperatureStr);
  }


  delay(100);
}