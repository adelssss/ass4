let myChart; 
let metricsContainer; 

async function fetchData() {
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;
    const field = document.getElementById('field').value;
    const chartType = document.getElementById('chart_type').value;

    if (!['temperature', 'wind_speed', 'visibility'].includes(field)) {
        console.error('Invalid field value');
        return;
    }

    const isValidDate = date => !isNaN(Date.parse(date));
    if ((startDate && !isValidDate(startDate)) || (endDate && !isValidDate(endDate))) {
        console.error('Invalid date format. Use YYYY-MM-DD');
        return;
    }

    try {
        const response = await fetch(`/api/measurements?start_date=${startDate}&end_date=${endDate}&field=${field}`);

        if (!response.ok) {
            throw new Error('Network error: ' + response.statusText);
        }

        const data = await response.json();

        if (data.length === 0) {
            console.log('No data to display.');
            return;
        }

        const labels = data.map(item => new Date(item.timestamp).toLocaleDateString());
        const values = data.map(item => item[field]);

        const ctx = document.getElementById('myChart').getContext('2d');

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: field.charAt(0).toUpperCase() + field.slice(1),
                    data: values,
                    borderColor: chartType === 'pie' ? [] : 'rgba(75, 192, 192, 1)',
                    backgroundColor: chartType === 'pie'
                        ? values.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`)
                        : 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    fill: chartType !== 'pie',
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `Data for ${field.charAt(0).toUpperCase() + field.slice(1)}`,
                    }
                },
                scales: chartType === 'pie' ? {} : {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const metricsResponse = await fetch(`/api/measurements/metrics?field=${field}`);
        if (!metricsResponse.ok) {
            console.error('Error retrieving metrics:', metricsResponse.statusText);
            return;
        }

        const metrics = await metricsResponse.json();
        displayMetrics(metrics);
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
}

function displayMetrics(metrics) {
    if (!metricsContainer) {
        metricsContainer = document.createElement('div');
        document.body.appendChild(metricsContainer);
    }

    metricsContainer.innerHTML = `
        <h3>Metrics for the selected field:</h3>
        <p>Average: ${metrics.average.toFixed(2)}</p>
        <p>Minimum: ${metrics.min}</p>
        <p>Maximum: ${metrics.max}</p>
        <p>Standard Deviation: ${metrics.stdDev.toFixed(2)}</p>
    `;
}
