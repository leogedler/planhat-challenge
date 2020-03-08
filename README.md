# Planhat 12 hours Challenge

Built with vanilla JS and jQuery / Bootstrap / FontAwesome / Chart.js

> To run this project just open the `index.html` in a web browser.

-----------------------------------------------------------------

## Tech Stack:
This is a front-end only exercise, to be implemented in pure JS / HTML / CSS.

Keep it lean and simple. You're free to use some libraries like JQuery, Lodash, Bootstrap but given the small scope of this exercise, you shouldn't need much of it. Plain Javascript + a few small external libraries will most likely be enough.

If you do use any bigger framework (though it really shouldn't be needed), please keep it to a minimum.. as few files and folders as possible and certainly no massive "generator" project structures.


## Background:
Let's assume that we have a software business called "Team Chat" together. It's a bit like Slack, “Skype for Business”, or "Microsoft Teams".
Our application is a bit simpler than the others (we don’t have bots, a lot of integrations etc), just simple messaging.

The main features are:
1) Ability to chat directly with other team member 1-1
2) Ability to create multiple channels to chat with a group of team members on some specific topic.

Let’s assume we have 2000 customers (companies) today, each with somewhere between 5 to 500 users. 
On average our customers (companies) have 30 users each.

In our case, we offer two pricing plans, our customers can choose which one they prefer (and of course pick the one that’s cheapest for them)

Starter Plan:
$500/month for Platform, plus $10/user per month

Enterprise Plan:
$1000/month, plus $1/user per month

All subscriptions are paid monthly at the start of the subscription period, and based on the number of users (active or not) at that point.


### Delivery A:
Write a function (plain JS) that generates a potential set of the 2000 customers (given the info above), Each customer should have at least the following properties/metrics:

Core Metrics:
 - number of users (as stated above at least 5 and at most 500)
 - customer since (the date they became customer, assume we got our first customer 5 years ago)
 - number of channels created (pseudo randomised within reasonable limits)
 - number or active users (pseudo randomised within reasonable limits - not all users with login may actually use our product)
 - number of messages per day (pseudo randomised within reasonable limits)

You decide how you want to generate these metrics, it should be pseudo randomised within reasonable limits.  For example if a customer is sending 700 messages a day.. it's quite unlikely it will drop to 7 the next day, though it could happen.

To keep it simple, let's assume people work all the days of the week, so we don't need to think about dips in usage over the weekends.


Implicit/derived Metrics:
 - monthly value (given by platform + per user fee * users)
 - last renewal date  (given by the start date, today's date, and the fact that each period is 1 month)
 - next renewal date  (given by the start date, today's date, and the fact that each period is 1 month)

 - health score (score to tell if a customer seems to be getting good value out of the product)
Score 1-10, you'll need to invent the formula and it should reflect how much value the customer is getting. Reasonable assumptions would be that the more active users, the more messages, perhaps the more channels - the better the health.


Static Properties (pseudo randomly picked from the potential values listed in brackets below)
 - Sector  [Public, Private]
 - Location [Europe, North America, Asia]



### Delivery B:
The options for analysis of this data are endless. Close your eyes for a moment and imagine if this was really your business, your customers! 
Clearly you want customers you want to stay so they keep paying. A great first step is having a good overview of some key metrics of your customer portfolio.  

Create a nice looking dashboard (single static html page) to give an overview of our customers. 
Keep the code simple, in just one or a few files, no need for massive frameworks, but do feel free to include some libraries where it makes sense, for example to create some nice looking charts.



Delivery C:
Add buttons to the dashboard, that when clicked will start/pause/reset a simulation. When running, this simulation will step forward one day at a time. Each second (in real life) corresponds to 6 days in the simulation, meaning it takes about a minute to simulate a year.

Each day the core metrics may see some change, for example:
 - User count may go up or down every day (though it typically doesn’t change too much or often)
 - Number of active users may change
 - Some customers may hit  their renewal date and enter a new period (month) of subscription
 - Number of daily messages and channels may change and so on

This in turn will affect the derived Metrics such as Health (updated every day), and how much the customer pays (changes when each customer renews, which could be any day of the month but only once a month) etc.

As the simulation runs, the dashboard should update in real time.


### Delivery D:
Extend the simulation to also cover the case where some customers are lost or won. Losing a customer simply means that their subscription doesn’t renew as usual. It may still be interesting to keep them in a collection of “lost customers” but they’re no longer relevant for the business.

When we lose a customer it’s called “churn”,  let’s assume we have around 10% churn, which means on average 10% of the customers that are supposed to renew (enter a new subscription period) don’t.

But were not only losing customers, we also win some completely new customers every now and then, this can happen during any day of the month. We call it “New Biz”. Let’s assume every month the number of new customers we get is about 15% of what we had at the beginning of the month (average number of users should stay around 30!)

Both the churn (10%) and New Biz (15%) are input controls that can be adjusted in the UI/dashboard to be able to simulate scenarios with different levels of churn and new biz.

So which 10% of customers will churn?
We don’t know exactly, it’s a bit random (based on health, which in turn is based on the semi-random changes in messages and active users etc).

But there is another component as well which isn’t entirely random!
1) European customers are 20% more likely to churn compared to North American  (given the same health score)
2) North American customers are 20% more likely to churn than Asian customers  (given the same health score)
3) Customers in the Private sector are 50% more likely to churn compared to those in Public Sector (given the same health score)

As before the dashboard should update in real time.


### Delivery E:
Build a separate function that takes the lost customers as input, and then based on that, predicts which of the existing customers are most likely to churn at any given point. Each of the existing customers get a “churn risk” score 0-100 where 100 is certain churn upon the next renewal.

This “function” can be anything from a correlation analysis to some advanced machine learning algorithm.The only rule is that this function does NOT know of your business logic from previous steps, but must derive it purely based on data from the lost customers.  Of course it means  the function initially will have very little (or no) data to work with and won’t be very accurate but that’s fine, it will get better as simulation moves on and there are more lost customers to analyze..

The prediction doesn't have to update every step of the game, but every perhaps once a week (roughly every second) or so.

Update the dashboard to somehow highlight this prediction.