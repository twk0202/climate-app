const API_KEY = "여기에_본인_API_키_입력";  // OpenWeatherMap에서 발급받은 키

function getWeather() {
  const city = "Seoul";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) throw new Error(data.message);

      const result = `
        <p>📍 위치: ${data.name}, ${data.sys.country}</p>
        <p>🌡 온도: ${data.main.temp}°C</p>
        <p>☁️ 날씨: ${data.weather[0].description}</p>
      `;
      document.getElementById("result").innerHTML = result;
    })
    .catch(err => {
      document.getElementById("result").innerText = "❌ 날씨 정보를 불러오지 못했습니다.";
      console.error(err);
    });
}

// 📈 평균기온 변화 그래프
window.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('globalTempChart').getContext('2d');

  const labels = [
    1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940,
    1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025
  ];

  const datasets = [
    {
      label: 'HadCRUT',
      borderColor: 'black',
      data: [-0.2, -0.15, -0.1, -0.12, -0.13, -0.14, -0.2, -0.15, -0.1, 0.0, 0.02, 0.05, 0.1, 0.2, 0.35, 0.5, 0.7, 1.0, 1.1],
      fill: false
    },
    {
      label: 'NOAAGlobalTemp',
      borderColor: 'steelblue',
      data: [-0.18, -0.12, -0.08, -0.1, -0.12, -0.1, -0.15, -0.1, -0.05, 0.05, 0.07, 0.08, 0.12, 0.25, 0.4, 0.55, 0.72, 1.05, 1.15],
      fill: false
    },
    {
      label: 'GISTEMP',
      borderColor: 'orange',
      data: [-0.2, -0.17, -0.11, -0.14, -0.15, -0.13, -0.18, -0.13, -0.08, 0.03, 0.04, 0.06, 0.11, 0.23, 0.38, 0.6, 0.75, 1.1, 1.2],
      fill: false
    },
    {
      label: 'ERA5',
      borderColor: 'tomato',
      data: [-0.21, -0.16, -0.09, -0.11, -0.14, -0.12, -0.17, -0.12, -0.06, 0.02, 0.03, 0.07, 0.14, 0.27, 0.41, 0.58, 0.74, 1.08, 1.19],
      fill: false
    },
    {
      label: 'JRA-55',
      borderColor: 'gold',
      data: [-0.19, -0.14, -0.1, -0.13, -0.12, -0.1, -0.16, -0.11, -0.07, 0.01, 0.03, 0.06, 0.13, 0.26, 0.4, 0.57, 0.71, 1.07, 1.18],
      fill: false
    }
  ];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#fff' }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year',
            color: '#fff'
          },
          ticks: { color: '#fff' }
        },
        y: {
          title: {
            display: true,
            text: 'Temperature Anomaly (°C)',
            color: '#fff'
          },
          ticks: { color: '#fff' }
        }
      }
    }
  });
});
