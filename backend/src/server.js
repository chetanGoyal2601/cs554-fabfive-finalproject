// mongodb
require("./config/db");

const app = require("express")();
const cors = require("cors");
const bodyParser = require("express").json;
const routes = require("./routes");

//cors
app.use(cors());

app.use(bodyParser());

app.use(routes);

module.exports = app;
