const eventRoutes = require("./event");

const constructorMethod = (app) => {
  app.use("/event", eventRoutes);

  app.use("*", (req, res) => {
    res.json({ error: "Route no valid" });
  });
};

module.exports = constructorMethod;
