
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
    {id: 1, name: "Test User 1", email: "testuser1@email.com", password: "12345", image: "logo192.png", places: 3},
    {id: 2, name: "Test User 2", email: "testuser2@email.com", password: "12345", image: "001.png", places: 3}
]

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
}

const getUserById = (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_USERS.find(u => u.id == userId)

    if (!user) {
      throw new HttpError("Could not find a user for the provided id.", 404);
    }

    res.json({user});
}

const userSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid input.", 422);
    }

    const { name, email, password, image } = req.body;

    if (DUMMY_USERS.find(u => u.email == email)) {
        throw new HttpError("The provided email is already assigned to a user.", 422);
    }

    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password,
        image,
    }

    DUMMY_USERS.push(createdUser);

    res.status(201).json({user: createdUser});
}

const userLogin = (req, res, next) => {
    const { email, password } = req.body;
    const user = DUMMY_USERS.find(u => u.email === email)

    if (!user || user.password != password) {
        throw new HttpError("The provided credentials do not match any existing users.", 401);
    }

    const token = uuidv4();

    res.status(200).json({token, message: `Logged into user ${user.name}`});
}

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.userSignup = userSignup;
exports.userLogin = userLogin;