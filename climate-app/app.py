from flask import Flask, jsonify, render_template
import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai

app = Flask(__name__)
load_dotenv()

API_KEY1 = os.getenv("OPENWEATHER_API_KEY")
API_KEY2 = os.getenv("GOOGLE_GEMINI_API_KEY")

genai.configure(api_key=API_KEY2)
model = genai.GenerativeModel("gemini-2.5-flash")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/weather')
def get_weather():
    city = "Seoul"
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY1}&units=metric&lang=kr"
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

@app.route('/advice')
def get_advice():
    city = "Seoul"
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY1}&units=metric&lang=kr"
    try:
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()

        # 날씨 정보를 조합한 프롬프트 생성
        prompt = f"""지금 대한민국 서울의 기온은 {data['main']['temp']}도이고, 날씨는 '{data['weather'][0]['description']}'입니다.
이 날씨에서 외출하거나 활동할 때 건강을 위해 유의해야 할 점이나 추천 행동을 알려주세요. 간결하고 실용적으로 한국어로 답해주세요."""

        # Gemini 호출
        response = model.generate_content(prompt)
        print("Gemini 응답:", response)  # 👈 로그 출력
        advice = response.text.strip()
        return jsonify({"advice": advice})
    except Exception as e:
        print("Gemini 오류:", e)  # 👈 로그 확인
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
