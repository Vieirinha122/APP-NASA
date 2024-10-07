let emissionChart;

document.getElementById('searchButton').addEventListener('click', async () => {
    const countryCode = document.getElementById('country').value.toUpperCase();
    const url = `https://api.climatetrace.org/v4/country/emissions?countries=${countryCode}&since=2023&to=2023`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data); // Log for debugging

        if (data.length === 0) {
            document.getElementById('result').innerHTML = '<p class="text-danger">No data found for this country.</p>';
            return;
        }

        displayResults(data[0]); // Pass the first item of the array
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = '<p class="text-danger">An error occurred while fetching the data.</p>';
    }
});

function displayResults(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // Display summary of emissions
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'emission-summary';
    summaryDiv.innerHTML = `
        <h3>Emissions Summary for ${data.country}</h3>
        <p><strong>CO2:</strong> ${data.emissions.co2.toLocaleString()} tons</p>
        <p><strong>CH4:</strong> ${data.emissions.ch4.toLocaleString()} tons</p>
        <p><strong>N2O:</strong> ${data.emissions.n2o.toLocaleString()} tons</p>
        <p><strong>CO2 equivalent (100 years):</strong> ${data.emissions.co2e_100yr.toLocaleString()} tons</p>
        <p><strong>CO2 equivalent (20 years):</strong> ${data.emissions.co2e_20yr.toLocaleString()} tons</p>
    `;
    resultDiv.appendChild(summaryDiv);

    // Create chart
    const labels = ['CO2', 'CH4', 'N2O'];
    const emissions = [
        data.emissions.co2,
        data.emissions.ch4,
        data.emissions.n2o
    ];

    // Check if the chart already exists and destroy it if necessary
    if (emissionChart) {
        emissionChart.destroy();
    }

    // Create chart
    const ctx = document.getElementById('emissionChart').getContext('2d');
    emissionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gas Emissions (in tons)',
                data: emissions,
                backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Emissions (tons)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Greenhouse Gas Emissions'
                }
            }
        }
    });
}
