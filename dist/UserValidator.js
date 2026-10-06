"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
// ตรวจข้อมูล user ก่อนบันทึก คืนรายการข้อผิดพลาด (ว่าง = ผ่าน)
// partial = true ใช้ตอน update: ตรวจเฉพาะฟิลด์ที่ส่งมา
const validateUser = (data, partial = false) => {
    data = data || {};
    const errors = [];
    const check = (key) => !partial || data[key] !== undefined;
    if (check('name')) {
        if (typeof data.name !== 'string' || data.name.trim() === '') {
            errors.push('name is required');
        }
        else if (/\s/.test(data.name)) {
            errors.push('name must not contain spaces');
        }
    }
    if (check('email')) {
        if (typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('email is invalid');
        }
    }
    if (check('password')) {
        if (typeof data.password !== 'string' || data.password.length < 4) {
            errors.push('password must be at least 4 characters');
        }
    }
    if (check('age')) {
        const age = data.age;
        const isWholeNumber = typeof age === 'number'
            ? Number.isInteger(age)
            : typeof age === 'string' && /^\d+$/.test(age);
        if (!isWholeNumber) {
            errors.push('age must be a whole number');
        }
        else if (Number(age) < 1 || Number(age) > 150) {
            errors.push('age must be between 1 and 150');
        }
    }
    return errors;
};
exports.validateUser = validateUser;
