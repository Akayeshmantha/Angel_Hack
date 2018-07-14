const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-1" });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allows CORS, Remove are after poc testing
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.use(express.static(__dirname + "/public"));
let router = express.Router();

router.get("/", function(req, res) {
    res.json({ message: "welcome to praedictio server!" });
});

router.use(function(req, res, next) {
    console.log("got a request....");
    next();
});

const storageRouter = require('./routes/storage-routes');


app.use('/', storageRouter);
const PORT = process.env.PORT || 8090;

if (module === require.main) {
    // Start the server
    const server = app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
}

module.exports = app;
