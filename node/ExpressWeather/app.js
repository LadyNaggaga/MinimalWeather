"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express = require("express");
const got_1 = require("got");
const baseUrl = 'https://atlas.microsoft.com/weather/';
const baseQuery = `api-version=1.0&subscription-key=${process.env['SubscriptionKey']}&unit=imperial`;
const app = express();
app.get('/weather/:lat,:lon', cors(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lat = parseFloat(req.params.lat);
        const lon = parseFloat(req.params.lon);
        const currentQuery = got_1.default(`${baseUrl}currentConditions/json?${baseQuery}&query=${lat},${lon}`);
        const hourlyQuery = got_1.default(`${baseUrl}forecast/hourly/json?${baseQuery}&query=${lat},${lon}&duration=24`);
        const dailyQuery = got_1.default(`${baseUrl}forecast/daily/json?${baseQuery}&query=${lat},${lon}&duration=10`);
        // Wait for the 3 parallel requests to complete and combine the responses.
        const [currentResponse, hourlyResponse, dailyResponse] = yield Promise.all([currentQuery, hourlyQuery, dailyQuery]);
        yield res.json({
            currentWeather: JSON.parse(currentResponse.body).results[0],
            hourlyForecasts: JSON.parse(hourlyResponse.body).forecasts,
            dailyForecasts: JSON.parse(dailyResponse.body).forecasts,
        });
    }
    catch (err) {
        // Express doesn't handle async errors natively yet.
        next(err);
    }
}));
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
//# sourceMappingURL=app.js.map