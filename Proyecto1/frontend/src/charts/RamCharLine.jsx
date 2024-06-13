import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function RamChartLine() {

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
                bbackgroundColor: 'rgba(224, 224, 209, 1)', // Lime green
                borderColor: 'rgba(224, 224, 209, 1)', // Lime green
                pointRadius: 0
            },
            {
                label: 'LIBRE',
                data: [0],
                fill: false,
                backgroundColor: 'rgba(224, 224, 209, 1)', // Lime green
                borderColor: 'rgba(224, 224, 209, 1)', // Lime green
                pointRadius: 0
            },
        ],
    });

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:8080/api/ram")
            //fetch("/api/ram")
                .then(response => response.json())
                .then(() => {
                })
                .catch(err => { console.log(err) })

        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <h2 style={{ margin: 0, textAlign: 'center' }}> RAM </h2>
            <Line data={chartData} options={options} />
        </>
    )
};

export default RamChartLine;