import React, { useState, useEffect } from 'react';
import { Pie,Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';


function CPUChart() {
    const [chartData, setChartData] = useState({
        labels: ['USO', 'LIBRE'],
        datasets: [{
            label: 'label - memory ram',
            data: [50, 50],
            backgroundColor: [
                'rgba(255, 99, 32, 0.9)', // Light Orange
                'rgba(255, 193, 7, 0.9)'  // Light yellow
            ],
            borderColor: [
                'rgba(255, 99, 32, 1)', // Orange
                'rgba(255, 193, 7, 1)'  // Yellow
            ],
            borderWidth: 2
        }]
    });

    const [numCPU, setNumCPU] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
             fetch("/api/cpu")
                .then(response => response.json())
                .then(data => {
                    const used = data.used;
                    const notused = data.notused;
                    setNumCPU(data.num_cpu)
                    setChartData(prevChartData => ({
                        ...prevChartData,
                        labels: [`USO ${used.toFixed(2)}%`, `LIBRE ${notused.toFixed(2)}%`],
                        datasets: [{
                            ...prevChartData.datasets[0],
                            data: [used, notused],
                        }]
                    }));
                })
                .catch(err => { console.log(err) })

        }, 500);
        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <div>
                <h2 style={{ margin: 0, textAlign: 'center', color: '#e0e0d1' }}>CPU </h2>
                <h2 style={{ margin: 0, textAlign: 'center', color: '#e0e0d1' }}> {numCPU} CPUs disponibles </h2>
                <div id='divChart' style={{ maxHeight: '700px', display: 'flex', justifyContent: 'center' }}>
                    <Doughnut data={chartData} options={{ maintainAspectRatio: true }} />
                </div>
            </div>
        </>
    )
};

export default CPUChart;
