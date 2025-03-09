 // Initialize MQTT Client
 const mqttClient = mqtt.connect('ws://157.173.101.159:9001') // Replace with your MQTT broker URL

 const ctx = document.getElementById('myChart').getContext('2d')
 const timeLabels = []
 let timeCounter = 0; // Time counter for labels (in minutes)

 const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels, // x-axis labels
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [], // y-axis data for temperature
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'Humidity (%)',
                data: [], // y-axis data for humidity
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }
        ]
    },
    options: {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Values'
                },
                beginAtZero: false
            },
            x: {
                title: {
                    display: true,
                    text: 'Time (minutes)'
                },
                ticks: {
                    stepSize: 5 // Set stepSize to 5 minutes
                }
            }
        },
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    }
});

 let tempData = []
 let humidityData = []
 let startTime = Date.now()

 mqttClient.on('connect', () => {
     console.log("Connected to MQTT via WebSockets")
     mqttClient.subscribe("/work_group_01/room_temp/temperature")
     mqttClient.subscribe("/work_group_01/room_temp/humidity")
 })

 mqttClient.on('message', (topic, message) => {
     console.log(`Received: ${topic} → ${message.toString()}`)
     const currentTime = Math.floor((Date.now() - startTime) / 60000) // Time in minutes

     if (topic === "/work_group_01/room_temp/temperature") {
         const tempValue = parseFloat(message.toString())
         document.getElementById("temp").innerText = tempValue.toFixed(2)
         tempData.push(tempValue)
     } else if (topic === "/work_group_01/room_temp/humidity") {
         const humidityValue = parseFloat(message.toString())
         document.getElementById("humidity").innerText = humidityValue.toFixed(2)
         humidityData.push(humidityValue)
     }
 })

 // Function to calculate averages and insert into the database
 const calculateAndStoreAverages = async () => {
     if (tempData.length > 0 && humidityData.length > 0) {
         const avgTemp = tempData.reduce((a, b) => a + b, 0) / tempData.length
         const avgHumidity = humidityData.reduce((a, b) => a + b, 0) / humidityData.length
         const timestamp = new Date().getTime() // Current timestamp in (Integer)

         // Update chart
        timeLabels.push(timeCounter); // Push current time counter to chart
        chart.data.datasets[0].data.push(avgTemp);
        chart.data.datasets[1].data.push(avgHumidity);

        $.ajax({
            url: 'http://localhost:5000/weather_api',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                temperature: avgTemp,
                humidity: avgHumidity,
                timestamp: timestamp
            }),
            success: function(response) {
                console.log(response.message);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

         chart.update() // Refresh the chart

         // Clear data arrays for next averaging period
         tempData = []
         humidityData = []
         timeCounter++
     }
 }

setInterval(calculateAndStoreAverages, 5000) // 5 sec