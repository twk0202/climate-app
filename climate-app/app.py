from flask import Flask, jsonify, render_template
import requests
from bs4 import BeautifulSoup
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/weather', methods=['GET'])
def get_weather():
    url = "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EB%82%A0%EC%94%A8"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        res = requests.get(url, headers=headers)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")

        address = soup.find('h2', {'class': 'title'}).text.strip()
        temperature = soup.find('div', {'class': 'temperature_text'}).text.strip()
        jawea = soup.find('li', {'class': 'item_today level3'}).text.strip()

        # 콘솔에도 출력 (디버깅용)
        print(f"> 위치: {address}\\n> 온도: {temperature}\\n> 자외선: {jawea}")

        # 🔥 여기서 실제로 응답을 반환해야 웹에서 볼 수 있음
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