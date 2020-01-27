require('dotenv').config();
import express from 'express';
import { createServer }  from 'http';
import path from 'path';
import socketio from 'socket.io';
import cityname from './service/cityname';
import iconurl from './service/icons';
import { getRootDir } from './helpers/helpers';
import router from './router/web';
import { City } from './types';
import logger from './service/logger';

const app = express();
app.set('view engine', 'pug');
const server = createServer(app);
const io = socketio.listen(server);
const port = process.env.PORT || 5000;

io.on('connection', (socket) => {
    socket.on('cityname', async (data: any) => {
        if  (data.name.length < 4) {
            return;
        }
        const cities: City[] = await cityname.searchCity(data.name);
            socket.emit('citylist', cities);
    });
});

app.use(express.static(path.join(getRootDir(), 'public')));
app.use('/assets', express.static(path.join(getRootDir(), 'assets')));
app.use(router);

runApp();

async function runApp() {
    try {
        await cityname.init();
        await iconurl.init();
    } catch (err) {
        logger.log({ level: 'error', message: err.message})
        return;
    }
    
    server.listen(port, () => {
        logger.log({ level: 'info', message: `Server is runnig on ${port}`})
    });
}