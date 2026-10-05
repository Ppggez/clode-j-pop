import { Utils } from "./Utils";

const integration_test = () => {
  const total = Utils.sumPrice([100, 200]);   
  const tax = Utils.calcTax(total);           
  if (total + tax !== 321) {
    console.log(1);
    return;
  }
  console.log(0);
};

integration_test();