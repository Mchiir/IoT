const int LED_PIN = 13;
String command;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  Serial.begin(9600);
  while (!Serial) {
    ;
  }
  Serial.println("Arduino ready");
}

void loop() {
  if (Serial.available() > 0) {
    command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "1") {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED ON");
    } else if (command == "0") {
      digitalWrite(LED_PIN, LOW);
      Serial.println("LED OFF");
    } else {
      Serial.println("Unknown command: " + command);
    }
  }
}