const server = require("./server");

// server port
const port = process.env.PORT || 8000;

const startServer = () => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
