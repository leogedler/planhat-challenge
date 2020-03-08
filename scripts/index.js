

let companiesArray = [];
let generator;
let healthChart;
let monthlyValueAverageChart;
let usersChart;
let messagesChart;
let companiesChart;
let similationInterval;

function generateCompanies() {
  generator = new Generator();
  companiesArray = generator.generateCompanies();
  console.log('Initial Companies --->', companiesArray);
  $('#current_company_number').text(generator.companyNumber);
  $('#current_churn').text(generator.churn);
  $('#current_biz').text(generator.biz);
  $('#initial_message').hide();
  $('#dashboard_container').show();
  $('#simulation_div').show();
  $('#current_churn').text(10);
  $('#current_biz').text(15);
  $('#churn').val(10);
  $('#biz').val(15);
  generateHealthChart();
  generateMonthlyValueChart();
  generateUsersChart();
  generateMessagesChart();
  generateCompaniesChart();
}

function toggleSimilation() {
  if (similationInterval) {
    clearInterval(similationInterval);
    $('#start_simulation').show();
    $('#stop_simulation').hide();
    return similationInterval = null;
  } else {
    $('#stop_simulation').show();
    $('#start_simulation').hide();
  }

  similationInterval = setInterval(() => {
    generator.forthwardTime();
    generator.generateChurn();
    generator.generateNewBiz();
    $('#current_company_number').text(generator.companyNumber);
    $('#current_churn').text(generator.churn);
    $('#current_biz').text(generator.biz);
    console.log('Companies simulation --->', companiesArray);
    generateHealthChart();
    generateMonthlyValueChart();
    generateUsersChart();
    generateMessagesChart();
    generateCompaniesChart();
  }, 1000)
}

function changeChurn() {
  const churn = $('#churn').val();
  generator.changeChurn(churn);
  $('#current_churn').text(generator.churn);
}

function changeBiz() {
  const biz = $('#biz').val();
  generator.changeBiz(biz);
  $('#current_biz').text(generator.biz);
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

function generateCompaniesChart() {
  const ctx = $('#companiesChart');
  if (companiesChart) companiesChart.destroy();
  companiesChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['current companies', 'lost companies', 'new companies'],
      datasets: [{
        label: 'Messages',
        data: [generator.companyNumber, generator.lostCompaniesNumber, generator.newCompaniesNumber],
        backgroundColor: ['#0384fc', '#fc2c03', '#03fc41'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
    }
  });
}
