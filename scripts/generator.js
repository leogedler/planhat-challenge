class Generator {
  companyNumber;
  companies = [];
  sectors = ['Public', 'Private'];
  locations = ['Europe', 'Asia', 'North America'];
  currentDate = new Date();
  plans = {
    plan500: {
      name: '$500/month',
      month: 500,
      userCost: 10
    },
    plan1000: {
      name: '$1000/month',
      month: 1000,
      userCost: 1
    }
  }

  constructor() {
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  generateUsersNumber() {
    return this.getRandom(5, 500);
  }

  generateActiveUsers(usersNumber) {
    const min = usersNumber * 0.2;
    const max = usersNumber * 0.6;
    return this.getRandom(min, max);
  }

  generateSinceDate() {
    const start = new Date(2015, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  generateChannels(usersNumber) {
    const min = usersNumber * 0.10;
    const max = usersNumber * 0.9;
    return this.getRandom(min, max);
  }

  generateMessages(channels) {
    const min = channels * 100;
    const max = channels * 10000;
    return this.getRandom(min, max);
  }

  generateCompanyPlan(activeUsers) {
    const plan500 = 500 + activeUsers * 10;
    const plan1000 = 1000 + activeUsers;
    let planType = ''
    let monthlyValue = 0
    if (plan500 < plan1000) {
      monthlyValue = plan500;
      planType = this.plans.plan500;
      return { monthlyValue, planType }
    }
    monthlyValue = plan1000;
    planType = this.plans.plan1000;
    return { monthlyValue, planType }
  }

  getSector() {
    const index = this.getRandom(0, 1);
    return this.sectors[index];
  }

  getLocations() {
    const index = this.getRandom(0, 2);
    return this.locations[index];
  }

  getLastRenewalDate(since) {
    if (since.getTime() < this.currentDate.getTime()) {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), since.getDate());
    }
    return since;
  }

  getNextRenewalDate(lastRenewal) {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), lastRenewal.getDate());
  }

  calculateHealth(usersNumber, activeUsers, messages, channels) {
    const maxMessages = channels * 10000;
    const maxChannels = usersNumber * 0.9;
    const pUser = activeUsers / usersNumber;
    const pChannels = channels / maxChannels;
    const pMessages = messages / maxMessages;
    return Math.ceil(((pUser + pChannels + pMessages) / 3) * 10);
  }

  getCompaniesProperty(property) {
    return this.companies.map(c => c[property]);
  }

  getRandomRgba() {
    let o = this.getRandom(100, 255), r = this.getRandom(50, 200), s = this.getRandom(80, 100);
    return `rgba(${o},${s},${r},1)`;
  }

  generateColorForCompanies() {
    return this.companies.map(() => this.getRandomRgba());
  }

  calculateAverage(property) {
    const sum = this.companies.reduce((acc, c) => acc + c[property], 0);
    return sum / this.companyNumber;
  }

  forthwardTime() {
    this.currentDate.setDate(this.currentDate.getDate() + 6);
    return this.companies.map((c) => {
      const usersNumber = this.modifyProperty(c.usersNumber);
      const activeUsers = this.generateActiveUsers(usersNumber);
      const channels = this.generateChannels(activeUsers);
      const messages = this.generateMessages(channels);
      const { monthlyValue } = this.generateCompanyPlan(activeUsers);
      const lastRenewalDate = this.getLastRenewalDate(c.sinceDate);
      const nextRenewalDate = this.getNextRenewalDate(lastRenewalDate);

      const healthScore = this.calculateHealth(usersNumber, activeUsers, messages, channels);

      c.usersNumber = usersNumber;
      c.activeUsers = activeUsers;
      c.channels = channels;
      c.messages = messages;
      c.monthlyValue = monthlyValue;
      c.healthScore = healthScore;
      c.lastRenewalDate = lastRenewalDate;
      c.nextRenewalDate = nextRenewalDate;
      return c;
    })
  }

  modifyProperty(property) {
    let percentage = this.getRandom(-15, 20) / 100;
    if (percentage > 0) {
      percentage = 1 + percentage;
    } else {
      percentage = 1 - Math.abs(percentage);
    }
    return property * percentage;
  }

  generateCompanies() {
    this.companyNumber = $('#companies_number').val() || 2000;
    if (this.companyNumber > 2000) {
      $('#dashboard_container').hide();
      $('#companies_number').val(20);
      return alert('Companies number cannot be greater than 2000')
    };
    for (let index = 0; index < this.companyNumber; index++) {
      const usersNumber = this.generateUsersNumber();
      const activeUsers = this.generateActiveUsers(usersNumber);
      const channels = this.generateChannels(activeUsers);
      const messages = this.generateMessages(channels);
      const { monthlyValue, planType } = this.generateCompanyPlan(activeUsers);
      const sector = this.getSector();
      const locations = this.getLocations();
      const sinceDate = this.generateSinceDate();
      const lastRenewalDate = this.getLastRenewalDate(sinceDate);
      const nextRenewalDate = this.getNextRenewalDate(lastRenewalDate);
      const healthScore = this.calculateHealth(usersNumber, activeUsers, messages, channels);
      const company = {
        id: index + 1,
        usersNumber,
        activeUsers,
        channels,
        messages,
        monthlyValue,
        planType,
        sector,
        locations,
        sinceDate,
        lastRenewalDate,
        nextRenewalDate,
        healthScore
      }
      this.companies.push(company);
    }
    return this.companies;
  }
}