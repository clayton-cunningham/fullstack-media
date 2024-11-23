const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent && error) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error was thrown.'});
})

mongoose
    .connect("mongodb+srv://claytonccunningham:yIw7U69S4EZqhqEy@fullstackcluster.wapcj.mongodb.net/places?retryWrites=true&w=majority&appName=FullstackCluster")
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(error);
    });
