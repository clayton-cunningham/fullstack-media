const express = require('express');

const usersControllers = require("../controllers/users-controllers")

const router = express.Router();

router.get("/", usersControllers.getUsers);
router.get("/:uid", usersControllers.getUserById);

router.post("/signup", usersControllers.userSignup);
router.post("/login", usersControllers.userLogin);

module.exports = router;