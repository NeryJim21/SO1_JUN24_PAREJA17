import React, { useState, useEffect } from 'react';
import { Pie ,Doughnut} from 'react-chartjs-2';
import 'chart.js/auto';


function RamChart() {
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
            borderWidth: 5
        }]
    });

    const [totalRam, setTotalRam] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("/api/ram")
                .then(response => response.json())
                .then(data => {
                    const total = data.total;
                    const used = data.used;
                    const notused = data.notused;

                    setTotalRam(total);
                    setChartData(prevChartData => ({
                        ...prevChartData,
                        labels: [`USO ${used.toFixed(2)}% (${(total * used / 100000).toFixed(2)}GB)`, `LIBRE ${notused.toFixed(2)}% (${(notused * total / 100000).toFixed(2)}GB)`],
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
                <h2 style={{ margin: 0, textAlign: 'center', color: '#e0e0d1' }}>Memoria RAM</h2>
                <h2 style={{ margin: 0, textAlign: 'center', color: '#e0e0d1' }}> Total {(totalRam / 1000).toFixed(2)} GB</h2>
                <div id='divChart' style={{ maxHeight: '700px', display: 'flex', justifyContent: 'center' }}>
                    <Doughnut data={chartData} options={{ maintainAspectRatio: true }} />
                </div>
            </div>
        </>
    )
};

export default RamChart;
