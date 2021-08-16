/*
    Vending Machine for Mednax
*/

const prompt = require("prompt-sync")({ sigint: true });
const inquirer = require('inquirer');
const data = require('./data');

// Calls this function to power up the vending machine.
exports.start_function = async () => {

    let coins_inserted = 0;
    let coin_return = 0;

    let run = 1;

    // initial prompt for the user choice
    let answer = await inquirer.prompt([
        {
        type: 'list',
        name: 'choice',
        message: 'Welcome to Mednax Vending Machine!',
        choices: ['cola', 'chips', 'candy'],
        },
    ])

    let choice = answer.choice;

    // Loop system to make sure the user fulfills the payment
    while (run == 1) {
        let process = await this.accept_coins('', choice, coins_inserted, coin_return);

        if (process.choice == 'reset') {
            let result = await inquirer.prompt([
                {
                type: 'list',
                name: 'choice',
                message: 'Welcome to Mednax Vending Machine!',
                choices: ['cola', 'chips', 'candy'],
                },
            ])
            choice = result.choice;

            coins_inserted = 0;
            coin_return = 0;

            continue;
        }

        run = process.run;
        choice = process.choice;
        coins_inserted = process.coins_inserted;
        coin_return = process.coin_return;
    }
};

// Validates the coin that's received by customer
exports.validate_coin = async (coin, coins_inserted, coin_return, choice) => {
    if (!data.valid_coins.includes(coin)) {

        if (coin.toLowerCase() == 'penny') {
            coin_return += 0.01;
            console.log(` Coin Return: $${coin_return}`);
        }

        console.log("Invalid coin.");

        return {
            choice: choice,
            coins_inserted: coins_inserted,
            coin_return: coin_return,
            run: 1
        };
    } else {
        return {
            choice: choice,
            coins_inserted: coins_inserted,
            coin_return: coin_return,
            run: 0
        };
    }
}

// Check if the payment is good and successful
exports.check_pay = async (product_price, coins_inserted, coin_return, choice) => {
    
    if (product_price <= coins_inserted) {

        coin_return += coins_inserted - product_price;
        coin_return = parseFloat(coin_return.toFixed(2));

        console.log('THANK YOU!')
        console.log(` Coin Return: $${coin_return}`);
        
        // let reset = prompt("Would you like to order again? Y or N: ");

        return {
            run: 1,
            invoice: 'paid',
            choice: 'reset',
            coin_return: coin_return
        };

    } else {
        console.log(`Amount inserted: $${coins_inserted}, Price: $${product_price}`);
        console.log(` Coin Return: $${coin_return}`);
        return {
            run: 1,
            invoice: 'unpaid',
            choice: choice,
            coins_inserted: coins_inserted,
            coin_return: coin_return
        };
    }
}

// Asks and accepts the coins from customer
exports.accept_coins = async (coin, choice, coins_inserted, coin_return) => {
    if (coin == '') {
        coin = prompt("INSERT COIN(nickel, dime, quarter): ");
    }
    
    let validate = await this.validate_coin(coin, coins_inserted, coin_return, choice);
    if (validate.run == 1) {
        return {
            run : 1, 
            choice: validate.choice,
            coins_inserted: validate.coins_inserted,
            coin_return: validate.coin_return
        };
    }

    let product_price = data.products[choice].price;
    coins_inserted = coins_inserted + data.coins[coin.toLowerCase()].value;

    // make sure coins_inserted is two decimal
    coins_inserted = parseFloat(coins_inserted.toFixed(2));

    let price_fulfilled = await this.check_pay(product_price, coins_inserted, coin_return, choice);

    return price_fulfilled;
}
