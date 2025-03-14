# Welcome to weather-station

just execute these scripts to setup the environment:

```cmd
    git clone --branch weather-station --single-branch  https://github.com/Mchiir/IoT.git

    cd IoT
    cd server
    py -m venv .venv
    .\.venv.\Scripts\activate
    pip install flask flask-cors
    pip freeze > requirements.txt
    flask --app app run
```