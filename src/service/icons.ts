import fs from 'fs';
import path from 'path';
import { getRootDir } from '../helpers/helpers';
import logger from '../service/logger';

class IconUrl {
    private icons = [];

    async init() {
        return new Promise((resolve) => {
            if (!process.env.DATA_FOLDER) throw new Error('Data folder must be setted');
            if (!process.env.ICON_FILE) throw new Error('City name file must be setted');
            if (!process.env.ICON_PREFIX) throw new Error('Icon prefix must be setted');
            if (!process.env.ICON_SUFFIX) throw new Error('Icon suffix must be setted');

            const filename = path.join(getRootDir(), process.env.DATA_FOLDER, process.env.ICON_FILE);
            fs.access(filename, (err) => {
                if (err) throw new Error(err.message);
                fs.readFile(filename, (err, data) => {
                    if (err) throw new Error(err.message);
                    this.icons = JSON.parse(data.toString());
                    logger.log({ level: 'info', message: `Init icons service. Loaded ${this.icons.length} icon names.`});
                    resolve();
                });  
            });
        });      
    }

    getIconUrl(code:string) {
        const iconObj: any = this.icons.find((el: any) => {
            return el.code === code;
        });
        logger.log({ level: 'debug', message: `Requested image for code. Code: ${code}, image: ${iconObj.icon}`});
        return iconObj ? process.env.ICON_PREFIX + iconObj.icon + process.env.ICON_SUFFIX : '';
    }
    
}

export default new IconUrl();