import request from 'request';
import { DayForecast } from '../types';
import iconurl from '../service/icons';
import logger from '../service/logger';
class Forecast {
    private fetchedForecast:any = {};

    async fetchForecast(city: string) {
        return new Promise((resolve) => {
            if (!process.env.API_URL) throw new Error('Api url must be setted');
            if (!process.env.API_KEY) throw new Error('Api key must be setted');
            request({
                url: process.env.API_URL,
                qs: {
                    q: city,
                    appid: process.env.API_KEY,
                }
            }, (err, resp, body) => {
                if (err) throw new Error(err.message);
                this.fetchedForecast = JSON.parse(body);
                logger.log({ level: 'info', message: `Requested weather forecast. Response city: ${this.fetchedForecast.city.name}`});
                return resolve();
            });
        });
    }

    getWetherForecast(): DayForecast[] {
        const result: DayForecast[] = [];
        const timezoneOffset = this.fetchedForecast.city.timezone - (new Date()).getTimezoneOffset() * 60;
        let day = '';
        let weatherTypeId: any = {};
        this.fetchedForecast.list.forEach((el: any) => {
            const date = new Date((el.dt - timezoneOffset) * 1000);
            const eventDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
            if (day !== eventDay) {
                if (day !== '') {
                    result.push({
                        day,
                        icon: iconurl.getIconUrl(this.getPrimeryWetherId(weatherTypeId)),
                    });
                }
                day = eventDay;
                weatherTypeId = {};
            }
            weatherTypeId[el.weather[0].id] = weatherTypeId[el.weather[0].id] !== undefined ? weatherTypeId[el.weather[0].id] + 1 : 1;
        });
        result.push({
            day,
            icon: iconurl.getIconUrl(this.getPrimeryWetherId(weatherTypeId)),
        });
        return result;
    }
   
    getPrimeryWetherId(weather: any): string {
        let maxValue: number = 0;;
        let maxKey = '';
        for (const el in weather) {
            if (weather[el] > maxValue) {
                maxValue = weather[el];
               maxKey = el;
            }
        }
    return maxKey;
    }
}

export default new Forecast();