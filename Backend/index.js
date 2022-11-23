const express = require("express");
const app = express();
const configRoutes = require("./routes");
const cors = require("cors");
const static = express.static("images");

app.use(static);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);
app.listen(3001, async () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
