

const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const fs = require('fs');
const { default: mongoose } = require("mongoose");

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (e) {
        const error = new HttpError(
            'Failed to retrieve a place, please try again',
            500
        );
        return next (error);
    }

    if (!place) {
        const error = new HttpError(
            "Could not find a place for the provided id.", 404
        );
        return next (error);
    }

    res.json({ place: place.toObject({ getters: true }) });
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    
    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    } catch (e) {
        const error = new HttpError(
            "Failed to retrieve a user's places, please try again",
            500
        );
        return next (error);
    }

    if (!userWithPlaces || userWithPlaces.length < 1) {
        const error = new HttpError(
            "Could not find any places for the provided user id.", 404
        );
        return next (error);
    }

    res.json({ places: userWithPlaces.places.map(p => p.toObject({ getters: true })) });

}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError("Invalid input.", 422));
    }

    const { title, description, address } = req.body;
    
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (e) {
        return next(e);
    }

    const createdPlace = new Place({
        title, description, address, 
        creator: req.userData.userId,
        location: coordinates,
        image: req.file.path,
    })

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (e) {
        const error = new HttpError(
            'Failed to find the referenced user, please try again',
            500,
            e
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            "Could not find a user for the provided id.", 404
        );
        return next (error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Failed to create a place, please try again',
            500,
            err
        );
        return next (error);
    }

    res.status(201).json({place: createdPlace.toObject({ getters: true }) });
}

const editPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new HttpError(
            "Invalid input.", 422
        );
        return next (error);
    }

    const placeId = req.params.pid;
    const { title, description, address } = req.body;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (e) {
        const error = new HttpError(
            'Failed to retrieve a place, please try again',
            500
        );
        return next (error);
    }

    if (!place || place.creator.toString() !== req.userData.userId) {
        const error = new HttpError(
            "Could not find a place for the provided place and user ids.", 404
        );
        return next (error);
    }

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

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            'Failed to save edits for a place, please try again',
            500
        );
        return next (error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (e) {
        const error = new HttpError(
            'Failed to retrieve a place, please try again',
            500
        );
        return next (error);
    }

    if (!place || place.creator.id !== req.userData.userId) {
        const error = new HttpError(
            "Could not find a place for the provided place and user ids.", 404
        );
        return next (error);
    }

    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Failed to delete a place, please try again',
            500
        );
        console.log(err)
        return next (error);
    }

    fs.unlink(imagePath, (err) => { console.log(err); });

    res.status(204).json({});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.editPlace = editPlace;
exports.deletePlace = deletePlace;