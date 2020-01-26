import fs from 'fs';
import path from 'path';
import { getRootDir } from '../helpers/rootdir';

export default class CityNames {

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
                    resolve();
                });  
            });
        });      
    }

    searchCity(city: string) {
        return this.cities.filter((el: any) => {
            return el.name.toString().toUpperCase().indexOf(city.toUpperCase()) !== -1;
        }).map((el: any) => {
            return {
                id: el.id,
                name: el.name,
                country: el.country,
            }
        });
    }    
}