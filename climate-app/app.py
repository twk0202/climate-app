from flask import Flask, jsonify, render_template
import requests
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

app = Flask(__name__)

# 환경변수에서 API 키 불러오기
API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/weather', methods=['GET'])
def get_weather():
    city = "Seoul"
    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={city}&appid={API_KEY}&units=metric&lang=kr"
    )

    try:
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()

        address = f"{data['name']}, {data['sys']['country']}"
        temperature = f"{data['main']['temp']}°C"
        jawea = data['weather'][0]['description']

        return jsonify({
            "address": address,
            "temperature": temperature,
            "jawea": jawea
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
