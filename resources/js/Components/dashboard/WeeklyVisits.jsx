import React from 'react';
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeeklyVisits = ({ data }) => {
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
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
      x: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: '#9aa8bf' }},
      y: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: '#9aa8bf' }},
    }
  };

  // Override data with colorful colors
  const colorfulLineData = {
    labels: data.labels,
    datasets: [{
      label: 'Visits',
      data: data.datasets[0].data,
      fill: true,
      borderColor: '#3b82f6', // blue
      backgroundColor: 'rgba(59, 130, 246, 0.15)', // blue with transparency
      pointRadius: 0,
      tension: 0.35,
    }]
  };

  return (
    <Card className="chart-card">
      <Card.Header>
        <h6 className="mb-0">Weekly Visits</h6>
      </Card.Header>
      <Card.Body>
        <div style={{ height: '250px' }}>
          <Line data={colorfulLineData} options={lineOptions} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default WeeklyVisits;
