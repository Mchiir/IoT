// WebSocket Client
const socket = new WebSocket('ws://157.173.101.159:9001'); // Replace with your WebSocket server URL

const ctx = document.getElementById('myChart').getContext('2d')
const timeLabels = []
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
})

let tempData = []
let humidityData = []
let startTime = Date.now()

// WebSocket connection open event
socket.onopen = () => {
    console.log("Connected to WebSocket")
}

// WebSocket message event
socket.onmessage = (event) => {
    const message = JSON.parse(event.data) // Assuming the message is JSON formatted
    const currentTime = Math.floor((Date.now() - startTime) / 60000) // Time in minutes

    if (message.temperature) {
        const tempValue = parseFloat(message.temperature)
        document.getElementById("temp").innerText = tempValue.toFixed(2)
        tempData.push(tempValue)
    }

    if (message.humidity) {
        const humidityValue = parseFloat(message.humidity)
        document.getElementById("humidity").innerText = humidityValue.toFixed(2)
        humidityData.push(humidityValue)
    }
}

// Function to calculate averages and update the chart
const calculateAndStoreAverages = () => {
    if (tempData.length > 0 && humidityData.length > 0) {
        const avgTemp = tempData.reduce((a, b) => a + b, 0) / tempData.length
        const avgHumidity = humidityData.reduce((a, b) => a + b, 0) / humidityData.length
        const timestamp = Math.floor(Date.now() / 1000) // Current timestamp in seconds

        // Update chart
        timeLabels.push(Math.floor((Date.now() - startTime) / 60000)) // Update time labels
        chart.data.datasets[0].data.push(avgTemp)
        chart.data.datasets[1].data.push(avgHumidity)
        chart.update() // Refresh the chart

        // Clear data arrays for next averaging period
        tempData = []
        humidityData = []
    }
}

// Set an interval to calculate averages every minute (60000 ms)
setInterval(calculateAndStoreAverages, 10000)