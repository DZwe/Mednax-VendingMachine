const valid_options = ['cola','chips','candy'];
const valid_coins = ['nickel', 'dime', 'quarter'];

const products = {
    cola: {
        name: "cola",
        price: 1
    },
    chips: {
        name: "chips",
        price: 0.5
    },
    candy: {
        name: "candy",
        price: 0.65
    }
};

const coins = {
    nickel: {
        value: 0.05
    },
    dime: {
        value: 0.10
    }
    , 
    quarter: {
        value : 0.25
    }
}

module.exports = {
    valid_options: valid_options,
    valid_coins: valid_coins,
    products: products,
    coins: coins
};