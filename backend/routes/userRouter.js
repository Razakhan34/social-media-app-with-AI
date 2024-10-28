const express = require("express");

const userController = require("../controller/userController");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", authUser, userController.logout);

// for chat features
// router.get("/getAllUser", authUser, userController.getAllUsers);
// router.get("/getAllUser", authUser, userController.getAllUsersByName);

// for reset password
router.post("/forgotPassword", userController.forgotPassword);
router.patch("/resetPassword/:token", userController.resetPassword);

router.patch("/updateMyPassword", authUser, userController.updateMyPassword);
router.patch("/updateMyProfile", authUser, userController.updateProfile);

router.get("/me", authUser, userController.getMyProfile);
router.delete("/deleteMe", authUser, userController.deleteMe);

router.get("/follow/:followId", authUser, userController.followUser);

router.get("/getMyPosts", authUser, userController.getAllMyPosts);
router.get("/getUserPosts/:userId", authUser, userController.getAllPostsOfUser);

router.get("/userProfile/:id", authUser, userController.getUserProfile);

router.get("/usersByName", authUser, userController.getAllUsersByName);

module.exports = router;
