from flask import Flask, jsonify, render_template
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/weather')
def get_weather():
    city = "Seoul"
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric&lang=kr"
    try:
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()

        return jsonify({
            "address": f"{data['name']}, {data['sys']['country']}",
            "temperature": f"{data['main']['temp']}°C",
            "description": data['weather'][0]['description']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
