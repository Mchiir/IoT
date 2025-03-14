// MQTT Broker Configuration
const brokerUrl = "ws://157.173.101.159:9001"; // Use your WebSocket-enabled broker
const topic = "/student_group/light_control";

// Create MQTT Client
const mqttClient = mqtt.connect(brokerUrl);

// Handle connection
mqttClient.on("connect", () => {
    console.log("✅ Connected to MQTT via WebSockets");
    mqttClient.subscribe(topic, (err) => {
        if (!err) {
            console.log(`📡 Subscribed to topic: ${topic}`);
        } else {
            console.error("Subscription error:", err);
        }
    });
});

// Publish message on button click
function toggleLight(state) {
    console.log("📤 Sending:", state);
    mqttClient.publish(topic, state);
    
    // Append to log
    const logArea = document.getElementById("log");
    logArea.value += `Sent: ${state}\n`;
    logArea.scrollTop = logArea.scrollHeight; // Auto-scroll
}