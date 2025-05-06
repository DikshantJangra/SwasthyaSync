'use client';
import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
    datasets: [
      {
        label: 'Target', // short for "Water must have drank"
        data: [400, 200, 500, 600, 1000, 300, 100, 200, 400, 200, 500, 600, 1000, 300, 100],
        backgroundColor: 'dodgerblue',
        barPercentage: 0.6, // thicker than before
        categoryPercentage: 0.7, // good spacing
        borderRadius: 6,
      },
      {
        label: 'Consumed', // short for "Water drank"
        data: [300, 100, 400, 500, 800, 200, 80, 150, 350, 180, 450, 500, 900, 250, 90],
        backgroundColor: 'orangered',
        barPercentage: 0.6,
        categoryPercentage: 0.7,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#fff',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#444',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
