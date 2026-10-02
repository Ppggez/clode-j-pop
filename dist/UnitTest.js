"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
const unit_test = () => {
    // test1: รวมเงิน
    if (Utils_1.Utils.sumPrice([100, 200]) !== 300) {
        console.log(1);
        return;
    }
    // test2: คิดภาษี
    if (Utils_1.Utils.calcTax(100) !== 7) {
        console.log(1);
        return;
    }
    console.log(0);
};
unit_test();
