import paho.mqtt.client as mqtt
import signal
import sys

# MQTT Broker Configuration
BROKER = "157.173.101.159"  # Use your broker IP/hostname
PORT = 1883  # Standard MQTT port (Ensure your broker allows this)
TOPIC = "/student_group/light_control"

# Callback for when the client receives a CONNACK response from the server
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT Broker!")
        client.subscribe(TOPIC)
        print(f"📡 Subscribed to topic: {TOPIC}")
    else:
        print(f"❌Connection failed with code {rc}")

# Callback for when a PUBLISH message is received from the broker
def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    if payload == "ON":
        print("💡 Light is TURNED ON")
    elif payload == "OFF":
        print("🚫 Light is TURNED OFF")
    else:
        print(f"Unknown message received: {payload}")

def graceful_exit(signal, frame):
    print("\n💡 Disconnecting from MQTT Broker...")
    client.loop_stop()  # Stoping the MQTT client loop
    client.disconnect()  # Disconnecting from the broker
    print("✅ Disconnected. Program terminated.")
    sys.exit(0)

signal.signal(signal.SIGINT, graceful_exit)

# MQTT Client instantiation
client = mqtt.Client()

# callback functions assignment
client.on_connect = on_connect
client.on_message = on_message

# instatiating Broker connection and starting listening
try:
    client.connect(BROKER, PORT, 60)
    client.loop_forever()  # Keeping listening for messages
except Exception as e:
    print(f"Connection error: {e}")
