import cron from 'node-cron';
import totalDeyMarketController from '../controllers/total.dey.market.controller';

export const startCronJob = () => {
    totalDeyMarketController.scrapeAndSaveDataCron();
    cron.schedule('0 */6 * * *', async () => {
        try {
            await totalDeyMarketController.scrapeAndSaveDataCron();
        } catch (error) {
            console.error('Error in running Cron job:', error);
        }
    });
};