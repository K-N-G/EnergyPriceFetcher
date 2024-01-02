import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/routes';
import { startCronJob } from './cron/cron-job';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const dbURL = process.env.DB_URL;

const connectionString = `${dbURL}`;
mongoose.connect(connectionString);

app.use(express.json());

app.use(routes)

startCronJob()

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
