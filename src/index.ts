require('dotenv').config();
import express from 'express';
import { createServer }  from 'http';
import path from 'path';
import socketio from 'socket.io';
import CityName from './service/cityname';
import { getRootDir } from './helpers/rootdir';
import request from 'request';

const app = express();
const server = createServer(app);
const io = socketio.listen(server);
const PORT = process.env.PORT || 5000;
const cityname = new CityName;

io.on('connection', (socket) => {
    socket.on('cityname', async (data: any) => {
        if  (data.name.length < 4) {
            return;
        }
        const cities = await cityname.searchCity(data.name);
        if (cities.length !== 0) {
            socket.emit('citylist', cities);
        }        
    });
});



app.use(express.static(path.join(getRootDir(), 'public')));
app.use('/assets', express.static(path.join(getRootDir(), 'assets')));

app.get('/', (req, res) => {
    res.send(cityname.searchCity('Kirov'));
});

runApp();

request('https://api.openweathermap.org/data/2.5/forecast?id=705812&appid=eddd2d5b336d29e2b7351ca4f9ec3c63', (err, res, body) => {
    const json = JSON.parse(body);
    console. log(json);
    json.list.forEach((el: any) => {
    //     console.log(el);
        const date = new Date(parseInt(el.dt, 10) * 1000);
        // console.log(date.toString());
    });
});

async function runApp() {
    await cityname.init();
    server.listen(PORT, () => {
        console.log(`Server is runnig on ${PORT}`);
    });
}