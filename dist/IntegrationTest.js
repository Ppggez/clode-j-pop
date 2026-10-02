"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
const integration_test = () => {
    const total = Utils_1.Utils.sumPrice([100, 200]); // 300
    const tax = Utils_1.Utils.calcTax(total); // 21
    if (total + tax !== 321) {
        console.log(1);
        return;
    }
    console.log(0);
};
integration_test();
