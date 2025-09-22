import React from 'react';
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = ({ data, stats }) => {
  const perfOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(16,21,32,.96)",
        borderColor: "rgba(255,255,255,.08)",
        borderWidth: 1,
        titleColor: "#e6e9ef",
        bodyColor: "#cfd6e6",
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,.06)", drawBorder: false },
        ticks: { color: "#9aa8bf", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,.06)", drawBorder: false },
        ticks: { color: "#9aa8bf", font: { size: 11 } },
      },
    },
  };

  // Override data with colorful colors
  const colorfulPerfData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Page Views',
        data: data.datasets[0].data,
        backgroundColor: '#3b82f6', // blue
        borderRadius: 6,
        barThickness: 22
      },
      {
        label: 'Sales',
        data: data.datasets[1].data,
        backgroundColor: '#10b981', // green
        borderRadius: 6,
        barThickness: 22
      },
      {
        label: 'Conversion',
        data: data.datasets[2].data,
        backgroundColor: '#f59e0b', // orange
        borderRadius: 6,
        barThickness: 22
      },
    ]
  };

  return (
    <Card className="chart-card">
      <Card.Header>
        <div>
          <h6 className="mb-0">Performance</h6>
        </div>
        <div className="chart-stats">
          {stats.map((stat, index) => (
            <div key={index} className="chart-stat">
              <div className="chart-stat-value">{stat.value}</div>
              <div className="chart-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card.Header>
      <Card.Body>
        <div style={{ height: '300px' }}>
          <Bar data={colorfulPerfData} options={perfOptions} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default PerformanceChart;
