import axios from 'axios';
import * as cheerio from 'cheerio';
import { Request, Response } from 'express';
import MarketDataModel from '../models/market.data.model';
import { MarketData, DateAndTime } from '../models/market.data.model';


class MarketDataController {
  async scrapeAndSaveData(req: Request, res: Response) {
    const config = {
      headers: {
        'User-Agent': 'PostmanRuntime/7.32.3'
      }
    };

    try {
      const url = 'https://ibex.bg/данни-за-пазара/пазарен-сегмент-ден-напред/пазарен-сегмент-ден-напред-2/';
      const response = await axios.get(url, config);
      const $ = cheerio.load(response.data);

      const table = $('#dam-php-table');

      const dataToSave: MarketData[] = [];

      table.find('tr').each((i, row) => {
        const columns = $(row).find('td');
          if (columns.length > 0) {
            const date = $(columns[2]).text().trim();
            const time =  $(columns[1]).text().trim();
            const priceEur = $(columns[3]).text().trim();
            const price = $(columns[4]).text().trim();
            const volume = $(columns[5]).text().trim();
            const hourlyData: DateAndTime = {
              time,
              data: {
                eur: Number(priceEur),
                bgn: Number(price),
                volume: Number(volume)
              }
            };

            const existingData = dataToSave.find(data => data.date === date);
          if (existingData) {
            const existingHourlyData = existingData.hourlyData.find(hData => hData.time === time);
            if (existingHourlyData) {
              existingHourlyData.data = hourlyData.data;
            } else {
              existingData.hourlyData.push(hourlyData);
            }
          } else {
            dataToSave.push({
              date,
              hourlyData: [hourlyData]
            });
          }
          }
      });

      for (const data of dataToSave) {
        await MarketDataModel.findOneAndUpdate(
          { date: data.date },
          { hourlyData: data.hourlyData },
          { upsert: true, new: true }
        );
      }

      res.json({ message: 'Data scraped and saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async scrapeAndSaveDataCron() {
    const config = {
      headers: {
        'User-Agent': 'PostmanRuntime/7.32.3'
      }
    };

    try {
      const url = 'https://ibex.bg/данни-за-пазара/пазарен-сегмент-ден-напред/пазарен-сегмент-ден-напред-2/';
      const response = await axios.get(url, config);
      const $ = cheerio.load(response.data);

      const table = $('#dam-php-table');

      const dataToSave: MarketData[] = [];

      table.find('tr').each((i, row) => {
        const columns = $(row).find('td');
          if (columns.length > 0) {
            const date = $(columns[2]).text().trim();
            const time =  $(columns[1]).text().trim();
            const priceEur = $(columns[3]).text().trim();
            const price = $(columns[4]).text().trim();
            const volume = $(columns[5]).text().trim();
            const hourlyData: DateAndTime = {
              time,
              data: {
                eur: Number(priceEur),
                bgn: Number(price),
                volume: Number(volume)
              }
            };

            const existingData = dataToSave.find(data => data.date === date);
          if (existingData) {
            const existingHourlyData = existingData.hourlyData.find(hData => hData.time === time);
            if (existingHourlyData) {
              existingHourlyData.data = hourlyData.data;
            } else {
              existingData.hourlyData.push(hourlyData);
            }
          } else {
            dataToSave.push({
              date,
              hourlyData: [hourlyData]
            });
          }
          }
      });

      for (const data of dataToSave) {
        await MarketDataModel.findOneAndUpdate(
          { date: data.date },
          { hourlyData: data.hourlyData },
          { upsert: true, new: true }
        );
      }
      console.log('cron updated')
    } catch (error) {
      console.error(error);
    }
  }
}

export default new MarketDataController();