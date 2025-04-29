const wsUrl = 'ws://localhost:8765';
let ws;

function connectWebSocket() {
    console.log(`Attempting to connect to ${wsUrl}`);
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log(`Connected to WebSocket server at ${wsUrl}`);
        document.getElementById('status').textContent = 'Status: Connected to server';
    };

    ws.onmessage = (event) => {
        console.log('Received from server:', event.data);
        document.getElementById('status').textContent = `Status: ${event.data}`;
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        document.getElementById('status').textContent = 'Status: WebSocket error (check console)';
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
        document.getElementById('status').textContent = 'Status: Disconnected from server. Retrying...';
        setTimeout(connectWebSocket, 5000);
    };
}

connectWebSocket();

// Ensure form exists before binding
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('scheduleForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const onTime = document.getElementById('onTime').value;
            const offTime = document.getElementById('offTime').value;
            const schedule = { onTime, offTime };
            console.log('Submitting schedule:', schedule);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(schedule));
                console.log('Schedule sent to server');
                document.getElementById('status').textContent = 'Status: Schedule sent!';
            } else {
                console.error('WebSocket not open:', ws.readyState);
                document.getElementById('status').textContent = 'Status: WebSocket not connected';
            }
        });
    } else {
        console.error('Form with ID "scheduleForm" not found');
    }
});