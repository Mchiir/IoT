from flask import Flask, request, jsonify, g, send_from_directory 
import sqlite3
from flask_cors import CORS, cross_origin

app = Flask(__name__)

# Enable CORS for the allowed origins
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

DATABASE = 'database.sqlite'

# Utility to get database connection
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
    return g.db

# Close the database connection after request
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

# Initialize database and create table if not exists
def init_db():
    with app.app_context():
        db = get_db()
        db.execute('''CREATE TABLE IF NOT EXISTS weather_data (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        temperature REAL NOT NULL,
                        humidity REAL NOT NULL,
                        timestamp INTEGER NOT NULL)''')
        db.commit()

# Endpoint for the home route
@app.route("/")
def hello_world():
    return "<p>Welcome to Weather station backend!</p>"

@app.route("/home")
def home():
    return send_from_directory('templates', 'index.html')

# Endpoint to handle saving and fetching weather data
@app.route('/weather_api', methods=['POST', 'GET'])
@cross_origin(origins=["http://127.0.0.1:5500", "http://localhost:3000", "http://127.0.0.1:3000"])
def weather_data():
    if request.method == 'POST':
        return save_weather_data()
    else:
        return send_weather_data()

# Function to save weather data to the database
def save_weather_data():
    # Get JSON data from the request
    data = request.get_json()

    # Check if the necessary data is provided
    if 'temperature' not in data or 'humidity' not in data or 'timestamp' not in data:
        return jsonify({"error": "Invalid or incorrect or incomplete data passed!"}), 400

    temperature = data['temperature']
    humidity = data['humidity']
    timestamp = data['timestamp']

    # Insert data into the database
    db = get_db()
    db.execute('INSERT INTO weather_data (temperature, humidity, timestamp) VALUES (?, ?, ?)',
               (temperature, humidity, timestamp))
    db.commit()

    return jsonify({"message": "Weather data saved successfully!"}), 200

# Function to fetch weather data from the database
def send_weather_data():
    db = get_db()
    cursor = db.execute('SELECT * FROM weather_data ORDER BY timestamp DESC')
    rows = cursor.fetchall()

    # Format the result into a list of dictionaries
    weather_data = []
    for row in rows:
        weather_data.append({
            "id": row[0],
            "temperature": row[1],
            "humidity": row[2],
            "timestamp": row[3]
        })

    return jsonify(weather_data), 200

if __name__ == "__main__":
    init_db()  # Initialize the database when the app starts
    app.run(debug=True)
