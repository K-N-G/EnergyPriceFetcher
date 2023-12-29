import mongoose, { Schema, Document } from 'mongoose';

export interface HourlyData {
    eur: number;
    bgn: number;
    volume: number;
}

export interface DateAndTime {
    time: string;
    data: HourlyData;
}

export interface MarketData {
    date: string;
    hourlyData: DateAndTime[];
}

const HourlyDataSchema: Schema = new Schema({
    time: { type: String, required: true },
    data: {
        eur: { type: Number, required: true },
        bgn: { type: Number, required: true },
        volume: { type: Number, required: true }
    }
});

const MarketDataSchema: Schema = new Schema({
    date: { type: String, required: true },
    hourlyData: [HourlyDataSchema]
});

const MarketDataModel = mongoose.model<MarketData>('EnergyPrice', MarketDataSchema);

export default MarketDataModel;
