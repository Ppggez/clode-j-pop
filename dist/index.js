"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserRoutes_1 = __importDefault(require("./UserRoutes"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// connection string อยู่ใน config.json (ไม่ขึ้น GitHub) ถ้าไม่มีไฟล์ใช้ MONGO_URI หรือ local แทน
const configPath = path_1.default.join(__dirname, 'config.json');
const mongoUri = fs_1.default.existsSync(configPath)
    ? JSON.parse(fs_1.default.readFileSync(configPath, { encoding: 'utf8', flag: 'r' })).connection
    : process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Routes
app.use('/api', UserRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
mongoose_1.default.connect(mongoUri)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
