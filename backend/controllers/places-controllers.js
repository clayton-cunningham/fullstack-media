
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
          lat: 40.7484405,
          lng: -73.9878584
        },
        creator: '1'
    }
]

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => p.id === placeId)

    if (!place) {
      throw new HttpError("Could not find a place for the provided id.", 404);
    }

    res.json({place});
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creator == userId)
    
    if (!places || places.length < 1) {
        throw new HttpError("Could not find any places for the provided user id.", 404);
    }

    res.json({places});
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError("Invalid input.", 422));
    }

    const { title, description, address, creator } = req.body;
    
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (e) {
        return next(e);
    }
    
    const createdPlace = {
        id: uuidv4(),
        title, description, address, creator,
        location: coordinates,
    }

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace});
}

const editPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid input.", 422);
    }

    const placeId = req.params.pid;
    const index = DUMMY_PLACES.findIndex(p => p.id === placeId)
    if (index < 0) {
      throw new HttpError("Could not find a place for the provided id.", 404);
    }

    const place = {...DUMMY_PLACES.find(p => p.id === placeId)}
    const { title, description, address } = req.body;
    
    if (address) {
        place.address = address;
        
        let coordinates;
        try {
            coordinates = await getCoordsForAddress(address);
        } catch (e) {
            return next(e);
        }
        place.location = coordinates
    }
    if (title) place.title = title;
    if (description) place.description = description;
    // if (creator) place.creator = creator; Not creator - shouldn't be able to change in this app

    DUMMY_PLACES[index] = place;

    res.status(200).json({place});
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    const index = DUMMY_PLACES.findIndex(p => p.id === placeId)

    if (index > -1) DUMMY_PLACES.splice(index, 1);
    else throw new HttpError("Could not find a place for the provided id.", 404);

    res.status(204).json({});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.editPlace = editPlace;
exports.deletePlace = deletePlace;