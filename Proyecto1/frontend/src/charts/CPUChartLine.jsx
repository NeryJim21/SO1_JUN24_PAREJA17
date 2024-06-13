import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function CpuChartLine() {

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                ticks: {
                    display: false
                },
                grid: {
                    drawBorder: false,
                    display: false
                },
            },
        },
    };

    const [chartData, setChartData] = useState({
        labels: ['In'],
        datasets: [
            {
                label: 'USO',
                data: [0],
                fill: false,
                backgroundColor: 'rgba(172, 21, 18 )',
                borderColor: 'rgba(172, 21, 18 )',
                pointRadius: 0
            },
            {
                label: 'LIBRE',
                data: [0],
                fill: false,
                backgroundColor: 'rgba(46, 172, 18 )',
                borderColor: 'rgba(46, 172, 18 )',
                pointRadius: 0
            },
        ],
    });

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:8080/api/cpu")
            //fetch("/api/cpu")
                .then(response => response.json())
                .then(() => {
                })
                .catch(err => { console.log(err) })

        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <h2 style={{ margin: 0, textAlign: 'center' }}> CPU </h2>
            <Line data={chartData} options={options} />
        </>
    )
};

export default CpuChartLine;