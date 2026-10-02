"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
function sumPrice(prices) {
    let total = 0;
    for (const p of prices)
        total += p;
    return total;
}
function calcTax(total) {
    return total * 0.07;
}
exports.Utils = { sumPrice, calcTax };
