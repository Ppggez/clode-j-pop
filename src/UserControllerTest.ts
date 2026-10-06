import { Request, Response } from 'express';
import User from './User';
import { createUser, getUsers, getUserById, deleteUser, updateUser } from './UserController';

// จำลอง User model แทนการต่อ MongoDB จริง
const UserMock = User as any;
const fakeUser = { _id: '1', name: 'Ann', email: 'ann@example.com', password: '1234', age: 20 };
const fail = async () => { throw new Error('db error'); };

const mockReq = (params: any = {}, body: any = {}) => ({ params, body } as Request);

const mockRes = () => {
  const res: any = {};
  res.status = (code: number) => { res.statusCode = code; return res; };
  res.json = (body: any) => { res.body = body; return res; };
  return res as Response & { statusCode: number; body: any };
};

const tests: { name: string; run: () => Promise<boolean> }[] = [
  {
    name: 'createUser returns 201',
    run: async () => {
      UserMock.prototype.save = async function () { return this; };
      const res = mockRes();
      await createUser(mockReq({}, { name: 'Ann', email: 'ann@example.com', password: '1234', age: 20 }), res);
      return res.statusCode === 201 && res.body.name === 'Ann' && res.body.age === 20;
    },
  },
  {
    name: 'createUser returns 500 when save fails',
    run: async () => {
      UserMock.prototype.save = fail;
      const res = mockRes();
      await createUser(mockReq({}, { name: 'Ann', email: 'ann@example.com', password: '1234', age: 20 }), res);
      return res.statusCode === 500;
    },
  },
  {
    name: 'createUser returns 400 and does not save when name has space',
    run: async () => {
      let saved = false;
      UserMock.prototype.save = async function () { saved = true; return this; };
      const res = mockRes();
      await createUser(mockReq({}, { name: 'Ann B', email: 'ann@example.com', password: '1234', age: 20 }), res);
      return res.statusCode === 400 && res.body.errors.includes('name must not contain spaces') && !saved;
    },
  },
  {
    name: 'createUser returns 400 when age is not a number',
    run: async () => {
      const res = mockRes();
      await createUser(mockReq({}, { name: 'Ann', email: 'ann@example.com', password: '1234', age: 'abc' }), res);
      return res.statusCode === 400 && res.body.errors.includes('age must be a whole number');
    },
  },
  {
    name: 'getUsers returns 200 with list',
    run: async () => {
      UserMock.find = async () => [fakeUser, fakeUser];
      const res = mockRes();
      await getUsers(mockReq(), res);
      return res.statusCode === 200 && res.body.length === 2;
    },
  },
  {
    name: 'getUsers returns 500 when db fails',
    run: async () => {
      UserMock.find = fail;
      const res = mockRes();
      await getUsers(mockReq(), res);
      return res.statusCode === 500;
    },
  },
  {
    name: 'getUserById returns 200 when found',
    run: async () => {
      UserMock.findById = async () => fakeUser;
      const res = mockRes();
      await getUserById(mockReq({ id: '1' }), res);
      return res.statusCode === 200 && res.body.email === 'ann@example.com';
    },
  },
  {
    name: 'getUserById returns 404 when not found',
    run: async () => {
      UserMock.findById = async () => null;
      const res = mockRes();
      await getUserById(mockReq({ id: '2' }), res);
      return res.statusCode === 404;
    },
  },
  {
    name: 'getUserById returns 500 when db fails',
    run: async () => {
      UserMock.findById = fail;
      const res = mockRes();
      await getUserById(mockReq({ id: '1' }), res);
      return res.statusCode === 500;
    },
  },
  {
    name: 'updateUser returns 200 with updated data',
    run: async () => {
      UserMock.findByIdAndUpdate = async (id: string, data: any) => ({ ...fakeUser, ...data });
      const res = mockRes();
      await updateUser(mockReq({ id: '1' }, { age: 21 }), res);
      return res.statusCode === 200 && res.body.age === 21;
    },
  },
  {
    name: 'updateUser returns 404 when not found',
    run: async () => {
      UserMock.findByIdAndUpdate = async () => null;
      const res = mockRes();
      await updateUser(mockReq({ id: '2' }, { age: 21 }), res);
      return res.statusCode === 404;
    },
  },
  {
    name: 'updateUser returns 400 and does not update when age is invalid',
    run: async () => {
      let updated = false;
      UserMock.findByIdAndUpdate = async () => { updated = true; return fakeUser; };
      const res = mockRes();
      await updateUser(mockReq({ id: '1' }, { age: 'abc' }), res);
      return res.statusCode === 400 && !updated;
    },
  },
  {
    name: 'updateUser returns 500 when db fails',
    run: async () => {
      UserMock.findByIdAndUpdate = fail;
      const res = mockRes();
      await updateUser(mockReq({ id: '1' }, { age: 21 }), res);
      return res.statusCode === 500;
    },
  },
  {
    name: 'deleteUser returns 200 when deleted',
    run: async () => {
      UserMock.findByIdAndDelete = async () => fakeUser;
      const res = mockRes();
      await deleteUser(mockReq({ id: '1' }), res);
      return res.statusCode === 200 && res.body.message === 'User deleted';
    },
  },
  {
    name: 'deleteUser returns 404 when not found',
    run: async () => {
      UserMock.findByIdAndDelete = async () => null;
      const res = mockRes();
      await deleteUser(mockReq({ id: '2' }), res);
      return res.statusCode === 404;
    },
  },
];

const user_controller_test = async () => {
  let failed = 0;
  for (const test of tests) {
    if (!(await test.run())) {
      failed++;
      console.error('FAIL: ' + test.name); 
    }
  }
  console.log(failed === 0 ? 0 : 1);
};

user_controller_test();
