let planhatcompanies = [];

class CompaniesGenerator {
  companyNumber;
  companies = [];
  sectors = ['Public', 'Private'];
  locations = ['Europe', 'Asia', 'North America'];
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
    return Math.floor(Math.random() * (max - min) + min);
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

  generateCompanyPlan(activeUser) {
    const plan500 = 500 + activeUser * 10;
    const plan1000 = 1000 + activeUser;
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
    const index = this.getRandom(0, 2);
    return this.sectors[index];
  }

  getLocations() {
    const index = this.getRandom(0, 3);
    return this.locations[index];
  }

  getLastRenewalDate(since) {
    const today = new Date();
    if (since.getTime() < today.getTime()) {
      today.setMonth(today.getMonth() - 1);
      return new Date(today.getFullYear(), today.getMonth(), since.getDate());
    }
    return since;
  }

  getNextRenewalDate(lastRenewal) {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    return new Date(today.getFullYear(), today.getMonth(), lastRenewal.getDate());
  }

  calculateHealth(usersNumber, activeUser, messages, channels) {
    const maxMessages = channels * 10000;
    const maxChannels = usersNumber * 0.9;
    const pUser = activeUser / usersNumber;
    const pChannels = channels / maxChannels;
    const pMessages = messages / maxMessages;
    return Math.round(((pUser + pChannels + pMessages) / 3) * 10);
  }

  generateCompanies() {
    this.companyNumber = $('#companies_number').val() || 2000;
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
        usersNumber,
        channels,
        activeUsers,
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




function generateCompanies() {
  const companiesGenerator = new CompaniesGenerator();
  planhatcompanies = companiesGenerator.generateCompanies();
  console.log('Companies --->', planhatcompanies);
}
