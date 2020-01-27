import { Router } from 'express';
import forecast from '../service/forecast';

const router = Router();

router.get('/', (req, res) => {
    const tz = (new Date()).getTimezoneOffset();
    res.render('index', { tz });
});

router.get('/forecast/:cityname', async (req, res) => {
    await forecast.fetchForecast(req.params.cityname);
    res.render('forecast', {weather: forecast.getWetherForecast()});
});

router.get('*', (req, res) => {
    const url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
    res.render('404', { url });
});

export default router;