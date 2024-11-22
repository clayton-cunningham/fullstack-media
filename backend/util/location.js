
const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = '6740cf0ddd80e206130748lqz312dcf';

async function getCoordsForAddress(address) {
    const url = 
        `https://geocode.maps.co/search?q=${encodeURIComponent(address)}
        &api_key=${API_KEY}`;

    const response = await axios.get(url);

    if (!response || response.status != 200 || response.data == undefined || response.data.length == 0) {
        throw new HttpError('Address not found.', 404);
    }

    const boundingBox = response.data[0].boundingbox;
    const coordinates = {
        lat: boundingBox[0],
        lng: boundingBox[2]
    }

    return coordinates;
}

module.exports = getCoordsForAddress;