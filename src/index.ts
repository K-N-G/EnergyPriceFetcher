import express from 'express';
import mongoose from 'mongoose';
import totalDeyMarketController from './controllers/total.dey.market.controller';

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/energy-price-fetcher');

app.use(express.json());

app.get('/scrape-and-save', totalDeyMarketController.scrapeAndSaveData);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
