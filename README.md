# 💡 Light Scheduler

## 📝 Overview
A smart light scheduling system that allows users to set ON/OFF times via a web UI.  
The schedule is sent over WebSocket → MQTT → Arduino, controlling an LED accordingly.

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript (WebSocket client)
- **Backend**: Python (WebSocket server, MQTT publisher)
- **IoT**: Arduino (LED control), MQTT (Mosquitto broker)
- **Protocol**: WebSocket, MQTT, Serial

## 🚀 How to Run
1. **Start MQTT Broker**  
   Run Mosquitto on `localhost:1883`.

2. **Connect Arduino**  
   Upload the Arduino sketch and ensure it's on the correct serial port (e.g., `COM3`).

3. **Run Subscriber**  
   `python subscriber.py` (receives MQTT messages, sends commands to Arduino)

4. **Run WebSocket Server**  
   `python backend.py` (listens on `ws://localhost:8765`)

5. **Open `client.html`**  
   In a browser to set the light ON/OFF schedule.

🕒 LED will toggle based on the scheduled times!