

let companiesArray = [];
let generator;
let healthChart;
let monthlyValueAverageChart;
let usersChart;
let messagesChart;
let similationInterval;

function generateCompanies() {
  generator = new Generator();
  companiesArray = generator.generateCompanies();
  console.log('Initial Companies --->', companiesArray);
  $('#initial_message').hide();
  $('#dashboard_container').show();
  $('#simulation_div').show();
  generateHealthChart();
  generateMonthlyValueChart();
  generateUsersChart();
  generateMessagesChart();
}

function toggleSimilation(){
  if (similationInterval) {
    clearInterval(similationInterval);
    $('#start_simulation').show();
    $('#stop_simulation').hide();
    return similationInterval = null;
  }else {
    $('#stop_simulation').show();
    $('#start_simulation').hide();
  }

  similationInterval = setInterval(()=>{
    generator.forthwardTime();
    console.log('Companies simulation --->', companiesArray);
    generateHealthChart();
    generateMonthlyValueChart();
    generateUsersChart();
    generateMessagesChart();
  }, 1000)
}

function generateHealthChart() {
  console.log('Health --->', generator.calculateAverage('healthScore'));
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
      responsive: true,
      scales: {
        yAxes: [{
          stacked: true
        }]
      }
    }
  });
}

function generateUsersChart() {
  $('#users_average').text(Math.round(generator.calculateAverage('usersNumber')));
  $('#active_users_average').text(Math.round(generator.calculateAverage('activeUsers')));
  const ctx = $('#usersChart');
  if (usersChart) usersChart.destroy();
  usersChart = new Chart(ctx, {
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

function generateMessagesChart() {
  $('#messages_average').text(Math.round(generator.calculateAverage('messages')));
  const ctx = $('#messagesChart');
  if (messagesChart) messagesChart.destroy();
  messagesChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: generator.getCompaniesProperty('id'),
      datasets: [{
        label: 'Messages',
        data: generator.getCompaniesProperty('messages'),
        backgroundColor: generator.generateColorForCompanies(),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
    }
  });
}
