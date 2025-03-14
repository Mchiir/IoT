# Congrats you just landed to IoT LightSwitch repo

## please leave a star if it's worth it

### Features

- Subscribes to `/student_group/light_control` via MQTT.
- Prints the light status based on MQTT messages.
- Simulates an ESP8266 IoT device.
- Works with an HTML frontend.

### Installation, first open the public/index.html with live-server

1. Clone the repository:
```cmd
    git clone https://github.com/Mchiir/IoT.git
    cd IoT
    py -m venv .venv
    .\.venv\Scripts\activate
    pip install paho-mqtt
    py esp8266_simulator.py
```