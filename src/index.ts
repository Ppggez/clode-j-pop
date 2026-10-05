import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import userRoutes from './UserRoutes';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

// connection string อยู่ใน config.json (ไม่ขึ้น GitHub) ถ้าไม่มีไฟล์ใช้ MONGO_URI หรือ local แทน
const configPath = path.join(__dirname, 'config.json');
const mongoUri: string = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' })).connection
  : process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
