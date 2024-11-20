const express = require('express');

const router = express.Router();

const DUMMY_USERS = [
    {id: 1, name: "Test User", image: "logo192.png", places: 3},
    {id: 2, name: "Test User", image: "001.png", places: 3}
]

router.get("/user/:uid", (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_USERS.find(u => u.id == userId)
    
    if (!user) {
        const error = new Error("Could not find a user for the provided id.");
        error.code = 404;
        return next(error);
        // return res.status(404).json({message: "Could not find a user for the provided id."});
    }

    res.json({user});
});

module.exports = router;