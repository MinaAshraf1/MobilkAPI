require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require("path");

const productRouter = require("./router/products.route");
const usersRouter = require("./router/users.route");
const cartsRouter = require("./router/carts.route");
const httpStatusText = require("./utils/httpStatusText");

const app = express();

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log("mongoose connected successfuly");
})

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());

app.use('/api/products/', productRouter);
app.use('/api/users', usersRouter);
app.use('/api/carts', cartsRouter);

app.all('*', (req, res, next) => {
    return res.status(404).json({
        "status": httpStatusText.ERROR,
        "message": "URL Not Found",
        "data": null
    })
})

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        "status": error.statusText || httpStatusText.ERROR,
        "message": error.message,
        "data": null
    })
})

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running in port ${process.env.PORT || 4000}`);
})