#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

// const char* ssid = "Your Username";
// const char* password = "Your Password";

WebSocketsServer webSocket = WebSocketsServer(81);

// sensors
const int POT_OXYGEN   = A0;
const int POT_NITROGEN = A1;
const int POT_SOLAR    = A2;
const int POT_LATITUDE = A3;
const int POT_ALTITUDE = A4;

// button
const int BUTTON_PIN = 8;
bool lastButtonState = HIGH;

unsigned long lastSensorSend = 0;

void setup() {
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }

  Serial.println("\nConnected!");
  Serial.println(WiFi.localIP());

  webSocket.begin();
}

// send button event ONLY when pressed
void sendButtonEvent() {
  StaticJsonDocument<128> doc;
  doc["event"] = "button_press";

  String msg;
  serializeJson(doc, msg);

  webSocket.broadcastTXT(msg);
}

// send sensor data
void sendSensorData(int oxygen, int nitrogen, int solar, int latitude, int altitude) {
  StaticJsonDocument<256> doc;

  doc["oxygen"]   = oxygen;
  doc["nitrogen"] = nitrogen;
  doc["solar"]    = solar;
  doc["latitude"] = latitude;
  doc["altitude"] = altitude;

  String msg;
  serializeJson(doc, msg);

  webSocket.broadcastTXT(msg);
}

void loop() {
  webSocket.loop();

  // BUTTON (edge detect)
  bool buttonState = digitalRead(BUTTON_PIN);

  if (lastButtonState == HIGH && buttonState == LOW) {
    Serial.println("BUTTON PRESSED!");
    sendButtonEvent();
  }

  lastButtonState = buttonState;

  // sensor throttle (important — don't spam server)
  if (millis() - lastSensorSend > 100) {
    lastSensorSend = millis();

    int oxygen   = map(analogRead(POT_OXYGEN),   0, 4095, 0, 100);
    int nitrogen = map(analogRead(POT_NITROGEN), 0, 4095, 0, 100);
    int solar    = map(analogRead(POT_SOLAR),    0, 4095, 1, 5);
    int latitude = map(analogRead(POT_LATITUDE), 0, 4095, 85, 85);
    int altitude = map(analogRead(POT_ALTITUDE), 0, 4095, 0, 100);

    sendSensorData(oxygen, nitrogen, solar, latitude, altitude);
  }
}