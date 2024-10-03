import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

// Register all Chart.js components and the candlestick chart type
Chart.register(...registerables, CandlestickController, CandlestickElement);

const ChartComponent = ({ data, coin, interval }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Prepare data for Chart.js
    const chartData = {
      datasets: [
        {
          label: `${coin.toUpperCase()} (${interval})`,
          data: data.map((candle) => ({
            x: new Date(candle.time),
            o: parseFloat(candle.open),
            h: parseFloat(candle.high),
            l: parseFloat(candle.low),
            c: parseFloat(candle.close),
          })),
          borderColor: '#42A5F5',
          borderWidth: 1,
        },
      ],
    };

    // Create the chart
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'candlestick',  // Using the candlestick chart type
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: { type: 'time', time: { unit: 'minute' } },
          y: { beginAtZero: false },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, coin, interval]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
