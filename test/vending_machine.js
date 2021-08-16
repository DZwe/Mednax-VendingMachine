/*
    Testing scripts to confirm functionality of the vending machine.
*/

var expect = require("chai").expect;
var machine = require("../app/vending_machine");

describe("Vending Machine Tests", () => {
    describe("Validate Coin", () => {

        it("validate coin and ask for coin", async () => {
            let run = await machine.validate_coin('nonsense', 0.2, 0, 'chips');
            expect(run).to.deep.equal({
                choice: 'chips',
                coins_inserted: 0.2,
                coin_return: 0,
                run: 1
            });
        })

        it("validate coin and check to see if that penny is in coin return", async () => {
            let run = await machine.validate_coin('penny', 0.2, 0, 'chips');
            expect(run).to.deep.equal({
                choice: 'chips',
                coins_inserted: 0.2,
                coin_return: 0.01,
                run: 1
            });
        })

    })

    describe("Accept coins", () => {

        it("accept dimes and give change back for chips", async () => {
            let run = await machine.accept_coins('dime', 'chips', 0.6, 0);
            expect(run).to.deep.equal({
                run: 1,
                invoice: 'paid',
                choice: 'reset',
                coin_return: 0.2
            });
        })

        it("keep accepting dimes to fulfill payment for chips", async () => {
            let run = await machine.accept_coins('dime', 'chips', 0.3, 0);
            expect(run).to.deep.equal({
                run: 1,
                invoice: 'unpaid',
                choice: 'chips',
                coin_return: 0,
                coins_inserted: 0.4
            });
        })

    })

    describe("Validate Payment", () => {

        it("check if after paid payment, it dispenses the product", async () => {
            let run = await machine.check_pay(0.5, 0.5, 0, 'chips');
            expect(run).to.deep.equal({
                run: 1,
                invoice: 'paid',
                choice: 'reset',
                coin_return: 0
            });
        })

        it("check if after paid payment, it dispenses the product and returns appropriate change", async () => {
            let run = await machine.check_pay(0.5, 0.7, 0, 'chips');
            expect(run).to.deep.equal({
                run: 1,
                invoice: 'paid',
                choice: 'reset',
                coin_return: 0.2
            });
        })

        it("check if after paid payment, it dispenses the product and returns appropriate change with invalid pennies", async () => {
            let run = await machine.check_pay(0.5, 0.7, 0.02, 'chips');
            expect(run).to.deep.equal({
                run: 1,
                invoice: 'paid',
                choice: 'reset',
                coin_return: 0.22
            });
        })

        it("check if after unpaid payment, it doesn't dispenses the product", async () => {
            let run = await machine.check_pay(0.5, 0.4, 0, 'chips');
            expect(run).to.deep.equal({
                run: 1,
                invoice: 'unpaid',
                choice: 'chips',
                coins_inserted: 0.4,
                coin_return: 0
            });
        })

    })

    
});