import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import userRoutes from './UserRoutes';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

// ใช้ MONGO_URI ก่อน (docker-compose ตั้งให้) ถ้าไม่มีค่อยอ่าน config.json (ไม่ขึ้น GitHub) หรือ local แทน
const configPath = path.join(__dirname, 'config.json');
const mongoUri: string = process.env.MONGO_URI
  || (fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' })).connection
    : 'mongodb://localhost:27017/mydb');

// Middleware
app.use(express.json());
app.use(cors());
// ไฟล์ html อยู่ที่ src/public (tsc ไม่ copy ไป dist) ใช้ได้ทั้งตอนรันจาก src และ dist
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));

// Routes
app.use('/api', userRoutes);

app.get('/', (req: Request, res: Response) => {
  // SERVER_NAME ตั้งใน docker-compose.yml เพื่อดูว่า request ไปตกที่ server ตัวไหน
  res.send(`Lab multiweb  ${process.env.SERVER_NAME || 'server'}`);
});

// ให้ docker healthcheck เรียกเช็คว่า server ยังทำงานอยู่
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// เปิด server ก่อนเสมอ ถึงจะต่อ MongoDB ไม่ได้ (เช่นบน Azure ที่ไม่มี DB) หน้าเว็บก็ยังขึ้น
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
