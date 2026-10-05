"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const UserController_1 = require("./UserController");
// จำลอง User model แทนการต่อ MongoDB จริง
const UserMock = User_1.default;
const fakeUser = { _id: '1', name: 'Ann', email: 'ann@example.com', password: '1234', age: 20 };
const fail = () => __awaiter(void 0, void 0, void 0, function* () { throw new Error('db error'); });
const mockReq = (params = {}, body = {}) => ({ params, body });
const mockRes = () => {
    const res = {};
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (body) => { res.body = body; return res; };
    return res;
};
const tests = [
    {
        name: 'createUser returns 201',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.prototype.save = function () {
                return __awaiter(this, void 0, void 0, function* () { return this; });
            };
            const res = mockRes();
            yield (0, UserController_1.createUser)(mockReq({}, { name: 'Ann', email: 'ann@example.com', password: '1234', age: 20 }), res);
            return res.statusCode === 201 && res.body.name === 'Ann' && res.body.age === 20;
        }),
    },
    {
        name: 'createUser returns 500 when save fails',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.prototype.save = fail;
            const res = mockRes();
            yield (0, UserController_1.createUser)(mockReq({}, { name: 'Ann' }), res);
            return res.statusCode === 500;
        }),
    },
    {
        name: 'getUsers returns 200 with list',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.find = () => __awaiter(void 0, void 0, void 0, function* () { return [fakeUser, fakeUser]; });
            const res = mockRes();
            yield (0, UserController_1.getUsers)(mockReq(), res);
            return res.statusCode === 200 && res.body.length === 2;
        }),
    },
    {
        name: 'getUsers returns 500 when db fails',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.find = fail;
            const res = mockRes();
            yield (0, UserController_1.getUsers)(mockReq(), res);
            return res.statusCode === 500;
        }),
    },
    {
        name: 'getUserById returns 200 when found',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.findById = () => __awaiter(void 0, void 0, void 0, function* () { return fakeUser; });
            const res = mockRes();
            yield (0, UserController_1.getUserById)(mockReq({ id: '1' }), res);
            return res.statusCode === 200 && res.body.email === 'ann@example.com';
        }),
    },
    {
        name: 'getUserById returns 404 when not found',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.findById = () => __awaiter(void 0, void 0, void 0, function* () { return null; });
            const res = mockRes();
            yield (0, UserController_1.getUserById)(mockReq({ id: '2' }), res);
            return res.statusCode === 404;
        }),
    },
    {
        name: 'getUserById returns 500 when db fails',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.findById = fail;
            const res = mockRes();
            yield (0, UserController_1.getUserById)(mockReq({ id: '1' }), res);
            return res.statusCode === 500;
        }),
    },
    {
        name: 'updateUser returns 200 with updated data',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.findByIdAndUpdate = (id, data) => __awaiter(void 0, void 0, void 0, function* () { return (Object.assign(Object.assign({}, fakeUser), data)); });
            const res = mockRes();
            yield (0, UserController_1.updateUser)(mockReq({ id: '1' }, { age: 21 }), res);
            return res.statusCode === 200 && res.body.age === 21;
        }),
    },
    {
        name: 'updateUser returns 404 when not found',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.findByIdAndUpdate = () => __awaiter(void 0, void 0, void 0, function* () { return null; });
            const res = mockRes();
            yield (0, UserController_1.updateUser)(mockReq({ id: '2' }, { age: 21 }), res);
            return res.statusCode === 404;
        }),
    },
    {
        name: 'updateUser returns 500 when db fails',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.findByIdAndUpdate = fail;
            const res = mockRes();
            yield (0, UserController_1.updateUser)(mockReq({ id: '1' }, { age: 21 }), res);
            return res.statusCode === 500;
        }),
    },
    {
        name: 'deleteUser returns 200 when deleted',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.findByIdAndDelete = () => __awaiter(void 0, void 0, void 0, function* () { return fakeUser; });
            const res = mockRes();
            yield (0, UserController_1.deleteUser)(mockReq({ id: '1' }), res);
            return res.statusCode === 200 && res.body.message === 'User deleted';
        }),
    },
    {
        name: 'deleteUser returns 404 when not found',
        run: () => __awaiter(void 0, void 0, void 0, function* () {
            UserMock.findByIdAndDelete = () => __awaiter(void 0, void 0, void 0, function* () { return null; });
            const res = mockRes();
            yield (0, UserController_1.deleteUser)(mockReq({ id: '2' }), res);
            return res.statusCode === 404;
        }),
    },
];
const user_controller_test = () => __awaiter(void 0, void 0, void 0, function* () {
    let failed = 0;
    for (const test of tests) {
        if (!(yield test.run())) {
            failed++;
            console.error('FAIL: ' + test.name); // stderr ไม่ไปปนกับผล 0/1 ที่ workflow อ่าน
        }
    }
    console.log(failed === 0 ? 0 : 1);
});
user_controller_test();
