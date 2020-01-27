import fs from 'fs';
import path from 'path';
import { getRootDir } from '../helpers/helpers';
import { City } from '../types';
import logger from '../service/logger';
class CityName {
    private cities = [];

    async init() {
        return new Promise((resolve) => {
            if (!process.env.DATA_FOLDER) throw new Error('Data folder must be setted');
            if (!process.env.CITY_FILE) throw new Error('City name file must be setted');

            const filename = path.join(getRootDir(), process.env.DATA_FOLDER, process.env.CITY_FILE);
            fs.access(filename, (err) => {
                if (err) throw new Error(err.message);
                fs.readFile(filename, (err, data) => {
                    if (err) throw new Error(err.message);
                    this.cities = JSON.parse(data.toString());
                    logger.log({ level: 'info', message: `Init cities service. Loaded ${this.cities.length} city names.`});
                    resolve();
                });  
            });
        });      
    }

    searchCity(city: string): City[] {
        const cities = this.cities.filter((el: any) => {
            return el.name.toString().toUpperCase().indexOf(city.toUpperCase()) !== -1;
        }).map((el: any) => {
            return {
                id: el.id,
                name: el.name,
                country: el.country,
            }
        });
        logger.log({ level: 'debug', message: `Requested city name. City: ${city}, found results: ${cities.length}`});
        return cities;
    }    
}

export default new CityName();