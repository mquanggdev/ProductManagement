const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/users.controller");
const userMiddleware = require("../../middleware/client/users.middleware");

router.get("/register" , controller.register);
router.post("/register" , controller.registerPost);
router.get("/login" , controller.login);
router.post("/login" , controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot",userMiddleware.requireAuth, controller.forgotPassword);
router.post("/password/forgot",userMiddleware.requireAuth, controller.forgotPasswordPost);
router.get("/password/otp",userMiddleware.requireAuth, controller.otpPassword);
router.post("/password/otp",userMiddleware.requireAuth, controller.otpPasswordPost);
router.get("/password/reset", userMiddleware.requireAuth,controller.resetPassword);
router.patch("/password/reset" ,userMiddleware.requireAuth, controller.resetPasswordPatch)
router.get("/profile" ,userMiddleware.requireAuth, controller.profile)
module.exports = router ;