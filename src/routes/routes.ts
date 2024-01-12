// routes/routes.ts

import { Router } from 'express';
import MarketDataModel from '../models/market.data.model';
import totalDeyMarketController from '../controllers/total.dey.market.controller';

const router = Router();


router.get('/scrape-and-save', totalDeyMarketController.scrapeAndSaveData);

router.get('/', async (req, res) => {
    try {
         res.send("Succses");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/prices', async (req, res) => {
    try {
        const prices = await MarketDataModel.find();
        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/prices/:date', async (req, res) => {
    try {
        const { date } = req.params;

        const prices = await MarketDataModel.find({ date });

        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/latest-price', async (req, res) => {
    try {
        const latestPrice = await MarketDataModel.findOne().sort({ _id: -1 });

        if (!latestPrice) {
            return res.status(404).json({ error: 'No data found.' });
        }

        res.json(latestPrice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
