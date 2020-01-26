import fs from 'fs';
import path from 'path';
import { getRootDir } from '../helpers/rootdir';

class IconUrl {
    private icons = [];

    async init() {
        return new Promise((resolve) => {
            console.log('icons init');
            if (!process.env.DATA_FOLDER) throw new Error('Data folder must be setted');
            if (!process.env.ICON_FILE) throw new Error('City name file must be setted');

            const filename = path.join(getRootDir(), process.env.DATA_FOLDER, process.env.ICON_FILE);
            fs.access(filename, (err) => {
                if (err) throw new Error(err.message);
                fs.readFile(filename, (err, data) => {
                    if (err) throw new Error(err.message);
                    this.icons = JSON.parse(data.toString());
                    resolve();
                });  
            });
        });      
    }

    getIconUrl(code:string) {
        if (!process.env.ICON_PREFIX) throw new Error('Icon prefix must be setted');
        if (!process.env.ICON_SUFFIX) throw new Error('Icon suffix must be setted');

        const iconObj: any = this.icons.find((el: any) => {
            return el.code === code;
        });
        return iconObj ? process.env.ICON_PREFIX + iconObj.icon + process.env.ICON_SUFFIX : '';
    }
    
}

export default new IconUrl();