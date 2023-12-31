import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/routes';
import { startCronJob } from './cron/cron-job';

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/energy-price-fetcher');

app.use(express.json());

app.use(routes)

startCronJob()

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
