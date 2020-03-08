

let companiesArray = [];
let generator;
let healthChart;
let monthlyValueAverageChart;
let usersChart;

function generateCompanies() {
  generator = new Generator();
  companiesArray = generator.generateCompanies();
  console.log('Companies --->', companiesArray);
  $('#dashboard_container').show();
  generateHealthChart();
  generateMonthlyValueChart();
  generateUserChart();
}

function generateHealthChart() {
  $('#health_average').text(generator.calculateAverage('healthScore'));
  const ctx = $('#healthChart');
  if (healthChart) healthChart.destroy();
  healthChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: generator.getCompaniesProperty('id'),
      datasets: [{
        label: 'Health',
        data: generator.getCompaniesProperty('healthScore'),
        backgroundColor: generator.generateColorForCompanies(),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function generateMonthlyValueChart() {
  $('#monthly_value_average').text(Math.round(generator.calculateAverage('monthlyValue')));

  const ctx = $('#monthlyValueAverageChart');
  if (monthlyValueAverageChart) monthlyValueAverageChart.destroy();
  monthlyValueAverageChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: generator.getCompaniesProperty('id'),
      datasets: [{
        label: 'Monthy value',
        data: generator.getCompaniesProperty('monthlyValue'),
        backgroundColor: generator.generateColorForCompanies(),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          stacked: true
        }]
      }
    }
  });
}

function generateUserChart() {
  const ctx = $('#usersChart');
  if (usersChart) usersChart.destroy();
  healthChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: generator.getCompaniesProperty('id'),
      datasets: [{
        label: 'Users',
        data: generator.getCompaniesProperty('usersNumber'),
        backgroundColor: '#FF7C66',
        borderWidth: 1
      },
      {
        label: 'Active Users',
        data: generator.getCompaniesProperty('activeUsers'),
        backgroundColor: '#7098E1',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }
  });
}
