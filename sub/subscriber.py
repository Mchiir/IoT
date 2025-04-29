import paho.mqtt.client as mqtt
import serial
import time
from datetime import datetime

# Arduino serial port (update to your port, e.g., COM3)
ARDUINO_PORT = 'COM3'
BAUD_RATE = 9600

# Initialize serial connection to Arduino
try:
    arduino = serial.Serial(ARDUINO_PORT, BAUD_RATE, timeout=1)
    time.sleep(2)
    print(f"Connected to Arduino on {ARDUINO_PORT}")
except Exception as e:
    print(f"Failed to connect to Arduino: {e}")
    arduino = None

# Store current schedule
current_schedule = None

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")
    client.subscribe("light/schedule")
    print("Subscribed to topic: light/schedule")

def on_message(client, userdata, msg):
    global current_schedule
    print(f"Received MQTT message on topic {msg.topic}: {msg.payload.decode()}")
    try:
        on_time, off_time = msg.payload.decode().split(',')
        current_schedule = {'on_time': on_time, 'off_time': off_time}
        print(f"Updated schedule: ON at {on_time}, OFF at {off_time}")
    except ValueError as e:
        print(f"Error parsing schedule: {e}")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

print("Connecting to MQTT broker at localhost:1883")
try:
    client.connect("localhost", 1883, 60)
    client.loop_start()  # Run MQTT loop in background
except Exception as e:
    print(f"Failed to connect to MQTT broker: {e}")
    exit(1)

# Main loop to check schedule
while True:
    if current_schedule:
        current_time = datetime.now().strftime('%H:%M:%S')
        if current_time == current_schedule['on_time']:
            if arduino:
                arduino.write(b'1\n')
                print(f"[{current_time}] Sent to Arduino: 1")
        elif current_time == current_schedule['off_time']:
            if arduino:
                arduino.write(b'0\n')
                print(f"[{current_time}] Sent to Arduino: 0")
    time.sleep(1)