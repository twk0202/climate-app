let chartInstance;

// 외곽선 텍스트 플러그인
const outlineLabelPlugin = {
  id: 'outlineLabel',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta.hidden) {
        const lastPoint = meta.data[meta.data.length - 1];
        if (lastPoint) {
          const label = dataset.label;
          const x = lastPoint.x + 25;
          const y = lastPoint.y;

          ctx.save();
          ctx.font = 'bold 12px Orbitron, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';

          ctx.lineWidth = 4;
          ctx.strokeStyle = 'black'; // 외곽선
          ctx.strokeText(label, x, y);

          ctx.fillStyle = dataset.borderColor; // 텍스트 색
          ctx.fillText(label, x, y);

          ctx.restore();
        }
      }
    });
  }
};

function getChartOptions() {
  const isLight = document.body.classList.contains('light');

  const textColor = isLight ? '#222222' : '#f0f0f0';
  const gridColor = isLight ? '#cccccc' : '#444444';

  return {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
          color: textColor,
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: textColor,
          font: {
            size: 12
          }
        },
        grid: {
          color: gridColor
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temperature Anomaly (°C)',
          color: textColor,
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: textColor,
          font: {
            size: 12
          }
        },
        grid: {
          color: gridColor
        }
      }
    }
  };
}

function getWeather() {
  fetch("/weather")
    .then(res => res.json())
    .then(data => {
      if (data.error) throw new Error(data.error);

      const result = `
        <p>📍 위치: ${data.address}</p>
        <p>🌡 온도: ${data.temperature}</p>
        <p>☁️ 날씨: ${data.description}</p>
      `;
      document.getElementById("result").innerHTML = result;

      fetch("/advice")
        .then(res => res.json())
        .then(adviceData => {
          if (adviceData.error) throw new Error(adviceData.error);
          const adviceText = `<p>💡 건강 조언: ${adviceData.advice}</p>`;
          const adviceBox = document.getElementById("advice");
          adviceBox.innerHTML = adviceText;
          adviceBox.classList.add("show");
        })
        .catch(err => {
          document.getElementById("advice").innerHTML = "<p>❌ 건강 조언을 불러오지 못했습니다.</p>";
          console.error(err);
        });
    })
    .catch(err => {
      document.getElementById("result").innerText = "❌ 날씨 정보를 불러오지 못했습니다.";
      console.error(err);
    });
}

function getTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
}

function createChart(ctx) {
  const color = getTextColor();
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940,
        1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025
      ],
      datasets: [
        {
          label: 'HadCRUT',
          borderColor: 'pink',
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
      ]
    },
    options: getChartOptions(),
    plugins: [outlineLabelPlugin]  // ✅ 추가된 플러그인
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('globalTempChart').getContext('2d');
  chartInstance = createChart(ctx);

  const savedTheme = localStorage.getItem('theme');
  const toggleBtn = document.getElementById('themeToggleBtn');

  if (savedTheme === 'light') {
    document.body.classList.add('light');
    toggleBtn.textContent = '🌙 다크모드';
  } else {
    toggleBtn.textContent = '🌞 라이트모드';
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    toggleBtn.textContent = isLight ? '🌙 다크모드' : '🌞 라이트모드';

    // 🔄 Chart 재생성
    chartInstance.destroy();
    chartInstance = createChart(ctx);
  });
});
