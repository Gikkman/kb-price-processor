import * as MerxRunner from '../src/merx/runner';
import { MerxProduct } from "../src/merx/types";

describe("Test Merx runner |", () => {
    /********************************************************************************
     * stock_quantity
     *******************************************************************************/
    it("given stock_quantity 10, when minimum_sell is 2, then new stock_quantity is 5", () => {
        const fixture: MerxProduct = {stock_quantity: 10, minimum_sell: 2} as MerxProduct;
        const newStockQuantity = MerxRunner.processStockQuantityRule(fixture);
        expect(newStockQuantity).toEqual(5);
    })

    it("given stock_quantity 10, when minimum_sell is 1, then new stock_quantity is 5", () => {
        const fixture: MerxProduct = {stock_quantity: 10, minimum_sell: 1} as MerxProduct;
        const newStockQuantity = MerxRunner.processStockQuantityRule(fixture);
        expect(newStockQuantity).toEqual(10);
    })

    it("given stock_quantity 10, when minimum_sell is 3, then new stock_quantity is 3 (we round down)", () => {
        const fixture: MerxProduct = {stock_quantity: 10, minimum_sell: 3} as MerxProduct
        const newStockQuantity = MerxRunner.processStockQuantityRule(fixture);
        expect(newStockQuantity).toEqual(3);
    })

    it("given stock_quantity 10, when minimum_sell is 20, then new stock_quantity is 0", () => {
        const fixture: MerxProduct = {stock_quantity: 10, minimum_sell: 20} as MerxProduct
        const newStockQuantity = MerxRunner.processStockQuantityRule(fixture);
        expect(newStockQuantity).toEqual(0);
    })
    
    /********************************************************************************
     * description1
     *******************************************************************************/
    it("given a description, when minimum_sell is 1, then description is unchanged", () => {
        const originalDescription = "Lore ipsum";
        const fixture: MerxProduct = {description1: originalDescription, minimum_sell: 1} as MerxProduct
        const newDescription = MerxRunner.processDescriptionRule(fixture);
        expect(newDescription).toEqual(originalDescription);
    })

    it("given a description, when minimum_sell is > 1, then description adds (X Pack)", () => {
        const originalDescription = "Lore ipsum";
        const fixture: MerxProduct = {description1: originalDescription, minimum_sell: 3} as MerxProduct
        const newDescription = MerxRunner.processDescriptionRule(fixture);
        expect(newDescription).toEqual(originalDescription + " (3-pack)");
    })

    /********************************************************************************
     * price
     *******************************************************************************/
    it("given price 100, when netprice == 0 and minimum_sell == 1, then price is 130 (price factor 1.3 applied)", () => {
        const fixture: MerxProduct = {price: 100, netprice: 0, minimum_sell: 1} as MerxProduct;
        const newPrice = MerxRunner.processPriceRule(fixture);
        expect(newPrice).toEqual(130);
    })

    it("given price 100, when netprice == 1 and minimum_sell == 1, then price is 225 (price factor 2.25 applied)", () => {
        const fixture: MerxProduct = {price: 100, netprice: 1, minimum_sell: 1} as MerxProduct;
        const newPrice = MerxRunner.processPriceRule(fixture);
        expect(newPrice).toEqual(225);
    })

    it("given price 10, when netprice == 0 and minimum_sell == 1, then price is 16 (price factor 1.3 + 3 since price < 100)", () => {
        const fixture: MerxProduct = {price: 10, netprice: 0, minimum_sell: 1} as MerxProduct;
        const newPrice = MerxRunner.processPriceRule(fixture);
        expect(newPrice).toEqual(16);
    })

    it("given price 10, when netprice == 1 and minimum_sell == 1, then price is 25 (price factor 2.25, + 3 since price < 100, round to nearest int)", () => {
        const fixture: MerxProduct = {price: 10, netprice: 1, minimum_sell: 1} as MerxProduct;
        const newPrice = MerxRunner.processPriceRule(fixture);
        expect(newPrice).toEqual(26);
    })

    it("given calculated price is 100, no price addition", () => {
        const fixture: MerxProduct = {price: (10/2.25), netprice: 1, minimum_sell: 10} as MerxProduct;
        const newPrice = MerxRunner.processPriceRule(fixture);
        expect(newPrice).toEqual(100);
    })

    it("given calculated price is 99.9, price addition is applied", () => {
        const fixture: MerxProduct = {price: (10/2.25)-0.01, netprice: 1, minimum_sell: 10} as MerxProduct;
        const newPrice = MerxRunner.processPriceRule(fixture);
        expect(newPrice).toEqual(103);
    })
})