
/**
 * Main class generator for the companies
 * Core logic of the similation.
 *
 * @class Generator
 */
class Generator {
  companyNumber;
  companies = [];
  lostCompanies = [];
  lostCompaniesNumber;
  newCompanies = [];
  newCompaniesNumber;
  sectors = ['Public', 'Private'];
  locations = ['Europe', 'Asia', 'North America'];
  currentDate = new Date();
  churn = 10;
  biz = 15;
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

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  generateUsersNumber() {
    return this.getRandom(5, 500);
  }

  generateActiveUsers(usersNumber) {
    const min = usersNumber * 0.1;
    const max = usersNumber * 0.9;
    const activeUsers = this.getRandom(min, max);
    return activeUsers > 0 ? activeUsers : 1;
  }

  generateSinceDate() {
    const start = new Date(2015, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  generateChannels(usersNumber) {
    const min = usersNumber * 0.1;
    const max = usersNumber * 0.9;
    const channels = this.getRandom(min, max);
    return channels > 0 ? usersNumber : 1;
  }

  generateMessages(channels) {
    const min = channels * 100;
    const max = channels * 10000;
    const messages = this.getRandom(min, max);
    return messages > 0 ? channels : 10;
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
    const sum = this.companies.reduce((acc, c) => +acc + +c[property], 0);
    return (sum / this.companyNumber).toFixed(2);
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
    let percentage = this.getRandom(-10, 20) / 100;
    if (percentage > 0) {
      percentage = 1 + percentage;
    } else {
      percentage = 1 - Math.abs(percentage);
    }
    return Math.ceil(property * percentage);
  }


  isChurn(c) {
    let chance = this.getRandom(1, 100);
    if (c.healthScore < 2) {
      if (c.location === 'North America') {
        if (chance >= 1 && chance < this.churn) {
          return true;
        }
      } else if (c.location === 'Europe') {
        if (chance >= 1 && chance < this.churn * 0.7) {
          return true;
        }
      } else if (c.location === 'Asia') {
        if (chance >= 1 && chance < this.churn * 0.6) {
          return true;
        }
      }
    }
    return false;
  }

  generateChurn() {
    const companies = [];
    this.companies.forEach((c, i) => {
      if (this.isChurn(c)) {
        console.log('lost company --->', c);
        this.lostCompanies.push(c);
        this.lostCompaniesNumber = this.lostCompanies.length;
      } else {
        companies.push(c)
      };

    });
    this.companyNumber = companies.length;
    this.companies = companies;
  }

  generateNewBiz() {
    let chance = this.getRandom(1, 100);
    if (chance >= 1 && chance < this.biz) {
      const company = this.generateCompany(`b-${this.getRandom(1, 2000)}`);
      console.log('new company --->', company);
      this.companies.push(company);
      this.newCompanies.push(company);
      this.newCompaniesNumber = this.newCompanies.length;
      this.companyNumber = this.companies.length;
    }
  }

  changeChurn(value) {
    this.churn = value;
  }

  changeBiz(value) {
    this.biz = value;
  }


  generateCompany(index) {
    const usersNumber = this.generateUsersNumber();
    const activeUsers = this.generateActiveUsers(usersNumber);
    const channels = this.generateChannels(activeUsers);
    const messages = this.generateMessages(channels);
    const { monthlyValue, planType } = this.generateCompanyPlan(activeUsers);
    const sector = this.getSector();
    const location = this.getLocations();
    const sinceDate = this.generateSinceDate();
    const lastRenewalDate = this.getLastRenewalDate(sinceDate);
    const nextRenewalDate = this.getNextRenewalDate(lastRenewalDate);
    const healthScore = this.calculateHealth(usersNumber, activeUsers, messages, channels);
    return {
      id: index + 1,
      usersNumber,
      activeUsers,
      channels,
      messages,
      monthlyValue,
      planType,
      sector,
      location,
      sinceDate,
      lastRenewalDate,
      nextRenewalDate,
      healthScore
    }
  }

  generateCompanies() {
    this.companyNumber = $('#companies_number').val() || 2000;
    if (this.companyNumber > 2000) {
      $('#dashboard_container').hide();
      $('#companies_number').val(20);
      return alert('Companies number cannot be greater than 2000')
    };
    for (let index = 0; index < this.companyNumber; index++) {
      const company = this.generateCompany(index);
      this.companies.push(company);
    }
    return this.companies;
  }
}