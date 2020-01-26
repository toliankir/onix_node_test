require('dotenv').config();
import express from 'express';
import { createServer }  from 'http';
import path from 'path';
import socketio from 'socket.io';
import cityname from './service/cityname';
import iconurl from './service/icons';
import { getRootDir } from './helpers/rootdir';
import router from './router/web';
import { City } from './types';

const app = express();
app.set('view engine', 'pug');
const server = createServer(app);
const io = socketio.listen(server);
const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    socket.on('cityname', async (data: any) => {
        if  (data.name.length < 4) {
            return;
        }
        const cities: City[] = await cityname.searchCity(data.name);
            socket.emit('citylist', cities);
    });
});

// console.log(forecast.getWetherForecast('Kirovohrad'));

app.use(express.static(path.join(getRootDir(), 'public')));
app.use('/assets', express.static(path.join(getRootDir(), 'assets')));
app.use(router);

runApp();



async function runApp() {
    await cityname.init();
    await iconurl.init();
    server.listen(PORT, () => {
        console.log(`Server is runnig on ${PORT}`);
    });
}