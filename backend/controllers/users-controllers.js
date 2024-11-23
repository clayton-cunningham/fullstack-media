
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Place = require("../models/place");

const getUsers = async (req, res, next) => {
    
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (e) {
        const error = new HttpError(
            'Failed to retrieve all users, please try again',
            500
        );
        return next (error);
    }

    res.json({ users: users.map(u => u.toObject({ getters: true })) });
}

const getUserById = async (req, res, next) => {
    const userId = req.params.uid;
    
    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        const error = new HttpError(
            'Failed to retrieve a user, please try again',
            500
        );
        return next (error);
    }

    if (!user) {
        const error = new HttpError(
            "Could not find a user for the provided id.", 404
        );
        return next (error);
    }

    res.json({ user: user.toObject({ getters: true }) });
}

const userSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new HttpError(
            "Invalid input.", 422
        );
        return next (error);
    }

    const { name, email, password, image } = req.body;
    
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (e) {
        const error = new HttpError(
            'Failed to retrieve a user, please try again',
            500
        );
        return next (error);
    }
    if (existingUser) {
        const error = new HttpError(
            "The provided email is already assigned to a user.  Please login instead.", 422
        );
        return next (error);
    }
    
    // let places;
    // try {
    //     places = await Place.find({ creator: userId });
    // } catch (e) {
    //     const error = new HttpError(
    //         "Failed to retrieve a user's places, please try again",
    //         500,
    //         e
    //     );
    //     return next (error);
    // }
    
    const createdUser = new User({
        name,
        email,
        password,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
        places: 0,
    })

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Failed to create a user, please try again',
            500
        );
        return next (error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}

const userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    
    let user;
    try {
        user = await User.findOne({ email: email });
    } catch (e) {
        const error = new HttpError(
            'Failed to retrieve a user, please try again',
            500
        );
        return next (error);
    }

    if (!user || user.password != password) {
        const error = new HttpError(
            "The provided credentials do not match any existing users.", 401
        );
        return next (error);
    }

    const token = uuidv4();

    res.status(200).json({token, message: `Logged into user ${user.name}`});
}

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.userSignup = userSignup;
exports.userLogin = userLogin;