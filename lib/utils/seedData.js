/* eslint-disable indent */
const User = require('../models/User.js');
const Budget = require('../models/Budget.js');
const Expenditure = require('../models/Expenditure.js');

const seedData = async() => {

    console.log('seeding user1');
    const user1 = await User.create({
      email: 'Bobby@test1.test',
      password: 'password'
    });

        const user1Budget1 = await Budget.create({
          userId: user1.id,
          monthOf: '1/2020',
          budget: 1000
        });
        
            //for budget aggregation: most expensive item of the month
            await Expenditure.create({
              budgetId: user1Budget1._id.toString(),
              item: 'groceries',
              cost: 40.33,
              dateOfExpenditure: new Date('1/3/2020')
            });

            await Expenditure.create({
              budgetId: user1Budget1._id.toString(),
              item: 'haircut',
              cost: 30.50,
              dateOfExpenditure: new Date('1/4/2020')
            });

            await Expenditure.create({
              budgetId: user1Budget1._id.toString(),
              item: 'bowling',
              cost: 23.67,
              dateOfExpenditure: new Date('1/5/2020')
            });
        
        console.log('seeding user1Budget2');
        const user1Budget2 = await Budget.create({
          userId: user1.id,
          monthOf: '2/2020',
          budget: 1000
        });

            //for budget aggregation: total item costs for the month
            await Expenditure.create({
              budgetId: user1Budget2._id.toString(),
              item: 'pinball',
              cost: 5,
              dateOfExpenditure: new Date('2/1/2020')
            });

            await Expenditure.create({
              budgetId: user1Budget2._id.toString(),
              item: 'pinball',
              cost: 6,
              dateOfExpenditure: new Date('2/2/2020')
            });

            await Expenditure.create({
              budgetId: user1Budget2._id.toString(),
              item: 'pinball',
              cost: 11,
              dateOfExpenditure: new Date('2/3/2020')
            });

        const user1Budget3 = await Budget.create({
          userId: user1.id,
          monthOf: '3/2020',
          budget: 1000
        });

            await Expenditure.create({
              budgetId: user1Budget3._id.toString(),
              item: 'car insurance',
              cost: 80,
              dateOfExpenditure: new Date('3/1/2020')
            });

            await Expenditure.create({
              budgetId: user1Budget3._id.toString(),
              item: 'utilities',
              cost: 130.89,
              dateOfExpenditure: '3/2/2020'
            });

            await Expenditure.create({
              budgetId: user1Budget3._id.toString(),
              item: 'orchestral tickets',
              cost: 180,
              dateOfExpenditure: new Date('3/20/2020')
            });

    console.log('seeding user2');
    const user2 = await User.create({
      email: 'Tom@test2.test',
      password: 'password'
    });

        //for budget aggregation: total expenditures for the month
        const user2Budget1 = await Budget.create({
          userId: user2.id,
          monthOf: '1/2019',
          budget: 1000
        });

            await Expenditure.create({
              budgetId: user2Budget1._id.toString(),
              item: 'new couch',
              cost: 600,
              dateOfExpenditure: new Date('1/5/2019')
            });

            await Expenditure.create({
              budgetId: user2Budget1._id.toString(),
              item: 'dog food',
              cost: 40.25,
              dateOfExpenditure: new Date('1/7/2019')
            });

            await Expenditure.create({
              budgetId: user2Budget1._id.toString(),
              item: 'gym membership',
              cost: 60.39,
              dateOfExpenditure: new Date('1/17/2029')
            });

        console.log('seeding user2Budget2');
        // for budget aggregation: did user go over budget?
        const user2Budget2 = await Budget.create({
            userId: user2.id,
            monthOf: '2/2019',
            budget: 1000
        });

            await Expenditure.create({
              budgetId: user2Budget2._id.toString(),
              item: 'diamond ring',
              cost: 800,
              dateOfExpenditure: new Date('2/5/2020')
            });

            await Expenditure.create({
              budgetId: user2Budget2._id.toString(),
              item: 'airbnb at coast',
              cost: 150,
              dateOfExpenditure: new Date('2/14/2019')
            });

            await Expenditure.create({
              budgetId: user2Budget2._id.toString(),
              item: 'Birthday celebreation',
              cost: 100,
              dateOfExpenditure: new Date('2/18/2020')
            });

  //filler data
    const user3 = await User.create({
      email: 'Jack@test3.test',
      password: 'password'
    });

        const user3Budget1 = await Budget.create({
          userId: user3.id,
          monthOf: '7/2018',
          budget: 1000
        });

            for(let i = 0; i < 20; i++) {
                await Expenditure.create({
                    budgetId: user3Budget1._id.toString(),
                    item: 'filler item',
                    cost: 1,
                    dateOfExpenditure: new Date('1/1/2018')
                });
            }

        for(let i = 2; i < 13; i++){
            await Budget.create({
              userId: user3.id,
              monthOf: `${i}/2018`,
              budget: 1000
            });
        }

  //filler data
  for(let i = 0; i < 10; i++){
    await User.create({
        email: `test${i}@test.test`,
        password: 'password'
      });
    }
};

module.exports = { seedData };
