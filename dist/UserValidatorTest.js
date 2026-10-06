"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserValidator_1 = require("./UserValidator");
const valid = { name: 'Ann', email: 'ann@example.com', password: '1234', age: 20 };
// ข้อมูลผิดต้องมี error ที่ระบุ, ข้อมูลถูกต้องไม่มี error เลย
const expectError = (data, error, partial = false) => (0, UserValidator_1.validateUser)(data, partial).includes(error);
const expectValid = (data, partial = false) => (0, UserValidator_1.validateUser)(data, partial).length === 0;
const tests = [
    // ข้อมูลถูกต้อง
    { name: 'valid user passes', run: () => expectValid(valid) },
    { name: 'age as digit string "20" passes', run: () => expectValid(Object.assign(Object.assign({}, valid), { age: '20' })) },
    // name
    { name: 'name with space fails', run: () => expectError(Object.assign(Object.assign({}, valid), { name: 'Ann B' }), 'name must not contain spaces') },
    { name: 'name with tab fails', run: () => expectError(Object.assign(Object.assign({}, valid), { name: 'Ann\tB' }), 'name must not contain spaces') },
    { name: 'name with leading space fails', run: () => expectError(Object.assign(Object.assign({}, valid), { name: ' Ann' }), 'name must not contain spaces') },
    { name: 'empty name fails', run: () => expectError(Object.assign(Object.assign({}, valid), { name: '' }), 'name is required') },
    { name: 'missing name fails', run: () => expectError(Object.assign(Object.assign({}, valid), { name: undefined }), 'name is required') },
    // email
    { name: 'email without @ fails', run: () => expectError(Object.assign(Object.assign({}, valid), { email: 'annexample.com' }), 'email is invalid') },
    { name: 'email without domain fails', run: () => expectError(Object.assign(Object.assign({}, valid), { email: 'ann@example' }), 'email is invalid') },
    // password
    { name: 'short password fails', run: () => expectError(Object.assign(Object.assign({}, valid), { password: '12' }), 'password must be at least 4 characters') },
    // age
    { name: 'age with letters fails', run: () => expectError(Object.assign(Object.assign({}, valid), { age: 'abc' }), 'age must be a whole number') },
    { name: 'age mixed "20a" fails', run: () => expectError(Object.assign(Object.assign({}, valid), { age: '20a' }), 'age must be a whole number') },
    { name: 'age with space "2 0" fails', run: () => expectError(Object.assign(Object.assign({}, valid), { age: '2 0' }), 'age must be a whole number') },
    { name: 'age decimal 20.5 fails', run: () => expectError(Object.assign(Object.assign({}, valid), { age: 20.5 }), 'age must be a whole number') },
    { name: 'age 0 fails', run: () => expectError(Object.assign(Object.assign({}, valid), { age: 0 }), 'age must be between 1 and 150') },
    { name: 'negative age fails', run: () => expectError(Object.assign(Object.assign({}, valid), { age: -5 }), 'age must be between 1 and 150') },
    { name: 'age 151 fails', run: () => expectError(Object.assign(Object.assign({}, valid), { age: 151 }), 'age must be between 1 and 150') },
    // ไม่ส่งอะไรมาเลย
    { name: 'empty body has 4 errors', run: () => (0, UserValidator_1.validateUser)(undefined).length === 4 },
    // update (partial) ตรวจเฉพาะฟิลด์ที่ส่งมา
    { name: 'update with only age passes', run: () => expectValid({ age: 21 }, true) },
    { name: 'update with name containing space fails', run: () => expectError({ name: 'Ann B' }, 'name must not contain spaces', true) },
    { name: 'update with age "abc" fails', run: () => expectError({ age: 'abc' }, 'age must be a whole number', true) },
];
const user_validator_test = () => {
    let failed = 0;
    for (const test of tests) {
        if (!test.run()) {
            failed++;
            console.error('FAIL: ' + test.name);
        }
    }
    console.log(failed === 0 ? 0 : 1);
};
user_validator_test();
