import React from 'react';
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const centerText = {
  id: 'centerText',
  afterDatasetsDraw(chart) {
    const {ctx, chartArea:{width,height}} = chart;
    ctx.save();
    ctx.font = '700 22px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#e6e9ef';
    ctx.textAlign = 'center';
    ctx.fillText('8,452', width/2, height/2 - 2);
    ctx.font = '500 11px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#9aa8bf';
    ctx.fillText('Total Sessions', width/2, height/2 + 16);
    ctx.restore();
  }
};

const DoughnutCard = ({ data, total, label }) => {
  const doughnutOptions = {
    cutout: '68%',
    plugins: { legend: { display: false } }
  };

  // Override data with colorful colors
  const colorfulDoughnutData = {
    labels: ['Clothing', 'Electronics', 'Furniture'],
    datasets: [{
      data: [45, 30, 25],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'], // blue, green, orange
      borderColor: 'transparent',
    }]
  };

  return (
    <Card>
      <Card.Header>
        <h6 className="mb-0">Top Categories</h6>
      </Card.Header>
      <Card.Body>
        <div style={{ height: '300px' }}>
          <Doughnut data={colorfulDoughnutData} options={doughnutOptions} plugins={[centerText]} />
        </div>

        <div className="mt-3 doughnut-legend">
          {colorfulDoughnutData.labels.map((label, index) => (
            <div key={index} className="doughnut-legend-item">
              <div
                className="doughnut-legend-color"
                style={{ backgroundColor: colorfulDoughnutData.datasets[0].backgroundColor[index] }}
              />
              <span className="doughnut-legend-text">{label}</span>
              <span className="doughnut-legend-value">
                {colorfulDoughnutData.datasets[0].data[index]}%
              </span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default DoughnutCard;
