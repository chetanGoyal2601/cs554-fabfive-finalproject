const chatRoutes = require('./chat');

const constructor = (app) => {
    app.use((req, res, next) => {
        console.log(`[${new Date().toUTCString()}]: ${req.method}  ${req.originalUrl}`);
        next();
    });

    app.use('/chat', chatRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({
            message: "Resource not found !!"
        });
    });
};


module.exports = constructor;