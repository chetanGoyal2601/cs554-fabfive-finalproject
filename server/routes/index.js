const chatRoutes = require('./chat');

const userRoutes = require("../domains/user");
const EmailVerificationRoutes = require("../domains/email_verification");
const EmailVerificationOTPRoutes = require("../domains/email_verification_otp");
const ForgotPasswordRoutes = require("../domains/forgot_password");
const ForgotPasswordOTPRoutes = require("../domains/forgot_password_otp");

const eventRoutes = require("./event");

const constructor = (app) => {
    app.use((req, res, next) => {
        console.log(`[${new Date().toUTCString()}]: ${req.method}  ${req.originalUrl}`);
        next();
    });

    app.use("/user", userRoutes);
    app.use("/email_verification", EmailVerificationRoutes);
    app.use("/email_verification_otp", EmailVerificationOTPRoutes);
    app.use("/forgot_password", ForgotPasswordRoutes);
    app.use("/forgot_password_otp", ForgotPasswordOTPRoutes);

    app.use("/event", eventRoutes);

    app.use('/chat', chatRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({
            message: "Resource not found !!"
        });
    });
};


module.exports = constructor;