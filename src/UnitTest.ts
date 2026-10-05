import { Utils } from "./Utils";

const unit_test = () => {

  if (Utils.sumPrice([100, 200]) !== 300) {
    console.log(1);
    return;
  }
 
  if (Utils.calcTax(100) !== 7) {
    console.log(1);
    return;
  }
  console.log(0);
};

unit_test();